"use client"

import { format } from "date-fns"
import { MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDuration } from "@/lib/format-time"

interface TimeEntriesTableProps {
  entries: any[]
  onDeleteEntry: (id: number) => void
  onEditEntry: (entry: any) => void
  onUpdateStatus: (id: number, status: string) => void
  onToggleBillable: (id: number) => void
}

export function TimeEntriesTable({
  entries,
  onDeleteEntry,
  onEditEntry,
  onUpdateStatus,
  onToggleBillable,
}: TimeEntriesTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="rounded-md border border-gray-800 bg-gray-900">
      {entries.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No time entries found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Project</TableHead>
              <TableHead className="text-gray-400">Task</TableHead>
              <TableHead className="text-gray-400">Description</TableHead>
              <TableHead className="text-gray-400">Duration</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Billable</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="border-gray-800 hover:bg-gray-800/50">
                <TableCell className="font-medium">
                  {format(new Date(entry.started_at), "MMM d, yyyy")}
                  <div className="text-xs text-gray-400">
                    {format(new Date(entry.started_at), "h:mm a")} - {format(new Date(entry.ended_at), "h:mm a")}
                  </div>
                </TableCell>
                <TableCell>{entry.project_name}</TableCell>
                <TableCell>{entry.task_title}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{formatDuration(entry.duration)}</TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`billable-${entry.id}`}
                      checked={entry.billable}
                      onCheckedChange={() => onToggleBillable(entry.id)}
                    />
                    <Label htmlFor={`billable-${entry.id}`} className="sr-only">
                      Billable
                    </Label>
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
                      <DropdownMenuItem className="cursor-pointer hover:bg-gray-700" onClick={() => onEditEntry(entry)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-gray-700"
                        onClick={() => onDeleteEntry(entry.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-gray-700"
                        onClick={() => onUpdateStatus(entry.id, "approved")}
                      >
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-gray-700"
                        onClick={() => onUpdateStatus(entry.id, "rejected")}
                      >
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
