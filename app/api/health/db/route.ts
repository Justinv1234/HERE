import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Try a simple query to check database connectivity
    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      status: "ok",
      timestamp: result[0].time,
      message: "Database connection successful",
    })
  } catch (error) {
    console.error("Database health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
