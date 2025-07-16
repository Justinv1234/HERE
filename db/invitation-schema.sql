-- Add invitation fields to users table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'invitation_token') THEN
        ALTER TABLE users ADD COLUMN invitation_token VARCHAR(255) NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'invitation_expires_at') THEN
        ALTER TABLE users ADD COLUMN invitation_expires_at TIMESTAMP NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'business_id') THEN
        ALTER TABLE users ADD COLUMN business_id INTEGER NULL;
    END IF;
END
$$;

-- Create invitations table if it doesn't exist
CREATE TABLE IF NOT EXISTS invitations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    business_id INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    invited_by INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create business_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_users (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

-- Add business_id to projects table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'business_id') THEN
        ALTER TABLE projects ADD COLUMN business_id INTEGER NULL;
    END IF;
END
$$;
