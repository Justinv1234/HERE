import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { businessId: string; projectId: string } }) {
  const debugInfo: any = {
    params,
    timestamp: new Date().toISOString(),
    steps: [],
  }

  try {
    debugInfo.steps.push({ step: "Start", time: new Date().toISOString() })

    // Check database connection
    try {
      const dbCheck = await sql`SELECT NOW() as time`
      debugInfo.steps.push({
        step: "Database connection",
        status: "success",
        time: new Date().toISOString(),
        dbTime: dbCheck[0].time,
      })
    } catch (dbError) {
      debugInfo.steps.push({
        step: "Database connection",
        status: "error",
        time: new Date().toISOString(),
        error: dbError.message,
      })
      throw new Error(`Database connection failed: ${dbError.message}`)
    }

    // Get session
    debugInfo.steps.push({ step: "Getting session", time: new Date().toISOString() })
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      debugInfo.steps.push({
        step: "Session check",
        status: "error",
        time: new Date().toISOString(),
        error: "No authenticated user",
      })
      return NextResponse.json(
        {
          error: "Unauthorized",
          debug: debugInfo,
        },
        { status: 401 },
      )
    }

    debugInfo.steps.push({
      step: "Session check",
      status: "success",
      time: new Date().toISOString(),
      userId: session.user.id,
    })

    const { businessId, projectId } = params

    // Check if user belongs to the business
    debugInfo.steps.push({ step: "Checking business access", time: new Date().toISOString() })
    const userBusiness = await sql`
      SELECT * FROM business_users 
      WHERE business_id = ${Number.parseInt(businessId)} 
      AND user_id = ${session.user.id}
    `

    if (userBusiness.length === 0) {
      debugInfo.steps.push({
        step: "Business access check",
        status: "error",
        time: new Date().toISOString(),
        error: "User does not belong to this business",
      })
      return NextResponse.json(
        {
          error: "Forbidden",
          debug: debugInfo,
        },
        { status: 403 },
      )
    }

    debugInfo.steps.push({
      step: "Business access check",
      status: "success",
      time: new Date().toISOString(),
    })

    // Check if project exists and belongs to the business
    debugInfo.steps.push({ step: "Fetching project", time: new Date().toISOString() })
    const project = await sql`
      SELECT * FROM projects 
      WHERE id = ${Number.parseInt(projectId)} 
      AND business_id = ${Number.parseInt(businessId)}
    `

    if (project.length === 0) {
      debugInfo.steps.push({
        step: "Project check",
        status: "error",
        time: new Date().toISOString(),
        error: "Project not found or does not belong to this business",
      })
      return NextResponse.json(
        {
          error: "Project not found",
          debug: debugInfo,
        },
        { status: 404 },
      )
    }

    debugInfo.steps.push({
      step: "Project check",
      status: "success",
      time: new Date().toISOString(),
      projectData: project[0],
    })

    // Get tasks for the project
    debugInfo.steps.push({ step: "Fetching tasks", time: new Date().toISOString() })
    const tasks = await sql`
      SELECT * FROM tasks
      WHERE project_id = ${Number.parseInt(projectId)}
    `

    debugInfo.steps.push({
      step: "Tasks fetch",
      status: "success",
      time: new Date().toISOString(),
      taskCount: tasks.length,
    })

    // Get team members for the project
    debugInfo.steps.push({ step: "Fetching team members", time: new Date().toISOString() })
    const teamMembers = await sql`
      SELECT u.id, u.name, u.email, pt.role
      FROM project_team pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.project_id = ${Number.parseInt(projectId)}
    `

    debugInfo.steps.push({
      step: "Team members fetch",
      status: "success",
      time: new Date().toISOString(),
      memberCount: teamMembers.length,
    })

    // Return all data
    return NextResponse.json({
      project: project[0],
      tasks,
      teamMembers,
      debug: debugInfo,
    })
  } catch (error) {
    debugInfo.steps.push({
      step: "Error",
      status: "error",
      time: new Date().toISOString(),
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })

    console.error("Error in project debug endpoint:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
        debug: debugInfo,
      },
      { status: 500 },
    )
  }
}
