CREATE INDEX "idx_threads_created_at" ON "threads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_replies_created_at" ON "replies" USING btree ("created_at");