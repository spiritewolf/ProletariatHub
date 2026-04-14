# API (`@proletariat-hub/api`)

Fastify server. **tRPC** is the main API surface (`/trpc`). **Prisma** is the DB client. **Redis** backs sessions (`connect-redis` + `@fastify/session`).

## Layout

| Path                   | Role                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/server.ts`        | Boot: env, Redis, Fastify plugins, listen                                                                                                                                       |
| `src/plugins/`         | Fastify registration (CORS, session, tRPC adapter)                                                                                                                              |
| `src/routes/`          | Non-tRPC HTTP only (e.g. health)                                                                                                                                                |
| `src/appRouter.ts`     | Root tRPC router: composes domain routers                                                                                                                                       |
| `src/trpc.ts`          | tRPC init, `publicProcedure`, `protectedProcedure`                                                                                                                              |
| `src/types/context.ts` | Portable `Context` type (Prisma, Redis, `req`/`res`, entity access layers)                                                                                                      |
| `src/createContext.ts` | Per-request `createContext`: builds access layers and returns `Context`                                                                                                         |
| `src/middleware/`      | tRPC middleware (e.g. resolve authenticated comrade via `comradeAccessLayer`)                                                                                                   |
| `src/domains/<name>/`  | Entity domain: `accessLayer.ts`, internal `queries.ts` / `mutations.ts`, `mapper.ts`, `types.ts`, optional `router.ts` / `schemas.ts`; auth is infrastructure (no access layer) |
| `src/shared/`          | Cross-cutting helpers (`util/`, Redis client, shutdown)                                                                                                                         |

**Why domains:** Keeps DB and business rules next to the procedures that expose them. **Why `appRouter.ts`:** Single place to mount new domain routers so the client gets one `AppRouter` type.

## Request flow

1. Fastify handles the request; session cookie is read/written by `@fastify/session`.
2. tRPC adapter calls `createContext` (`createContext.ts`) so each procedure gets `ctx.db`, `ctx.req`, `ctx.redis`, `ctx.comradeAccessLayer`, `ctx.hubAccessLayer`, etc.
3. The matched procedure runs on the appropriate domain router.

## Procedures

- **`publicProcedure`:** No login required. Use for login and anything that must work before a session exists.
- **`protectedProcedure`:** Runs auth middleware first (`middleware/requireAuthenticatedComrade.ts`): loads the authenticated comrade from `ctx.req.session` and DB, then continues with an augmented `ctx` (including `comrade`). Use for mutations/queries that must only run for a logged-in comrade.

Add **explicit Zod `.input()` / `.output()`** on procedures that cross the wire so the web client stays type-safe.

## Adding a backend mutation (example: `comrade.createOneComradeSettingsConfig`)

Assume the UI already exists; you need a tRPC mutation that updates persisted settings for the **current** comrade.

1. **Schema (Prisma)**  
   In `libs/database`, change `schema.prisma` if columns or models are missing, then migrate. The API only talks to the DB through Prisma.

2. **Domain logic**  
   In `src/domains/comrade/`, implement Prisma writes in internal **`mutations.ts`** and expose orchestration through **`ComradeAccessLayer`** methods. Routers call `ctx.comradeAccessLayer`, not `mutations.ts` directly.

3. **Zod**  
   Add input (and output if useful) schemas next to the domain, e.g. **`schemas.ts`**, same pattern as `domains/auth/schemas.ts`.

4. **Domain router**  
   If it does not exist yet, add **`src/domains/comrade/router.ts`** exporting `comradeRouter = router({ ... })`. Wire the mutation with **`protectedProcedure`**, `.input(...)`, optional `.output(...)`, and delegate to **`ctx.comradeAccessLayer`** (or the appropriate access layer). Do not import `queries.ts` / `mutations.ts` from outside `domains/comrade/`.

5. **Root router**  
   In **`appRouter.ts`**, import `comradeRouter` and add `comrade: comradeRouter` to `router({ ... })`. Procedure name on the client becomes **`comrade.createOneComradeSettingsConfig`**.

6. **Exports (optional)**  
   If other packages must import domain modules by path, add entries under **`package.json` > `exports`** (see existing `./domains/comrade/*` entries).

7. **Web**  
   Use the existing tRPC client; types update from **`@proletariat-hub/api/router`**. No Fastify changes unless you add non-tRPC routes.

8. **Tests**  
   Add focused tests under **`test/`** (see `test/loginSession.test.ts`): mock Prisma or call pure helpers so tests stay fast and deterministic.

## Commands

- **Dev:** `pnpm dev` from this package (or `pnpm --filter @proletariat-hub/api dev` from repo root). Requires root `.env` (see repo `docs/setup-guide.md` if present).
- **Build:** `pnpm build` (emits `dist/`).
- **Test:** `pnpm test` (Vitest, run once); `pnpm run test:watch` while developing.

## Related packages

- **`@proletariat-hub/database`:** Prisma schema, client, migrations.
- **`@proletariat-hub/config`:** `validateEnv()` and env shape used by `server.ts`.
- **`@proletariat-hub/types`:** Shared DTO types and const enums (e.g. `Comrade`, `ComradeRole`).
