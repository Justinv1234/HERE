"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Download, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InvoiceManagementProps {
  timeEntries: any[]
  projects: any[]
  clients: any[]
}

export function InvoiceManagement({ timeEntries, projects, clients }: InvoiceManagementProps) {
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  // Filter entries based on selections
  const filteredEntries = timeEntries.filter((entry) => {
    // Filter by date range
    const entryDate = new Date(entry.started_at)
    const isInDateRange =
      (!dateRange.from || entryDate >= dateRange.from) && (!dateRange.to || entryDate <= dateRange.to)

    // Filter by project
    const matchesProject = !selectedProject || entry.project_id.toString() === selectedProject

    return isInDateRange && matchesProject
  })

  // Calculate totals
  const totalHours = filteredEntries.reduce((total, entry) => total + entry.duration / 3600, 0)
  const totalAmount = filteredEntries.reduce((total, entry) => {
    const project = projects.find((p) => p.id === entry.project_id)
    const hourlyRate = project ? project.hourlyRate : 0
    return total + (entry.duration / 3600) * hourlyRate
  }, 0)

  const handleCreateInvoice = () => {
    // In a real app, this would create and save an invoice
    alert("Invoice created successfully!")
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg">Manage Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Client</label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name} (${project.hourlyRate}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white",
                      !dateRange.from && !dateRange.to && "text-gray-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange as any}
                    numberOfMonths={2}
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Total Hours: {totalHours.toFixed(2)}</div>
              <div className="text-lg font-medium">Total Amount: ${totalAmount.toFixed(2)}</div>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateInvoice}
              disabled={filteredEntries.length === 0}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Billable Time Entries</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              disabled={filteredEntries.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              No billable time entries found for the selected criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Project</TableHead>
                  <TableHead className="text-gray-400">Description</TableHead>
                  <TableHead className="text-gray-400">User</TableHead>
                  <TableHead className="text-gray-400 text-right">Hours</TableHead>
                  <TableHead className="text-gray-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const project = projects.find((p) => p.id === entry.project_id)
                  const hourlyRate = project ? project.hourlyRate : 0
                  const hours = entry.duration / 3600
                  const amount = hours * hourlyRate

                  return (
                    <TableRow key={entry.id} className="border-gray-800">
                      <TableCell className="font-medium">{format(new Date(entry.started_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>{entry.project_name}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.user_name}</TableCell>
                      <TableCell className="text-right">{hours.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
