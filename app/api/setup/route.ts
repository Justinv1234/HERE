import { NextResponse } from "next/server"
import { checkAndCreateTables, createSampleProject } from "@/lib/db-setup"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // Check and create tables
    const tablesResult = await checkAndCreateTables()

    if (!tablesResult.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to set up database tables",
          error: tablesResult.error,
        },
        { status: 500 },
      )
    }

    // Get current user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({
        status: "warning",
        message: "Tables created but no authenticated user to create sample data",
        tables: tablesResult,
      })
    }

    // Create sample project if user is authenticated
    const sampleProjectResult = await createSampleProject(session.user.id, session.user.businessId)

    return NextResponse.json({
      status: "success",
      message: "Database setup completed successfully",
      tables: tablesResult,
      sampleProject: sampleProjectResult,
    })
  } catch (error) {
    console.error("Error in setup endpoint:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database setup failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
