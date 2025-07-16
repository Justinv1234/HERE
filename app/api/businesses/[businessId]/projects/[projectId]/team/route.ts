import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { businessId: string; projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId, projectId } = params

    // Check if user belongs to the business
    const userBusiness = await sql`
      SELECT * FROM business_users 
      WHERE business_id = ${Number.parseInt(businessId)} 
      AND user_id = ${session.user.id}
    `

    if (userBusiness.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if project exists and belongs to the business
    const project = await sql`
      SELECT * FROM projects 
      WHERE id = ${Number.parseInt(projectId)} 
      AND business_id = ${Number.parseInt(businessId)}
    `

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get team members for the project
    const teamMembers = await sql`
      SELECT u.id, u.name, u.email, pt.role
      FROM project_team pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.project_id = ${Number.parseInt(projectId)}
      ORDER BY u.name
    `

    return NextResponse.json({ teamMembers })
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { businessId: string; projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId, projectId } = params
    const { userId, role } = await request.json()

    // Check if user belongs to the business and has admin role
    const userBusiness = await sql`
      SELECT role FROM business_users 
      WHERE business_id = ${Number.parseInt(businessId)} 
      AND user_id = ${session.user.id}
    `

    if (userBusiness.length === 0 || userBusiness[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if project exists and belongs to the business
    const project = await sql`
      SELECT * FROM projects 
      WHERE id = ${Number.parseInt(projectId)} 
      AND business_id = ${Number.parseInt(businessId)}
    `

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user exists and belongs to the business
    const userExists = await sql`
      SELECT * FROM business_users 
      WHERE business_id = ${Number.parseInt(businessId)} 
      AND user_id = ${userId}
    `

    if (userExists.length === 0) {
      return NextResponse.json({ error: "User not found in this business" }, { status: 404 })
    }

    // Check if user is already in the project team
    const existingMember = await sql`
      SELECT * FROM project_team 
      WHERE project_id = ${Number.parseInt(projectId)} 
      AND user_id = ${userId}
    `

    if (existingMember.length > 0) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 })
    }

    // Add user to project team
    const result = await sql`
      INSERT INTO project_team (project_id, user_id, role)
      VALUES (${Number.parseInt(projectId)}, ${userId}, ${role})
      RETURNING *
    `

    return NextResponse.json({ success: true, teamMember: result[0] })
  } catch (error) {
    console.error("Error adding team member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { businessId: string; projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { businessId, projectId } = params
    const { userId } = await request.json()

    // Check if user belongs to the business and has admin role
    const userBusiness = await sql`
      SELECT role FROM business_users 
      WHERE business_id = ${Number.parseInt(businessId)} 
      AND user_id = ${session.user.id}
    `

    if (userBusiness.length === 0 || userBusiness[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if project exists and belongs to the business
    const project = await sql`
      SELECT * FROM projects 
      WHERE id = ${Number.parseInt(projectId)} 
      AND business_id = ${Number.parseInt(businessId)}
    `

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Remove user from project team
    await sql`
      DELETE FROM project_team 
      WHERE project_id = ${Number.parseInt(projectId)} 
      AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing team member:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
