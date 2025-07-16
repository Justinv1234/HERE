import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function GET() {
  try {
    // Check if we already have users
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`

    if (existingUsers[0].count > 0) {
      return NextResponse.json({
        success: true,
        message: "Database already has data, skipping seed",
      })
    }

    // Create admin user
    const adminPassword = await hashPassword("admin123")
    const admin = await sql`
      INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
      VALUES ('Admin User', 'admin@example.com', ${adminPassword}, 'admin', 'active', NOW(), NOW())
      RETURNING id
    `

    // Create a business
    const business = await sql`
      INSERT INTO businesses (name, slug, plan, owner_id, created_at, updated_at)
      VALUES ('Demo Company', 'demo-company', 'business', ${admin[0].id}, NOW(), NOW())
      RETURNING id
    `

    // Update admin user with business_id
    await sql`
      UPDATE users
      SET business_id = ${business[0].id}
      WHERE id = ${admin[0].id}
    `

    // Create a project
    const project = await sql`
      INSERT INTO projects (name, description, status, business_id, owner_id, created_at, updated_at)
      VALUES (
        'Website Redesign', 
        'Complete overhaul of the company website with new branding', 
        'active', 
        ${business[0].id}, 
        ${admin[0].id}, 
        NOW(), 
        NOW()
      )
      RETURNING id
    `

    // Create some tasks
    await sql`
      INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, created_at, updated_at)
      VALUES 
        ('Design homepage mockup', 'Create initial design concepts for the homepage', 'todo', 'high', ${project[0].id}, ${admin[0].id}, NOW(), NOW()),
        ('Setup development environment', 'Configure development tools and repositories', 'in_progress', 'medium', ${project[0].id}, ${admin[0].id}, NOW(), NOW()),
        ('Content migration plan', 'Develop strategy for migrating existing content', 'todo', 'medium', ${project[0].id}, ${admin[0].id}, NOW(), NOW()),
        ('SEO optimization', 'Implement SEO best practices across the site', 'todo', 'high', ${project[0].id}, ${admin[0].id}, NOW(), NOW())
    `

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      adminEmail: "admin@example.com",
      adminPassword: "admin123",
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
