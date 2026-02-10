ALTER TABLE "threads" ADD COLUMN "image_metadata" text;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "deletion_password" varchar(255);--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "image_metadata" text;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "deletion_password" varchar(255);