-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id INTEGER NOT NULL,
  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add business_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS business_id INTEGER REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_users_business_id ON users(business_id);

-- Add business_id to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS business_id INTEGER REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_projects_business_id ON projects(business_id);

-- Add business_id to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS business_id INTEGER REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_tasks_business_id ON tasks(business_id);

-- Add business_id to time_entries table
ALTER TABLE time_entries ADD COLUMN IF NOT EXISTS business_id INTEGER REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_time_entries_business_id ON time_entries(business_id);

-- Add business_id to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS business_id INTEGER REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_invoices_business_id ON invoices(business_id);

-- Add business_id to audit_logs table
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS business_id INTEGER REFERENCES businesses(id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_business_id ON audit_logs(business_id);
