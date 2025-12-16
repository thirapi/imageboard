-- Add images table for tracking uploaded images
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  public_id VARCHAR(255) NOT NULL,
  thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
  reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add image columns if they don't exist
ALTER TABLE threads 
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE replies 
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Update reports table to track resolution
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS resolved_by VARCHAR(100);

-- Add index for images
CREATE INDEX IF NOT EXISTS idx_images_thread_id ON images(thread_id);
CREATE INDEX IF NOT EXISTS idx_images_reply_id ON images(reply_id);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);
