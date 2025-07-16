"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface TimeEntryFormProps {
  projects: any[]
  tasks: any[]
  entry?: any
  onSave: (entry: any) => void
  onCancel: () => void
}

export function TimeEntryForm({ projects, tasks, entry, onSave, onCancel }: TimeEntryFormProps) {
  const [projectId, setProjectId] = useState<string>(entry?.project_id?.toString() || "")
  const [taskId, setTaskId] = useState<string>(entry?.task_id?.toString() || "")
  const [description, setDescription] = useState(entry?.description || "")
  const [date, setDate] = useState<Date>(entry?.started_at ? new Date(entry.started_at) : new Date())
  const [startTime, setStartTime] = useState(entry?.started_at ? format(new Date(entry.started_at), "HH:mm") : "09:00")
  const [endTime, setEndTime] = useState(entry?.ended_at ? format(new Date(entry.ended_at), "HH:mm") : "17:00")
  const [duration, setDuration] = useState(entry?.duration ? entry.duration / 3600 : 0)
  const [billable, setBillable] = useState(entry?.billable !== undefined ? entry.billable : true)
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])

  // Filter tasks based on selected project
  useEffect(() => {
    if (projectId) {
      const filtered = tasks.filter((task) => task.project_id.toString() === projectId)
      setFilteredTasks(filtered)

      // If the current task doesn't belong to the selected project, reset it
      if (taskId && !filtered.some((task) => task.id.toString() === taskId)) {
        setTaskId("")
      }
    } else {
      setFilteredTasks([])
      setTaskId("")
    }
  }, [projectId, tasks, taskId])

  // Calculate duration when start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const startDate = new Date(date)
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      startDate.setHours(startHours, startMinutes, 0, 0)

      const endDate = new Date(date)
      const [endHours, endMinutes] = endTime.split(":").map(Number)
      endDate.setHours(endHours, endMinutes, 0, 0)

      // If end time is earlier than start time, assume it's the next day
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1)
      }

      const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
      setDuration(Number.parseFloat(durationInHours.toFixed(2)))
    }
  }, [date, startTime, endTime])

  // Update duration when manually changed
  const handleDurationChange = (value: string) => {
    const newDuration = Number.parseFloat(value)
    if (!isNaN(newDuration)) {
      setDuration(newDuration)

      // Update end time based on new duration
      if (startTime) {
        const startDate = new Date(date)
        const [startHours, startMinutes] = startTime.split(":").map(Number)
        startDate.setHours(startHours, startMinutes, 0, 0)

        const endDate = new Date(startDate.getTime() + newDuration * 60 * 60 * 1000)
        setEndTime(format(endDate, "HH:mm"))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectId || !description) {
      alert("Please fill in all required fields")
      return
    }

    // Create start and end date objects
    const startDate = new Date(date)
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    startDate.setHours(startHours, startMinutes, 0, 0)

    const endDate = new Date(date)
    const [endHours, endMinutes] = endTime.split(":").map(Number)
    endDate.setHours(endHours, endMinutes, 0, 0)

    // If end time is earlier than start time, assume it's the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1)
    }

    const selectedProject = projects.find((p) => p.id.toString() === projectId)
    const selectedTask = tasks.find((t) => t.id.toString() === taskId)

    const newEntry = {
      ...(entry || {}), // Keep existing properties if editing
      project_id: Number.parseInt(projectId),
      task_id: taskId ? Number.parseInt(taskId) : null,
      description,
      started_at: startDate,
      ended_at: endDate,
      duration: duration * 3600, // Convert hours to seconds
      project_name: selectedProject?.name || "",
      task_title: selectedTask?.title || "",
      billable,
    }

    onSave(newEntry)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project">Project *</Label>
        <Select value={projectId} onValueChange={setProjectId} required>
          <SelectTrigger id="project" className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select a project" />
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

      <div className="space-y-2">
        <Label htmlFor="task">Task</Label>
        <Select value={taskId} onValueChange={setTaskId} disabled={!projectId}>
          <SelectTrigger id="task" className="bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select a task" />
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

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
          placeholder="What did you work on?"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white",
                  !date && "text-gray-400",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="bg-gray-800 text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (hours)</Label>
        <Input
          id="duration"
          type="number"
          min="0"
          step="0.25"
          value={duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="billable" checked={billable} onCheckedChange={setBillable} />
        <Label htmlFor="billable">Billable</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="bg-gray-800 border-gray-700 text-white">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {entry ? "Update" : "Save"} Time Entry
        </Button>
      </div>
    </form>
  )
}
