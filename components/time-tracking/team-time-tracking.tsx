"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { formatDuration } from "@/lib/format-time"

interface TeamTimeTrackingProps {
  teamMembers: any[]
  timeEntries: any[]
  projects: any[]
  onUpdateStatus: (entryId: number, status: string) => void
}

export function TeamTimeTracking({ teamMembers, timeEntries, projects, onUpdateStatus }: TeamTimeTrackingProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate total hours per team member
  const memberStats = teamMembers.map((member) => {
    const memberEntries = timeEntries.filter((entry) => entry.user_id === member.id)
    const totalHours = memberEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
    const pendingEntries = memberEntries.filter((entry) => entry.status === "pending").length

    return {
      ...member,
      totalHours,
      pendingEntries,
    }
  })

  // Get pending entries for approval
  const pendingEntries = timeEntries.filter((entry) => entry.status === "pending")

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-900">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="approvals">
            Pending Approvals
            {pendingEntries.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingEntries.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {memberStats.map((member) => (
              <Card key={member.id} className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <div className="text-sm text-gray-400">{member.role}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Hours:</span>
                      <span className="font-medium">{member.totalHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pending Entries:</span>
                      <span className="font-medium">{member.pendingEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Active:</span>
                      <span className="font-medium">
                        {timeEntries.filter((entry) => entry.user_id === member.id).length > 0
                          ? format(
                              new Date(
                                Math.max(
                                  ...timeEntries
                                    .filter((entry) => entry.user_id === member.id)
                                    .map((entry) => new Date(entry.ended_at).getTime()),
                                ),
                              ),
                              "MMM d, yyyy",
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="mt-6">
          {pendingEntries.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-400">No pending time entries to approve.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingEntries.map((entry) => (
                <Card key={entry.id} className="bg-gray-900 border-gray-800 text-white">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-sm text-gray-400">
                          {entry.project_name} - {entry.task_title}
                        </div>
                        <div className="text-sm text-gray-400">
                          By {entry.user_name} on {format(new Date(entry.started_at), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-medium">{formatDuration(entry.duration)}</div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-900/20 border-green-800 text-green-400 hover:bg-green-900/40 hover:text-green-300"
                            onClick={() => onUpdateStatus(entry.id, "approved")}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-900/20 border-red-800 text-red-400 hover:bg-red-900/40 hover:text-red-300"
                            onClick={() => onUpdateStatus(entry.id, "rejected")}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
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
