import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return Promise.resolve(bcrypt.compareSync(plain, hash));
}

export async function hashPassword(plain: string): Promise<string> {
  return Promise.resolve(bcrypt.hashSync(plain, SALT_ROUNDS));
}
