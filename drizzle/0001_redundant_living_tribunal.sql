PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_recordings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fileUri` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_recordings`("id", "fileUri", "createdAt", "updatedAt") SELECT "id", "fileUri", "createdAt", "updatedAt" FROM `recordings`;--> statement-breakpoint
DROP TABLE `recordings`;--> statement-breakpoint
ALTER TABLE `__new_recordings` RENAME TO `recordings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_scripts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_scripts`("id", "title", "content", "createdAt", "updatedAt") SELECT "id", "title", "content", "createdAt", "updatedAt" FROM `scripts`;--> statement-breakpoint
DROP TABLE `scripts`;--> statement-breakpoint
ALTER TABLE `__new_scripts` RENAME TO `scripts`;