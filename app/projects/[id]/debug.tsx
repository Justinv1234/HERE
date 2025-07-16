"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { AppLayout } from "@/components/layout/app-layout"
import Link from "next/link"

export default function ProjectDebugPage({ params }: { params: { id: string } }) {
  const projectId = Number.parseInt(params.id)
  const [isLoading, setIsLoading] = useState(true)
  const [dbHealth, setDbHealth] = useState<any>(null)
  const [projectDebug, setProjectDebug] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, business } = useAuth()

  useEffect(() => {
    async function checkDbHealth() {
      try {
        const res = await fetch("/api/health/db")
        const data = await res.json()
        setDbHealth(data)
      } catch (err) {
        setDbHealth({ status: "error", message: err.message })
      }
    }

    checkDbHealth()
  }, [])

  useEffect(() => {
    if (!business) {
      console.log("No business context yet, waiting...")
      return
    }

    async function fetchProjectDebug() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/businesses/${business.id}/projects/${projectId}/debug`)
        const data = await res.json()
        setProjectDebug(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectDebug()
  }, [projectId, business])

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Project Debug</h1>
        <p className="text-gray-400 mt-2">Debugging information for project ID: {projectId}</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Database Health Check</CardTitle>
          </CardHeader>
          <CardContent>
            {dbHealth ? (
              <div>
                <div className="flex items-center mb-4">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${dbHealth.status === "ok" ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="font-medium">{dbHealth.status === "ok" ? "Connected" : "Connection Failed"}</span>
                </div>
                <pre className="bg-gray-800 p-4 rounded overflow-auto text-sm">{JSON.stringify(dbHealth, null, 2)}</pre>
              </div>
            ) : (
              <div className="animate-pulse">Checking database connection...</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>Project Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse">Loading project debug information...</div>
            ) : error ? (
              <div className="text-red-400">
                <p className="mb-2">Error: {error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : (
              <pre className="bg-gray-800 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(projectDebug, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button asChild>
            <Link href={`/projects/${projectId}`}>Back to Project</Link>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Debug Info
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
