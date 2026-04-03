import './env.js';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { sql } from 'drizzle-orm';
import { db, runMigrations } from './db/index.js';
import { runSeed } from './db/seed.js';
import { authPublicRoutes, authSessionRoutes } from './routes/auth.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { setupRoutes } from './routes/setup.js';
import { choresRoutes } from './routes/chores.js';
import { todosRoutes } from './routes/todos.js';
import { shoppingRoutes } from './routes/shopping.js';

runMigrations();
runSeed();

const app = Fastify({ logger: true });

await app.register(cookie, { hook: 'onRequest' });

await app.register(cors, {
  origin: true,
  credentials: true,
});

app.get('/health', async () => {
  db.run(sql`SELECT 1`);
  return { status: 'ok', database: 'connected' };
});

await app.register(authPublicRoutes, { prefix: '/api/auth' });
await app.register(authSessionRoutes, { prefix: '/api/auth' });
await app.register(setupRoutes, { prefix: '/api/setup' });
await app.register(dashboardRoutes, { prefix: '/api/dashboard' });
await app.register(shoppingRoutes, { prefix: '/api/shopping' });
await app.register(choresRoutes, { prefix: '/api/chores' });
await app.register(todosRoutes, { prefix: '/api/todos' });

const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 3000);

await app.listen({ host, port });
