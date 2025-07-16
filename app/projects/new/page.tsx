"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function NewProjectPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    // Add the date to the form data if selected
    if (date) {
      formData.set("due_date", date.toISOString())
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create project")
      }

      const data = await response.json()
      router.push(`/projects/${data.id}`)
    } catch (err) {
      console.error("Error creating project:", err)
      setError(err instanceof Error ? err.message : "Failed to create project")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 bg-black text-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Create New Project</CardTitle>
            <CardDescription className="text-gray-400">Fill in the details for your new project</CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-4 bg-red-900 text-red-100 rounded-md">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-white">
                  Project Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter project name"
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-white">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter project description"
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      fromDate={new Date()}
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" asChild className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                  <Link href="/projects">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
