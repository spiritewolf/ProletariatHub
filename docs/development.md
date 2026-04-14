# Development

## Environment

Copy `.env.example` to `.env`. Match **`VITE_API_URL`** to the API origin (e.g. `http://localhost:3000` when **`PORT`** is `3000`). Run `make db_generate` and `docker compose up`. Prisma schema and migrations live under **`libs/database`**.

## API domain pattern

Entity domains (models backed by Prisma, e.g. comrade, hub) expose an **access layer** class instantiated in `apps/api/src/createContext.ts` and attached to tRPC context. Routers and auth session code use `ctx.comradeAccessLayer` (and peer layers) instead of importing a domain’s internal `queries.ts` or `mutations.ts`. Setup wizard completion is implemented as **`comrade.completeAdminSetup`** / **`comrade.completeMemberSetup`** on the comrade router, not a separate `setup` domain.

## Docker (repo root)

| Command                    | Stack                     |
| -------------------------- | ------------------------- |
| `docker compose up`        | Full stack                |
| `docker compose up web`    | Web only                  |
| `docker compose up api`    | API + Postgres + Redis    |
| `docker compose up worker` | Worker + Postgres + Redis |

## Make

`docker compose run` in `api`; DB targets start Postgres/Redis.

| Target              | Note                             |
| ------------------- | -------------------------------- |
| `make lint`         | ESLint                           |
| `make typecheck`    | `tsc --noEmit`                   |
| `make format`       | Prettier write                   |
| `make format_check` | Prettier check                   |
| `make check`        | lint + typecheck + format_check  |
| `make db_generate`  | Prisma generate                  |
| `make db_migrate`   | Prisma migrate dev               |
| `make db_seed`      | Seed                             |
| `make db_reset`     | Migrate reset (force)            |
| `make db_studio`    | http://localhost:5555            |
| `make clean`        | `node_modules`, `dist`, `.turbo` |
