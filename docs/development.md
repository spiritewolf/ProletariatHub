# Development

## Environment

Copy `.env.example` to `.env`. Match **`VITE_API_URL`** to the API origin (e.g. `http://localhost:3000` when **`PORT`** is `3000`). Run `make db_generate` and `docker compose up`.

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
| `make changeset`    | Changesets (interactive)         |
| `make version`      | `changeset version`              |
| `make clean`        | `node_modules`, `dist`, `.turbo` |
