# Phase 3 — Database schema (historical)

> **Superseded:** The canonical database model is [schema.md](./schema.md). Migration `0002_vision_schema` replaces the tables described below. This file is kept for context only.

---

This document described an earlier **relational model** for **ProletariatHub**: SQLite today, **PostgreSQL** later via Drizzle (portable types, explicit FKs, indexes).

**Not implemented in code until you approve this design** (then we add a Drizzle migration and replace the placeholder `app_meta`-only migration).

---

## Design principles

1. **One deploy = one logical hub** for now. Table `hubs` holds at least one row; `hub_id` on all tenant tables keeps a future **multi-hub** split cheap (same schema, more rows).
2. **No login**: **`comrades`** are rows with a **`name`** (and optional **`username`** for mentions). Assignees and “who gets notified” reference `comrades.id` (UUID).
3. **UUIDs everywhere**: every **primary key** and **foreign key** is **`text`** storing a **UUID** (v4 or v7). No integer surrogate keys for domain entities.
4. **Timestamps**: store **UTC instants** as SQLite **`INTEGER`** Unix **milliseconds** (same columns map cleanly to PostgreSQL `bigint` or `timestamptz` via Drizzle; app layer treats them as `Date` / `Instant`). This is the preferred “timestamp” story: sortable, index-friendly, timezone-safe when interpreted as UTC.
5. **Enums in DB vs app**: columns that are enums are stored as **`text`** (short snake_case values). The codebase uses **TypeScript string-literal unions / `as const` objects** (and optional Drizzle `sqliteEnum`) for **type safety**—same pattern after Postgres (native `ENUM` or `text` + check, migration optional).
6. **JSON sparingly**: use **`text`** in SQLite holding JSON only for **truly variable-length / open-ended** data (phone lists, tags, recurrence day lists, escalation step schedules). In PostgreSQL these become **`jsonb`** with **no ORM shape change** (Drizzle column type swap). Avoid JSON for things that should be first-class columns (priorities, statuses, FKs).
7. **Notifications decoupled**: domain tables do **not** embed SMS/ntfy fields. A small **polymorphic** pattern (`subject_type` + `subject_id`) plus optional **outbox** tables keeps notification delivery extensible without FK sprawl on chores/items/events.
8. **Integrations**: optional `external_source`, `external_id` on catalog / list rows where recipe or Grocy sync matters.

---

## Scalability (intent)

- **Normalize** stores, products, comrades; index **`hub_id`** and common filters (`bought_at`, `starts_at`, `due_at`).
- **Read path**: SQLite is fine for single-host household scale; moving to **PostgreSQL** is a **dialect + connection** change, not a redesign (Drizzle helps).
- **Write path**: later **connection pooling** (PgBouncer, pooler in managed PG), **partitioning** only if outbox/audit tables explode—out of scope for v1.
- **Hot tables** (e.g. `notification_outbox`): designed with **`scheduled_at`**, **`status`**, indexes for worker dequeue.

---

## Enum columns (stored as `text`; typed in app)

| Column / concept                   | Allowed values (example)                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `comrades.kind`                    | `person`, `pet`, …                                                                                                 |
| `hub_items.priority`               | `urgent`, `high`, `medium`, `low`                                                                                  |
| `chores.recurrence_kind`           | `once`, `daily`, `weekly`, `monthly`, `custom`                                                                     |
| `calendar_events.recurrence_kind`  | `none`, `yearly`, `monthly`, `custom`, …                                                                           |
| `calendar_events.status`           | `upcoming`, `completed`, `snoozed`                                                                                 |
| `notification_outbox.subject_type` | `hub_item`, `chore`, `calendar_event`, `comrade`, `hub`, … (extend without migrations if new string + app support) |
| `notification_outbox.status`       | `pending`, `sending`, `sent`, `failed`, `cancelled`                                                                |

Add DB **CHECK** constraints in a later migration if you want DB-enforced enums; v1 can rely on app validation.

---

## Entity overview

| Area                 | Tables                                                               |
| -------------------- | -------------------------------------------------------------------- |
| Core                 | `hubs`, `comrades`, `app_meta`                                       |
| Shopping             | `stores`, `products`, `hub_items`                                    |
| Chores               | `chores`, `chore_completions`                                        |
| Calendar             | `calendar_events`, `calendar_event_comrades`                         |
| Docs                 | `credential_entries`, `contacts`, `reference_notes`                  |
| Notifications (stub) | `notification_outbox` (polymorphic subject; decoupled from channels) |
| Media tiles          | **No DB table** — config / env only                                  |

---

## Table definitions (SQLite-oriented)

### `hubs`

| Column          | Type          | Notes                                                                                                  |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `id`            | text PK       | UUID                                                                                                   |
| `name`          | text          | Default seed: **`Proletariat Hub`** (or **Proletariat Household**—pick one for product copy)           |
| `timezone`      | text          | IANA; default e.g. `UTC` or app default                                                                |
| `settings_json` | text nullable | **Sparse**: only if you must stash a few variable knobs; prefer real columns for thresholds when fixed |
| `created_at`    | integer       | Unix ms UTC                                                                                            |

