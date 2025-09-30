-- Database Index Update Script
-- This script adds additional indexes to improve query performance

-- Add updated_at columns if they don't exist
ALTER TABLE chatbots 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE content_pipeline 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chatbots_created_at ON chatbots(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_content_pipeline_created_at ON content_pipeline(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_translation_cache_created_at ON translation_cache(created_at);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_jobs_bot_id_status ON jobs(bot_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_bot_id_created_at ON documents(bot_id, created_at);

-- Update existing rows with updated_at timestamps
UPDATE chatbots SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE jobs SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE content_pipeline SET updated_at = created_at WHERE updated_at IS NULL;