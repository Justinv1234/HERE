"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeTracker } from "./time-tracker"
import { TimeEntriesTable } from "./time-entries-table"
import { WeeklySummary } from "./weekly-summary"
import { TimeReports } from "./time-reports"
import { InvoiceManagement } from "./invoice-management"
import { TeamTimeTracking } from "./team-time-tracking"
import { useAuth } from "@/lib/auth-context"

export function TimeTrackingClient() {
  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch time entries
        const timeEntriesRes = await fetch("/api/time-entries", {
          credentials: "include",
        })
        if (timeEntriesRes.ok) {
          const timeEntriesData = await timeEntriesRes.json()
          setTimeEntries(timeEntriesData)
        }

        // Fetch projects
        const projectsRes = await fetch("/api/projects", {
          credentials: "include",
        })
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData)
        }

        // Fetch tasks
        const tasksRes = await fetch("/api/tasks", {
          credentials: "include",
        })
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }

        // Fetch team members
        const teamRes = await fetch("/api/team", {
          credentials: "include",
        })
        if (teamRes.ok) {
          const teamData = await teamRes.json()
          setTeam(teamData)
        }

        // Fetch clients
        const clientsRes = await fetch("/api/clients", {
          credentials: "include",
        })
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json()
          setClients(clientsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleTimeEntryAdded = (newEntry: any) => {
    setTimeEntries([newEntry, ...timeEntries])
  }

  const handleTimeEntryUpdated = (updatedEntry: any) => {
    setTimeEntries(timeEntries.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)))
  }

  const handleTimeEntryDeleted = (deletedId: string) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== deletedId))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-400 hover:underline">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Time Tracking</h1>
        <p className="text-gray-400">Track your time, manage projects, and generate invoices.</p>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-900 border-gray-800">
          <TabsTrigger value="tracker" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Tracker
          </TabsTrigger>
          <TabsTrigger value="entries" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Entries
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Summary
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Reports
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Time Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeTracker
                projects={projects}
                tasks={tasks}
                onTimeEntryAdded={handleTimeEntryAdded}
                onTimeEntryUpdated={handleTimeEntryUpdated}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries" className="space-y-6">
          <TimeEntriesTable
            timeEntries={timeEntries}
            projects={projects}
            tasks={tasks}
            onTimeEntryUpdated={handleTimeEntryUpdated}
            onTimeEntryDeleted={handleTimeEntryDeleted}
          />
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <WeeklySummary timeEntries={timeEntries} projects={projects} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <TimeReports timeEntries={timeEntries} projects={projects} team={team} />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceManagement timeEntries={timeEntries} projects={projects} clients={clients} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamTimeTracking team={team} projects={projects} timeEntries={timeEntries} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
