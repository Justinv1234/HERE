"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface TimeReportsProps {
  timeEntries: any[]
  projects: any[]
  teamMembers: any[]
}

export function TimeReports({ timeEntries, projects, teamMembers }: TimeReportsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedMember, setSelectedMember] = useState("all")

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  // Filter entries for the current month
  const monthEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.started_at)
    return entryDate >= monthStart && entryDate <= monthEnd
  })

  // Apply additional filters
  const filteredEntries = monthEntries.filter((entry) => {
    const matchesProject = selectedProject === "all" || entry.project_id.toString() === selectedProject
    const matchesMember = selectedMember === "all" || entry.user_id.toString() === selectedMember
    return matchesProject && matchesMember
  })

  // Calculate total hours
  const totalHours = filteredEntries.reduce((total, entry) => total + entry.duration / 3600, 0)

  // Prepare data for project chart
  const projectData = projects
    .map((project) => {
      const projectEntries = filteredEntries.filter((entry) => entry.project_id === project.id)
      const hours = projectEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
      return {
        name: project.name,
        hours: Number.parseFloat(hours.toFixed(1)),
      }
    })
    .filter((item) => item.hours > 0)

  // Prepare data for team member chart
  const memberData = teamMembers
    .map((member) => {
      const memberEntries = filteredEntries.filter((entry) => entry.user_id === member.id)
      const hours = memberEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
      return {
        name: member.name,
        hours: Number.parseFloat(hours.toFixed(1)),
      }
    })
    .filter((item) => item.hours > 0)

  // Prepare data for daily chart
  const dailyData: { name: string; hours: number }[] = []
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const dayEntries = filteredEntries.filter((entry) => new Date(entry.started_at).getDate() === day)
    const hours = dayEntries.reduce((total, entry) => total + entry.duration / 3600, 0)

    if (hours > 0) {
      dailyData.push({
        name: format(date, "MMM d"),
        hours: Number.parseFloat(hours.toFixed(1)),
      })
    }
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Time Reports</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</span>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="All Team Members" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Team Members</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Total Hours</div>
                  <div className="text-3xl font-bold mt-1">{totalHours.toFixed(1)}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Projects</div>
                  <div className="text-3xl font-bold mt-1">{projectData.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Team Members</div>
                  <div className="text-3xl font-bold mt-1">{memberData.length}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm">Time by Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projectData.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No data available</div>
                    ) : (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={projectData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="hours"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {projectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} hours`, "Time"]} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-sm">Time by Team Member</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {memberData.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No data available</div>
                    ) : (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={memberData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                            <YAxis tick={{ fill: "#ccc" }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#333", border: "none" }}
                              formatter={(value) => [`${value} hours`, "Time"]}
                            />
                            <Bar dataKey="hours" fill="#0088FE" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Project Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Project</TableHead>
                        <TableHead className="text-gray-400 text-right">Hours</TableHead>
                        <TableHead className="text-gray-400 text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-400">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        projectData.map((item, index) => (
                          <TableRow key={index} className="border-gray-700">
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.hours}</TableCell>
                            <TableCell className="text-right">
                              {totalHours > 0 ? ((item.hours / totalHours) * 100).toFixed(0) : 0}%
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="mt-4">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Team Member Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Team Member</TableHead>
                        <TableHead className="text-gray-400 text-right">Hours</TableHead>
                        <TableHead className="text-gray-400 text-right">% of Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-400">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        memberData.map((item, index) => (
                          <TableRow key={index} className="border-gray-700">
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.hours}</TableCell>
                            <TableCell className="text-right">
                              {totalHours > 0 ? ((item.hours / totalHours) * 100).toFixed(0) : 0}%
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="daily" className="mt-4">
              <Card className="bg-gray-800 border-gray-700 text-white">
                <CardHeader>
                  <CardTitle className="text-sm">Daily Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  {dailyData.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No data available</div>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="name" tick={{ fill: "#ccc" }} />
                          <YAxis tick={{ fill: "#ccc" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#333", border: "none" }}
                            formatter={(value) => [`${value} hours`, "Time"]}
                          />
                          <Bar dataKey="hours" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
