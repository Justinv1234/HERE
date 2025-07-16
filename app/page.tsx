import Link from "next/link"
import { ArrowRight, BarChart3, Clock, CreditCard, Layout, ListChecks, Users } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 14l2 2 4-4" />
              </svg>
              TaskFlow
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/features" className="text-sm font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-sm font-medium">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm font-medium">
                Documentation
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium">
              Login
            </Link>
            <Button asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Manage Projects Smarter with AI
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                TaskFlow helps you organize tasks, track time, and collaborate with your team. Our AI assistant makes
                project management effortless.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/get-started">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">View Demo</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg border bg-background shadow-xl">
                <Image
                  src="/project-management-dashboard.png"
                  width={800}
                  height={600}
                  alt="TaskFlow Dashboard"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your projects efficiently
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <ListChecks className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Create, assign, and track tasks with ease. Set priorities and deadlines.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Time Tracking</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Track time spent on tasks and projects. Generate detailed reports.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Team Collaboration</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Work together with your team. Share files and communicate in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <BarChart3 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get insights into your productivity and project progress with detailed analytics.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CreditCard className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Invoicing</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Manage invoices, track payments, and organize billing information efficiently.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">AI</span>
                </div>
                <h3 className="text-xl font-bold">AI Assistant</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get smart suggestions for task prioritization and time estimation.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pricing Plans</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that fits your needs
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card className="flex flex-col rounded-lg border p-6 shadow-sm">
                <h3 className="text-2xl font-bold">Freelancer</h3>
                <div className="my-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400 mb-6">Perfect for individual professionals</p>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Up to 5 projects
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Basic time tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Task management
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Email support
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Mobile app access
                  </li>
                </ul>
                <Button className="mt-auto bg-transparent" variant="outline" asChild>
                  <Link href="/get-started">Get Started</Link>
                </Button>
              </Card>
              <Card className="flex flex-col rounded-lg border p-6 shadow-sm relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold">Team</h3>
                <div className="my-6">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400 mb-6">For small to medium teams</p>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Unlimited projects
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Advanced time tracking
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    File sharing
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Custom reports
                  </li>
                </ul>
                <Button className="mt-auto" asChild>
                  <Link href="/get-started">Get Started</Link>
                </Button>
              </Card>
              <Card className="flex flex-col rounded-lg border p-6 shadow-sm">
                <h3 className="text-2xl font-bold">Business</h3>
                <div className="my-6">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400 mb-6">For larger organizations</p>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Everything in Team
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    API access
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Dedicated support
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    Custom branding
                  </li>
                </ul>
                <Button className="mt-auto bg-transparent" variant="outline" asChild>
                  <Link href="/get-started">Get Started</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of teams already using TaskFlow to manage their projects more efficiently.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/get-started">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Layout className="h-6 w-6" />
            <p className="text-sm font-medium">TaskFlow</p>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">© 2025 TaskFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
