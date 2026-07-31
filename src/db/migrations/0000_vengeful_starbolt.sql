CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`due_date` integer NOT NULL,
	`topic` text NOT NULL,
	`status` text DEFAULT 'Todo' NOT NULL,
	`is_archived` integer DEFAULT 0 NOT NULL
);
