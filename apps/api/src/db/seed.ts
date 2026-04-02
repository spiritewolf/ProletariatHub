import { hashPassword } from '../lib/password.js';
import { db } from './index.js';
import { comrades, hubs } from './schema.js';

/** Deterministic UUIDs for bootstrap (valid variant bits for tooling that cares). */
export const SEED_HUB_ID = '00000000-0000-4000-8000-000000000001';
export const SEED_ADMIN_COMRADE_ID = '00000000-0000-4000-8000-000000000002';

export function runSeed(): void {
  const existing = db.select().from(hubs).limit(1).all();
  if (existing.length > 0) {
    return;
  }

  const now = Date.now();

  db.insert(hubs)
    .values({
      id: SEED_HUB_ID,
      name: 'Proletariat Hub',
      createdAt: now,
    })
    .run();

  db.insert(comrades)
    .values({
      id: SEED_ADMIN_COMRADE_ID,
      hubId: SEED_HUB_ID,
      username: 'admin',
      passwordHash: hashPassword('admin'),
      isAdmin: true,
      hasCompletedSetup: false,
      mustChangePassword: true,
      notificationPhone: null,
      notificationSignal: null,
      notificationNtfyTopic: null,
      icon: null,
      createdAt: now,
    })
    .run();
}
