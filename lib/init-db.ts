import { sql } from "@/lib/db"

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

export async function initializeTables(): Promise<boolean> {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        business_id INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMP,
        invitation_token VARCHAR(255),
        invitation_expires_at TIMESTAMP
      )
    `

    // Create sessions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Create businesses table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        plan VARCHAR(50) NOT NULL DEFAULT 'free',
        owner_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Create business_users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS business_users (
        id SERIAL PRIMARY KEY,
        business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(business_id, user_id)
      )
    `

    // Create projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        owner_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Create project_members table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(project_id, user_id)
      )
    `

    // Create tasks table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'todo',
        priority VARCHAR(50) NOT NULL DEFAULT 'medium',
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        assignee_id INTEGER REFERENCES users(id),
        due_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Create time_entries table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS time_entries (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        duration INTEGER NOT NULL, -- in seconds
        description TEXT,
        started_at TIMESTAMP NOT NULL,
        ended_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    // Create invoices table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        due_date TIMESTAMP NOT NULL,
        issued_date TIMESTAMP NOT NULL,
        paid_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `

    return true
  } catch (error) {
    console.error("Error initializing tables:", error)
    return false
  }
}

export async function initializeTwoFactorTables(): Promise<boolean> {
  try {
    // Create two_factor_auth table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS two_factor_auth (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        secret VARCHAR(255) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE(user_id)
      )
    `

    // Create backup_codes table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS backup_codes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(255) NOT NULL,
        used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        used_at TIMESTAMP,
        UNIQUE(user_id, code)
      )
    `

    return true
  } catch (error) {
    console.error("Error initializing two-factor tables:", error)
    return false
  }
}

export async function createInitialAdminUser(): Promise<boolean> {
  try {
    // Check if any users exist
    const users = await sql`SELECT COUNT(*) as count FROM users`

    if (users[0].count > 0) {
      console.log("Users already exist, skipping initial admin creation")
      return true
    }

    // Create initial admin user
    await sql`
      INSERT INTO users (
        name, email, password_hash, role, status, created_at, updated_at
      ) VALUES (
        'Admin User', 'admin@example.com', 'admin123', 'admin', 'active', NOW(), NOW()
      )
    `

    console.log("Created initial admin user: admin@example.com / admin123")
    return true
  } catch (error) {
    console.error("Error creating initial admin user:", error)
    return false
  }
}
