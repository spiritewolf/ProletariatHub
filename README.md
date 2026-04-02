# ProletariatHub

Monorepo: **Fastify + Drizzle + SQLite** (`apps/api`), **React** (`apps/web`), **Yarn 4** workspaces.

## Local development (default): Docker

One command from the repo root (Docker Desktop or engine running):

```bash
yarn start
```

| Command          | What it starts                                                                                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`yarn start`** | **`api` container:** Node runs the **API** with **file watch** (restart on save). **SQLite** file at **`./data/app.db`** on your machine (bind-mounted). **`web` container:** **Vite** serves the React app with **hot reload** and **proxies** `/api` and `/health` to the API. |
| **`yarn stop`**  | Stops those containers.                                                                                                                                                                                                                                                          |

**Open the UI:** [http://localhost:5173](http://localhost:5173) — API and DB are already up; the browser talks to Vite, which forwards API calls to the backend.

**Optional — API directly:** [http://localhost:3000/health](http://localhost:3000/health)

**First time:** `cp .env.example .env` (optional: set `DATABASE_URL`; default is `./data/app.db`). No `yarn install` on the host required for Docker.

More detail: [docs/quickstart.md](docs/quickstart.md).

---

## Run API + web on the host (no Docker)

If you prefer Node on your machine:

| Command            | What it starts                                                 |
| ------------------ | -------------------------------------------------------------- |
| **`yarn dev`**     | **Terminal:** API (port 3000) + **Vite** (port 5173) together. |
| **`yarn dev:api`** | API only.                                                      |
| **`yarn dev:web`** | Vite only (needs API running separately).                      |

Requires `yarn install` on the host. Don’t run **`yarn dev`** and **`yarn start`** at once (both use port 3000).

---

## Production-style stack (nginx + built assets) — later

| Command               | What it starts                                                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`yarn start:prod`** | **`api`:** compiled Node app. **`web`:** **nginx** serves the **production build** of React (static files) and **forwards** `/api` to the API. UI on [http://localhost:8080](http://localhost:8080). SQLite in a Docker volume (`sqlite-data-prod`). |
| **`yarn stop:prod`**  | Stops that stack.                                                                                                                                                                                                                                    |

Use this when you want to mimic a static-file + API deploy, not for day-to-day editing (no hot reload on the frontend).

---

## Configuration

- **`.env`** at repo root: `DATABASE_URL` (optional; defaults to `./data/app.db` from repo root).
- **Docker dev** uses **`./data/app.db`** inside the mounted `./data` folder.

The API seeds a Hub and Admin Comrade (**`admin`** / **`admin`**) on first run. Sign in at the UI; you must **change the default password**, then the **Admin** runs a short **setup wizard** (Hub name + optional Comrades). Sessions use an **httpOnly cookie** (`ph_session`). Set **`COOKIE_SECURE=true`** when serving only over HTTPS.

## Docs

- [Quick start](docs/quickstart.md)
- [Database schema (canonical)](docs/schema.md)
- [Phase 3 schema (historical)](docs/phase3-schema.md)
