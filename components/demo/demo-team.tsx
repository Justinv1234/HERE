"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DemoTeam() {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Designer",
      status: "active",
      avatar: "/abstract-letter-aj.png",
      projects: ["Website Redesign", "Marketing Campaign"],
      tasksCompleted: 24,
      hoursLogged: 87,
    },
    {
      id: 2,
      name: "Sam Wilson",
      email: "sam@example.com",
      role: "Developer",
      status: "active",
      avatar: "/stylized-sw.png",
      projects: ["Mobile App Development", "Website Redesign"],
      tasksCompleted: 18,
      hoursLogged: 65,
    },
    {
      id: 3,
      name: "Jamie Smith",
      email: "jamie@example.com",
      role: "Marketing Specialist",
      status: "active",
      avatar: "/javascript-code.png",
      projects: ["Marketing Campaign"],
      tasksCompleted: 12,
      hoursLogged: 42,
    },
    {
      id: 4,
      name: "Taylor Brown",
      email: "taylor@example.com",
      role: "Backend Developer",
      status: "inactive",
      avatar: "/abstract-geometric-tb.png",
      projects: ["Mobile App Development"],
      tasksCompleted: 8,
      hoursLogged: 28,
    },
  ])

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Team Member",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("members")

  const handleAddMember = () => {
    const member = {
      id: teamMembers.length + 1,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: "active",
      avatar: `/placeholder.svg?height=40&width=40&query=${newMember.name
        .split(" ")
        .map((n) => n[0])
        .join("")}`,
      projects: [],
      tasksCompleted: 0,
      hoursLogged: 0,
    }

    setTeamMembers([...teamMembers, member])
    setNewMember({
      name: "",
      email: "",
      role: "Team Member",
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team</h2>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>Add a new member to your team.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Team Member">Team Member</SelectItem>
                      <SelectItem value="Designer">Designer</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Marketing Specialist">Marketing Specialist</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Invite Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{member.name}</CardTitle>
                        <CardDescription>{member.email}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Project</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Remove from Team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{member.role}</Badge>
                      <Badge variant={member.status === "active" ? "success" : "secondary"}>
                        {member.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Projects</div>
                      <div className="flex flex-wrap gap-2">
                        {member.projects.length > 0 ? (
                          member.projects.map((project, index) => (
                            <Badge key={index} variant="secondary">
                              {project}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No projects assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="flex w-full justify-between text-sm text-muted-foreground">
                    <div>Tasks: {member.tasksCompleted}</div>
                    <div>Hours: {member.hoursLogged}</div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Permissions</CardTitle>
              <CardDescription>Manage access levels for team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 items-center p-4 font-medium">
                    <div>Role</div>
                    <div className="text-center">View Projects</div>
                    <div className="text-center">Edit Projects</div>
                    <div className="text-center">Manage Team</div>
                    <div className="text-center">Billing Access</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 items-center p-4">
                      <div className="font-medium">Admin</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-4">
                      <div className="font-medium">Project Manager</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">-</div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-4">
                      <div className="font-medium">Developer</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">-</div>
                      <div className="text-center">-</div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-4">
                      <div className="font-medium">Designer</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">-</div>
                      <div className="text-center">-</div>
                    </div>
                    <div className="grid grid-cols-5 items-center p-4">
                      <div className="font-medium">Team Member</div>
                      <div className="text-center">✓</div>
                      <div className="text-center">-</div>
                      <div className="text-center">-</div>
                      <div className="text-center">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Custom Role
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
