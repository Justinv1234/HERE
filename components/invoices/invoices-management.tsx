"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus, Search, Download, FileText, MoreHorizontal, CheckCircle, Clock, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false)
  const [isViewInvoiceOpen, setIsViewInvoiceOpen] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    project: "",
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    items: [{ description: "", hours: 0, rate: 0, amount: 0 }],
  })

  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch invoices
        const invoicesRes = await fetch("/api/invoices", {
          credentials: "include",
        })
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json()
          setInvoices(invoicesData)
        }

        // Fetch clients
        const clientsRes = await fetch("/api/clients", {
          credentials: "include",
        })
        if (clientsRes.ok) {
          const clientsData = await clientsRes.json()
          setClients(clientsData)
        }

        // Fetch projects
        const projectsRes = await fetch("/api/projects", {
          credentials: "include",
        })
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData)
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

  // Filter invoices based on search query and status filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.project_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalPaid = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0)

  const totalPending = invoices
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0)

  const totalOverdue = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + (invoice.amount || 0), 0)

  // Handle viewing an invoice
  const handleViewInvoice = (invoice: any) => {
    setCurrentInvoice(invoice)
    setIsViewInvoiceOpen(true)
  }

  // Handle creating a new invoice
  const handleCreateInvoice = async () => {
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newInvoice),
      })

      if (response.ok) {
        const createdInvoice = await response.json()
        setInvoices([createdInvoice, ...invoices])

        // Reset form
        setNewInvoice({
          client: "",
          project: "",
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          items: [{ description: "", hours: 0, rate: 0, amount: 0 }],
        })

        setIsCreateInvoiceOpen(false)
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
    }
  }

  // Handle adding an item to the invoice
  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: "", hours: 0, rate: 0, amount: 0 }],
    })
  }

  // Handle updating an item in the invoice
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newInvoice.items]

    // Update the specified field
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }

    // If hours or rate changed, recalculate amount
    if (field === "hours" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].hours * updatedItems[index].rate
    }

    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
    })
  }

  // Handle removing an item from the invoice
  const handleRemoveItem = (index: number) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index)
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
    })
  }

  // Handle updating invoice status
  const handleUpdateStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setInvoices(
          invoices.map((invoice) =>
            invoice.id === invoiceId
              ? {
                  ...invoice,
                  status: newStatus,
                  paid_date: newStatus === "paid" ? new Date() : invoice.paid_date,
                }
              : invoice,
          ),
        )
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-600 flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-400 flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="flex items-center">
            <AlertCircle className="mr-1 h-3 w-3" />
            Overdue
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-400 flex items-center">
            <FileText className="mr-1 h-3 w-3" />
            Draft
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreateInvoiceOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Paid</CardTitle>
            <div className="text-2xl font-bold text-green-400">{formatCurrency(totalPaid)}</div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400">
              {invoices.filter((invoice) => invoice.status === "paid").length} invoices
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
            <div className="text-2xl font-bold text-yellow-400">{formatCurrency(totalPending)}</div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400">
              {invoices.filter((invoice) => invoice.status === "pending").length} invoices
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Overdue</CardTitle>
            <div className="text-2xl font-bold text-red-400">{formatCurrency(totalOverdue)}</div>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-400">
              {invoices.filter((invoice) => invoice.status === "overdue").length} invoices
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Invoices</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8 bg-gray-800 border-gray-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
              <p className="text-gray-400 mb-4">Create your first invoice to get started.</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsCreateInvoiceOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-800/50 border-gray-800">
                  <TableHead className="text-gray-400">Invoice</TableHead>
                  <TableHead className="text-gray-400">Client</TableHead>
                  <TableHead className="text-gray-400">Project</TableHead>
                  <TableHead className="text-gray-400">Issue Date</TableHead>
                  <TableHead className="text-gray-400">Due Date</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-800/50 border-gray-800">
                    <TableCell className="font-medium">{invoice.invoice_number || invoice.id}</TableCell>
                    <TableCell>{invoice.client_name}</TableCell>
                    <TableCell>{invoice.project_name}</TableCell>
                    <TableCell>{format(new Date(invoice.issue_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(invoice.due_date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
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
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-700">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuLabel>Status</DropdownMenuLabel>
                          {invoice.status !== "paid" && (
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-700"
                              onClick={() => handleUpdateStatus(invoice.id, "paid")}
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-400" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new invoice for your client. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select
                  value={newInvoice.client}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, client: value })}
                >
                  <SelectTrigger id="client" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select
                  value={newInvoice.project}
                  onValueChange={(value) => setNewInvoice({ ...newInvoice, project: value })}
                >
                  <SelectTrigger id="project" className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Invoice Items</h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={handleAddItem}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 md:col-span-5">
                      <Input
                        placeholder="Description"
                        className="bg-gray-800 border-gray-700 text-white"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, "description", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input
                        type="number"
                        placeholder="Hours"
                        className="bg-gray-800 border-gray-700 text-white"
                        value={item.hours || ""}
                        onChange={(e) => handleUpdateItem(index, "hours", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-4 md:col-span-2">
                      <Input
                        type="number"
                        placeholder="Rate"
                        className="bg-gray-800 border-gray-700 text-white"
                        value={item.rate || ""}
                        onChange={(e) => handleUpdateItem(index, "rate", Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-3 md:col-span-2 font-medium">{formatCurrency(item.amount)}</div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-gray-800"
                        onClick={() => handleRemoveItem(index)}
                        disabled={newInvoice.items.length === 1}
                      >
                        <span className="sr-only">Remove</span>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-800">
                <div className="space-y-1 text-right">
                  <div className="text-sm text-gray-400">Total Amount</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(newInvoice.items.reduce((sum, item) => sum + item.amount, 0))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => setIsCreateInvoiceOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateInvoice}>
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={isViewInvoiceOpen} onOpenChange={setIsViewInvoiceOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          {currentInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">
                    Invoice {currentInvoice.invoice_number || currentInvoice.id}
                  </DialogTitle>
                  {getStatusBadge(currentInvoice.status)}
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">From</h3>
                    <div className="mt-1">
                      <div className="font-medium">Your Business Name</div>
                      <div className="text-sm text-gray-400">123 Business St</div>
                      <div className="text-sm text-gray-400">San Francisco, CA 94107</div>
                      <div className="text-sm text-gray-400">contact@yourbusiness.com</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">To</h3>
                    <div className="mt-1">
                      <div className="font-medium">{currentInvoice.client_name}</div>
                      <div className="text-sm text-gray-400">{currentInvoice.client_email}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Details</h3>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Invoice Number:</span>
                        <span>{currentInvoice.invoice_number || currentInvoice.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Project:</span>
                        <span>{currentInvoice.project_name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Issue Date:</span>
                        <span>{format(new Date(currentInvoice.issue_date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Due Date:</span>
                        <span>{format(new Date(currentInvoice.due_date), "MMM d, yyyy")}</span>
                      </div>
                      {currentInvoice.paid_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Paid Date:</span>
                          <span>{format(new Date(currentInvoice.paid_date), "MMM d, yyyy")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="text-center py-4">
                    <p className="text-gray-400">Invoice details will be displayed here</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <div className="space-y-1 text-right">
                    <div className="text-sm text-gray-400">Total Amount</div>
                    <div className="text-2xl font-bold">{formatCurrency(currentInvoice.amount)}</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    onClick={() => setIsViewInvoiceOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
