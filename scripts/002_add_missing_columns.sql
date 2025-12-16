-- Add missing columns to threads table for deleted status and images
ALTER TABLE threads 
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS image TEXT;

-- Add missing columns to replies table for deleted status and images  
ALTER TABLE replies 
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS image TEXT;

-- Create indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_threads_is_deleted ON threads(is_deleted);
CREATE INDEX IF NOT EXISTS idx_replies_is_deleted ON replies(is_deleted);

-- Create indexes for image queries
CREATE INDEX IF NOT EXISTS idx_threads_image_created ON threads(created_at DESC) WHERE image IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_replies_image_created ON replies(created_at DESC) WHERE image IS NOT NULL;
