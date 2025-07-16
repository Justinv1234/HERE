import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"
import { Plus } from "lucide-react"
import { sql } from "@/lib/db"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AppLayout } from "@/components/layout/app-layout"

// Make this route dynamic to fix the cookies() error
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to view your dashboard</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Fetch real data from database with error handling
  let projects = []
  let tasks = []
  let timeEntries = []
  let recentActivity = []

  try {
    // For now, get all projects since we don't have business_id yet
    projects = await sql`SELECT * FROM projects LIMIT 10`
  } catch (error) {
    console.log("Projects table not found or error:", error)
    projects = []
  }

  try {
    tasks = await sql`SELECT * FROM tasks LIMIT 10`
  } catch (error) {
    console.log("Tasks table not found or error:", error)
    tasks = []
  }

  try {
    timeEntries = await sql`SELECT * FROM time_entries LIMIT 10`
  } catch (error) {
    console.log("Time entries table not found or error:", error)
    timeEntries = []
  }

  try {
    recentActivity = await sql`
      SELECT 'task_completed' as type, title as description, updated_at as created_at
      FROM tasks 
      WHERE status = 'done'
      ORDER BY updated_at DESC 
      LIMIT 5
    `
  } catch (error) {
    console.log("Recent activity query error:", error)
    recentActivity = []
  }

  const totalProjects = projects.length
  const activeTasks = tasks.filter((task) => task.status !== "done").length
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const hoursTracked = timeEntries.reduce((total, entry) => total + (entry.duration || 0), 0) / 3600

  const projectProgress = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project_id === project.id)
    const completedProjectTasks = projectTasks.filter((task) => task.status === "done")
    const progress =
      projectTasks.length > 0 ? Math.round((completedProjectTasks.length / projectTasks.length) * 100) : 0

    return {
      id: project.id,
      name: project.name,
      progress,
    }
  })

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}!</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gray-800 hover:bg-gray-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hours Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(hoursTracked)}</div>
            <p className="text-xs text-gray-400">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription className="text-gray-400">Track your project completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectProgress.length > 0 ? (
                projectProgress.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-400">{project.progress}%</div>
                    </div>
                    <Progress value={project.progress} className="bg-gray-700" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">
                  No projects found. Create your first project to track progress.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="rounded-lg border border-gray-800 p-3">
                    <p className="text-sm">
                      <span className="font-medium">Task completed:</span> {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(activity.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
