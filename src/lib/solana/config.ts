export const RPC_CONFIG = {
  endpoints: [
    'https://rpc-mainnet.solanatracker.io/?api_key=9b01b24e-db25-4baa-bc0f-80fb6da4e3da',
    'https://api.mainnet-beta.solana.com',
    'https://solana-mainnet.rpc.extrnode.com'
  ],
  apiKeys: {
    rpc: '9b01b24e-db25-4baa-bc0f-80fb6da4e3da',
    data: 'f9919b35-0b3d-4713-ac1b-7a5e754ca935'
  },
  retryDelays: [2000, 3000, 4000],
  initialDelay: 1000,
  maxRetries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 9b01b24e-db25-4baa-bc0f-80fb6da4e3da',
    'x-api-key': '9b01b24e-db25-4baa-bc0f-80fb6da4e3da'
  }
} as const;