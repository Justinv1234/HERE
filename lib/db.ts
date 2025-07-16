import { neon } from "@neondatabase/serverless"
import { z } from "zod"

// Create a function to get the SQL client
export function getSqlClient() {
  // Always use real database for all operations
  if (!process.env.DATABASE_URL) {
    console.error("No DATABASE_URL provided. Database operations will fail.")
    throw new Error("Database connection string is required. Please check your DATABASE_URL environment variable.")
  }

  try {
    return neon(process.env.DATABASE_URL)
  } catch (error) {
    console.error("Error initializing database client:", error)
    throw new Error("Failed to initialize database client. Please check your DATABASE_URL environment variable.")
  }
}

// Initialize the SQL client
export const sql = getSqlClient()

// User schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  role: z.enum(["member", "admin", "super_admin"]),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  last_login_at: z.date().nullable().optional(),
  business_id: z.number().nullable().optional(),
  invitation_token: z.string().nullable().optional(),
  invitation_expires_at: z.date().nullable().optional(),
})

export type User = z.infer<typeof UserSchema>

// Project schema
const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(["active", "archived", "completed"]).default("active"),
  owner_id: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  business_id: z.number().nullable().optional(),
})

export type Project = z.infer<typeof ProjectSchema>

// Task schema
const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  project_id: z.number(),
  assignee_id: z.number().nullable().optional(),
  due_date: z.date().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export type Task = z.infer<typeof TaskSchema>

// Time entry schema
const TimeEntrySchema = z.object({
  id: z.number(),
  task_id: z.number(),
  user_id: z.number(),
  duration: z.number(), // in seconds
  description: z.string().nullable().optional(),
  started_at: z.date(),
  ended_at: z.date().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export type TimeEntry = z.infer<typeof TimeEntrySchema>

// Invoice schema
const InvoiceSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  amount: z.number(),
  status: z.enum(["draft", "sent", "paid", "overdue"]).default("draft"),
  due_date: z.date(),
  issued_date: z.date(),
  paid_date: z.date().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export type Invoice = z.infer<typeof InvoiceSchema>

// User functions
export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`
    return result.length > 0 ? UserSchema.parse(result[0]) : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result.length > 0 ? UserSchema.parse(result[0]) : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserByInvitationToken(token: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE invitation_token = ${token} 
      AND invitation_expires_at > NOW()
    `
    return result.length > 0 ? UserSchema.parse(result[0]) : null
  } catch (error) {
    console.error("Error getting user by invitation token:", error)
    return null
  }
}

