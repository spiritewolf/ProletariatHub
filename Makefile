.PHONY: lint typecheck format format_check check \
        db_generate db_migrate db_migrate_deploy db_seed db_reset db_studio \
        build_ui generate_ui_types all_up all_down deps_refresh clean

COMPOSE := docker compose

# Prisma CLI inside `docker compose run api` must use the compose network hostname `postgres`, not
# `localhost` from `.env`. Passing this explicitly avoids missing or host-only DATABASE_URL when
# `scripts/turbo-with-env.mjs` runs Node with `--env-file=.env`.
DATABASE_URL_DOCKER := postgresql://proletariat:proletariat@postgres:5432/proletariat_hub

lint:
	$(COMPOSE) run --rm -T --no-deps api pnpm run lint

typecheck:
	$(COMPOSE) run --rm -T --no-deps api pnpm run typecheck

format:
	$(COMPOSE) run --rm -T --no-deps api pnpm run format

format_check:
	$(COMPOSE) run --rm -T --no-deps api pnpm run format:check

check: lint typecheck format_check

db_generate:
	$(COMPOSE) run --rm -T --no-deps api pnpm run db:generate

db_migrate:
	$(COMPOSE) run --rm -T -e DATABASE_URL=$(DATABASE_URL_DOCKER) api pnpm run db:migrate

db_migrate_deploy:
	$(COMPOSE) run --rm -T -e DATABASE_URL=$(DATABASE_URL_DOCKER) api pnpm run db:migrate:deploy

db_seed:
	$(COMPOSE) run --rm -T -e DATABASE_URL=$(DATABASE_URL_DOCKER) api pnpm run db:seed

db_reset:
	$(COMPOSE) run --rm -T -e DATABASE_URL=$(DATABASE_URL_DOCKER) api sh -c 'cd libs/database && pnpm exec prisma migrate reset --force'

db_studio:
	$(COMPOSE) run --rm -T -p 5555:5555 -e DATABASE_URL=$(DATABASE_URL_DOCKER) api sh -c 'cd libs/database && pnpm exec prisma studio --hostname 0.0.0.0 --port 5555'

build_ui:
	$(COMPOSE) pnpm --filter @proletariat-hub/web run build

generate_ui_types:
	$(COMPOSE) pnpm --filter @proletariat-hub/web run typegen

all_up:
	$(COMPOSE) up -d

all_down:
	$(COMPOSE) down

deps_refresh:
	$(COMPOSE) down
	docker volume ls -q | awk '/(_api_node_modules|_web_node_modules|_web_app_node_modules|_worker_node_modules)$$/ { print }' | xargs -r docker volume rm
	$(COMPOSE) up -d

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf {} +
	find . -name "dist" -type d -prune -exec rm -rf {} +
	find . -name ".turbo" -type d -prune -exec rm -rf {} +
