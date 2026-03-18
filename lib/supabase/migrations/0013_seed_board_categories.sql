-- Custom SQL migration file, put your code below! --

-- 1. Insert Categories
INSERT INTO "board_categories" ("name", "display_order") 
VALUES 
  ('Popkultur', 1),
  ('Kekinian', 2),
  ('Bebas', 3)
ON CONFLICT ("name") DO NOTHING;

-- 2. Update popkultur boards
UPDATE "boards" 
SET "category_id" = (SELECT "id" FROM "board_categories" WHERE "name" = 'Popkultur')
WHERE "code" IN ('wibu', 'gim', 'sass', 'oc', 'cb', 'med', 'rj');

-- 3. Update kekinian boards
UPDATE "boards" 
SET "category_id" = (SELECT "id" FROM "board_categories" WHERE "name" = 'Kekinian')
WHERE "code" IN ('pol', 'mipa', 'pew', 'omni', 'jas', 'wang', 'kul', 'oto', 'ac', 'tre');

-- 4. Update bebas boards
UPDATE "boards" 
SET "category_id" = (SELECT "id" FROM "board_categories" WHERE "name" = 'Bebas')
WHERE "code" IN ('b', 'dio', 'mis', 'sjrh', 'tlg');