import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PREFIX = 'scrypt1';
const KEYLEN = 64;

/** Format: scrypt1$<salt_b64>$<hash_b64> */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEYLEN);
  return `${PREFIX}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== PREFIX) return false;
  const [, saltB64, hashB64] = parts;
  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltB64, 'base64');
    expected = Buffer.from(hashB64, 'base64');
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length !== KEYLEN) return false;
  const actual = scryptSync(plain, salt, KEYLEN);
  return timingSafeEqual(actual, expected);
}
