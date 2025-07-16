import Link from "next/link"
import { PlusCircle, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AppLayout } from "@/components/layout/app-layout"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

// Make this route dynamic to fix the cookies() error
export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <AppLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in to view projects</h1>
        </div>
      </AppLayout>
    )
  }

  // Check if projects table exists
  let projects = []
  try {
    // Try to get projects with minimal columns
    projects = await sql`
      SELECT p.id, p.name, p.description, p.status, p.due_date, p.created_at, p.updated_at,
             COUNT(t.id) as task_count,
             COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_task_count
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id, p.name, p.description, p.status, p.due_date, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `
  } catch (error) {
    console.error("Error fetching projects:", error)
    // If there's an error, we'll show the empty state
  }

  // Calculate progress for each project
  const projectsWithProgress = projects.map((project) => ({
    ...project,
    progress: project.task_count > 0 ? Math.round((project.completed_task_count / project.task_count) * 100) : 0,
  }))

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projectsWithProgress.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No projects yet</h2>
          <p className="text-gray-400 mb-6">Get started by creating your first project</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsWithProgress.map((project) => {
            return (
              <Card
                key={project.id}
                className="flex flex-col overflow-hidden hover:shadow-md transition-shadow bg-gray-900 border-gray-800 text-white"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <Link href={`/projects/${project.id}`} className="hover:underline">
                      {project.name}
                    </Link>
                    {project.status === "completed" && (
                      <span className="bg-green-900 text-green-100 text-xs font-medium inline-flex items-center px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {project.description || "No description provided"}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-gray-800 text-xs text-gray-400 flex justify-between">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {project.completed_task_count}/{project.task_count} tasks
                  </div>
                  {project.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 h-3" />
                      Due {new Date(project.due_date).toLocaleDateString()}
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}
