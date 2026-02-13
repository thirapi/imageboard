ALTER TABLE "threads" ADD COLUMN "is_spoiler" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "is_spoiler" boolean DEFAULT false;