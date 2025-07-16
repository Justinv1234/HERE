"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeTrackerProps {
  projects: any[]
  tasks: any[]
  onSaveEntry: (entry: any) => void
  onTimerStopped?: () => void
}

export function TimeTracker({ projects, tasks, onSaveEntry, onTimerStopped }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedTask, setSelectedTask] = useState("")
  const [description, setDescription] = useState("")
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedProject) {
      setFilteredTasks(tasks.filter((task) => task.project_id.toString() === selectedProject))
      setSelectedTask("")
    } else {
      setFilteredTasks([])
    }
  }, [selectedProject, tasks])

  const startTimer = () => {
    if (!selectedProject || !selectedTask) {
      alert("Please select a project and task before starting the timer")
      return
    }

    setIsTracking(true)
    setIsPaused(false)

    if (!startTimeRef.current) {
      startTimeRef.current = new Date()
    }

    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const now = new Date()
        const diff = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000) + pausedTimeRef.current
        setElapsedTime(diff)
      }
    }, 1000)
  }

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Store the current elapsed time when pausing
    pausedTimeRef.current = elapsedTime

    setIsPaused(true)
    setIsTracking(false)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (elapsedTime > 0 && startTimeRef.current) {
      const endTime = new Date()

      // Get project and task names for display
      const projectName = projects.find((p) => p.id.toString() === selectedProject)?.name || ""
      const taskName = tasks.find((t) => t.id.toString() === selectedTask)?.title || ""

      const newEntry = {
        project_id: Number.parseInt(selectedProject),
        task_id: Number.parseInt(selectedTask),
        project_name: projectName,
        task_title: taskName,
        description,
        duration: elapsedTime,
        started_at: startTimeRef.current,
        ended_at: endTime,
      }

      // Save the entry
      onSaveEntry(newEntry)

      // Notify parent component that timer was stopped
      if (onTimerStopped) {
        onTimerStopped()
      }
    }

    // Reset everything
    setIsTracking(false)
    setIsPaused(false)
    setElapsedTime(0)
    startTimeRef.current = null
    pausedTimeRef.current = 0
    setDescription("")
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Time Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isTracking || isPaused}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={selectedTask}
              onValueChange={setSelectedTask}
              disabled={!selectedProject || isTracking || isPaused}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Task" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {filteredTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-4xl font-mono tabular-nums">
            {formatTime(elapsedTime)}
            {isPaused && <span className="text-yellow-500 text-sm ml-2">(Paused)</span>}
          </div>
          <div className="flex gap-2">
            {!isTracking ? (
              <Button
                className={isPaused ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}
                onClick={startTimer}
                disabled={!selectedProject || !selectedTask}
              >
                <Play className="mr-2 h-4 w-4" />
                {isPaused ? "Resume" : "Start"}
              </Button>
            ) : (
              <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={pauseTimer}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={stopTimer}
              disabled={elapsedTime === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
