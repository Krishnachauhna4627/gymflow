import { createHash, randomBytes } from 'node:crypto';
import db from '../db.js';

export const SESSION_COOKIE = 'gf_session';
const HOUR = 60 * 60 * 1000;
export const SESSION_TTL = { remember: 30 * 24 * HOUR, default: 12 * HOUR };

const hashToken = (token) => createHash('sha256').update(token).digest('hex');

const insertSession = db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)');
const deleteByHash = db.prepare('DELETE FROM sessions WHERE token_hash = ?');
const deleteExpired = db.prepare('DELETE FROM sessions WHERE expires_at <= ?');
const findByHash = db.prepare(`
  SELECT u.id, u.name, u.email, u.user_id, u.role,
         g.id AS gym_id, g.name AS gym_name, g.logo_file
  FROM sessions s
  JOIN users u ON u.id = s.user_id
  JOIN gyms g ON g.id = u.gym_id
  WHERE s.token_hash = ? AND s.expires_at > ?
`);

/** Creates a session and returns the raw token (only ever sent to the client in a cookie). */
export function createSession(userId, remember) {
  deleteExpired.run(Date.now());
  const token = randomBytes(32).toString('base64url');
  const ttl = remember ? SESSION_TTL.remember : SESSION_TTL.default;
  insertSession.run(hashToken(token), userId, Date.now() + ttl);
  return { token, ttl };
}

/** Returns the signed-in user and their gym for a token, or null if missing/expired. */
export function findSession(token) {
  if (!token) return null;
  const row = findByHash.get(hashToken(token), Date.now());
  if (!row) return null;
  return {
    user: { id: row.id, name: row.name, email: row.email, userId: row.user_id, role: row.role },
    gym: { id: row.gym_id, name: row.gym_name, logoUrl: row.logo_file ? `/api/gyms/${row.gym_id}/logo` : null },
  };
}

export function deleteSession(token) {
  if (token) deleteByHash.run(hashToken(token));
}
