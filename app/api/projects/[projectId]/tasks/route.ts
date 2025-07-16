import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Task schema for validation
const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.date().nullable().optional(),
  assignee_id: z.number().nullable().optional(),
})

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const projectId = Number.parseInt(params.projectId)
    if (isNaN(projectId)) {
      return NextResponse.json({ message: "Invalid project ID" }, { status: 400 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = TaskSchema.parse(body)

    // In a real app, you would save this to the database
    // For demo purposes, we'll just return success

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: {
          id: Math.floor(Math.random() * 1000), // Generate a random ID for demo
          ...validatedData,
          project_id: projectId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating task:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        message: "Failed to create task",
      },
      { status: 500 },
    )
  }
}
