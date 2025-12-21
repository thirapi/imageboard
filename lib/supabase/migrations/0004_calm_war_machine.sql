ALTER TABLE "threads" ADD COLUMN "post_number" integer;--> statement-breakpoint
ALTER TABLE "replies" ADD COLUMN "post_number" integer;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_post_number_unique" UNIQUE("post_number");--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_post_number_unique" UNIQUE("post_number");