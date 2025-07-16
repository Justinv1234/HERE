import { sql } from "./db"

export type Task = {
  id: number
  title: string
  description: string | null
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  project_id: number
  business_id: number
  assignee_id: number | null
  due_date: Date | null
  created_at: Date
  updated_at: Date
}

export async function getTasksByProjectId(projectId: number, businessId: number): Promise<Task[]> {
  try {
    const result = await sql`
      SELECT * FROM tasks
      WHERE project_id = ${projectId} AND business_id = ${businessId}
      ORDER BY 
        CASE 
          WHEN status = 'todo' THEN 1
          WHEN status = 'in_progress' THEN 2
          WHEN status = 'review' THEN 3
          WHEN status = 'done' THEN 4
          ELSE 5
        END,
        CASE
          WHEN priority = 'high' THEN 1
          WHEN priority = 'medium' THEN 2
          WHEN priority = 'low' THEN 3
          ELSE 4
        END,
        due_date ASC NULLS LAST
    `
    return result
  } catch (error) {
    console.error("Error getting tasks by project ID:", error)
    return []
  }
}

export async function getTaskById(taskId: number, businessId: number): Promise<Task | null> {
  try {
    const result = await sql`
      SELECT * FROM tasks
      WHERE id = ${taskId} AND business_id = ${businessId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting task by ID:", error)
    return null
  }
}

export async function createTask({
  title,
  description,
  status,
  priority,
  project_id,
  business_id,
  assignee_id,
  due_date,
}: {
  title: string
  description?: string | null
  status?: "todo" | "in_progress" | "review" | "done"
  priority?: "low" | "medium" | "high"
  project_id: number
  business_id: number
  assignee_id?: number | null
  due_date?: Date | null
}): Promise<Task | null> {
  try {
    const result = await sql`
      INSERT INTO tasks (
        title, description, status, priority, project_id, business_id, assignee_id, due_date, created_at, updated_at
      )
      VALUES (
        ${title}, ${description}, ${status || "todo"}, ${priority || "medium"}, 
        ${project_id}, ${business_id}, ${assignee_id}, ${due_date}, NOW(), NOW()
      )
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error creating task:", error)
    return null
  }
}

export async function updateTask(
  taskId: number,
  businessId: number,
  data: Partial<Omit<Task, "id" | "created_at" | "business_id" | "project_id">>,
): Promise<Task | null> {
  try {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ${value === null ? "NULL" : `'${value}'`}`)
      .join(", ")

    if (!updates) return await getTaskById(taskId, businessId)

    const result = await sql`
      UPDATE tasks
      SET ${updates}, updated_at = NOW()
      WHERE id = ${taskId} AND business_id = ${businessId}
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error updating task:", error)
    return null
  }
}

export async function deleteTask(taskId: number, businessId: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM tasks
      WHERE id = ${taskId} AND business_id = ${businessId}
      RETURNING id
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting task:", error)
    return false
  }
}

export async function getTasksByAssigneeId(assigneeId: number, businessId: number): Promise<Task[]> {
  try {
    const result = await sql`
      SELECT t.*, p.name as project_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.assignee_id = ${assigneeId} AND t.business_id = ${businessId}
      ORDER BY 
        CASE 
          WHEN t.status = 'todo' THEN 1
          WHEN t.status = 'in_progress' THEN 2
          WHEN t.status = 'review' THEN 3
          WHEN t.status = 'done' THEN 4
          ELSE 5
        END,
        CASE
          WHEN t.priority = 'high' THEN 1
          WHEN t.priority = 'medium' THEN 2
          WHEN t.priority = 'low' THEN 3
          ELSE 4
        END,
        t.due_date ASC NULLS LAST
    `
    return result
  } catch (error) {
    console.error("Error getting tasks by assignee ID:", error)
    return []
  }
}

export async function getTaskCountsByStatus(projectId: number, businessId: number): Promise<Record<string, number>> {
  try {
    const result = await sql`
      SELECT status, COUNT(*) as count
      FROM tasks
      WHERE project_id = ${projectId} AND business_id = ${businessId}
      GROUP BY status
    `

    const counts: Record<string, number> = {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    }

    result.forEach((row) => {
      counts[row.status] = Number(row.count)
    })

    return counts
  } catch (error) {
    console.error("Error getting task counts by status:", error)
    return {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    }
  }
}
