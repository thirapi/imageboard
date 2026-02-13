CREATE TABLE "bans" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"reason" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "is_nsfw" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "is_spoiler" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "is_nsfw" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "is_spoiler" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "idx_bans_ip" ON "bans" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "idx_bans_expires_at" ON "bans" USING btree ("expires_at");