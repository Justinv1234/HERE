"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Clock, CreditCard, Layout, ListChecks, Menu, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      href: "/projects",
      label: "Projects",
      icon: <ListChecks className="h-5 w-5" />,
    },
    {
      href: "/time-tracking",
      label: "Time Tracking",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      href: "/team",
      label: "Team",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/invoices",
      label: "Invoices",
      icon: <CreditCard className="h-5 w-5" />,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black border-gray-800 text-white p-0">
        <div className="flex items-center border-b border-gray-800 px-4 py-3">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Layout className="h-5 w-5" />
            <span className="font-bold">TaskFlow</span>
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <nav className="grid gap-2 p-4 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                pathname === route.href ? "bg-gray-800 text-white" : "hover:bg-gray-800"
              }`}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
