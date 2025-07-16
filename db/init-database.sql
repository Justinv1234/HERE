-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create a test admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'super_admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create a test regular user (password: user123)
INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
VALUES (
  'Test User',
  'user@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'member',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
