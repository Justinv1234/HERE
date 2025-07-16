import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import {
  generateTOTPSecret,
  generateTOTPUri,
  verifyTOTP,
  generateBackupCodes,
  storeUserTwoFactorSettings,
  disableUserTwoFactor,
} from "@/lib/two-factor-auth"

// GET - Generate a new TOTP secret and URI
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Generate a new TOTP secret
    const secret = generateTOTPSecret(user.email)

    // Generate a TOTP URI for QR code
    const uri = generateTOTPUri(secret, user.email)

    return NextResponse.json({
      secret,
      uri,
      email: user.email,
    })
  } catch (error) {
    console.error("Error generating 2FA secret:", error)
    return NextResponse.json({ error: "Failed to generate 2FA secret" }, { status: 500 })
  }
}

// POST - Verify and enable 2FA
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { token, secret } = await request.json()

    // Verify the token
    const isValid = verifyTOTP(token, secret)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes()

    // Store the 2FA settings
    const success = await storeUserTwoFactorSettings(user.id.toString(), secret, backupCodes)

    if (!success) {
      return NextResponse.json({ error: "Failed to store 2FA settings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      backupCodes,
    })
  } catch (error) {
    console.error("Error enabling 2FA:", error)
    return NextResponse.json({ error: "Failed to enable 2FA" }, { status: 500 })
  }
}

// DELETE - Disable 2FA
export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const success = await disableUserTwoFactor(user.id.toString())

    if (!success) {
      return NextResponse.json({ error: "Failed to disable 2FA" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disabling 2FA:", error)
    return NextResponse.json({ error: "Failed to disable 2FA" }, { status: 500 })
  }
}
