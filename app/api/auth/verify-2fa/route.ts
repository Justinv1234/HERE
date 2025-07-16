import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyTOTP, getUserTOTPSecret, verifyAndUseUserBackupCode } from "@/lib/two-factor-auth"

export async function POST(request: Request) {
  try {
    const { userId, token, isBackupCode } = await request.json()

    if (!userId || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let isValid = false

    if (isBackupCode) {
      // Verify backup code
      isValid = await verifyAndUseUserBackupCode(userId, token)
    } else {
      // Get the user's TOTP secret
      const secret = await getUserTOTPSecret(userId)

      if (!secret) {
        return NextResponse.json({ error: "2FA not enabled for this user" }, { status: 400 })
      }

      // Verify the TOTP token
      isValid = verifyTOTP(token, secret)
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Set a cookie to indicate 2FA has been verified
    cookies().set("2fa_verified", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying 2FA:", error)
    return NextResponse.json({ error: "Failed to verify 2FA" }, { status: 500 })
  }
}
