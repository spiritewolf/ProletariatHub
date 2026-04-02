# Database schema (canonical)

SQLite via Drizzle. UUIDs are `TEXT`. Timestamps are Unix **milliseconds** UTC (`INTEGER`) unless noted.

**Migrations:** `0000_initial` (`app_meta`), `0001_phase3` (legacy tables), `0002_vision_schema` **drops** legacy domain tables and creates the model below (clean break for dev — no data migration).

## `app_meta`

Key-value for migrations and flags.

## `hubs`

| Column       | Type    | Notes |
| ------------ | ------- | ----- |
| `id`         | TEXT PK | UUID  |
| `name`       | TEXT    |       |
| `created_at` | INTEGER |       |

## `comrades`

| Column                    | Type    | Notes                                            |
| ------------------------- | ------- | ------------------------------------------------ |
| `id`                      | TEXT PK | UUID                                             |
| `hub_id`                  | TEXT FK |                                                  |
| `username`                | TEXT    | Unique per hub (`UNIQUE(hub_id, username)`)      |
| `password_hash`           | TEXT    | `scrypt1$…` (see `apps/api/src/lib/password.ts`) |
| `is_admin`                | INTEGER | 0/1                                              |
| `has_completed_setup`     | INTEGER | 0/1, per-Comrade wizard                          |
| `must_change_password`    | INTEGER | 0/1, force change-password gate                  |
| `notification_phone`      | TEXT    | Nullable                                         |
| `notification_signal`     | TEXT    | Nullable                                         |
| `notification_ntfy_topic` | TEXT    | Nullable                                         |
| `icon`                    | TEXT    | Nullable, reserved                               |
| `created_at`              | INTEGER |                                                  |

No `kind` / pets, no separate display name.

## `sessions`

| Column         | Type    | Notes                               |
| -------------- | ------- | ----------------------------------- |
| `id`           | TEXT PK | Session id (httpOnly cookie target) |
| `comrade_id`   | TEXT FK |                                     |
| `created_at`   | INTEGER |                                     |
| `last_seen_at` | INTEGER |                                     |

No expiry column — sessions live until logout (implementation TBD).

## `shopping_lists`

| Column                      | Type    | Notes                                                   |
| --------------------------- | ------- | ------------------------------------------------------- |
| `id`                        | TEXT PK |                                                         |
| `hub_id`                    | TEXT FK |                                                         |
| `name`                      | TEXT    |                                                         |
| `list_kind`                 | TEXT    | `hub` \| `personal`                                     |
| `owner_comrade_id`          | TEXT FK | Nullable; set for `personal`                            |
| `created_by_comrade_id`     | TEXT FK | Nullable                                                |
| `notified_comrade_ids`      | TEXT    | JSON array; NULL = all Comrades in Hub                  |
| `summary_frequency`         | TEXT    | Short enum: `off`, `daily`, `weekly` (default `weekly`) |
| `created_at` / `updated_at` | INTEGER |                                                         |

## `shopping_list_items`

| Column                                 | Type         | Notes                               |
| -------------------------------------- | ------------ | ----------------------------------- |
| `id`                                   | TEXT PK      |                                     |
| `list_id`                              | TEXT FK      |                                     |
| `name`                                 | TEXT         |                                     |
| `category` / `vendor`                  | TEXT         | Nullable                            |
| `purchase_type`                        | TEXT         | `online` \| `in_person` \| `either` |
| `priority`                             | TEXT         | `urgent` \| `medium` \| `low`       |
| `is_one_time`                          | INTEGER      | 0/1                                 |
| `product_code_or_url` / `notes`        | TEXT         | Nullable                            |
| `added_by_comrade_id`                  | TEXT FK      | Nullable                            |
| `added_at`                             | INTEGER      | For age / escalation jobs           |
| `ordered_by_comrade_id` / `ordered_at` | FK / INTEGER | Nullable until ordered              |
| `last_escalated_at`                    | INTEGER      | Nullable                            |
| `sort_order`                           | INTEGER      |                                     |
| `created_at` / `updated_at`            | INTEGER      |                                     |

## `chores`

