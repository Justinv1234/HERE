import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth"
import { createTask, getTasksByProjectId } from "@/lib/tasks"
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

export async function GET(req: NextRequest, { params }: { params: { businessId: string; projectId: string } }) {
  try {
    const user = await requireAuth()

    const businessId = Number.parseInt(params.businessId)
    const projectId = Number.parseInt(params.projectId)

    if (isNaN(businessId) || isNaN(projectId)) {
      return NextResponse.json({ message: "Invalid business or project ID" }, { status: 400 })
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

    const tasks = await getTasksByProjectId(projectId, businessId)

    return NextResponse.json(tasks)
  } catch (error: any) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { businessId: string; projectId: string } }) {
  try {
    const user = await requireAuth()

    const businessId = Number.parseInt(params.businessId)
    const projectId = Number.parseInt(params.projectId)

    if (isNaN(businessId) || isNaN(projectId)) {
      return NextResponse.json({ message: "Invalid business or project ID" }, { status: 400 })
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

    // Parse and validate request body
    const body = await req.json()
    const validatedData = TaskSchema.parse(body)

    // Create the task
    const task = await createTask({
      ...validatedData,
      project_id: projectId,
      business_id: businessId,
    })

    if (!task) {
      return NextResponse.json({ message: "Failed to create task" }, { status: 500 })
    }

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error("Error creating task:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 })
    }

    return NextResponse.json({ message: error.message || "Failed to create task" }, { status: 500 })
  }
}
