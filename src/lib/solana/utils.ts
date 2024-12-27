// Generate a secure nonce using Web Crypto API
export function generateNonce(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function validateSignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    // Add signature validation logic here
    return true;
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
}