CREATE TABLE `hubs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`timezone` text NOT NULL,
	`settings_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comrades` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`name` text NOT NULL,
	`username` text,
	`kind` text NOT NULL,
	`color` text,
	`sort_order` integer NOT NULL,
	`archived_at` integer,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`preferred_store_id` text,
	`notes` text,
	`external_source` text,
	`external_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`preferred_store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `hub_items` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`product_id` text,
	`name` text NOT NULL,
	`priority` text NOT NULL,
	`store_id` text,
	`quantity` text,
	`notes` text,
	`bought_at` integer,
	`added_by_comrade_id` text,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`added_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chores` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`assignee_comrade_id` text,
	`recurrence_kind` text NOT NULL,
	`recurrence_rule_json` text,
	`due_at` integer,
	`annoying_mode` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignee_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chore_completions` (
	`id` text PRIMARY KEY NOT NULL,
	`chore_id` text NOT NULL,
	`completed_at` integer NOT NULL,
	`completed_by_comrade_id` text,
	`notes` text,
	FOREIGN KEY (`chore_id`) REFERENCES `chores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`completed_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`starts_at` integer NOT NULL,
	`ends_at` integer,
	`all_day` integer NOT NULL,
	`recurrence_kind` text NOT NULL,
	`recurrence_rule_json` text,
	`status` text NOT NULL,
	`notes` text,
	`snoozed_until` integer,
	`external_caldav_uid` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `calendar_event_comrades` (
	`event_id` text NOT NULL,
	`comrade_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `comrade_id`),
	FOREIGN KEY (`event_id`) REFERENCES `calendar_events`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `credential_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`label` text NOT NULL,
	`username` text,
	`secret_ciphertext` blob NOT NULL,
	`url_or_app` text,
	`notes_plain` text,
	`key_version` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`phones_json` text,
	`emails_json` text,
	`address` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reference_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`title` text NOT NULL,
	`body_markdown` text NOT NULL,
	`tags_json` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notification_outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`recipient_comrade_id` text,
	`subject_type` text NOT NULL,
	`subject_id` text,
	`kind` text NOT NULL,
	`payload_json` text,
	`scheduled_at` integer NOT NULL,
	`status` text NOT NULL,
	`dedupe_key` text,
	`created_at` integer NOT NULL,
	`sent_at` integer,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`recipient_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_comrades_hub_sort` ON `comrades` (`hub_id`,`sort_order`);
--> statement-breakpoint
CREATE INDEX `idx_products_hub_name` ON `products` (`hub_id`,`name`);
--> statement-breakpoint
CREATE INDEX `idx_hub_items_hub_bought` ON `hub_items` (`hub_id`,`bought_at`);
--> statement-breakpoint
CREATE INDEX `idx_hub_items_hub_store` ON `hub_items` (`hub_id`,`store_id`);
--> statement-breakpoint
CREATE INDEX `idx_notification_outbox_worker` ON `notification_outbox` (`hub_id`,`status`,`scheduled_at`);
--> statement-breakpoint
CREATE UNIQUE INDEX `comrades_hub_username_unique` ON `comrades` (`hub_id`,`username`) WHERE `username` IS NOT NULL;
