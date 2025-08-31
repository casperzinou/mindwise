CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name TEXT NOT NULL,
    website_url TEXT,
    support_email TEXT,
    configuration_details JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bot_id UUID REFERENCES chatbots(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_pipeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT,
    status TEXT DEFAULT 'pending_draft',
    raw_draft TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT,
    embedding VECTOR(384), -- Assuming 384-dimensional embeddings
    metadata JSONB,
    bot_id UUID REFERENCES chatbots(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE translation_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_text TEXT NOT NULL,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_text, source_language, target_language)
);

-- Add indexes for better query performance
CREATE INDEX idx_chatbots_user_id ON chatbots(user_id);
CREATE INDEX idx_jobs_bot_id ON jobs(bot_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_content_pipeline_status ON content_pipeline(status);
CREATE INDEX idx_documents_bot_id ON documents(bot_id);
CREATE INDEX idx_translation_cache_lookup ON translation_cache(source_text, source_language, target_language);