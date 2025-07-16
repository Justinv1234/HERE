import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const dueDate = formData.get("due_date") as string

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    // For demo purposes, create a project with a mock ID
    // In a real app, you would save to the database
    const newProject = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      description: description || null,
      due_date: dueDate || null,
      owner_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "active",
    }

    // Return the new project
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