| Column                              | Type    | Notes                                        |
| ----------------------------------- | ------- | -------------------------------------------- |
| `id`                                | TEXT PK |                                              |
| `hub_id`                            | TEXT FK |                                              |
| `title` / `description`             | TEXT    |                                              |
| `assigned_comrade_id`               | TEXT FK | NOT NULL                                     |
| `frequency`                         | TEXT    | `daily` \| `weekly` \| `monthly` \| `custom` |
| `frequency_rule_json`               | TEXT    | Nullable                                     |
| `last_completed_at` / `next_due_at` | INTEGER | Nullable                                     |
| `annoying_mode_enabled`             | INTEGER | 0/1                                          |
| `created_at` / `updated_at`         | INTEGER |                                              |

## `chore_completions`

| Column                    | Type    | Notes                               |
| ------------------------- | ------- | ----------------------------------- |
| `id`                      | TEXT PK |                                     |
| `chore_id`                | TEXT FK |                                     |
| `completed_at`            | INTEGER |                                     |
| `completed_by_comrade_id` | TEXT FK | Nullable if `completed_by = system` |
| `completed_by`            | TEXT    | `comrade` \| `system`               |
| `notes`                   | TEXT    | Nullable                            |

## `todos`

| Column                                               | Type    | Notes                                          |
| ---------------------------------------------------- | ------- | ---------------------------------------------- |
| `id`                                                 | TEXT PK |                                                |
| `hub_id`                                             | TEXT FK |                                                |
| `created_by_comrade_id`                              | TEXT FK |                                                |
| `title`                                              | TEXT    |                                                |
| `category`                                           | TEXT    | Nullable                                       |
| `visibility`                                         | TEXT    | `private` \| `assigned` \| `hub`               |
| `assigned_comrade_id`                                | TEXT FK | Nullable when `hub`                            |
| `due_date`                                           | TEXT    | Nullable `YYYY-MM-DD`                          |
| `due_time`                                           | TEXT    | Nullable `HH:MM`                               |
| `recurrence`                                         | TEXT    | `one_time` \| `daily` \| `weekly` \| `monthly` |
| `notify_before_json`                                 | TEXT    | Nullable                                       |
| `annoying_mode_enabled`                              | INTEGER | 0/1                                            |
| `notes`                                              | TEXT    | Nullable                                       |
| `status`                                             | TEXT    | `open` \| `completed` \| `archived`            |
| `last_completed_at` / `next_due_at` / `completed_at` | INTEGER | Nullable                                       |
| `created_at` / `updated_at`                          | INTEGER |                                                |

## `calendar_events`

| Column                      | Type    | Notes                                                                 |
| --------------------------- | ------- | --------------------------------------------------------------------- |
| `id`                        | TEXT PK |                                                                       |
| `hub_id`                    | TEXT FK |                                                                       |
| `title`                     | TEXT    |                                                                       |
| `category`                  | TEXT    | birthday, medical, dental, appointment, annual_exam, general_reminder |
| `event_date`                | TEXT    | `YYYY-MM-DD`                                                          |
| `event_time`                | TEXT    | Nullable `HH:MM`                                                      |
| `recurrence`                | TEXT    | `none` \| `yearly` \| `monthly` \| `custom`                           |
| `recurrence_rule_json`      | TEXT    | Nullable                                                              |
| `status`                    | TEXT    |                                                                       |
| `notes`                     | TEXT    | Nullable                                                              |
| `notify_before_days`        | INTEGER | Default 0                                                             |
| `notified_comrade_ids`      | TEXT    | JSON; NULL = assigned Comrades only                                   |
| `snoozed_until`             | INTEGER | Nullable                                                              |
| `caldav_uid`                | TEXT    | Nullable, reserved                                                    |
| `created_at` / `updated_at` | INTEGER |                                                                       |

## `calendar_event_comrades`

Composite PK (`event_id`, `comrade_id`) — canonical assignment set (API may expose as `assigned_comrade_ids`).

## `credential_entries`, `contacts`, `reference_notes`

Unchanged intent from product spec: shared credentials (encrypted blob), contacts (JSON phone/email arrays), markdown notes + tags.

## `service_tiles`

Media & services grid: name, url, description, icon_url, category (`media` \| `tools` \| `other`), sort_order.

## `notification_outbox`

Queue for SMS / Signal / Ntfy workers: polymorphic `subject_type` / `subject_id`, `scheduled_at`, `status`, etc.
