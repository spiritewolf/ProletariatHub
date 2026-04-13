# API (`@proletariat-hub/api`)

Fastify server. **tRPC** is the main API surface (`/trpc`). **Prisma** is the DB client. **Redis** backs sessions (`connect-redis` + `@fastify/session`).

## Layout

| Path                    | Role                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/server.ts`         | Boot: env, Redis, Fastify plugins, listen                                                                    |
| `src/services/`         | Fastify registration (CORS, session, tRPC adapter)                                                           |
| `src/routes/`           | Non-tRPC HTTP only (e.g. health)                                                                             |
| `src/app-router.ts`     | Root tRPC router: composes domain routers                                                                    |
| `src/trpc.ts`           | tRPC init, `publicProcedure`, `protectedProcedure`                                                           |
| `src/context.ts`        | Portable `Context` type (used by web for inference)                                                          |
| `src/create-context.ts` | Per-request `createContext` (Prisma, Redis, Fastify `req`/`res`)                                             |
| `src/middleware/`       | tRPC middleware (e.g. session to comrade)                                                                    |
| `src/domains/<name>/`   | Domain: `router.ts`, Zod `schemas.ts`, `session.ts` / `mutations.ts` / `queries.ts`, `mapper.ts`, `types.ts` |
| `src/shared/lib/`       | Cross-cutting helpers (Redis client, shutdown, small utilities)                                              |

**Why domains:** Keeps DB and business rules next to the procedures that expose them. **Why `app-router.ts`:** Single place to mount new domain routers so the client gets one `AppRouter` type.

## Request flow

1. Fastify handles the request; session cookie is read/written by `@fastify/session`.
2. tRPC adapter calls `createContext` (`create-context.ts`) so each procedure gets `ctx.db`, `ctx.req`, `ctx.redis`, etc.
3. The matched procedure runs on the appropriate domain router.

## Procedures

- **`publicProcedure`:** No login required. Use for login and anything that must work before a session exists.
- **`protectedProcedure`:** Runs session middleware first (`middleware/session-comrade.ts`): loads the comrade from `ctx.req.session` and DB, then continues with an augmented `ctx` (including `comrade`). Use for mutations/queries that must only run for a logged-in comrade.

Add **explicit Zod `.input()` / `.output()`** on procedures that cross the wire so the web client stays type-safe.

## Adding a backend mutation (example: `comrade.createOneComradeSettingsConfig`)

Assume the UI already exists; you need a tRPC mutation that updates persisted settings for the **current** comrade.

1. **Schema (Prisma)**  
   In `packages/database`, change `schema.prisma` if columns or models are missing, then migrate. The API only talks to the DB through Prisma.

2. **Domain logic**  
   In `src/domains/comrade/` (or the domain that owns the data), implement the write in **`mutations.ts`** (or a dedicated module if it grows). Prefer **RORO**-style functions, e.g. `createOneComradeSettingsConfig({ db, comradeId, input })`, and keep Prisma calls here, not inside the router callback body.

3. **Zod**  
   Add input (and output if useful) schemas next to the domain, e.g. **`schemas.ts`**, same pattern as `domains/auth/schemas.ts`.

4. **Domain router**  
   If it does not exist yet, add **`src/domains/comrade/router.ts`** exporting `comradeRouter = router({ ... })`. Wire the mutation with **`protectedProcedure`** (so only authenticated comrades can change their own settings), `.input(...)`, optional `.output(...)`, and call your mutation with `ctx.db` and **`ctx.comrade.id`** (or the field your rule needs). Do not put large Prisma blocks in the router; delegate to `mutations.ts`.

5. **Root router**  
   In **`app-router.ts`**, import `comradeRouter` and add `comrade: comradeRouter` to `router({ ... })`. Procedure name on the client becomes **`comrade.createOneComradeSettingsConfig`**.

6. **Exports (optional)**  
   If other packages must import domain modules by path, add entries under **`package.json` > `exports`** (see existing `./domains/comrade/*` entries).

7. **Web**  
   Use the existing tRPC client; types update from **`@proletariat-hub/api/router`**. No Fastify changes unless you add non-tRPC routes.

8. **Tests**  
   Add focused tests under **`test/`** (see `test/login-session.test.ts`): mock Prisma or call pure helpers so tests stay fast and deterministic.

## Commands

- **Dev:** `pnpm dev` from this package (or `pnpm --filter @proletariat-hub/api dev` from repo root). Requires root `.env` (see repo `docs/setup-guide.md` if present).
- **Build:** `pnpm build` (emits `dist/`).
- **Test:** `pnpm test` (Vitest, run once); `pnpm run test:watch` while developing.

## Related packages

- **`@proletariat-hub/database`:** Prisma schema, client, migrations.
- **`@proletariat-hub/config`:** `validateEnv()` and env shape used by `server.ts`.
