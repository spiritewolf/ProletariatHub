# Quick start

All commands run from the **repo root**.

## First time

```bash
cp .env.example .env
# Optional: set DATABASE_URL (default ./data/app.db from repo root)
```

For **Docker**, you do **not** need `yarn install` on your Mac. For **host** dev (`yarn dev`), run `yarn install` once.

---

## Local development with Docker (recommended)

| Command          | Starts                                                                                                                                                       | You open                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| **`yarn start`** | **Container `api`:** Fastify + **SQLite** at **`./data/app.db`** (folder in this repo). **Container `web`:** **Vite** (React dev server) + proxy to the API. | [http://localhost:5173](http://localhost:5173) |
| **`yarn stop`**  | Stops both containers.                                                                                                                                       | —                                              |

**What is Vite?** The tool that runs the React app **while you develop** — fast refresh when you save files.

**Backend port 3000** is published so you can hit `/health` directly; the UI at 5173 does not require you to use it.

**Auth:** The API seeds Comrade **`admin`** / **`admin`**. Open the app, sign in, change your password (required), then complete the Admin setup wizard (name the Hub, optionally recruit Comrades). Sessions use an **httpOnly cookie** (`ph_session`).

---

## Local development without Docker (optional)

| Command            | Starts                                             |
| ------------------ | -------------------------------------------------- |
| **`yarn dev`**     | API on **3000** + Vite on **5173** (one terminal). |
| **`yarn dev:api`** | API only.                                          |
| **`yarn dev:web`** | Vite only — start **`yarn dev:api`** first.        |

Do **not** run **`yarn dev`** and **`yarn start`** together (port **3000** conflict).

---

## Production-style Docker (nginx + built UI)

| Command               | Starts                                                                                                                                                                                    | You open                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **`yarn start:prod`** | **`api`:** compiled API + SQLite in a **Docker volume**. **`web`:** **nginx** hands out the **built** React site (like a normal static website) and **sends** `/api` requests to the API. | [http://localhost:8080](http://localhost:8080) |
| **`yarn stop:prod`**  | Stops that stack.                                                                                                                                                                         | —                                              |

**What is nginx?** A web server. Here it **serves** the pre-built HTML/JS/CSS and **reverse-proxies** API traffic. This path is for **preview / prod-like** runs, not hot reload.

Rebuild the **`web`** image after UI changes: `yarn start:prod` with `--build`.

---

## Migrations (host with Node installed)

```bash
yarn workspace api db:migrate
```

Inside Docker dev, migrations run when the **API container** starts.
