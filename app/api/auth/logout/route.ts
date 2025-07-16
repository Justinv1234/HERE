import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/auth"

export async function POST() {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      // Delete the session from the database
      await deleteSession(sessionToken)

      // Clear the session cookie
      cookies().delete("session_token")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 })
  }
}
