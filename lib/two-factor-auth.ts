import { authenticator } from "otplib"
import { createHash } from "crypto"
import {
  storeTwoFactorSettings,
  disableTwoFactor,
  isTwoFactorEnabled,
  getTOTPSecret,
  verifyAndUseBackupCode,
} from "./two-factor-auth-db"

// Generate a new TOTP secret
export function generateTOTPSecret(email: string): string {
  return authenticator.generateSecret()
}

// Generate a TOTP URI for QR code
export function generateTOTPUri(secret: string, email: string): string {
  return authenticator.keyuri(email, "TaskFlow", secret)
}

// Verify a TOTP token
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error("Error verifying TOTP:", error)
    return false
  }
}

// Generate backup codes
export function generateBackupCodes(count = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    // Generate a random 8-character code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

// Hash a backup code
export function hashBackupCode(code: string): string {
  return createHash("sha256").update(code).digest("hex")
}

// Store 2FA settings in the database
export async function storeUserTwoFactorSettings(
  userId: string,
  secret: string,
  backupCodes: string[],
): Promise<boolean> {
  try {
    // Store the TOTP secret
    await storeTwoFactorSettings(userId, secret, true)

    // Store backup codes
    // Implementation depends on your database schema
    // This would typically involve storing hashed versions of the backup codes

    return true
  } catch (error) {
    console.error("Error storing 2FA settings:", error)
    return false
  }
}

// Disable 2FA for a user
export async function disableUserTwoFactor(userId: string): Promise<boolean> {
  try {
    await disableTwoFactor(userId)
    return true
  } catch (error) {
    console.error("Error disabling 2FA:", error)
    return false
  }
}

// Check if 2FA is enabled for a user
export async function isUserTwoFactorEnabled(userId: string): Promise<boolean> {
  try {
    return await isTwoFactorEnabled(userId)
  } catch (error) {
    console.error("Error checking if 2FA is enabled:", error)
    return false
  }
}

// Get the TOTP secret for a user
export async function getUserTOTPSecret(userId: string): Promise<string | null> {
  try {
    return await getTOTPSecret(userId)
  } catch (error) {
    console.error("Error getting TOTP secret:", error)
    return null
  }
}

// Verify and use a backup code
export async function verifyAndUseUserBackupCode(userId: string, code: string): Promise<boolean> {
  try {
    return await verifyAndUseBackupCode(userId, code)
  } catch (error) {
    console.error("Error verifying backup code:", error)
    return false
  }
}