**Bootstrap:** insert one hub if none exists; seed one **comrade** (see below).

---

### `comrades`

| Column        | Type              | Notes                                                    |
| ------------- | ----------------- | -------------------------------------------------------- |
| `id`          | text PK           | UUID                                                     |
| `hub_id`      | text FK → hubs.id | indexed                                                  |
| `name`        | text              | Display name (replaces old `display_name`)               |
| `username`    | text nullable     | Optional; unique per `hub_id` if set (for mentions / UI) |
| `kind`        | text              | `person` \| `pet` (enum in app)                          |
| `color`       | text nullable     | UI                                                       |
| `sort_order`  | integer           | default 0                                                |
| `archived_at` | integer nullable  | soft delete, Unix ms                                     |

**Index:** `(hub_id, sort_order)`.

**Seed:** one comrade with `name` = **`Admin`** (or **`admin`**) as the default operator—adjust casing in product copy.

---

### `stores`

| Column       | Type    | Notes   |
| ------------ | ------- | ------- |
| `id`         | text PK | UUID    |
| `hub_id`     | text FK | indexed |
| `name`       | text    |         |
| `sort_order` | integer |         |

---

### `products` (catalog)

| Column               | Type                         | Notes   |
| -------------------- | ---------------------------- | ------- |
| `id`                 | text PK                      | UUID    |
| `hub_id`             | text FK                      | indexed |
| `name`               | text                         |         |
| `category`           | text nullable                |         |
| `preferred_store_id` | text nullable FK → stores.id | UUID    |
| `notes`              | text nullable                |         |
| `external_source`    | text nullable                |         |
| `external_id`        | text nullable                |         |
| `created_at`         | integer                      | Unix ms |
| `updated_at`         | integer                      | Unix ms |

**Index:** `(hub_id, name)`.

---

### `hub_items` (was “shopping list items”)

| Column                | Type                           | Notes                                                                                |
| --------------------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| `id`                  | text PK                        | UUID                                                                                 |
| `hub_id`              | text FK                        | indexed                                                                              |
| `product_id`          | text nullable FK → products.id | null = ad hoc line                                                                   |
| `name`                | text not null                  | Denormalized label                                                                   |
| `priority`            | text not null                  | **`urgent` \| `high` \| `medium` \| `low`** — stored as string; **enum in codebase** |
| `store_id`            | text nullable FK → stores.id   | UUID                                                                                 |
| `quantity`            | text nullable                  |                                                                                      |
| `notes`               | text nullable                  |                                                                                      |
| `bought_at`           | integer nullable               | null = open item; Unix ms                                                            |
| `added_by_comrade_id` | text nullable FK → comrades.id | UUID                                                                                 |
| `sort_order`          | integer                        | default 0                                                                            |
| `created_at`          | integer                        | Unix ms                                                                              |
| `updated_at`          | integer                        | Unix ms                                                                              |

**Indexes:** `(hub_id, bought_at)`; `(hub_id, store_id)`.

---

### `chores`

| Column                 | Type                           | Notes                                                                                            |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `id`                   | text PK                        | UUID                                                                                             |
| `hub_id`               | text FK                        | UUID                                                                                             |
| `title`                | text                           |                                                                                                  |
| `description`          | text nullable                  |                                                                                                  |
| `assignee_comrade_id`  | text nullable FK → comrades.id | UUID                                                                                             |
| `recurrence_kind`      | text                           | enum string in app                                                                               |
| `recurrence_rule_json` | text nullable                  | **JSON text**: variable recurrence (e.g. days of week); refine in Phase 6 without schema lock-in |
| `due_at`               | integer nullable               | Unix ms                                                                                          |
| `annoying_mode`        | integer                        | 0/1                                                                                              |
| `created_at`           | integer                        |                                                                                                  |
| `updated_at`           | integer                        |                                                                                                  |

### `chore_completions`

| Column                    | Type                           | Notes   |
| ------------------------- | ------------------------------ | ------- |
| `id`                      | text PK                        | UUID    |
| `chore_id`                | text FK → chores.id            | indexed |
| `completed_at`            | integer                        | Unix ms |
| `completed_by_comrade_id` | text nullable FK → comrades.id | UUID    |
| `notes`                   | text nullable                  |         |

---

### `calendar_events`

| Column                 | Type             | Notes                   |
| ---------------------- | ---------------- | ----------------------- |
| `id`                   | text PK          | UUID                    |
| `hub_id`               | text FK          | UUID                    |
| `title`                | text             |                         |
| `category`             | text nullable    |                         |
| `starts_at`            | integer          | Unix ms                 |
| `ends_at`              | integer nullable |                         |
| `all_day`              | integer          | 0/1                     |
| `recurrence_kind`      | text             | enum in app             |
| `recurrence_rule_json` | text nullable    | JSON for variable rules |
| `status`               | text             | enum in app             |
| `notes`                | text nullable    |                         |
| `snoozed_until`        | integer nullable |                         |
| `external_caldav_uid`  | text nullable    |                         |
| `created_at`           | integer          |                         |
| `updated_at`           | integer          |                         |