export async function createUser({
  email,
  password_hash,
  name,
  role = "member",
  business_id = null,
  status = "active",
}: {
  email: string
  password_hash: string
  name: string
  role?: string
  business_id?: number | null
  status?: string
}): Promise<User> {
  try {
    const result = await sql`
      INSERT INTO users (
        email, 
        password_hash, 
        name, 
        role, 
        status, 
        business_id,
        created_at, 
        updated_at
      )
      VALUES (
        ${email}, 
        ${password_hash}, 
        ${name}, 
        ${role}, 
        ${status}, 
        ${business_id},
        NOW(), 
        NOW()
      )
      RETURNING *
    `
    return UserSchema.parse(result[0])
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: number, data: Partial<Omit<User, "id" | "created_at">>): Promise<User | null> {
  try {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ${value === null ? "NULL" : `'${value}'`}`)
      .join(", ")

    if (!updates) return await getUserById(id)

    const result = await sql`
      UPDATE users
      SET ${updates}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return result.length > 0 ? UserSchema.parse(result[0]) : null
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// Project functions
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const result = await sql`SELECT * FROM projects WHERE id = ${id}`
    return result.length > 0 ? ProjectSchema.parse(result[0]) : null
  } catch (error) {
    console.error("Error getting project by ID:", error)
    return null
  }
}

export async function getProjectsByUserId(userId: number): Promise<Project[]> {
  try {
    const result = await sql`
      SELECT p.*
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = ${userId} OR p.owner_id = ${userId}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `
    return result.map((row) => ProjectSchema.parse(row))
  } catch (error) {
    console.error("Error getting projects by user ID:", error)
    return []
  }
}

export async function getProjectsByBusinessId(businessId: number): Promise<Project[]> {
  try {
    const result = await sql`
      SELECT * FROM projects
      WHERE business_id = ${businessId}
      ORDER BY created_at DESC
    `
    return result.map((row) => ProjectSchema.parse(row))
  } catch (error) {
    console.error("Error getting projects by business ID:", error)
    return []
  }
}

export async function createProject({
  name,
  description,
  owner_id,
  business_id,
}: {
  name: string
  description?: string | null
  owner_id: number
  business_id: number
}): Promise<Project> {
  try {
    const result = await sql`
      INSERT INTO projects (
        name, 
        description, 
        owner_id, 
        business_id,
        status, 
        created_at, 
        updated_at
      )
      VALUES (
        ${name}, 
        ${description}, 
        ${owner_id}, 
        ${business_id},
        'active', 
        NOW(), 
        NOW()
      )
      RETURNING *
    `
    return ProjectSchema.parse(result[0])
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

// Task functions
export async function getTasksByProjectId(projectId: number): Promise<Task[]> {
  try {
    const result = await sql`
      SELECT * FROM tasks
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `
    return result.map((row) => TaskSchema.parse(row))
  } catch (error) {
    console.error("Error getting tasks by project ID:", error)
    return []
  }
}

export async function createTask({
  title,
  description,
  status,
  priority,
  project_id,
  assignee_id,
  due_date,
}: {
  title: string
  description?: string | null
  status?: "todo" | "in_progress" | "review" | "done"
  priority?: "low" | "medium" | "high"
  project_id: number
  assignee_id?: number | null
  due_date?: Date | null
}): Promise<Task> {
  try {
    const result = await sql`
      INSERT INTO tasks (
        title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at
      )
      VALUES (
        ${title}, ${description}, ${status || "todo"}, ${priority || "medium"}, 
        ${project_id}, ${assignee_id}, ${due_date}, NOW(), NOW()
      )
      RETURNING *
    `
    return TaskSchema.parse(result[0])
  } catch (error) {
    console.error("Error creating task:", error)
    throw error
  }
}

// Time entry functions
export async function getTimeEntriesByTaskId(taskId: number): Promise<TimeEntry[]> {
  try {
    const result = await sql`
      SELECT * FROM time_entries
      WHERE task_id = ${taskId}
      ORDER BY started_at DESC
    `
    return result.map((row) => TimeEntrySchema.parse(row))
  } catch (error) {
    console.error("Error getting time entries by task ID:", error)
    return []
  }
}

export async function getTimeEntriesByUserId(userId: number): Promise<TimeEntry[]> {
  try {
    const result = await sql`
      SELECT * FROM time_entries
      WHERE user_id = ${userId}
      ORDER BY started_at DESC
    `
    return result.map((row) => TimeEntrySchema.parse(row))
  } catch (error) {
    console.error("Error getting time entries by user ID:", error)
    return []
  }
}

export async function createTimeEntry({
  task_id,
  user_id,
  duration,
  description,
  started_at,
  ended_at,
}: {
  task_id: number
  user_id: number
  duration: number
  description?: string | null
  started_at: Date
  ended_at?: Date | null
}): Promise<TimeEntry> {
  try {
    const result = await sql`
      INSERT INTO time_entries (
        task_id, user_id, duration, description, started_at, ended_at, created_at, updated_at
      )
      VALUES (
        ${task_id}, ${user_id}, ${duration}, ${description}, ${started_at}, ${ended_at}, NOW(), NOW()
      )
      RETURNING *
    `
    return TimeEntrySchema.parse(result[0])
  } catch (error) {
    console.error("Error creating time entry:", error)
    throw error
  }
}

// Invoice functions
export async function getInvoicesByProjectId(projectId: number): Promise<Invoice[]> {
  try {
    const result = await sql`
      SELECT * FROM invoices
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `
    return result.map((row) => InvoiceSchema.parse(row))
  } catch (error) {
    console.error("Error getting invoices by project ID:", error)
    return []
  }
}

export async function createInvoice({
  project_id,
  amount,
  status,
  due_date,
  issued_date,
}: {
  project_id: number
  amount: number
  status?: "draft" | "sent" | "paid" | "overdue"
  due_date: Date
  issued_date: Date
}): Promise<Invoice> {
  try {
    const result = await sql`
      INSERT INTO invoices (
        project_id, amount, status, due_date, issued_date, created_at, updated_at
      )
      VALUES (
        ${project_id}, ${amount}, ${status || "draft"}, ${due_date}, ${issued_date}, NOW(), NOW()
      )
      RETURNING *
    `
    return InvoiceSchema.parse(result[0])
  } catch (error) {
    console.error("Error creating invoice:", error)
    throw error
  }
}

// Database status check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

// Check if tables exist
export async function checkTablesExist(): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) as users_exist
    `
    return result[0].users_exist
  } catch (error) {
    console.error("Error checking if tables exist:", error)
    return false
  }
}
