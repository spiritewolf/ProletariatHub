# ProletariatHub

Monorepo for the ProletariatHub apps (web, API, worker) and `libs/` (config, database, types).

## Local development

- Node.js 20+
- pnpm 9+ (see `packageManager` in root `package.json`)
- Docker and Docker Compose

## Run locally

```bash
cp .env.example .env
docker compose build && docker compose up
```

`docker compose up <service>` (e.g. `web`, `api`, `worker`) and Make targets for lint, typecheck, DB, and Changesets: [docs/development.md](docs/development.md).

## License

[GNU Affero General Public License v3.0](LICENSE).
