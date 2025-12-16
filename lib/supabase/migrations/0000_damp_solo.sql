CREATE TABLE "boards" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "boards_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"thread_id" integer,
	"reply_id" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_id" integer NOT NULL,
	"subject" varchar(200),
	"content" text NOT NULL,
	"author" varchar(100) DEFAULT 'Awanama',
	"image" text,
	"is_deleted" boolean DEFAULT false,
	"is_pinned" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"bumped_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"thread_id" integer NOT NULL,
	"content" text NOT NULL,
	"author" varchar(100) DEFAULT 'Awanama',
	"image" text,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar(20) NOT NULL,
	"content_id" serial NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"reported_at" timestamp with time zone DEFAULT now(),
	"resolved_at" timestamp with time zone,
	"resolved_by" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_reply_id_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."replies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_images_thread_id" ON "images" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "idx_images_reply_id" ON "images" USING btree ("reply_id");--> statement-breakpoint
CREATE INDEX "idx_images_created_at" ON "images" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_threads_board_id" ON "threads" USING btree ("board_id");--> statement-breakpoint
CREATE INDEX "idx_threads_bumped_at" ON "threads" USING btree ("bumped_at");--> statement-breakpoint
CREATE INDEX "idx_threads_is_deleted" ON "threads" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "idx_replies_thread_id" ON "replies" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "idx_replies_is_deleted" ON "replies" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "idx_reports_status" ON "reports" USING btree ("status");