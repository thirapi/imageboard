-- Custom SQL migration file, put your code below! --
-- Migration: Remove redundant boards
-- This migration removes boards that are redundant or no longer needed

-- Remove 'his' (Sejarah Nusantara) as 'sjrh' covers it
DELETE FROM boards WHERE code = 'his';

-- Remove 'toku' (Tokusatsu dan Live Action)
DELETE FROM boards WHERE code = 'toku';

-- Remove 'n' (Nirmakna) as 'b' (Random) covers it
DELETE FROM boards WHERE code = 'n';