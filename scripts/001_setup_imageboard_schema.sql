-- Create boards table
CREATE TABLE IF NOT EXISTS boards (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id SERIAL PRIMARY KEY,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  subject VARCHAR(200),
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'Awanama',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bumped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'Awanama',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table for moderation
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(20) NOT NULL, -- 'thread' or 'reply'
  content_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' -- 'pending', 'resolved', 'dismissed'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_threads_board_id ON threads(board_id);
CREATE INDEX IF NOT EXISTS idx_threads_bumped_at ON threads(bumped_at DESC);
CREATE INDEX IF NOT EXISTS idx_replies_thread_id ON replies(thread_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Insert some default boards
INSERT INTO boards (code, name, description) VALUES
  ('g', 'Technology', 'Discussion about technology and gadgets'),
  ('a', 'Anime & Manga', 'Discussion about anime and manga'),
  ('v', 'Video Games', 'Discussion about video games'),
  ('fit', 'Fitness', 'Health, fitness, and nutrition'),
  ('b', 'Random', 'Random discussion')
ON CONFLICT (code) DO NOTHING;
