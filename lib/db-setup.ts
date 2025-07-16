import { sql } from "./db"

export async function checkAndCreateTables() {
  console.log("Checking and creating necessary database tables...")

  try {
    // Check if projects table exists
    const projectsTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'projects'
      ) as exists
    `

    if (!projectsTableCheck[0].exists) {
      console.log("Creating projects table...")
      await sql`
        CREATE TABLE projects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'active',
          owner_id INTEGER NOT NULL,
          business_id INTEGER NOT NULL,
          due_date TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
      console.log("Projects table created successfully")
    } else {
      console.log("Projects table already exists")
    }

    // Check if tasks table exists
    const tasksTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'tasks'
      ) as exists
    `

    if (!tasksTableCheck[0].exists) {
      console.log("Creating tasks table...")
      await sql`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'todo',
          priority VARCHAR(50) NOT NULL DEFAULT 'medium',
          project_id INTEGER NOT NULL,
          assignee_id INTEGER,
          due_date TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
      console.log("Tasks table created successfully")
    } else {
      console.log("Tasks table already exists")
    }

    // Check if project_team table exists
    const projectTeamTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'project_team'
      ) as exists
    `

    if (!projectTeamTableCheck[0].exists) {
      console.log("Creating project_team table...")
      await sql`
        CREATE TABLE project_team (
          id SERIAL PRIMARY KEY,
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'member',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(project_id, user_id)
        )
      `
      console.log("Project_team table created successfully")
    } else {
      console.log("Project_team table already exists")
    }

    return { success: true, message: "Database tables checked and created if needed" }
  } catch (error) {
    console.error("Error checking/creating database tables:", error)
    return { success: false, error: error.message }
  }
}

export async function createSampleProject(userId: number, businessId: number) {
  try {
    // Check if user has any projects
    const projectCount = await sql`
      SELECT COUNT(*) as count FROM projects
      WHERE business_id = ${businessId}
    `

    if (projectCount[0].count > 0) {
      return { success: true, message: "Sample projects already exist" }
    }

    // Create a sample project
    const project = await sql`
      INSERT INTO projects (name, description, owner_id, business_id, status, due_date, created_at, updated_at)
      VALUES (
        'Sample Project', 
        'This is a sample project to get you started', 
        ${userId}, 
        ${businessId}, 
        'active', 
        NOW() + INTERVAL '30 days', 
        NOW(), 
        NOW()
      )
      RETURNING *
    `

    // Add user to project team
    await sql`
      INSERT INTO project_team (project_id, user_id, role, created_at, updated_at)
      VALUES (${project[0].id}, ${userId}, 'owner', NOW(), NOW())
    `

    // Create sample tasks
    await sql`
      INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date, created_at, updated_at)
      VALUES 
        (
          'Set up project', 
          'Define project scope and objectives', 
          'done', 
          'high', 
          ${project[0].id}, 
          ${userId}, 
          NOW() - INTERVAL '5 days', 
          NOW() - INTERVAL '10 days', 
          NOW() - INTERVAL '5 days'
        ),
        (
          'Create wireframes', 
          'Design initial wireframes for the application', 
          'in_progress', 
          'medium', 
          ${project[0].id}, 
          ${userId}, 
          NOW() + INTERVAL '5 days', 
          NOW() - INTERVAL '5 days', 
          NOW()
        ),
        (
          'Develop MVP', 
          'Build the minimum viable product', 
          'todo', 
          'high', 
          ${project[0].id}, 
          ${userId}, 
          NOW() + INTERVAL '15 days', 
          NOW(), 
          NOW()
        )
    `

    return {
      success: true,
      message: "Sample project created successfully",
      project: project[0],
    }
  } catch (error) {
    console.error("Error creating sample project:", error)
    return { success: false, error: error.message }
  }
}
