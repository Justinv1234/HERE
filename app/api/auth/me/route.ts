import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    console.log("Getting current user...")
    const user = await getCurrentUser()

    if (!user) {
      console.log("No user found")
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    console.log("Current user found:", { id: user.id, email: user.email, role: user.role })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business_id: user.business_id || 1, // Default business ID
      },
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
