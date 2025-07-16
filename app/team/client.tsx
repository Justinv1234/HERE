"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export default function TeamClient() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: user?.name || "Admin User",
      email: user?.email || "admin@example.com",
      role: "Admin",
      avatarUrl: null,
      status: "active",
    },
  ])

  // Ensure we have at least one team member (the current user)
  useEffect(() => {
    if (user && teamMembers.length === 0) {
      setTeamMembers([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "Admin",
          avatarUrl: null,
          status: "active",
        },
      ])
    }
  }, [user])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-500">Manage your team members and their permissions</p>
        </div>
        <Button>Invite Team Member</Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>View and manage your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading team members...</div>
            ) : teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl || ""} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{member.role}</span>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">No team members found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
