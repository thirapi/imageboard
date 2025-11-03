CREATE TABLE "boards" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"thread_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"author" varchar(100) DEFAULT 'Anonymous' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reply_to" uuid
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"ip" varchar NOT NULL,
	"user_agent" varchar NOT NULL,
	"last_seen" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_id" text NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"image" text,
	"author" varchar(100) DEFAULT 'Anonymous' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"last_reply" timestamp,
	"is_pinned" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"avatar" text,
	"is_anonymous" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;