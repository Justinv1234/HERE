"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("Form submitted!")

    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Form data:", { email, password: password ? "***" : "empty" })

    if (!email || !password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      console.log("Making API call to /api/auth/login")

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      console.log("API response status:", response.status)
      console.log("API response headers:", Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log("API response data:", data)

      if (response.ok && data.success) {
        setSuccess("Login successful! Redirecting...")
        console.log("Login successful, redirecting to dashboard")

        // Small delay to show success message
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1000)
      } else {
        setError(data.message || "Login failed")
        console.error("Login failed:", data.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Sign In</CardTitle>
        <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your email"
              disabled={isLoading}
              defaultValue="test@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your password"
              disabled={isLoading}
              defaultValue="password123"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Don't have an account?{" "}
            <Link href="/get-started" className="text-primary hover:underline">
              Get Started
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
