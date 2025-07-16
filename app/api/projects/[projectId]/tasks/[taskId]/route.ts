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

export async function PUT(req: NextRequest, { params }: { params: { projectId: string; taskId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const projectId = Number.parseInt(params.projectId)
    const taskId = Number.parseInt(params.taskId)

    if (isNaN(projectId) || isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid project or task ID" }, { status: 400 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = TaskSchema.parse(body)

    // In a real app, you would update this in the database
    // For demo purposes, we'll just return success

    return NextResponse.json({
      message: "Task updated successfully",
      task: {
        id: taskId,
        ...validatedData,
        project_id: projectId,
        updated_at: new Date(),
      },
    })
  } catch (error: any) {
    console.error("Error updating task:", error)

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
        message: "Failed to update task",
      },
      { status: 500 },
    )
  }
}
