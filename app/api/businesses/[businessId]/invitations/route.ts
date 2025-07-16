import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params

    // Get pending invitations for the business
    const invitations = await sql`
      SELECT 
        u.id,
        u.email,
        u.role,
        u.created_at as "invitedAt",
        'System' as "invitedBy"
      FROM users u
      WHERE u.business_id = ${Number.parseInt(businessId)}
      AND u.status = 'invited'
      ORDER BY u.created_at DESC
    `

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json({ invitations: [] })
  }
}

export async function POST(request: Request, { params }: { params: { businessId: string } }) {
  try {
    const { businessId } = params
    const { email, role } = await request.json()

    // Create invitation record
    const result = await sql`
      INSERT INTO users (email, name, role, status, business_id, created_at, updated_at)
      VALUES (${email}, ${email.split("@")[0]}, ${role.toLowerCase()}, 'invited', ${Number.parseInt(businessId)}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json({ success: true, invitation: result[0] })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
}
