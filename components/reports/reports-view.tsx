"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  LineChart,
  Line,
} from "recharts"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { exportToCSV } from "@/lib/export-utils"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function ReportsView({ data }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [projectFilter, setProjectFilter] = useState("all")
  const [memberFilter, setMemberFilter] = useState("all")

  // Use provided data or fallback to empty arrays
  const { timeEntries = [], projects = [], teamMembers = [], tasks = [], invoices = [] } = data || {}

  // Calculate summary metrics
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0)
  const billableHours = timeEntries
    .filter((entry) => entry.billable)
    .reduce((sum, entry) => sum + entry.duration / 3600, 0)
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)

  // Prepare data for charts
  const projectData = projects.map((project) => {
    const projectEntries = timeEntries.filter((entry) => entry.project_id === project.id)
    const hours = projectEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0)
    return {
      name: project.name,
      hours: Number.parseFloat(hours.toFixed(1)),
      tasks: tasks.filter((task) => task.project_id === project.id).length,
    }
  })

  const memberData = teamMembers.map((member) => {
    const memberEntries = timeEntries.filter((entry) => entry.user_id === member.id)
    const hours = memberEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0)
    return {
      name: member.name,
      hours: Number.parseFloat(hours.toFixed(1)),
      tasks: tasks.filter((task) => task.assigned_to === member.id).length,
    }
  })

  // Monthly data for trends
  const monthlyData = [
    { name: "Jan", hours: 42.5, revenue: 4250 },
    { name: "Feb", hours: 47.8, revenue: 4780 },
    { name: "Mar", hours: 51.2, revenue: 5120 },
    { name: "Apr", hours: 56.7, revenue: 5670 },
    { name: "May", hours: 58.9, revenue: 5890 },
    { name: "Jun", hours: 62.3, revenue: 6230 },
  ]

  const handleExport = () => {
    let dataToExport = []
    let filename = "report"

    switch (activeTab) {
      case "time":
        dataToExport = timeEntries.map((entry) => ({
          Date: new Date(entry.started_at).toLocaleDateString(),
          Project: projects.find((p) => p.id === entry.project_id)?.name || "Unknown",
          User: teamMembers.find((m) => m.id === entry.user_id)?.name || "Unknown",
          Hours: (entry.duration / 3600).toFixed(2),
          Billable: entry.billable ? "Yes" : "No",
        }))
        filename = "time-tracking-report"
        break
      case "projects":
        dataToExport = projectData.map((project) => ({
          Project: project.name,
          Hours: project.hours,
          Tasks: project.tasks,
        }))
        filename = "projects-report"
        break
      case "team":
        dataToExport = memberData.map((member) => ({
          Member: member.name,
          Hours: member.hours,
          Tasks: member.tasks,
        }))
        filename = "team-report"
        break
      case "financial":
        dataToExport = invoices.map((invoice) => ({
          Invoice: invoice.number,
          Client: invoice.client_name,
          Amount: invoice.amount.toFixed(2),
          Status: invoice.status,
          Date: new Date(invoice.date).toLocaleDateString(),
        }))
        filename = "financial-report"
        break
      default:
        dataToExport = timeEntries.map((entry) => ({
          Date: new Date(entry.started_at).toLocaleDateString(),
          Project: projects.find((p) => p.id === entry.project_id)?.name || "Unknown",
          User: teamMembers.find((m) => m.id === entry.user_id)?.name || "Unknown",
          Hours: (entry.duration / 3600).toFixed(2),
        }))
        filename = "overview-report"
    }

    exportToCSV(dataToExport, filename)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangePicker from={dateRange.from} to={dateRange.to} onSelect={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billableHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {totalHours > 0 ? ((billableHours / totalHours) * 100).toFixed(0) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(0) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">From paid invoices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Hours tracked and revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="hours"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                      name="Hours"
                    />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#00C49F" name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>Hours by project</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Hours by team member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memberData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} hours`, "Time"]} />
                      <Bar dataKey="hours" fill="#0088FE" name="Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={memberFilter} onValueChange={setMemberFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Team Members</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time Distribution</CardTitle>
              <CardDescription>Hours tracked by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} hours`, "Time"]} />
                    <Bar dataKey="hours" fill="#0088FE" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billable vs. Non-Billable</CardTitle>
              <CardDescription>Distribution of billable hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Billable", value: billableHours },
                        { name: "Non-Billable", value: totalHours - billableHours },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toFixed(1)} hours`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Overview of all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projects.map((project) => ({
                      name: project.name,
                      completed: tasks.filter((task) => task.project_id === project.id && task.status === "completed")
                        .length,
                      inProgress: tasks.filter(
                        (task) => task.project_id === project.id && task.status === "in_progress",
                      ).length,
                      todo: tasks.filter((task) => task.project_id === project.id && task.status === "todo").length,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#00C49F" name="Completed" />
                    <Bar dataKey="inProgress" stackId="a" fill="#0088FE" name="In Progress" />
                    <Bar dataKey="todo" stackId="a" fill="#FFBB28" name="To Do" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Metrics</CardTitle>
              <CardDescription>Key metrics by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Project</th>
                      <th className="text-left py-3 px-4">Hours</th>
                      <th className="text-left py-3 px-4">Tasks</th>
                      <th className="text-left py-3 px-4">Completion</th>
                      <th className="text-left py-3 px-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => {
                      const projectTasks = tasks.filter((task) => task.project_id === project.id)
                      const completedTasks = projectTasks.filter((task) => task.status === "completed")
                      const completionRate =
                        projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0
                      const projectInvoices = invoices.filter((inv) => inv.project_id === project.id)
                      const projectRevenue = projectInvoices.reduce((sum, inv) => sum + inv.amount, 0)

                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{project.name}</td>
                          <td className="py-3 px-4">{projectData.find((p) => p.name === project.name)?.hours || 0}</td>
                          <td className="py-3 px-4">{projectTasks.length}</td>
                          <td className="py-3 px-4">{completionRate.toFixed(0)}%</td>
                          <td className="py-3 px-4">${projectRevenue.toFixed(0)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Productivity by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#0088FE" name="Hours" />
                    <Bar dataKey="tasks" fill="#00C49F" name="Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Metrics</CardTitle>
              <CardDescription>Key metrics by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Team Member</th>
                      <th className="text-left py-3 px-4">Hours</th>
                      <th className="text-left py-3 px-4">Tasks</th>
                      <th className="text-left py-3 px-4">Completion Rate</th>
                      <th className="text-left py-3 px-4">Avg Hours/Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member, index) => {
                      const memberTasks = tasks.filter((task) => task.assigned_to === member.id)
                      const completedTasks = memberTasks.filter((task) => task.status === "completed")
                      const completionRate =
                        memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0
                      const memberHours = memberData.find((m) => m.name === member.name)?.hours || 0
                      const avgHoursPerTask = completedTasks.length > 0 ? memberHours / completedTasks.length : 0

                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{member.name}</td>
                          <td className="py-3 px-4">{memberHours}</td>
                          <td className="py-3 px-4">{memberTasks.length}</td>
                          <td className="py-3 px-4">{completionRate.toFixed(0)}%</td>
                          <td className="py-3 px-4">{avgHoursPerTask.toFixed(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by project and client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projects.map((project) => {
                      const projectInvoices = invoices.filter((inv) => inv.project_id === project.id)
                      const paid = projectInvoices
                        .filter((inv) => inv.status === "paid")
                        .reduce((sum, inv) => sum + inv.amount, 0)
                      const pending = projectInvoices
                        .filter((inv) => inv.status === "pending")
                        .reduce((sum, inv) => sum + inv.amount, 0)
                      const overdue = projectInvoices
                        .filter((inv) => inv.status === "overdue")
                        .reduce((sum, inv) => sum + inv.amount, 0)

                      return {
                        name: project.name,
                        paid,
                        pending,
                        overdue,
                      }
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, ""]} />
                    <Legend />
                    <Bar dataKey="paid" stackId="a" fill="#00C49F" name="Paid" />
                    <Bar dataKey="pending" stackId="a" fill="#FFBB28" name="Pending" />
                    <Bar dataKey="overdue" stackId="a" fill="#FF8042" name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Status</CardTitle>
              <CardDescription>Overview of invoice status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Paid",
                          value: invoices
                            .filter((inv) => inv.status === "paid")
                            .reduce((sum, inv) => sum + inv.amount, 0),
                        },
                        {
                          name: "Pending",
                          value: invoices
                            .filter((inv) => inv.status === "pending")
                            .reduce((sum, inv) => sum + inv.amount, 0),
                        },
                        {
                          name: "Overdue",
                          value: invoices
                            .filter((inv) => inv.status === "overdue")
                            .reduce((sum, inv) => sum + inv.amount, 0),
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toFixed(0)}`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
