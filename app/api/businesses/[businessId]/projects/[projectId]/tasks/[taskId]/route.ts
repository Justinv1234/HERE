import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth"
import { getTaskById, updateTask, deleteTask } from "@/lib/tasks"
import { getProjectById } from "@/lib/projects"

// Task schema for validation
const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
  assignee_id: z.number().nullable().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string; projectId: string; taskId: string } },
) {
  try {
    const user = await requireAuth()

    const businessId = Number.parseInt(params.businessId)
    const projectId = Number.parseInt(params.projectId)
    const taskId = Number.parseInt(params.taskId)

    if (isNaN(businessId) || isNaN(projectId) || isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid ID parameters" }, { status: 400 })
    }

    // Verify user belongs to this business
    if (user.business_id !== businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Verify project belongs to this business
    const project = await getProjectById(projectId, businessId)
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    const task = await getTaskById(taskId, businessId)
    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Verify task belongs to this project
    if (task.project_id !== projectId) {
      return NextResponse.json({ message: "Task does not belong to this project" }, { status: 400 })
    }

    return NextResponse.json(task)
  } catch (error: any) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { businessId: string; projectId: string; taskId: string } },
) {
  try {
    const user = await requireAuth()

    const businessId = Number.parseInt(params.businessId)
    const projectId = Number.parseInt(params.projectId)
    const taskId = Number.parseInt(params.taskId)

    if (isNaN(businessId) || isNaN(projectId) || isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid ID parameters" }, { status: 400 })
    }

    // Verify user belongs to this business
    if (user.business_id !== businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Verify project belongs to this business
    const project = await getProjectById(projectId, businessId)
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Verify task exists and belongs to this business
    const existingTask = await getTaskById(taskId, businessId)
    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Verify task belongs to this project
    if (existingTask.project_id !== projectId) {
      return NextResponse.json({ message: "Task does not belong to this project" }, { status: 400 })
    }

    // Parse and validate request body
    const body = await req.json()
    const validatedData = TaskSchema.parse(body)

    // Update the task
    const updatedTask = await updateTask(taskId, businessId, validatedData)

    if (!updatedTask) {
      return NextResponse.json({ message: "Failed to update task" }, { status: 500 })
    }

    return NextResponse.json(updatedTask)
  } catch (error: any) {
    console.error("Error updating task:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: error.message || "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { businessId: string; projectId: string; taskId: string } },
) {
  try {
    const user = await requireAuth()

    const businessId = Number.parseInt(params.businessId)
    const projectId = Number.parseInt(params.projectId)
    const taskId = Number.parseInt(params.taskId)

    if (isNaN(businessId) || isNaN(projectId) || isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid ID parameters" }, { status: 400 })
    }

    // Verify user belongs to this business
    if (user.business_id !== businessId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Verify project belongs to this business
    const project = await getProjectById(projectId, businessId)
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    // Verify task exists and belongs to this business
    const existingTask = await getTaskById(taskId, businessId)
    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Verify task belongs to this project
    if (existingTask.project_id !== projectId) {
      return NextResponse.json({ message: "Task does not belong to this project" }, { status: 400 })
    }

    // Delete the task
    const success = await deleteTask(taskId, businessId)

    if (!success) {
      return NextResponse.json({ message: "Failed to delete task" }, { status: 500 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ message: error.message || "Failed to delete task" }, { status: 500 })
  }
}
