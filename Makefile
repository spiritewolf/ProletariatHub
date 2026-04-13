.PHONY: lint typecheck format format_check check \
        db_generate db_migrate db_seed db_reset db_studio \
        changeset version clean

COMPOSE := docker compose

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
	$(COMPOSE) run --rm -T api pnpm run db:migrate

db_seed:
	$(COMPOSE) run --rm -T api pnpm run db:seed

db_reset:
	$(COMPOSE) run --rm -T api sh -c 'cd packages/database && pnpm exec prisma migrate reset --force'

db_studio:
	$(COMPOSE) run --rm -T -p 5555:5555 api sh -c 'cd packages/database && pnpm exec prisma studio --hostname 0.0.0.0 --port 5555'

changeset:
	$(COMPOSE) run --rm --no-deps api pnpm changeset

version:
	$(COMPOSE) run --rm --no-deps api pnpm changeset version

build_ui:
	$(COMPOSE) pnpm --filter @proletariat-hub/ui run build

generate_ui_types:
	$(COMPOSE) pnpm --filter @proletariat-hub/ui run typegen

all_up:
	$(COMPOSE) up -d

all_down:
	$(COMPOSE) down

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf {} +
	find . -name "dist" -type d -prune -exec rm -rf {} +
	find . -name ".turbo" -type d -prune -exec rm -rf {} +
