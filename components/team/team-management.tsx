"use client"

import { useState, useEffect } from "react"
import { Search, Mail, UserPlus, UserMinus, Settings, Shield, MoreHorizontal, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export default function TeamManagement() {
  // Initialize with empty arrays to prevent errors
  const [teamMembers, setTeamMembers] = useState([
    // Default admin user to show something
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      status: "active",
      lastActive: new Date(),
      projects: ["All Projects"],
      permissions: {
        manageTeam: true,
        manageProjects: true,
        manageInvoices: true,
        viewReports: true,
      },
    },
  ])
  const [invitations, setInvitations] = useState([])
  const [activity, setActivity] = useState([
    {
      id: 1,
      user: "System",
      action: "initialized",
      target: "team page",
      targetType: "system",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<any>(null)
  const [newInvite, setNewInvite] = useState({
    email: "",
    role: "Member",
    sendCopy: false,
  })

  const { user, business } = useAuth()

  useEffect(() => {
    // Force loading state to false after 5 seconds to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Update handlers to make API calls instead of local state updates
  const handleInviteMember = async () => {
    if (!newInvite.email || !newInvite.role) return

    try {
      // For now, just add locally
      const newInvitation = {
        id: Date.now(),
        email: newInvite.email,
        role: newInvite.role,
        invitedBy: user?.name || "You",
        invitedAt: new Date(),
        status: "pending",
      }
      setInvitations([newInvitation, ...invitations])
      setNewInvite({ email: "", role: "Member", sendCopy: false })
      setIsInviteDialogOpen(false)
    } catch (error) {
      console.error("Error inviting member:", error)
    }
  }

  // Handle canceling an invitation
  const handleCancelInvitation = (invitationId: number) => {
    setInvitations(invitations.filter((invitation) => invitation.id !== invitationId))

    // Add to activity
    const invitation = invitations.find((inv) => inv.id === invitationId)
    if (invitation) {
      const newActivity = {
        id: Date.now(),
        user: user?.name || "Current User",
        action: "canceled invitation to",
        target: invitation.email,
        targetType: "email",
        timestamp: new Date(),
      }

      setActivity([newActivity, ...activity])
    }
  }

  // Handle resending an invitation
  const handleResendInvitation = (invitationId: number) => {
    // In a real app, this would send an API request
    alert(`Invitation resent to ${invitations.find((inv) => inv.id === invitationId)?.email}`)
  }

  // Handle editing a team member
  const handleEditMember = (member: any) => {
    setCurrentMember(member)
    setIsEditMemberDialogOpen(true)
  }

  // Handle saving team member changes
  const handleSaveMemberChanges = () => {
    if (!currentMember) return

    setTeamMembers(
      teamMembers.map((member) => (member.id === currentMember.id ? { ...member, ...currentMember } : member)),
    )

    // Add to activity
    const newActivity = {
      id: Date.now(),
      user: user?.name || "Current User",
      action: "updated",
      target: currentMember.name,
      targetType: "user",
      timestamp: new Date(),
    }

    setActivity([newActivity, ...activity])

    setIsEditMemberDialogOpen(false)
    setCurrentMember(null)
  }

  // Handle removing a team member
  const handleRemoveMember = (memberId: number) => {
    const member = teamMembers.find((m) => m.id === memberId)
    if (!member) return

    setTeamMembers(teamMembers.filter((member) => member.id !== memberId))

    // Add to activity
    const newActivity = {
      id: Date.now(),
      user: user?.name || "Current User",
      action: "removed",
      target: member.name,
      targetType: "user",
      timestamp: new Date(),
    }

    setActivity([newActivity, ...activity])
  }

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "Never"

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-gray-900">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search team members..."
                    className="pl-8 bg-gray-800 border-gray-700 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription className="text-gray-400">
                Manage your team members and their access permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-gray-800/50 border-gray-800">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Last Active</TableHead>
                    <TableHead className="text-gray-400">Projects</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeamMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-800/50 border-gray-800">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={member.avatar || undefined} />
                            <AvatarFallback className="bg-blue-700">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            member.role === "Admin"
                              ? "border-blue-500 text-blue-400"
                              : member.role === "Project Manager"
                                ? "border-green-500 text-green-400"
                                : "border-gray-500 text-gray-400"
                          }
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.status === "active" ? (
                          <Badge className="bg-green-600">Active</Badge>
                        ) : member.status === "invited" ? (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                            Invited
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(member.lastActive)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.projects.map((project, index) => (
                            <Badge key={index} variant="outline" className="border-gray-700 text-gray-400">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-700"
                              onClick={() => handleEditMember(member)}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-500 hover:bg-gray-700 hover:text-red-400"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription className="text-gray-400">
                Manage invitations that have been sent but not yet accepted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-6 text-gray-400">No pending invitations.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800/50 border-gray-800">
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Role</TableHead>
                      <TableHead className="text-gray-400">Invited By</TableHead>
                      <TableHead className="text-gray-400">Invited On</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id} className="hover:bg-gray-800/50 border-gray-800">
                        <TableCell className="font-medium">{invitation.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            {invitation.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{invitation.invitedBy}</TableCell>
                        <TableCell>{formatDate(invitation.invitedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                              onClick={() => handleResendInvitation(invitation.id)}
                            >
                              Resend
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 bg-gray-800 border-red-700 text-red-500 hover:bg-red-900/30"
                              onClick={() => handleCancelInvitation(invitation.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription className="text-gray-400">Recent activity related to team management.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-800">
                    <Avatar className="mt-0.5">
                      <AvatarFallback className="bg-blue-700">
                        {item.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">{item.user}</span>{" "}
                        <span className="text-gray-400">{item.action}</span>{" "}
                        <span className="font-medium">
                          {item.targetType === "email" ? (
                            <span className="text-blue-400">{item.target}</span>
                          ) : (
                            item.target
                          )}
                        </span>{" "}
                        {item.details && <span className="text-gray-400">{item.details}</span>}
                      </p>
                      <p className="text-sm text-gray-400">{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Team Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send an invitation to join your team. They'll receive an email with instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                className="bg-gray-800 border-gray-700 text-white"
                value={newInvite.email}
                onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newInvite.role} onValueChange={(value) => setNewInvite({ ...newInvite, role: value })}>
                <SelectTrigger id="role" className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="send-copy"
                checked={newInvite.sendCopy}
                onCheckedChange={(checked) => setNewInvite({ ...newInvite, sendCopy: checked })}
              />
              <Label htmlFor="send-copy">Send me a copy of the invitation</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update role and permissions for {currentMember?.name}.
            </DialogDescription>
          </DialogHeader>
          {currentMember && (
            <div className="space-y-4 py-2">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
                <Avatar>
                  <AvatarFallback className="bg-blue-700">
                    {currentMember.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentMember.name}</div>
                  <div className="text-sm text-gray-400">{currentMember.email}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={currentMember.role}
                  onValueChange={(value) => setCurrentMember({ ...currentMember, role: value })}
                >
                  <SelectTrigger id="edit-role" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="font-medium flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-blue-400" />
                  Permissions
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-team" className="cursor-pointer">
                      Manage Team Members
                    </Label>
                    <Switch
                      id="manage-team"
                      checked={currentMember.permissions?.manageTeam || false}
                      onCheckedChange={(checked) =>
                        setCurrentMember({
                          ...currentMember,
                          permissions: { ...(currentMember.permissions || {}), manageTeam: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-projects" className="cursor-pointer">
                      Manage Projects
                    </Label>
                    <Switch
                      id="manage-projects"
                      checked={currentMember.permissions?.manageProjects || false}
                      onCheckedChange={(checked) =>
                        setCurrentMember({
                          ...currentMember,
                          permissions: { ...(currentMember.permissions || {}), manageProjects: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manage-invoices" className="cursor-pointer">
                      Manage Invoices
                    </Label>
                    <Switch
                      id="manage-invoices"
                      checked={currentMember.permissions?.manageInvoices || false}
                      onCheckedChange={(checked) =>
                        setCurrentMember({
                          ...currentMember,
                          permissions: { ...(currentMember.permissions || {}), manageInvoices: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="view-reports" className="cursor-pointer">
                      View Reports
                    </Label>
                    <Switch
                      id="view-reports"
                      checked={currentMember.permissions?.viewReports || false}
                      onCheckedChange={(checked) =>
                        setCurrentMember({
                          ...currentMember,
                          permissions: { ...(currentMember.permissions || {}), viewReports: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setIsEditMemberDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveMemberChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
