-- Add industry column to businesses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'industry'
    ) THEN
        ALTER TABLE businesses ADD COLUMN industry VARCHAR(255);
    END IF;
END $$;

-- Add plan column to businesses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'businesses' 
        AND column_name = 'plan'
    ) THEN
        ALTER TABLE businesses ADD COLUMN plan VARCHAR(50) DEFAULT 'freelancer';
    END IF;
END $$;
