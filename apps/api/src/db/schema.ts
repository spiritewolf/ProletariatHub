import { blob, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

/** Key-value store (migrations, flags, config blobs). */
export const appMeta = sqliteTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const hubs = sqliteTable('hubs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});

export const comrades = sqliteTable(
  'comrades',
  {
    id: text('id').primaryKey(),
    hubId: text('hub_id')
      .notNull()
      .references(() => hubs.id),
    username: text('username').notNull(),
    passwordHash: text('password_hash').notNull(),
    isAdmin: integer('is_admin', { mode: 'boolean' }).notNull().default(false),
    hasCompletedSetup: integer('has_completed_setup', { mode: 'boolean' }).notNull().default(false),
    mustChangePassword: integer('must_change_password', { mode: 'boolean' })
      .notNull()
      .default(true),
    notificationPhone: text('notification_phone'),
    notificationSignal: text('notification_signal'),
    notificationNtfyTopic: text('notification_ntfy_topic'),
    icon: text('icon'),
    createdAt: integer('created_at', { mode: 'number' }).notNull(),
  },
  (t) => ({
    hubUsernameUnique: uniqueIndex('comrades_hub_id_username_unique').on(t.hubId, t.username),
  }),
);

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  comradeId: text('comrade_id')
    .notNull()
    .references(() => comrades.id),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  lastSeenAt: integer('last_seen_at', { mode: 'number' }).notNull(),
});

export const shoppingLists = sqliteTable('shopping_lists', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  name: text('name').notNull(),
  listKind: text('list_kind').notNull(),
  ownerComradeId: text('owner_comrade_id').references(() => comrades.id),
  createdByComradeId: text('created_by_comrade_id').references(() => comrades.id),
  notifiedComradeIds: text('notified_comrade_ids'),
  summaryFrequency: text('summary_frequency').notNull().default('weekly'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const shoppingListItems = sqliteTable('shopping_list_items', {
  id: text('id').primaryKey(),
  listId: text('list_id')
    .notNull()
    .references(() => shoppingLists.id),
  name: text('name').notNull(),
  category: text('category'),
  vendor: text('vendor'),
  purchaseType: text('purchase_type').notNull(),
  priority: text('priority').notNull(),
  isOneTime: integer('is_one_time', { mode: 'boolean' }).notNull().default(false),
  productCodeOrUrl: text('product_code_or_url'),
  notes: text('notes'),
  addedByComradeId: text('added_by_comrade_id').references(() => comrades.id),
  addedAt: integer('added_at', { mode: 'number' }).notNull(),
  orderedByComradeId: text('ordered_by_comrade_id').references(() => comrades.id),
  orderedAt: integer('ordered_at', { mode: 'number' }),
  lastEscalatedAt: integer('last_escalated_at', { mode: 'number' }),
  sortOrder: integer('sort_order', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const chores = sqliteTable('chores', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  title: text('title').notNull(),
  description: text('description'),
  assignedComradeId: text('assigned_comrade_id')
    .notNull()
    .references(() => comrades.id),
  frequency: text('frequency').notNull(),
  frequencyRuleJson: text('frequency_rule_json'),
  lastCompletedAt: integer('last_completed_at', { mode: 'number' }),
  nextDueAt: integer('next_due_at', { mode: 'number' }),
  annoyingModeEnabled: integer('annoying_mode_enabled', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const choreCompletions = sqliteTable('chore_completions', {
  id: text('id').primaryKey(),
  choreId: text('chore_id')
    .notNull()
    .references(() => chores.id),
  completedAt: integer('completed_at', { mode: 'number' }).notNull(),
  completedByComradeId: text('completed_by_comrade_id').references(() => comrades.id),
  completedBy: text('completed_by').notNull(),
  notes: text('notes'),
});

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  createdByComradeId: text('created_by_comrade_id')
    .notNull()
    .references(() => comrades.id),
  title: text('title').notNull(),
  category: text('category'),
  visibility: text('visibility').notNull(),
  assignedComradeId: text('assigned_comrade_id').references(() => comrades.id),
  dueDate: text('due_date'),
  dueTime: text('due_time'),
  recurrence: text('recurrence').notNull(),
  notifyBeforeJson: text('notify_before_json'),
  annoyingModeEnabled: integer('annoying_mode_enabled', { mode: 'boolean' })
    .notNull()
    .default(false),
  notes: text('notes'),
  status: text('status').notNull(),
  lastCompletedAt: integer('last_completed_at', { mode: 'number' }),
  nextDueAt: integer('next_due_at', { mode: 'number' }),
  completedAt: integer('completed_at', { mode: 'number' }),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const calendarEvents = sqliteTable('calendar_events', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  title: text('title').notNull(),
  category: text('category').notNull(),
  eventDate: text('event_date').notNull(),
  eventTime: text('event_time'),
  recurrence: text('recurrence').notNull(),
  recurrenceRuleJson: text('recurrence_rule_json'),
  status: text('status').notNull(),
  notes: text('notes'),
  notifyBeforeDays: integer('notify_before_days', { mode: 'number' }).notNull().default(0),
  notifiedComradeIds: text('notified_comrade_ids'),
  snoozedUntil: integer('snoozed_until', { mode: 'number' }),
  caldavUid: text('caldav_uid'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const calendarEventComrades = sqliteTable(
  'calendar_event_comrades',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => calendarEvents.id),
    comradeId: text('comrade_id')
      .notNull()
      .references(() => comrades.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.eventId, t.comradeId] }),
  }),
);

export const credentialEntries = sqliteTable('credential_entries', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  label: text('label').notNull(),
  username: text('username'),
  secretCiphertext: blob('secret_ciphertext', { mode: 'buffer' }).notNull(),
  urlOrApp: text('url_or_app'),
  notesPlain: text('notes_plain'),
  keyVersion: integer('key_version', { mode: 'number' }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  name: text('name').notNull(),
  category: text('category'),
  phonesJson: text('phones_json'),
  emailsJson: text('emails_json'),
  address: text('address'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const referenceNotes = sqliteTable('reference_notes', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  title: text('title').notNull(),
  bodyMarkdown: text('body_markdown').notNull(),
  tagsJson: text('tags_json'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const serviceTiles = sqliteTable('service_tiles', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  category: text('category').notNull(),
  sortOrder: integer('sort_order', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

export const notificationOutbox = sqliteTable('notification_outbox', {
  id: text('id').primaryKey(),
  hubId: text('hub_id')
    .notNull()
    .references(() => hubs.id),
  recipientComradeId: text('recipient_comrade_id').references(() => comrades.id),
  subjectType: text('subject_type').notNull(),
  subjectId: text('subject_id'),
  kind: text('kind').notNull(),
  payloadJson: text('payload_json'),
  scheduledAt: integer('scheduled_at', { mode: 'number' }).notNull(),
  status: text('status').notNull(),
  dedupeKey: text('dedupe_key'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  sentAt: integer('sent_at', { mode: 'number' }),
});
