import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isUserTwoFactorEnabled } from "@/lib/two-factor-auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const enabled = await isUserTwoFactorEnabled(user.id.toString())

    return NextResponse.json({ enabled })
  } catch (error) {
    console.error("Error checking 2FA status:", error)
    return NextResponse.json({ error: "Failed to check 2FA status" }, { status: 500 })
  }
}
