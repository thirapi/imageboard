CREATE TYPE "public"."report_content_type" AS ENUM('thread', 'reply');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'resolved', 'dismissed');--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "content_type" SET DATA TYPE "public"."report_content_type" USING "content_type"::"public"."report_content_type";--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."report_status";--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "status" SET DATA TYPE "public"."report_status" USING "status"::"public"."report_status";