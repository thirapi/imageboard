CREATE TABLE "board_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "board_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "board_categories_display_order_unique" UNIQUE("display_order")
);
--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_category_id_board_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."board_categories"("id") ON DELETE no action ON UPDATE no action;