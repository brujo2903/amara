import { Connection, PublicKey } from '@solana/web3.js';

const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const RPC_API_KEY = '9b01b24e-db25-4baa-bc0f-80fb6da4e3da';
const DATA_API_KEY = 'f9919b35-0b3d-4713-ac1b-7a5e754ca935';

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export interface TokenHolder {
  wallet: string;
  amount: number;
  rank: 1 | 2 | 3 | 4 | 5;
}

export async function getTokenHolders(tokenAddress: string): Promise<TokenHolder[]> {
  try {
    if (!tokenAddress.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      throw new Error('Invalid Solana address format');
    }

    const mintPubkey = new PublicKey(tokenAddress);
    const tokenAccounts = await connection.getParsedProgramAccounts(
      new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      {
        filters: [
          { dataSize: 165 },
          { memcmp: { offset: 0, bytes: mintPubkey.toBase58() } },
        ],
      }
    );

    if (!tokenAccounts.length) {
      throw new Error('No token holders found for this address');
    }

    const holders = tokenAccounts.map(account => ({
      wallet: account.pubkey.toString(),
      amount: Number(account.account.data.parsed.info.tokenAmount.uiAmount)
    }));

    // Sort by amount descending
    holders.sort((a, b) => b.amount - a.amount);

    // Calculate total supply
    const totalSupply = holders.reduce((sum, h) => sum + h.amount, 0);

    // Assign ranks based on percentage of total supply
    const total = holders.length;
    return holders.map((holder, index) => {
      const percentage = (holder.amount / totalSupply) * 100;
      let rank: TokenHolder['rank'];
      
      if (percentage >= 5) rank = 5;
      else if (percentage >= 2) rank = 4;
      else if (percentage >= 1) rank = 3;
      else if (percentage >= 0.5) rank = 2;
      else rank = 1;

      return { ...holder, rank };
    });
  } catch (error) {
    console.error('Failed to fetch token holders:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch token holders');
  }
}