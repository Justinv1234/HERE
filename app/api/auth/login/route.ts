import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { comparePasswords, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  console.log("=== LOGIN API CALLED ===")

  try {
    const body = await request.json()
    const { email, password } = body

    console.log("Login attempt for email:", email)
    console.log("Request body received:", { email, password: password ? "***" : "empty" })

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Get user from database
    console.log("Querying database for user...")
    const users = await sql`
      SELECT id, email, password_hash, name, role, status
      FROM users
      WHERE email = ${email}
    `

    console.log("Users found:", users.length)

    if (users.length === 0) {
      console.log("No user found with email:", email)
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]
    console.log("User found:", { id: user.id, email: user.email, role: user.role, status: user.status })

    // Check if user is active
    if (user.status !== "active") {
      console.log("User account is not active:", user.status)
      return NextResponse.json({ success: false, message: "Account is not active" }, { status: 401 })
    }

    // Verify password
    console.log("Verifying password...")
    const passwordValid = await comparePasswords(password, user.password_hash)
    console.log("Password valid:", passwordValid)

    if (!passwordValid) {
      console.log("Invalid password for user:", email)
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Create token
    console.log("Creating token...")
    const token = await createToken(user.id, user.role)
    console.log("Token created successfully")

    // Set auth cookie
    console.log("Setting auth cookie...")
    setAuthCookie(token)
    console.log("Auth cookie set")

    // Update last login time (if column exists)
    try {
      await sql`
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = ${user.id}
      `
      console.log("Updated last login time")
    } catch (updateError) {
      console.log("Note: last_login_at column not found, skipping update")
    }

    console.log("Login successful for user:", user.id)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

    console.log("Returning success response")
    return response
  } catch (error) {
    console.error("=== LOGIN ERROR ===")
    console.error("Error details:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