### `calendar_event_comrades`

| Column       | Type                         | Notes      |
| ------------ | ---------------------------- | ---------- |
| `event_id`   | text FK → calendar_events.id | part of PK |
| `comrade_id` | text FK → comrades.id        | part of PK |

Composite PK `(event_id, comrade_id)`.

---

### `credential_entries` (encrypted at rest)

| Column              | Type          | Notes |
| ------------------- | ------------- | ----- |
| `id`                | text PK       | UUID  |
| `hub_id`            | text FK       | UUID  |
| `label`             | text          |       |
| `username`          | text nullable |       |
| `secret_ciphertext` | blob not null |       |
| `url_or_app`        | text nullable |       |
| `notes_plain`       | text nullable |       |
| `key_version`       | integer       |       |
| `created_at`        | integer       |       |
| `updated_at`        | integer       |       |

---

### `contacts`

| Column        | Type          | Notes                 |
| ------------- | ------------- | --------------------- |
| `id`          | text PK       | UUID                  |
| `hub_id`      | text FK       | UUID                  |
| `name`        | text          |                       |
| `category`    | text nullable |                       |
| `phones_json` | text nullable | JSON array of strings |
| `emails_json` | text nullable | JSON array            |
| `address`     | text nullable |                       |
| `notes`       | text nullable |                       |
| `created_at`  | integer       |                       |
| `updated_at`  | integer       |                       |

---

### `reference_notes`

| Column          | Type          | Notes                 |
| --------------- | ------------- | --------------------- |
| `id`            | text PK       | UUID                  |
| `hub_id`        | text FK       | UUID                  |
| `title`         | text          |                       |
| `body_markdown` | text          |                       |
| `tags_json`     | text nullable | JSON array of strings |
| `created_at`    | integer       |                       |
| `updated_at`    | integer       |                       |

---

### `notification_outbox` (stub — polymorphic, channel-agnostic)

Decouples **what** to notify about from **how** (Twilio, ntfy, …) in Phase 8. Rows are dequeueable by a worker.

| Column                 | Type                           | Notes                                                                                        |
| ---------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `id`                   | text PK                        | UUID                                                                                         |
| `hub_id`               | text FK                        | UUID                                                                                         |
| `recipient_comrade_id` | text nullable FK → comrades.id | UUID; null = broadcast / TBD                                                                 |
| `subject_type`         | text not null                  | **Polymorphic discriminator** — e.g. `hub_item`, `chore`, `calendar_event`, `comrade`, `hub` |
| `subject_id`           | text nullable                  | **UUID** of the subject row (nullable only if a global hub-level event)                      |
| `kind`                 | text not null                  | App-defined: `due_reminder`, `escalation`, `threshold_met`, …                                |
| `payload_json`         | text nullable                  | **Sparse** variable payload only                                                             |
| `scheduled_at`         | integer not null               | Unix ms                                                                                      |
| `status`               | text not null                  | enum in app                                                                                  |
| `dedupe_key`           | text nullable                  | optional idempotency                                                                         |
| `created_at`           | integer                        |                                                                                              |
| `sent_at`              | integer nullable               |                                                                                              |

**Indexes:** `(hub_id, status, scheduled_at)` for workers.

**Polymorphic rule:** `subject_type` + `subject_id` reference **no FK** in DB (by design), so new notification sources do not require migrations; **app layer** resolves UUID to table. Optional future: `CHECK` that `subject_id` is not null when required.

---

### `app_meta`

Key-value for migrations and flags. Keep.

---

## Deferred

- **`comrade_notification_preferences`** (per-channel prefs) — Phase 8.
- **`automation_rules`** — Phase 12.
- **Webhook idempotency log** — when HA lands.

---

## Resolved decisions (from your feedback)

1. **Timestamps:** **Unix ms UTC** in SQLite `INTEGER`; treat as timestamps in app; Postgres migration can use `bigint` or `timestamptz`.
2. **Bootstrap:** one **`hubs`** row + one **`comrades`** row with **`name` = `Admin`** (or preferred spelling).
3. **Recurrence:** **`recurrence_rule_json`** text stays loose; refine later without boxing in.
4. **Naming:** **`hubs`** / **`comrades`** / **`hub_items`**; theme strings for default hub name.
5. **Enums:** **text in DB**, **typed enums / unions in TS** for `priority` and friends.

---

## After approval

1. Add Drizzle schema + migration(s) for approved tables; seed hub + default comrade.
2. Phase 4: list + catalog API on **`hub_items`**, **`products`**, **`stores`**, **`comrades`**.

---

**Further tweaks?** If this matches intent, say **approved** and we implement the migration in-repo.
