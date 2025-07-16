import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const connectionTest = await sql`SELECT NOW() as time`

    if (!connectionTest || connectionTest.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection test failed",
        },
        { status: 500 },
      )
    }

    // Check if tables exist
    const tablesExist = await checkTablesExist()

    // Initialize tables if they don't exist
    if (!tablesExist) {
      await initializeTables()
    }

    return NextResponse.json({
      success: true,
      message: "Database setup complete",
      timestamp: connectionTest[0].time,
      tablesExisted: tablesExist,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database setup failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

async function checkTablesExist() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as users_exist
    `
    return result[0].users_exist
  } catch (error) {
    console.error("Error checking if tables exist:", error)
    return false
  }
}

async function initializeTables() {
  // Create users table
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

  // Create sessions table
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `

  // Create businesses table
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

  // Create projects table
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'active',
      business_id INTEGER,
      owner_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `

  // Create tasks table
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'todo',
      priority VARCHAR(50) NOT NULL DEFAULT 'medium',
      project_id INTEGER NOT NULL,
      assignee_id INTEGER,
      due_date TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `

  // Create time_entries table
  await sql`
    CREATE TABLE IF NOT EXISTS time_entries (
      id SERIAL PRIMARY KEY,
      task_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      description TEXT,
      started_at TIMESTAMP NOT NULL,
      ended_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `

  // Create invoices table
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'draft',
      due_date TIMESTAMP NOT NULL,
      issued_date TIMESTAMP NOT NULL,
      paid_date TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `

  // Create two_factor_auth table
  await sql`
    CREATE TABLE IF NOT EXISTS two_factor_auth (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      secret VARCHAR(255) NOT NULL,
      enabled BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE(user_id)
    )
  `

  // Create backup_codes table
  await sql`
    CREATE TABLE IF NOT EXISTS backup_codes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      code VARCHAR(255) NOT NULL,
      used BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      used_at TIMESTAMP,
      UNIQUE(user_id, code)
    )
  `

  // Create invitations table
  await sql`
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
    )
  `
}
