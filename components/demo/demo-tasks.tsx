"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Clock, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DemoTasks() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Homepage Mockup",
      description: "Create a mockup for the new homepage design",
      status: "completed",
      priority: "high",
      project: "Website Redesign",
      assignee: "Alex Johnson",
      dueDate: "2023-11-25",
    },
    {
      id: 2,
      title: "Implement User Authentication",
      description: "Set up user authentication system with OAuth",
      status: "in-progress",
      priority: "high",
      project: "Mobile App Development",
      assignee: "Sam Wilson",
      dueDate: "2023-12-05",
    },
    {
      id: 3,
      title: "Create Content Strategy",
      description: "Develop a content strategy for the marketing campaign",
      status: "completed",
      priority: "medium",
      project: "Marketing Campaign",
      assignee: "Jamie Smith",
      dueDate: "2023-11-20",
    },
    {
      id: 4,
      title: "Optimize Database Queries",
      description: "Improve performance of database queries",
      status: "todo",
      priority: "medium",
      project: "Mobile App Development",
      assignee: "Taylor Brown",
      dueDate: "2023-12-10",
    },
    {
      id: 5,
      title: "Design Logo Variations",
      description: "Create different variations of the logo for review",
      status: "in-progress",
      priority: "low",
      project: "Website Redesign",
      assignee: "Alex Johnson",
      dueDate: "2023-11-30",
    },
    {
      id: 6,
      title: "Set Up Analytics",
      description: "Implement analytics tracking for the website",
      status: "todo",
      priority: "high",
      project: "Website Redesign",
      assignee: "Sam Wilson",
      dueDate: "2023-12-15",
    },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    project: "Website Redesign",
    assignee: "Alex Johnson",
    dueDate: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleAddTask = () => {
    const task = {
      id: tasks.length + 1,
      ...newTask,
    }

    setTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      project: "Website Redesign",
      assignee: "Alex Johnson",
      dueDate: "",
    })
    setIsDialogOpen(false)
  }

  const handleToggleStatus = (id: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status: task.status === "completed" ? "todo" : "completed",
          }
        }
        return task
      }),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "todo") return task.status === "todo"
    if (activeTab === "in-progress") return task.status === "in-progress"
    if (activeTab === "completed") return task.status === "completed"
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your project.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={newTask.project} onValueChange={(value) => setNewTask({ ...newTask, project: value })}>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                      <SelectItem value="Sam Wilson">Sam Wilson</SelectItem>
                      <SelectItem value="Jamie Smith">Jamie Smith</SelectItem>
                      <SelectItem value="Taylor Brown">Taylor Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">No tasks found in this category.</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <button onClick={() => handleToggleStatus(task.id)} className="mt-0.5 flex-shrink-0">
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        <div>
                          <CardTitle
                            className={task.status === "completed" ? "line-through text-muted-foreground" : ""}
                          >
                            {task.title}
                          </CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(task.id)}>
                            {task.status === "completed" ? "Mark as Incomplete" : "Mark as Complete"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Add Comment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="border-t bg-muted/20 p-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="outline">{task.project}</Badge>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </Badge>
                      {task.status === "in-progress" && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          In Progress
                        </Badge>
                      )}
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="ml-auto text-muted-foreground">Assigned to {task.assignee}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
