import { sql } from "./db"

export type Project = {
  id: number
  name: string
  description: string | null
  status: "active" | "archived" | "completed"
  owner_id: number
  business_id: number
  created_at: Date
  updated_at: Date
  due_date: Date | null
}

export async function getProjectsByBusinessId(businessId: number): Promise<Project[]> {
  try {
    const result = await sql`
      SELECT p.*, 
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_task_count
      FROM projects p
      WHERE p.business_id = ${businessId}
      ORDER BY p.updated_at DESC
    `
    return result
  } catch (error) {
    console.error("Error getting projects by business ID:", error)
    return []
  }
}

export async function getProjectById(projectId: number, businessId: number): Promise<Project | null> {
  try {
    const result = await sql`
      SELECT p.*, 
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_task_count
      FROM projects p
      WHERE p.id = ${projectId} AND p.business_id = ${businessId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting project by ID:", error)
    return null
  }
}

export async function createProject({
  name,
  description,
  owner_id,
  business_id,
  due_date,
}: {
  name: string
  description?: string | null
  owner_id: number
  business_id: number
  due_date?: Date | null
}): Promise<Project | null> {
  try {
    const result = await sql`
      INSERT INTO projects (name, description, owner_id, business_id, status, due_date, created_at, updated_at)
      VALUES (${name}, ${description}, ${owner_id}, ${business_id}, 'active', ${due_date}, NOW(), NOW())
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error creating project:", error)
    return null
  }
}

export async function updateProject(
  projectId: number,
  businessId: number,
  data: Partial<Omit<Project, "id" | "created_at" | "business_id">>,
): Promise<Project | null> {
  try {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ${value === null ? "NULL" : `'${value}'`}`)
      .join(", ")

    if (!updates) return await getProjectById(projectId, businessId)

    const result = await sql`
      UPDATE projects
      SET ${updates}, updated_at = NOW()
      WHERE id = ${projectId} AND business_id = ${businessId}
      RETURNING *
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error updating project:", error)
    return null
  }
}

export async function deleteProject(projectId: number, businessId: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM projects
      WHERE id = ${projectId} AND business_id = ${businessId}
      RETURNING id
    `
    return result.length > 0
  } catch (error) {
    console.error("Error deleting project:", error)
    return false
  }
}

export async function getProjectTeamMembers(projectId: number, businessId: number): Promise<any[]> {
  try {
    const result = await sql`
      SELECT u.id, u.name, u.email, u.role, pm.role as project_role
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = ${projectId} AND u.business_id = ${businessId}
    `
    return result
  } catch (error) {
    console.error("Error getting project team members:", error)
    return []
  }
}

export async function addProjectMember(
  projectId: number,
  userId: number,
  businessId: number,
  role = "member",
): Promise<boolean> {
  try {
    // First verify that the project belongs to the business
    const project = await getProjectById(projectId, businessId)
    if (!project) return false

    // Then verify that the user belongs to the business
    const userCheck = await sql`
      SELECT id FROM users WHERE id = ${userId} AND business_id = ${businessId}
    `
    if (userCheck.length === 0) return false

    // Add the user to the project
    await sql`
      INSERT INTO project_members (project_id, user_id, role, created_at)
      VALUES (${projectId}, ${userId}, ${role}, NOW())
      ON CONFLICT (project_id, user_id) DO UPDATE
      SET role = ${role}, updated_at = NOW()
    `
    return true
  } catch (error) {
    console.error("Error adding project member:", error)
    return false
  }
}

export async function removeProjectMember(projectId: number, userId: number, businessId: number): Promise<boolean> {
  try {
    // First verify that the project belongs to the business
    const project = await getProjectById(projectId, businessId)
    if (!project) return false

    const result = await sql`
      DELETE FROM project_members
      WHERE project_id = ${projectId} AND user_id = ${userId}
      RETURNING id
    `
    return result.length > 0
  } catch (error) {
    console.error("Error removing project member:", error)
    return false
  }
}
