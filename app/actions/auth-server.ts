"use server"

import { sql } from "@/lib/db"
import { hashPassword, verifyPassword, createToken, setAuthCookie, removeAuthCookie } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function loginAction(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    // Get user from database
    const userResult = await sql`
      SELECT id, name, email, password_hash, role, status
      FROM users 
      WHERE email = ${email.toLowerCase()}
    `

    if (userResult.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = userResult[0]

    if (user.status !== "active") {
      return { success: false, error: "Account is not active" }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    // Update last login
    await sql`
      UPDATE users 
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = ${user.id}
    `

    // Create token and set cookie
    const token = await createToken(user.id, user.role)
    setAuthCookie(token)

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function signupAction(name: string, email: string, password: string) {
  try {
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userResult = await sql`
      INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
      VALUES (${name}, ${email.toLowerCase()}, ${hashedPassword}, 'user', 'active', NOW(), NOW())
      RETURNING id, name, email, role
    `

    if (userResult.length === 0) {
      return { success: false, error: "Failed to create user" }
    }

    const user = userResult[0]

    // Create token and set cookie
    const token = await createToken(user.id, user.role)
    setAuthCookie(token)

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "An error occurred during signup" }
  }
}

export async function logoutAction() {
  try {
    removeAuthCookie()
    redirect("/login")
  } catch (error) {
    console.error("Logout error:", error)
  }
}
