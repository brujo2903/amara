import { v4 as uuidv4 } from 'uuid';

export function generateAnonymousEmail(): string {
  // Use a more standard email format that will pass validation
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `anon_${timestamp}_${random}@morvak.app`;
}

export function generateSecurePassword(): string {
  // Generate a secure random password
  const length = 32;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}

export function generateUserId(): string {
  return uuidv4();
}