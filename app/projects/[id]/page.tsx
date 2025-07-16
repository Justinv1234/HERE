"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, Plus, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TaskForm } from "@/components/tasks/task-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projectId = Number.parseInt(params.id)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProjectData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch project details
        const projectRes = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        })

        if (!projectRes.ok) {
          if (projectRes.status === 404) {
            setError("Project not found")
          } else {
            setError(`Failed to fetch project: ${projectRes.status}`)
          }
          return
        }

        const projectData = await projectRes.json()
        setProject(projectData)

        // Fetch tasks for this project
        const tasksRes = await fetch(`/api/projects/${projectId}/tasks`, {
          credentials: "include",
        })

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }

        // Fetch team members
        const teamRes = await fetch(`/api/team`, {
          credentials: "include",
        })

        if (teamRes.ok) {
          const teamData = await teamRes.json()
          setTeamMembers(teamData)
        }
      } catch (error) {
        console.error("Error fetching project data:", error)
        setError("Failed to load project data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId, user, router])

  const completedTasks = tasks.filter((task) => task.status === "done" || task.status === "completed").length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleAddTask = () => {
    setEditingTask(null)
    setIsAddTaskOpen(true)
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsAddTaskOpen(true)
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
      } else {
        console.error("Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const closeTaskDialog = () => {
    setIsAddTaskOpen(false)
    setEditingTask(null)
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Loading project...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading project</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button asChild className="mr-4">
              <Link href="/projects">Back to Projects</Link>
            </Button>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/projects">Back to Projects</Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Link href="/projects" className="text-gray-400 hover:text-white flex items-center mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-400 mt-2">{project.description}</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{progress}%</div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-400 mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">Created: {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">
                Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : "No due date"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-400">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm">{teamMembers.length} members</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-gray-900 text-gray-400">
          <TabsTrigger value="tasks" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Team ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Files
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-0">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tasks yet. Add your first task to get started.</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleAddTask}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4">Task</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Priority</th>
                      <th className="text-left p-4">Due Date</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-800">
                        <td className="p-4">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-400">{task.description}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              task.status === "done" || task.status === "completed"
                                ? "bg-green-900 text-green-100"
                                : task.status === "in_progress"
                                  ? "bg-blue-900 text-blue-100"
                                  : task.status === "review"
                                    ? "bg-yellow-900 text-yellow-100"
                                    : "bg-gray-800 text-gray-300"
                            }`}
                          >
                            {task.status?.replace("_", " ") || "todo"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              task.priority === "high"
                                ? "bg-red-900 text-red-100"
                                : task.priority === "medium"
                                  ? "bg-yellow-900 text-yellow-100"
                                  : "bg-green-900 text-green-100"
                            }`}
                          >
                            {task.priority || "low"}
                          </span>
                        </td>
                        <td className="p-4">
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                              <DropdownMenuItem
                                onClick={() => handleEditTask(task)}
                                className="cursor-pointer hover:bg-gray-700"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteTask(task.id)}
                                className="cursor-pointer hover:bg-gray-700 text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="mt-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Team Members</h3>
              {teamMembers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-400">No team members assigned to this project yet.</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Add Team Member</Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {teamMembers.map((member) => (
                    <li key={member.id} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        {member.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "?"}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="files" className="mt-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-400">No files uploaded yet</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Upload File</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white p-0 max-w-md">
          <TaskForm projectId={projectId} task={editingTask} teamMembers={teamMembers} onClose={closeTaskDialog} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
