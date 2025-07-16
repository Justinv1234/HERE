"use client"

import { useState } from "react"
import { Calendar, Download, FileText, MoreHorizontal, Plus, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export function DemoInvoices() {
  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      client: "Acme Corp",
      project: "Website Redesign",
      amount: 2500,
      status: "paid",
      issueDate: "2023-11-01",
      dueDate: "2023-11-15",
      paidDate: "2023-11-10",
    },
    {
      id: "INV-002",
      client: "Globex Inc",
      project: "Mobile App Development",
      amount: 4800,
      status: "pending",
      issueDate: "2023-11-05",
      dueDate: "2023-11-20",
      paidDate: null,
    },
    {
      id: "INV-003",
      client: "Stark Industries",
      project: "Marketing Campaign",
      amount: 1200,
      status: "overdue",
      issueDate: "2023-10-15",
      dueDate: "2023-10-30",
      paidDate: null,
    },
    {
      id: "INV-004",
      client: "Wayne Enterprises",
      project: "Website Redesign",
      amount: 3200,
      status: "draft",
      issueDate: "2023-11-10",
      dueDate: "2023-11-25",
      paidDate: null,
    },
  ])

  const [newInvoice, setNewInvoice] = useState({
    client: "Acme Corp",
    project: "Website Redesign",
    amount: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleAddInvoice = () => {
    const invoice = {
      id: `INV-00  = useState("all")

  const handleAddInvoice = () => {
    const invoice = {
      id: \`INV-00${invoices.length + 1}`,
      client: newInvoice.client,
      project: newInvoice.project,
      amount: Number.parseFloat(newInvoice.amount),
      status: "draft",
      issueDate: newInvoice.issueDate,
      dueDate: newInvoice.dueDate,
      paidDate: null,
    }

    setInvoices([...invoices, invoice])
    setNewInvoice({
      client: "Acme Corp",
      project: "Website Redesign",
      amount: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
    setIsDialogOpen(false)
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true
    return invoice.status === activeTab
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>Create a new invoice for your client.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={newInvoice.client}
                    onValueChange={(value) => setNewInvoice({ ...newInvoice, client: value })}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                      <SelectItem value="Globex Inc">Globex Inc</SelectItem>
                      <SelectItem value="Stark Industries">Stark Industries</SelectItem>
                      <SelectItem value="Wayne Enterprises">Wayne Enterprises</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={newInvoice.project}
                    onValueChange={(value) => setNewInvoice({ ...newInvoice, project: value })}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={newInvoice.issueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddInvoice}>Create Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 items-center border-b p-4 font-medium">
                  <div>Invoice</div>
                  <div>Client</div>
                  <div>Project</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Due Date</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-7 items-center p-4">
                        <div className="font-medium">{invoice.id}</div>
                        <div>{invoice.client}</div>
                        <div>{invoice.project}</div>
                        <div>${invoice.amount.toLocaleString()}</div>
                        <div>{getStatusBadge(invoice.status)}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex justify-end">
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
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete Invoice</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <p className="text-center text-muted-foreground">No invoices found in this category.</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
