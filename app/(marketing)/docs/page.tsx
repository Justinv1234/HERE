import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Documentation | TaskFlow",
  description: "Learn how to use TaskFlow with our comprehensive documentation.",
}

export default function DocsPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Documentation</h1>
        <p className="mt-6 text-xl text-gray-400">
          Learn how to use TaskFlow with our comprehensive guides and tutorials.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {docCategories.map((category) => (
          <Card key={category.title} className="border-gray-800 bg-black/50 backdrop-blur">
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.articles.map((article) => (
                  <li key={article.title}>
                    <Link href={article.href} className="text-blue-500 hover:text-blue-400 hover:underline">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="mb-8 text-center text-3xl font-bold">Video Tutorials</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {videoTutorials.map((video) => (
            <div key={video.title} className="overflow-hidden rounded-lg border border-gray-800">
              <div className="aspect-video bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                      <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{video.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-black/50 p-8 backdrop-blur">
          <h2 className="text-2xl font-bold">Community Support</h2>
          <p className="mt-2 text-gray-400">Get help from the TaskFlow community and our support team.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/community">
              <Button variant="outline">Community Forum</Button>
            </Link>
            <Link href="/support">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const docCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of TaskFlow",
    articles: [
      { title: "Introduction to TaskFlow", href: "/docs/introduction" },
      { title: "Creating your account", href: "/docs/creating-account" },
      { title: "Setting up your first project", href: "/docs/first-project" },
      { title: "Inviting team members", href: "/docs/inviting-team" },
      { title: "TaskFlow interface overview", href: "/docs/interface-overview" },
    ],
  },
  {
    title: "Project Management",
    description: "Manage projects and tasks effectively",
    articles: [
      { title: "Creating and organizing projects", href: "/docs/creating-projects" },
      { title: "Managing tasks and subtasks", href: "/docs/managing-tasks" },
      { title: "Setting deadlines and milestones", href: "/docs/deadlines" },
      { title: "Assigning tasks to team members", href: "/docs/assigning-tasks" },
      { title: "Using project templates", href: "/docs/project-templates" },
    ],
  },
  {
    title: "Time Tracking",
    description: "Track time efficiently",
    articles: [
      { title: "Using the time tracker", href: "/docs/time-tracker" },
      { title: "Manual time entries", href: "/docs/manual-time" },
      { title: "Time reports and analytics", href: "/docs/time-reports" },
      { title: "Team time tracking", href: "/docs/team-time" },
      { title: "Exporting time data", href: "/docs/exporting-time" },
    ],
  },
  {
    title: "Team Collaboration",
    description: "Work effectively with your team",
    articles: [
      { title: "Team roles and permissions", href: "/docs/team-roles" },
      { title: "Team communication", href: "/docs/team-communication" },
      { title: "Activity feed and notifications", href: "/docs/activity-feed" },
      { title: "Managing team workload", href: "/docs/team-workload" },
      { title: "Team performance reports", href: "/docs/team-performance" },
    ],
  },
  {
    title: "Invoice Management",
    description: "Organize and track invoices",
    articles: [
      { title: "Managing invoice records", href: "/docs/creating-invoices" },
      { title: "Invoice customization", href: "/docs/invoice-customization" },
      { title: "Managing clients", href: "/docs/managing-clients" },
      { title: "Payment tracking", href: "/docs/payment-tracking" },
      { title: "Exporting invoices", href: "/docs/exporting-invoices" },
    ],
  },
  {
    title: "Account & Settings",
    description: "Manage your account and preferences",
    articles: [
      { title: "Profile settings", href: "/docs/profile-settings" },
      { title: "Notification preferences", href: "/docs/notifications" },
      { title: "Security and 2FA", href: "/docs/security" },
      { title: "Billing and subscription", href: "/docs/billing" },
    ],
  },
]

const videoTutorials = [
  {
    title: "Getting Started with TaskFlow",
    duration: "5:32",
    thumbnail: "/project-management-dashboard.png",
  },
  {
    title: "Advanced Project Management",
    duration: "8:47",
    thumbnail: "/project-management-kanban-board.png",
  },
  {
    title: "Time Tracking Essentials",
    duration: "6:15",
    thumbnail: "/time-tracking-dashboard.png",
  },
  {
    title: "Creating and Managing Invoices",
    duration: "7:23",
    thumbnail: "/placeholder-mdgll.png",
  },
]
