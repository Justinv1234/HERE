import { neon } from "@neondatabase/serverless"

// Fetch reports data from the real database
export async function fetchReportsData(businessId: number) {
  try {
    // Validate DATABASE_URL
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }

    const sql = neon(process.env.DATABASE_URL)

    // Test connection with a simple query
    try {
      await sql`SELECT 1`
    } catch (connectionError) {
      console.error("Database connection test failed:", connectionError)
      throw new Error("Database connection failed. Please check your DATABASE_URL environment variable.")
    }

    // Fetch time entries
    const timeEntries = await sql`
      SELECT * FROM time_entries 
      WHERE business_id = ${businessId}
      ORDER BY started_at DESC
    `

    // Fetch projects
    const projects = await sql`
      SELECT * FROM projects 
      WHERE business_id = ${businessId}
    `

    // Fetch team members
    const teamMembers = await sql`
      SELECT * FROM users 
      WHERE id IN (
        SELECT user_id FROM business_users 
        WHERE business_id = ${businessId}
      )
    `

    // Fetch tasks
    const tasks = await sql`
      SELECT t.* FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.business_id = ${businessId}
    `

    // Fetch invoices
    const invoices = await sql`
      SELECT * FROM invoices 
      WHERE business_id = ${businessId}
    `

    return {
      timeEntries,
      projects,
      teamMembers,
      tasks,
      invoices,
    }
  } catch (error) {
    console.error("Error fetching reports data:", error)
    throw error // Re-throw to be handled by the component
  }
}

export function getMockReportsData() {
  return {
    timeEntries: [
      {
        id: "te1",
        user_id: "user1",
        project_id: "proj1",
        task_id: "task1",
        description: "Working on homepage design",
        started_at: new Date(2023, 5, 1, 9, 0).toISOString(),
        ended_at: new Date(2023, 5, 1, 12, 30).toISOString(),
        duration: 12600, // 3.5 hours in seconds
        billable: true,
        business_id: "business1",
      },
      {
        id: "te2",
        user_id: "user1",
        project_id: "proj1",
        task_id: "task2",
        description: "Backend API development",
        started_at: new Date(2023, 5, 2, 13, 0).toISOString(),
        ended_at: new Date(2023, 5, 2, 17, 0).toISOString(),
        duration: 14400, // 4 hours in seconds
        billable: true,
        business_id: "business1",
      },
      {
        id: "te3",
        user_id: "user2",
        project_id: "proj2",
        task_id: "task3",
        description: "Client meeting",
        started_at: new Date(2023, 5, 3, 10, 0).toISOString(),
        ended_at: new Date(2023, 5, 3, 11, 0).toISOString(),
        duration: 3600, // 1 hour in seconds
        billable: false,
        business_id: "business1",
      },
      {
        id: "te4",
        user_id: "user2",
        project_id: "proj2",
        task_id: "task4",
        description: "Database optimization",
        started_at: new Date(2023, 5, 4, 9, 0).toISOString(),
        ended_at: new Date(2023, 5, 4, 15, 0).toISOString(),
        duration: 21600, // 6 hours in seconds
        billable: true,
        business_id: "business1",
      },
      {
        id: "te5",
        user_id: "user3",
        project_id: "proj3",
        task_id: "task5",
        description: "Content writing",
        started_at: new Date(2023, 5, 5, 13, 0).toISOString(),
        ended_at: new Date(2023, 5, 5, 16, 0).toISOString(),
        duration: 10800, // 3 hours in seconds
        billable: true,
        business_id: "business1",
      },
    ],
    projects: [
      {
        id: "proj1",
        name: "Website Redesign",
        description: "Complete redesign of company website",
        client_id: "client1",
        status: "in_progress",
        start_date: new Date(2023, 4, 15).toISOString(),
        end_date: new Date(2023, 7, 30).toISOString(),
        business_id: "business1",
      },
      {
        id: "proj2",
        name: "Mobile App Development",
        description: "Develop iOS and Android apps",
        client_id: "client2",
        status: "in_progress",
        start_date: new Date(2023, 3, 1).toISOString(),
        end_date: new Date(2023, 8, 30).toISOString(),
        business_id: "business1",
      },
      {
        id: "proj3",
        name: "Marketing Campaign",
        description: "Q3 digital marketing campaign",
        client_id: "client3",
        status: "planning",
        start_date: new Date(2023, 6, 1).toISOString(),
        end_date: new Date(2023, 8, 30).toISOString(),
        business_id: "business1",
      },
    ],
    teamMembers: [
      {
        id: "user1",
        name: "John Smith",
        email: "john@example.com",
        role: "Developer",
        avatar_url: "/javascript-code.png",
      },
      {
        id: "user2",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "Designer",
        avatar_url: "/stylized-letters-sj.png",
      },
      {
        id: "user3",
        name: "Michael Brown",
        email: "michael@example.com",
        role: "Project Manager",
        avatar_url: "/monogram-mb.png",
      },
    ],
    tasks: [
      {
        id: "task1",
        project_id: "proj1",
        title: "Design homepage mockup",
        description: "Create mockups for the new homepage design",
        status: "completed",
        priority: "high",
        assigned_to: "user2",
        due_date: new Date(2023, 5, 10).toISOString(),
      },
      {
        id: "task2",
        project_id: "proj1",
        title: "Implement homepage frontend",
        description: "Convert the approved design to HTML/CSS/JS",
        status: "in_progress",
        priority: "medium",
        assigned_to: "user1",
        due_date: new Date(2023, 5, 20).toISOString(),
      },
      {
        id: "task3",
        project_id: "proj2",
        title: "Client requirements meeting",
        description: "Meet with client to discuss app requirements",
        status: "completed",
        priority: "high",
        assigned_to: "user3",
        due_date: new Date(2023, 4, 5).toISOString(),
      },
      {
        id: "task4",
        project_id: "proj2",
        title: "Database schema design",
        description: "Design the database schema for the mobile app",
        status: "completed",
        priority: "high",
        assigned_to: "user1",
        due_date: new Date(2023, 4, 15).toISOString(),
      },
      {
        id: "task5",
        project_id: "proj3",
        title: "Content creation",
        description: "Create content for the marketing campaign",
        status: "todo",
        priority: "medium",
        assigned_to: "user3",
        due_date: new Date(2023, 6, 15).toISOString(),
      },
    ],
    invoices: [
      {
        id: "inv1",
        number: "INV-2023-001",
        client_name: "Acme Corp",
        project_id: "proj1",
        amount: 4500,
        status: "paid",
        date: new Date(2023, 4, 30).toISOString(),
        due_date: new Date(2023, 5, 14).toISOString(),
        business_id: "business1",
      },
      {
        id: "inv2",
        number: "INV-2023-002",
        client_name: "TechStart Inc",
        project_id: "proj2",
        amount: 6200,
        status: "pending",
        date: new Date(2023, 5, 15).toISOString(),
        due_date: new Date(2023, 5, 30).toISOString(),
        business_id: "business1",
      },
      {
        id: "inv3",
        number: "INV-2023-003",
        client_name: "Global Marketing",
        project_id: "proj3",
        amount: 2800,
        status: "overdue",
        date: new Date(2023, 4, 15).toISOString(),
        due_date: new Date(2023, 4, 30).toISOString(),
        business_id: "business1",
      },
    ],
  }
}
