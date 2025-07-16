import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { businessId: string } }) {
  try {
    // For now, return empty activity log
    // In the future, this would fetch from an activity_log table
    const activity = []

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ activity: [] })
  }
}
