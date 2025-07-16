"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Clock, CreditCard, Home, LayoutDashboard, ListChecks, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface AppSidebarProps {
  defaultOpen?: boolean
}

export function AppSidebar({ defaultOpen = true }: AppSidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Projects",
      icon: ListChecks,
      href: "/projects",
      active: pathname === "/projects" || pathname?.startsWith("/projects/"),
    },
    {
      label: "Time Tracking",
      icon: Clock,
      href: "/time-tracking",
      active: pathname === "/time-tracking",
    },
    {
      label: "Team",
      icon: Users,
      href: "/team",
      active: pathname === "/team",
    },
    {
      label: "Invoices",
      icon: CreditCard,
      href: "/invoices",
      active: pathname === "/invoices",
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/reports",
      active: pathname === "/reports",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-6 w-6" />
          <span className={cn("text-lg font-bold", isMobile ? "sr-only" : "")}>TaskFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route, index) => (
            <Button key={index} asChild variant={route.active ? "secondary" : "ghost"} className="justify-start">
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
