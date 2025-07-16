"use server"

import { sql } from "@/lib/db"
import { hashPassword, comparePasswords, createToken, setAuthCookie, clearAuthCookie } from "@/lib/auth"
import { createBusiness } from "@/lib/business"

export async function signup(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const plan = (formData.get("plan") as string) || "freelancer"

    // Get plan-specific fields
    const companyName = formData.get("companyName") as string
    const industry = formData.get("industry") as string
    const teamName = formData.get("teamName") as string

    // Business name based on plan
    let businessName = name // Default for freelancer
    if (plan === "business" && companyName) {
      businessName = companyName
    } else if (plan === "team" && teamName) {
      businessName = teamName
    }

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        message: "All fields are required",
      }
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      }
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long",
      }
    }

    // Validate plan-specific fields
    if (plan === "business" && (!companyName || !industry)) {
      return {
        success: false,
        message: "Company name and industry are required for business plan",
      }
    }

    if (plan === "team" && !teamName) {
      return {
        success: false,
        message: "Team name is required for team plan",
      }
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return {
        success: false,
        message: "Email already in use",
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Check if this is the first user (make them admin)
    const userCount = await sql`SELECT COUNT(*) as count FROM users`
    const isFirstUser = Number(userCount[0].count) === 0
    const role = isFirstUser ? "super_admin" : "admin"

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, 'active', NOW(), NOW())
      RETURNING id, name, email, role
    `

    const user = result[0]

    // Create business based on plan
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, "-")

    const business = await createBusiness({
      name: businessName,
      slug,
      owner_id: user.id,
      plan,
      industry: industry || null,
    })

    // Associate user with business
    if (business) {
      await sql`
        UPDATE users 
        SET business_id = ${business.id}
        WHERE id = ${user.id}
      `
    }

    // Create JWT token and set cookie
    const token = await createToken(user.id, user.role)
    setAuthCookie(token)

    return {
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      business: business || null,
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      message: "An error occurred during signup",
    }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  try {
    // Get user by email - only select columns that definitely exist
    const users = await sql`
      SELECT id, email, password_hash, name, role, status
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return { success: false, message: "Invalid email or password" }
    }

    const user = users[0]

    // Check if user is active
    if (user.status !== "active") {
      return { success: false, message: "Your account is not active. Please contact an administrator." }
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password_hash)

    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create JWT token
    const token = await createToken(user.id, user.role)

    // Set auth cookie
    setAuthCookie(token)

    // Update last login timestamp (only if column exists)
    try {
      await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}`
    } catch (updateError) {
      // Ignore if last_login_at column doesn't exist
      console.log("Note: last_login_at column not found, skipping update")
    }

    // Return success with user data
    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

export async function logout() {
  try {
    clearAuthCookie()
    return { success: true, message: "Logged out successfully" }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "An error occurred during logout" }
  }
}

// Export register as an alias for signup to match the form import
export const register = signup
