import { PublicKey } from '@solana/web3.js';
import { getConnection, rotateEndpoint } from './connection';
import { RPC_CONFIG } from './config';
import { TokenError, RPCError } from './errors';
import { sleep } from '@/lib/utils';
import type { TokenHolder } from '@/types/token';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

function validateTokenAddress(address: string): void {
  if (!address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
    throw new TokenError('Invalid Solana token address format');
  }
}

function processTokenAccounts(accounts: any[]) {
  if (!accounts.length) {
    throw new TokenError('No token holders found');
  }

  const holders = accounts
    .filter(account => {
      const parsed = account.account.data.parsed?.info?.tokenAmount;
      if (!parsed?.uiAmount) return false;
      const amount = Number(parsed.uiAmount);
      return !isNaN(amount) && amount > 0;
    })
    .map(account => ({
      wallet: account.pubkey.toString(),
      amount: Number(account.account.data.parsed.info.tokenAmount.uiAmount)
    }));

  if (!holders.length) {
    throw new TokenError('No valid token holders found');
  }

  return holders;
}

function calculateRanks(holders: { wallet: string; amount: number }[]): TokenHolder[] {
  const totalSupply = holders.reduce((sum, h) => sum + h.amount, 0);
  const totalHolders = holders.length;
  
  // Sort by amount descending
  holders.sort((a, b) => b.amount - a.amount);

  return holders.map((holder, index) => {
    const percentage = (holder.amount / totalSupply) * 100;
    const percentileRank = (index / totalHolders) * 100;
    let rank: TokenHolder['rank'];
    
    // Distribute ranks more evenly based on both percentage and percentile
    if (percentage >= 5 || percentileRank <= 5) rank = 5;
    else if (percentage >= 2 || percentileRank <= 15) rank = 4;
    else if (percentage >= 1 || percentileRank <= 30) rank = 3;
    else if (percentage >= 0.5 || percentileRank <= 50) rank = 2;
    else rank = 1;

    return { ...holder, rank };
  });
}

export async function getTokenHolders(tokenAddress: string): Promise<TokenHolder[]> {
  validateTokenAddress(tokenAddress);

  let connection = getConnection();
  let retries = RPC_CONFIG.maxRetries;
  let lastError: Error | null = null;

  while (retries > 0) {
    try {
      const mintPubkey = new PublicKey(tokenAddress);
      await sleep(RPC_CONFIG.initialDelay);

      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            { dataSize: 165 },
            { memcmp: { offset: 0, bytes: mintPubkey.toBase58() } },
          ],
          encoding: 'jsonParsed',
          commitment: 'confirmed'
        }
      );

      const holders = processTokenAccounts(accounts);
      return calculateRanks(holders);

    } catch (error) {
      console.error(`Attempt ${RPC_CONFIG.maxRetries - retries + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (retries > 1) {
        connection = await rotateEndpoint();
        const delay = RPC_CONFIG.retryDelays[RPC_CONFIG.maxRetries - retries];
        await sleep(delay);
      }
      
      retries--;
    }
  }

  throw lastError || new RPCError('Failed to fetch token data after multiple attempts');
}