PRAGMA foreign_keys=OFF;
--> statement-breakpoint
DROP TABLE IF EXISTS `notification_outbox`;
--> statement-breakpoint
DROP TABLE IF EXISTS `calendar_event_comrades`;
--> statement-breakpoint
DROP TABLE IF EXISTS `calendar_events`;
--> statement-breakpoint
DROP TABLE IF EXISTS `chore_completions`;
--> statement-breakpoint
DROP TABLE IF EXISTS `chores`;
--> statement-breakpoint
DROP TABLE IF EXISTS `hub_items`;
--> statement-breakpoint
DROP TABLE IF EXISTS `products`;
--> statement-breakpoint
DROP TABLE IF EXISTS `stores`;
--> statement-breakpoint
DROP TABLE IF EXISTS `credential_entries`;
--> statement-breakpoint
DROP TABLE IF EXISTS `contacts`;
--> statement-breakpoint
DROP TABLE IF EXISTS `reference_notes`;
--> statement-breakpoint
DROP TABLE IF EXISTS `comrades`;
--> statement-breakpoint
DROP TABLE IF EXISTS `hubs`;
--> statement-breakpoint
CREATE TABLE `hubs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comrades` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`is_admin` integer DEFAULT 0 NOT NULL,
	`has_completed_setup` integer DEFAULT 0 NOT NULL,
	`must_change_password` integer DEFAULT 1 NOT NULL,
	`notification_phone` text,
	`notification_signal` text,
	`notification_ntfy_topic` text,
	`icon` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `comrades_hub_id_username_unique` ON `comrades` (`hub_id`,`username`);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`comrade_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	FOREIGN KEY (`comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shopping_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`name` text NOT NULL,
	`list_kind` text NOT NULL,
	`owner_comrade_id` text,
	`created_by_comrade_id` text,
	`notified_comrade_ids` text,
	`summary_frequency` text DEFAULT 'weekly' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shopping_list_items` (
	`id` text PRIMARY KEY NOT NULL,
	`list_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`vendor` text,
	`purchase_type` text NOT NULL,
	`priority` text NOT NULL,
	`is_one_time` integer DEFAULT 0 NOT NULL,
	`product_code_or_url` text,
	`notes` text,
	`added_by_comrade_id` text,
	`added_at` integer NOT NULL,
	`ordered_by_comrade_id` text,
	`ordered_at` integer,
	`last_escalated_at` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`list_id`) REFERENCES `shopping_lists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`added_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ordered_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chores` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`assigned_comrade_id` text NOT NULL,
	`frequency` text NOT NULL,
	`frequency_rule_json` text,
	`last_completed_at` integer,
	`next_due_at` integer,
	`annoying_mode_enabled` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chore_completions` (
	`id` text PRIMARY KEY NOT NULL,
	`chore_id` text NOT NULL,
	`completed_at` integer NOT NULL,
	`completed_by_comrade_id` text,
	`completed_by` text NOT NULL,
	`notes` text,
	FOREIGN KEY (`chore_id`) REFERENCES `chores`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`completed_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`created_by_comrade_id` text NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`visibility` text NOT NULL,
	`assigned_comrade_id` text,
	`due_date` text,
	`due_time` text,
	`recurrence` text NOT NULL,
	`notify_before_json` text,
	`annoying_mode_enabled` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`status` text NOT NULL,
	`last_completed_at` integer,
	`next_due_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hub_id`) REFERENCES `hubs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`created_by_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assigned_comrade_id`) REFERENCES `comrades`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `calendar_events` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`event_date` text NOT NULL,
	`event_time` text,
	`recurrence` text NOT NULL,
	`recurrence_rule_json` text,
	`status` text NOT NULL,
	`notes` text,
	`notify_before_days` integer DEFAULT 0 NOT NULL,
	`notified_comrade_ids` text,
	`snoozed_until` integer,
	`caldav_uid` text,
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
CREATE TABLE `service_tiles` (
	`id` text PRIMARY KEY NOT NULL,
	`hub_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`icon_url` text,
	`category` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
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
PRAGMA foreign_keys=ON;
