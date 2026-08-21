ALTER TABLE "replies" ADD COLUMN "is_sage" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "idx_threads_board_view" ON "threads" USING btree ("board_id","is_deleted","is_archived","is_pinned","bumped_at");--> statement-breakpoint
CREATE INDEX "idx_replies_thread_view" ON "replies" USING btree ("thread_id","is_deleted","created_at");