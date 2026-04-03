ALTER TABLE "threads" ADD COLUMN "is_archived" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "idx_threads_is_archived" ON "threads" USING btree ("is_archived");