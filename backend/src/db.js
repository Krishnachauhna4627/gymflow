import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = process.env.DB_PATH || 'data/gymflow.db';

if (DB_PATH !== ':memory:') {
  mkdirSync(dirname(DB_PATH), { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS gyms (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    logo_file  TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    gym_id        INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    mobile        TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    user_id       TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'owner',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Lightweight migrations for databases created before a column existed.
const gymColumns = db.prepare('PRAGMA table_info(gyms)').all().map((c) => c.name);
if (!gymColumns.includes('logo_file')) {
  db.exec('ALTER TABLE gyms ADD COLUMN logo_file TEXT');
}

/** Runs `fn` inside a transaction, rolling back if it throws. */
export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export default db;
