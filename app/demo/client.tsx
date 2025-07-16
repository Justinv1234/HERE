"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoProjects } from "@/components/demo/demo-projects"
import { DemoTasks } from "@/components/demo/demo-tasks"
import { DemoTimeTracking } from "@/components/demo/demo-time-tracking"
import { DemoTeam } from "@/components/demo/demo-team"
import { DemoInvoices } from "@/components/demo/demo-invoices"
import { getMockReportsData } from "@/lib/reports"

export function DemoClient() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("projects")
  const [showTour, setShowTour] = useState(true)
  const [currentTourStep, setCurrentTourStep] = useState(0)

  // Get mock data for reports
  const mockReportsData = getMockReportsData()

  const tourSteps = [
    {
      title: "Welcome to TaskFlow",
      description:
        "This demo will guide you through the key features of TaskFlow. Let's start with Projects management.",
      target: "projects",
    },
    {
      title: "Task Management",
      description:
        "Create, assign, and track tasks for your projects. Set priorities, due dates, and monitor progress.",
      target: "tasks",
    },
    {
      title: "Time Tracking",
      description: "Track time spent on tasks and projects. Generate reports and invoices based on tracked time.",
      target: "time-tracking",
    },
    {
      title: "Team Management",
      description: "Manage your team members, assign roles, and track their productivity.",
      target: "team",
    },
    {
      title: "Invoice Generation",
      description: "Create and manage invoices for your clients based on tracked time and fixed project fees.",
      target: "invoices",
    },
    {
      title: "Reports & Analytics",
      description: "Get insights into your business with detailed reports and analytics.",
      target: "reports",
    },
  ]

  useEffect(() => {
    // If tour is active, set the active tab based on the current tour step
    if (showTour && tourSteps[currentTourStep]) {
      setActiveTab(tourSteps[currentTourStep].target)
    }
  }, [currentTourStep, showTour, tourSteps])

  const handleNextStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(currentTourStep + 1)
    } else {
      setShowTour(false)
    }
  }

  const handlePrevStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(currentTourStep - 1)
    }
  }

  const handleSkipTour = () => {
    setShowTour(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">TaskFlow Demo</h1>
        <p className="text-muted-foreground">
          Explore the features of TaskFlow with this interactive demo. No signup required.
        </p>
      </div>

      {showTour && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle>{tourSteps[currentTourStep].title}</CardTitle>
            <CardDescription>{tourSteps[currentTourStep].description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <div>
              <Button variant="outline" onClick={handleSkipTour}>
                Skip Tour
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrevStep} disabled={currentTourStep === 0}>
                Previous
              </Button>
              <Button onClick={handleNextStep}>
                {currentTourStep < tourSteps.length - 1 ? "Next" : "Finish Tour"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <DemoProjects />
        </TabsContent>
        <TabsContent value="tasks">
          <DemoTasks />
        </TabsContent>
        <TabsContent value="time-tracking">
          <DemoTimeTracking />
        </TabsContent>
        <TabsContent value="team">
          <DemoTeam />
        </TabsContent>
        <TabsContent value="invoices">
          <DemoInvoices />
        </TabsContent>
        <TabsContent value="reports">
          {activeTab === "reports" && (
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Reports Available in Live App</h2>
              <p className="text-muted-foreground">
                Reports with real data are available when you sign up for the full application.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ready to streamline your workflow?</CardTitle>
          <CardDescription>
            Sign up for TaskFlow today and start managing your projects more efficiently.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/signup")}>Sign Up Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
