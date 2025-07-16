import { NextResponse } from "next/server"
import {
  initializeTables,
  initializeTwoFactorTables,
  testDatabaseConnection,
  createInitialAdminUser,
} from "@/lib/init-db"

export async function GET() {
  try {
    // First test the database connection
    const connectionSuccess = await testDatabaseConnection()

    if (!connectionSuccess) {
      console.error("Database connection test failed")
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed. Please check your DATABASE_URL environment variable.",
        },
        { status: 500 },
      )
    }

    // Initialize the main tables
    const tablesSuccess = await initializeTables()
    if (!tablesSuccess) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize database tables.",
        },
        { status: 500 },
      )
    }

    // Initialize the two-factor tables
    const twoFactorSuccess = await initializeTwoFactorTables()
    if (!twoFactorSuccess) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize two-factor authentication tables.",
        },
        { status: 500 },
      )
    }

    // Create initial admin user if no users exist
    await createInitialAdminUser()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Error in init-db route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while initializing the database.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
