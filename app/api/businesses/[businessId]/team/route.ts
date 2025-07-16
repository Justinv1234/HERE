import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params

    // Get team members for the business
    const teamMembers = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.last_login_at as "lastActive",
        u.created_at
      FROM users u
      WHERE u.business_id = ${Number.parseInt(businessId)}
      ORDER BY u.name
    `

    // Format the data for the frontend
    const formattedTeamMembers = teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role || "Member",
      status: member.status || "active",
      lastActive: member.lastActive,
      projects: [], // Will be populated when we have project assignments
      permissions: {
        manageTeam: member.role === "admin",
        manageProjects: member.role === "admin" || member.role === "project_manager",
        manageInvoices: member.role === "admin",
        viewReports: true,
      },
    }))

    return NextResponse.json({ teamMembers: formattedTeamMembers })
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ teamMembers: [] })
  }
}

export async function POST(request: Request, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params
    const { email, role } = await request.json()

    // Create a new user invitation (simplified for now)
    const result = await sql`
      INSERT INTO users (email, name, role, status, business_id, created_at, updated_at)
      VALUES (${email}, ${email.split("@")[0]}, ${role.toLowerCase()}, 'invited', ${Number.parseInt(businessId)}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json({ success: true, user: result[0] })
  } catch (error) {
    console.error("Error adding team member:", error)
    return NextResponse.json({ error: "Failed to add team member" }, { status: 500 })
  }
}
