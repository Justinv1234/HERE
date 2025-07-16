import { neon } from "@neondatabase/serverless"

// Two-factor authentication functions that use the real database
export async function storeTwoFactorSettings(userId: string, secret: string, isEnabled: boolean) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if a record already exists
    const existingRecord = await sql`
      SELECT * FROM two_factor_auth WHERE user_id = ${userId}
    `

    if (existingRecord.length > 0) {
      // Update existing record
      return await sql`
        UPDATE two_factor_auth 
        SET secret = ${secret}, is_enabled = ${isEnabled}
        WHERE user_id = ${userId}
        RETURNING *
      `
    } else {
      // Insert new record
      return await sql`
        INSERT INTO two_factor_auth (user_id, secret, is_enabled)
        VALUES (${userId}, ${secret}, ${isEnabled})
        RETURNING *
      `
    }
  } catch (error) {
    console.error("Error storing 2FA settings:", error)
    throw error
  }
}

export async function disableTwoFactor(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined")
    }

    const sql = neon(process.env.DATABASE_URL)

    return await sql`
      UPDATE two_factor_auth 
      SET is_enabled = false
      WHERE user_id = ${userId}
      RETURNING *
    `
  } catch (error) {
    console.error("Error disabling 2FA:", error)
    throw error
  }
}

export async function isTwoFactorEnabled(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined")
    }

    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`
      SELECT is_enabled FROM two_factor_auth WHERE user_id = ${userId}
    `

    return result.length > 0 ? result[0].is_enabled : false
  } catch (error) {
    console.error("Error checking if 2FA is enabled:", error)
    return false
  }
}

export async function getTOTPSecret(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined")
    }

    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`
      SELECT secret FROM two_factor_auth WHERE user_id = ${userId}
    `

    return result.length > 0 ? result[0].secret : null
  } catch (error) {
    console.error("Error getting TOTP secret:", error)
    return null
  }
}

export async function verifyAndUseBackupCode(userId: string, code: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if the backup code exists and is unused
    const result = await sql`
      SELECT * FROM backup_codes 
      WHERE user_id = ${userId} AND code = ${code} AND used = false
    `

    if (result.length === 0) {
      return false
    }

    // Mark the code as used
    await sql`
      UPDATE backup_codes 
      SET used = true, used_at = NOW()
      WHERE user_id = ${userId} AND code = ${code}
    `

    return true
  } catch (error) {
    console.error("Error verifying backup code:", error)
    return false
  }
}
