import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { token, name, password } = await request.json()

    if (!token || !name || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Get user by invitation token
    const userResult = await sql`
      SELECT * FROM users 
      WHERE invitation_token = ${token} 
      AND invitation_expires_at > NOW()
    `

    if (userResult.length === 0) {
      return NextResponse.json({ error: "Invalid or expired invitation token" }, { status: 400 })
    }

    const user = userResult[0]

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Update user
    const updatedUser = await sql`
      UPDATE users
      SET 
        name = ${name},
        password_hash = ${hashedPassword},
        status = 'active',
        invitation_token = NULL,
        invitation_expires_at = NULL,
        updated_at = NOW()
      WHERE id = ${user.id}
      RETURNING *
    `

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    // Add user to business_users if not already there
    const existingBusinessUser = await sql`
      SELECT * FROM business_users 
      WHERE business_id = ${user.business_id} AND user_id = ${user.id}
    `

    if (existingBusinessUser.length === 0) {
      await sql`
        INSERT INTO business_users (business_id, user_id, role, created_at, updated_at)
        VALUES (${user.business_id}, ${user.id}, ${user.role}, NOW(), NOW())
      `
    }

    // Delete invitation
    await sql`
      DELETE FROM invitations 
      WHERE token = ${token}
    `

    // Create JWT token
    const jwtToken = await createToken(user.id, user.role)

    // Set auth cookie
    setAuthCookie(jwtToken)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
