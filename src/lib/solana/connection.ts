import { Connection, type Commitment } from '@solana/web3.js';
import { RPC_CONFIG } from './config';

let currentEndpointIndex = 0;
let currentConnection: Connection | null = null;

export function getConnection(commitment: Commitment = 'confirmed'): Connection {
  if (!currentConnection) {
    const endpoint = RPC_CONFIG.endpoints[currentEndpointIndex];
    const headers = { ...RPC_CONFIG.headers };

    currentConnection = new Connection(endpoint, {
      commitment,
      httpHeaders: headers,
      fetch: async (url: string, init?: RequestInit) => {
        const response = await fetch(url, {
          ...init,
          headers: {
            ...init?.headers,
            ...headers
          }
        });
        
        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: 'Network error' }));
          throw new Error(error.error?.message || 'Failed to fetch data');
        }
        
        return response;
      }
    });
  }

  return currentConnection;
}

export async function rotateEndpoint(): Promise<Connection> {
  currentEndpointIndex = (currentEndpointIndex + 1) % RPC_CONFIG.endpoints.length;
  currentConnection = null; // Force new connection with next endpoint
  return getConnection();
}