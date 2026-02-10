-- Custom SQL migration file, put your code below! --
-- Migration: Replace old boards with fscchan-inspired boards
-- This migration removes old boards and adds new ones inspired by fscchan.nl

-- First, delete all existing boards (this will cascade delete related threads/replies if configured)
-- If you want to preserve existing data, comment out the DELETE line
DELETE FROM boards;

-- Reset the sequence for board IDs (optional, for clean IDs)
-- Reset the sequence for board IDs (optional, for clean IDs)
ALTER SEQUENCE boards_id_seq RESTART WITH 1;
ALTER SEQUENCE post_number_seq RESTART WITH 1;

-- Insert new fscchan-inspired boards
INSERT INTO boards (code, name, description) VALUES
  -- Popkultur
  ('wibu', 'Subkultur Prowibu', 'Anime, manga, dan budaya Jepang - diskusi santai tanpa gatekeeping'),
  ('gim', 'Video Game', 'Gaming PC, konsol, mobile - dari AAA sampai indie lokal'),
  ('sass', 'Sastra dan Susastra', 'Puisi, novel, cerpen - dari Chairil Anwar sampai fanfic'),
  ('oc', 'Lingkarkarya Kreatif', 'Karya original - seni, musik, tulisan, dan kreativitas lainnya'),
  ('toku', 'Tokusatsu dan Live Action', 'Kamen Rider, Super Sentai, Ultraman, dan drama Asia'),
  
  -- Kekinian
  ('pol', 'Politik Tidak Sehat', 'Debat politik, isu terkini - harap tetap santun meski berbeda pendapat'),
  ('mipa', 'Sains dan Teknologi', 'Matematika, fisika, kimia, IT, programming, dan inovasi'),
  ('rj', 'Fiksi dan Delusi Romansa', 'Curhat cinta, tips PDKT, atau sindiran buat yang jomblo abadi'),
  ('med', 'Media dan Hiburan', 'Film, musik, podcast, YouTube - dari mainstream sampai underground'),
  ('pew', 'Militer', 'Alutsista, strategi perang, sejarah militer, dan geopolitik'),
  ('omni', 'Spiritual dan Filosofi', 'Agama, kepercayaan, eksistensialisme - diskusi mendalam tanpa judgement'),
  ('jas', 'Olahraga dan Jasmani', 'Sepak bola, basket, fitness, martial arts - dari nonton sampai praktik'),
  ('wang', 'Bisnis dan Keuangan', 'Investasi, crypto, saham, side hustle - jalan menuju financial freedom'),
  ('kul', 'Kuliner', 'Resep masakan, review warung, street food - dari Sabang sampai Merauke'),
  ('oto', 'Automotif dan Motorsport', 'Motor, mobil, F1, MotoGP - dari modifikasi sampai balapan'),
  ('cb', 'Komik dan Kartun', 'Komik lokal, webtoon, western comics, dan animasi'),
  ('ac', 'Sekolah dan Perkampusan', 'Tips belajar, curhat dosen killer, atau nostalgia masa sekolah'),
  ('tre', 'Travel & Wisata', 'Spot hidden gem, cerita backpacker, atau tips liburan hemat'),
  
  -- Bebas
  ('b', 'Random', 'Obrolan bebas, meme, dan curhatan sehari-hari'),
  ('n', 'Nirmakna', 'Random, shitpost, meme - zona bebas tanpa tema khusus'),
  ('dio', 'International', 'English board - discuss anything in English, practice your language skills'),
  ('mis', 'Klenik', 'Mistis, supranatural, paranormal - cerita hantu dan hal gaib Nusantara'),
  ('sjrh', 'Sejarah', 'Sejarah dunia dan Indonesia - dari kerajaan kuno sampai perang modern'),
  ('tlg', 'Permintaan Bantuan', 'Butuh saran? Tanya di sini - komunitas siap membantu'),
  ('his', 'Sejarah Nusantara', 'Cerita kerajaan Majapahit, perjuangan kemerdekaan, atau mitos lokal')
ON CONFLICT (code) DO NOTHING;
