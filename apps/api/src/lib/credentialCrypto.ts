import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const ALG = 'aes-256-gcm';
const IV_LEN = 12;
const AUTH_TAG_LEN = 16;
const SCRYPT_SALT = 'proletariat-hub-credential-v1';

function deriveKey(): Buffer {
  const env = process.env.CREDENTIALS_ENCRYPTION_KEY?.trim();
  const input =
    env && env.length > 0 ? env : 'dev-insecure-change-CREDENTIALS_ENCRYPTION_KEY-in-production';
  return scryptSync(input, SCRYPT_SALT, 32);
}

/** AES-256-GCM: `iv (12)` || `ciphertext` || `auth tag (16)`. */
export function encryptCredentialSecret(plain: string): Buffer {
  const key = deriveKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, enc, tag]);
}

export function decryptCredentialSecret(blob: Buffer): string {
  const key = deriveKey();
  if (blob.length < IV_LEN + AUTH_TAG_LEN + 1) {
    throw new Error('Invalid secret blob');
  }
  const iv = blob.subarray(0, IV_LEN);
  const tag = blob.subarray(blob.length - AUTH_TAG_LEN);
  const data = blob.subarray(IV_LEN, blob.length - AUTH_TAG_LEN);
  const decipher = createDecipheriv(ALG, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
