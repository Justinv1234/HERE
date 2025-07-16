"use client"

import { useState, useEffect } from "react"
import { ReportsView } from "@/components/reports/reports-view"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { getMockReportsData } from "@/lib/reports"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function ReportsClient() {
  const { user, business, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reportsData, setReportsData] = useState(null)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use mock data for now since the real API endpoints might not exist
      console.log("Loading reports data...")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const data = getMockReportsData()
      setReportsData(data)
      console.log("Reports data loaded successfully")
    } catch (error) {
      console.error("Failed to load reports data:", error)
      setError(error instanceof Error ? error.message : "Failed to load reports data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Wait for auth to finish loading
    if (!authLoading) {
      loadData()
    }
  }, [authLoading])

  if (authLoading || loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-6 md:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading reports</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadData}>Retry</Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>Please log in to view reports.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Business:</strong> {business?.name || "Default Business"} |<strong> User:</strong> {user.name} (
          {user.email})
        </p>
      </div>
      <ReportsView data={reportsData} />
    </div>
  )
}
