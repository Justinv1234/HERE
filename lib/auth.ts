import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "81b5c295ee111b66e505285134eeaae20727d85b84dd5cdda25dca8f1f173e6b",
)

export const authOptions = {
  secret: process.env.JWT_SECRET || "81b5c295ee111b66e505285134eeaae20727d85b84dd5cdda25dca8f1f173e6b",
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createToken(userId: number, role = "user"): Promise<string> {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: number; role: string }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function setAuthCookie(token: string) {
  const isPreview = process.env.VERCEL_ENV === "preview"

  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !isPreview,
    sameSite: isPreview ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  })
}

export function removeAuthCookie() {
  cookies().delete("auth_token")
}

// Alias for backward compatibility
export const clearAuthCookie = removeAuthCookie

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return null
    }

    // Get user from database
    const userResult = await sql`
      SELECT id, name, email, role, status, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId} AND status = 'active'
    `

    if (userResult.length === 0) {
      return null
    }

    return userResult[0]
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function createSession(userId: number, userAgent?: string, ipAddress?: string) {
  try {
    const sessionToken = await createToken(userId)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    // Only create session record if sessions table exists
    try {
      await sql`
        INSERT INTO sessions (user_id, token, expires_at, user_agent, ip_address, created_at, updated_at)
        VALUES (${userId}, ${sessionToken}, ${expiresAt}, ${userAgent || ""}, ${ipAddress || ""}, NOW(), NOW())
      `
    } catch (sessionError) {
      // Sessions table might not exist, just continue with cookie auth
      console.log("Sessions table not found, using cookie-only auth")
    }

    setAuthCookie(sessionToken)
    return sessionToken
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function deleteSession(token?: string) {
  try {
    const sessionToken = token || cookies().get("auth_token")?.value

    if (sessionToken) {
      try {
        await sql`
          DELETE FROM sessions 
          WHERE token = ${sessionToken}
        `
      } catch (sessionError) {
        // Sessions table might not exist, just continue
        console.log("Sessions table not found, skipping session deletion")
      }
    }

    removeAuthCookie()
  } catch (error) {
    console.error("Error deleting session:", error)
    throw error
  }
}

export function getJWTSecret(): Uint8Array {
  return JWT_SECRET
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}
