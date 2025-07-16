import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `

    // Create projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        due_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
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
        due_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `

    // Create some sample data if tables are empty
    const users = await sql`SELECT COUNT(*) FROM users`
    if (users[0].count === "0") {
      await sql`
        INSERT INTO users (name, email, password)
        VALUES ('Demo User', 'demo@example.com', '$2b$10$JUKcyS.5aHsGHmGdFczT8eUQwKrGe3FMwnrRtQNI5GCy6Ps.QXAwy');
      `
    }

    const projects = await sql`SELECT COUNT(*) FROM projects`
    if (projects[0].count === "0") {
      await sql`
        INSERT INTO projects (name, description, status)
        VALUES 
          ('Website Redesign', 'Complete overhaul of the company website with new branding', 'active'),
          ('Mobile App Development', 'Create a new mobile app for customer engagement', 'active'),
          ('Marketing Campaign', 'Q4 marketing campaign for new product launch', 'completed');
      `

      // Add some tasks to the first project
      await sql`
        INSERT INTO tasks (title, description, status, priority, project_id)
        VALUES 
          ('Design homepage', 'Create mockups for the new homepage', 'done', 'high', 1),
          ('Implement responsive design', 'Make sure the site works on mobile devices', 'todo', 'medium', 1),
          ('Content migration', 'Move content from old site to new site', 'in-progress', 'high', 1);
      `
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      tables: ["users", "projects", "tasks"],
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error initializing database",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
