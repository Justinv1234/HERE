import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { sendInvitationEmail } from "@/lib/email"
import { randomBytes } from "crypto"

// Generate a random token
function generateToken(): string {
  return randomBytes(32).toString("hex")
}

// Create an invitation
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get business ID from user
    const businessResult = await sql`
      SELECT b.* FROM businesses b
      JOIN business_users bu ON b.id = bu.business_id
      WHERE bu.user_id = ${user.id} AND (bu.role = 'admin' OR bu.role = 'owner')
    `

    if (businessResult.length === 0) {
      return NextResponse.json({ error: "No business found or insufficient permissions" }, { status: 403 })
    }

    const business = businessResult[0]

    // Get invitation data
    const { email, role = "member" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`

    if (existingUser.length > 0) {
      // If user exists, check if they're already in the business
      const existingBusinessUser = await sql`
        SELECT * FROM business_users 
        WHERE business_id = ${business.id} AND user_id = ${existingUser[0].id}
      `

      if (existingBusinessUser.length > 0) {
        return NextResponse.json({ error: "User is already a member of this business" }, { status: 400 })
      }

      // Add existing user to business
      await sql`
        INSERT INTO business_users (business_id, user_id, role, created_at, updated_at)
        VALUES (${business.id}, ${existingUser[0].id}, ${role}, NOW(), NOW())
      `

      return NextResponse.json({ success: true, message: "User added to business" })
    }

    // Generate token and expiration date (7 days from now)
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create invitation
    await sql`
      INSERT INTO invitations (
        email, token, business_id, role, invited_by, expires_at, created_at, updated_at
      )
      VALUES (
        ${email}, ${token}, ${business.id}, ${role}, ${user.id}, ${expiresAt}, NOW(), NOW()
      )
    `

    // Create a pending user
    await sql`
      INSERT INTO users (
        email, name, role, status, business_id, invitation_token, invitation_expires_at, created_at, updated_at
      )
      VALUES (
        ${email}, ${email.split("@")[0]}, ${role}, 'pending', ${business.id}, ${token}, ${expiresAt}, NOW(), NOW()
      )
    `

    // Send invitation email
    await sendInvitationEmail({
      email,
      token,
      businessName: business.name,
      invitedBy: user.name,
    })

    return NextResponse.json({ success: true, message: "Invitation sent" })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Get invitations for a business
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get business ID from user
    const businessResult = await sql`
      SELECT b.* FROM businesses b
      JOIN business_users bu ON b.id = bu.business_id
      WHERE bu.user_id = ${user.id}
    `

    if (businessResult.length === 0) {
      return NextResponse.json({ error: "No business found" }, { status: 404 })
    }

    const business = businessResult[0]

    // Get invitations
    const invitations = await sql`
      SELECT i.*, u.name as invited_by_name
      FROM invitations i
      JOIN users u ON i.invited_by = u.id
      WHERE i.business_id = ${business.id}
      ORDER BY i.created_at DESC
    `

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error("Error getting invitations:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
