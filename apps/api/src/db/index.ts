import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as schema from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo root (…/apps/api/src/db → four levels up). Stable regardless of process cwd. */
const repoRoot = path.resolve(__dirname, '../../../..');

function resolveDbPath(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./data/app.db';
  const withoutScheme = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;
  if (path.isAbsolute(withoutScheme)) {
    return path.normalize(withoutScheme);
  }
  return path.resolve(repoRoot, withoutScheme);
}

const dbPath = resolveDbPath();
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export function runMigrations(): void {
  const migrationsFolder = path.join(__dirname, '../../drizzle');
  migrate(db, { migrationsFolder });
}
