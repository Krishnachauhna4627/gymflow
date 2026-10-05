import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

/** Hashes a password as `salt:hash` (hex) using scrypt. */
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
  const [salt, hashHex] = stored.split(':');
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
}
