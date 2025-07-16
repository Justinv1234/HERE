"use client"

import { format, eachDayOfInterval, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface WeeklySummaryProps {
  timeEntries: any[]
  projects: any[]
  teamMembers: any[]
  weekStart: Date
  weekEnd: Date
}

export function WeeklySummary({ timeEntries, projects, teamMembers, weekStart, weekEnd }: WeeklySummaryProps) {
  // Generate array of days in the week
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Filter entries for the current week
  const weekEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.started_at)
    return entryDate >= weekStart && entryDate <= weekEnd
  })

  // Calculate hours per day per team member
  const memberHours = teamMembers.map((member) => {
    const dailyHours = daysOfWeek.map((day) => {
      const dayEntries = weekEntries.filter(
        (entry) => entry.user_id === member.id && isSameDay(new Date(entry.started_at), day),
      )
      const hours = dayEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
      return hours
    })

    const totalHours = dailyHours.reduce((total, hours) => total + hours, 0)

    return {
      member,
      dailyHours,
      totalHours,
    }
  })

  // Calculate project totals for the week
  const projectTotals = projects
    .map((project) => {
      const projectEntries = weekEntries.filter((entry) => entry.project_id === project.id)
      const hours = projectEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
      return {
        project,
        hours,
      }
    })
    .filter((item) => item.hours > 0)

  // Calculate daily totals
  const dailyTotals = daysOfWeek.map((day) => {
    const dayEntries = weekEntries.filter((entry) => isSameDay(new Date(entry.started_at), day))
    return dayEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
  })

  // Calculate week total
  const weekTotal = dailyTotals.reduce((total, hours) => total + hours, 0)

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Timesheet</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400">Team Member</TableHead>
                {daysOfWeek.map((day) => (
                  <TableHead key={day.toISOString()} className="text-gray-400 text-center">
                    {format(day, "EEE")}
                    <br />
                    {format(day, "MMM d")}
                  </TableHead>
                ))}
                <TableHead className="text-gray-400 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberHours.map(({ member, dailyHours, totalHours }) => (
                <TableRow key={member.id} className="border-gray-800">
                  <TableCell className="font-medium">{member.name}</TableCell>
                  {dailyHours.map((hours, index) => (
                    <TableCell key={index} className="text-center">
                      {hours > 0 ? hours.toFixed(1) : "-"}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-medium">{totalHours.toFixed(1)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-gray-800 bg-gray-800/50">
                <TableCell className="font-medium">Daily Total</TableCell>
                {dailyTotals.map((hours, index) => (
                  <TableCell key={index} className="text-center font-medium">
                    {hours.toFixed(1)}
                  </TableCell>
                ))}
                <TableCell className="text-right font-medium">{weekTotal.toFixed(1)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Project Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {projectTotals.length === 0 ? (
              <div className="text-center py-4 text-gray-400">No time tracked for any projects this week.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Project</TableHead>
                    <TableHead className="text-gray-400 text-right">Hours</TableHead>
                    <TableHead className="text-gray-400 text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTotals.map(({ project, hours }) => (
                    <TableRow key={project.id} className="border-gray-800">
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-right">{hours.toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        {weekTotal > 0 ? ((hours / weekTotal) * 100).toFixed(0) : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Total Hours Tracked</span>
                <span className="text-xl font-medium">{weekTotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Team Members Active</span>
                <span className="text-xl font-medium">
                  {memberHours.filter(({ totalHours }) => totalHours > 0).length}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <span className="text-gray-400">Projects Worked On</span>
                <span className="text-xl font-medium">{projectTotals.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Daily Average</span>
                <span className="text-xl font-medium">
                  {(weekTotal / daysOfWeek.filter((_, i) => dailyTotals[i] > 0).length || 0).toFixed(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
