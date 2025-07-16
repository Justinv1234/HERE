-- Create a test user for login testing
-- Password is 'password123' hashed with bcrypt

INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
VALUES (
  'Test User',
  'test@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrKxQ7u',
  'admin',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, name, email, role, status FROM users WHERE email = 'test@example.com';
