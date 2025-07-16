"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, Pause, Play, Plus, RefreshCw, StopCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { formatTime } from "@/lib/format-time"

export function DemoTimeTracking() {
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("timer")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newTimeEntry, setNewTimeEntry] = useState({
    project: "Website Redesign",
    task: "Design Homepage Mockup",
    description: "",
    date: new Date().toISOString().split("T")[0],
    hours: "1",
    minutes: "30",
  })

  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      project: "Website Redesign",
      task: "Design Homepage Mockup",
      description: "Created initial mockups for the homepage",
      date: "2023-11-20",
      duration: 7200, // 2 hours in seconds
    },
    {
      id: 2,
      project: "Mobile App Development",
      task: "Implement User Authentication",
      description: "Set up OAuth authentication flow",
      date: "2023-11-21",
      duration: 10800, // 3 hours in seconds
    },
    {
      id: 3,
      project: "Marketing Campaign",
      task: "Create Content Strategy",
      description: "Outlined content strategy for Q1",
      date: "2023-11-22",
      duration: 5400, // 1.5 hours in seconds
    },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = Date.now()
        setElapsedTime(Math.floor((now - startTime) / 1000))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, startTime])

  const handleStartTimer = () => {
    const now = Date.now()
    setStartTime(now - elapsedTime * 1000)
    setIsTracking(true)
  }

  const handlePauseTimer = () => {
    setIsTracking(false)
  }

  const handleStopTimer = () => {
    if (startTime) {
      const duration = elapsedTime
      const newEntry = {
        id: timeEntries.length + 1,
        project: "Website Redesign",
        task: "Design Homepage Mockup",
        description: "Time tracked manually",
        date: new Date().toISOString().split("T")[0],
        duration,
      }

      setTimeEntries([newEntry, ...timeEntries])
    }

    setIsTracking(false)
    setElapsedTime(0)
    setStartTime(null)
  }

  const handleResetTimer = () => {
    setIsTracking(false)
    setElapsedTime(0)
    setStartTime(null)
  }

  const handleAddTimeEntry = () => {
    const hours = Number.parseInt(newTimeEntry.hours) || 0
    const minutes = Number.parseInt(newTimeEntry.minutes) || 0
    const duration = hours * 3600 + minutes * 60

    const newEntry = {
      id: timeEntries.length + 1,
      project: newTimeEntry.project,
      task: newTimeEntry.task,
      description: newTimeEntry.description,
      date: newTimeEntry.date,
      duration,
    }

    setTimeEntries([newEntry, ...timeEntries])
    setNewTimeEntry({
      project: "Website Redesign",
      task: "Design Homepage Mockup",
      description: "",
      date: new Date().toISOString().split("T")[0],
      hours: "1",
      minutes: "30",
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Time Tracking</h2>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Time Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
                <DialogDescription>Manually add time spent on a task.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project">Project</Label>
                    <Select
                      value={newTimeEntry.project}
                      onValueChange={(value) => setNewTimeEntry({ ...newTimeEntry, project: value })}
                    >
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
                    <Label htmlFor="task">Task</Label>
                    <Select
                      value={newTimeEntry.task}
                      onValueChange={(value) => setNewTimeEntry({ ...newTimeEntry, task: value })}
                    >
                      <SelectTrigger id="task">
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Design Homepage Mockup">Design Homepage Mockup</SelectItem>
                        <SelectItem value="Implement User Authentication">Implement User Authentication</SelectItem>
                        <SelectItem value="Create Content Strategy">Create Content Strategy</SelectItem>
                        <SelectItem value="Optimize Database Queries">Optimize Database Queries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTimeEntry.description}
                    onChange={(e) => setNewTimeEntry({ ...newTimeEntry, description: e.target.value })}
                    placeholder="What did you work on?"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTimeEntry.date}
                    onChange={(e) => setNewTimeEntry({ ...newTimeEntry, date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      value={newTimeEntry.hours}
                      onChange={(e) => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minutes">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={newTimeEntry.minutes}
                      onChange={(e) => setNewTimeEntry({ ...newTimeEntry, minutes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTimeEntry}>Add Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
        </TabsList>
        <TabsContent value="timer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracker</CardTitle>
              <CardDescription>Track time for your current task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl font-mono font-bold tabular-nums">{formatTime(elapsedTime * 1000)}</div>
                <div className="flex space-x-2">
                  {!isTracking ? (
                    <Button onClick={handleStartTimer}>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={handlePauseTimer} variant="outline">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={handleStopTimer} variant="secondary" disabled={!isTracking && elapsedTime === 0}>
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop & Save
                  </Button>
                  <Button onClick={handleResetTimer} variant="outline" disabled={elapsedTime === 0}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-task">Current Task</Label>
                <Select defaultValue="Design Homepage Mockup">
                  <SelectTrigger id="current-task">
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Design Homepage Mockup">Design Homepage Mockup</SelectItem>
                    <SelectItem value="Implement User Authentication">Implement User Authentication</SelectItem>
                    <SelectItem value="Create Content Strategy">Create Content Strategy</SelectItem>
                    <SelectItem value="Optimize Database Queries">Optimize Database Queries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" placeholder="What are you working on?" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Time Entries</CardTitle>
              <CardDescription>View and manage your time entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="font-medium">{entry.task}</div>
                    <div className="text-sm text-muted-foreground">{entry.description}</div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{entry.project}</Badge>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right font-mono">
                      <div className="font-medium">{formatTime(entry.duration * 1000)}</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" className="w-full">
                View All Time Entries
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
