-- Custom SQL migration file, put your code below! --
INSERT INTO boards (code, name, description) VALUES
  ('b', 'Random (Nirmakna)', 'Obrolan bebas, meme, dan curhatan sehari-hari ala Indo'),
  ('rj', 'Romansa & Jomblo', 'Curhat pacaran, tips PDKT, atau sindiran buat yang single forever'),
  ('pol', 'Politik', 'Debat pemilu, isu korupsi, dan opini netral soal pemerintah'),
  ('kul', 'Kuliah & Kerja', 'Tips masuk PTN, cari lowongan, atau curhat deadline skripsi'),
  ('mak', 'Makanan & Kuliner', 'Review makanan pinggir jalan, resep nasi goreng, atau street food Nusantara'),
  ('tre', 'Travel & Wisata', 'Spot hidden gem di Bali, cerita backpacker ke Jogja, atau tips liburan hemat'),
  ('mis', 'Mistis & Klenik', 'Hantu kampung, ramalan primbon, atau cerita supranatural ala Nusantara'),
  ('his', 'Sejarah', 'Cerita kerajaan Majapahit, perjuangan kemerdekaan, atau mitos Nusantara')
ON CONFLICT (code) DO NOTHING;