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
import { register } from "@/app/actions/auth"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Building2, Users, User } from "lucide-react"

type PlanType = "business" | "team" | "freelancer"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState<PlanType>("freelancer")
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    formData.append("plan", plan)

    try {
      const result = await register(formData)

      if (result?.success === false) {
        setError(result.message || "Registration failed")
      } else if (result?.success === true) {
        // Registration successful, redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Signup form error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Create Account</CardTitle>
        <CardDescription className="text-gray-400">Enter your information to create your account</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your full name"
            />
          </div>
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
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Select Plan</Label>
            <RadioGroup
              defaultValue="freelancer"
              value={plan}
              onValueChange={(value) => setPlan(value as PlanType)}
              className="grid grid-cols-3 gap-4"
            >
              <div
                className={`flex flex-col items-center space-y-2 rounded-md border p-4 ${plan === "freelancer" ? "border-primary bg-gray-800" : "border-gray-700"}`}
              >
                <RadioGroupItem value="freelancer" id="freelancer" className="sr-only" />
                <User className={`h-6 w-6 ${plan === "freelancer" ? "text-primary" : "text-gray-400"}`} />
                <Label
                  htmlFor="freelancer"
                  className={`font-normal ${plan === "freelancer" ? "text-primary" : "text-gray-400"}`}
                >
                  Freelancer
                </Label>
              </div>

              <div
                className={`flex flex-col items-center space-y-2 rounded-md border p-4 ${plan === "team" ? "border-primary bg-gray-800" : "border-gray-700"}`}
              >
                <RadioGroupItem value="team" id="team" className="sr-only" />
                <Users className={`h-6 w-6 ${plan === "team" ? "text-primary" : "text-gray-400"}`} />
                <Label htmlFor="team" className={`font-normal ${plan === "team" ? "text-primary" : "text-gray-400"}`}>
                  Team
                </Label>
              </div>

              <div
                className={`flex flex-col items-center space-y-2 rounded-md border p-4 ${plan === "business" ? "border-primary bg-gray-800" : "border-gray-700"}`}
              >
                <RadioGroupItem value="business" id="business" className="sr-only" />
                <Building2 className={`h-6 w-6 ${plan === "business" ? "text-primary" : "text-gray-400"}`} />
                <Label
                  htmlFor="business"
                  className={`font-normal ${plan === "business" ? "text-primary" : "text-gray-400"}`}
                >
                  Business
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional fields based on plan */}
          {plan === "business" && (
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your company name"
              />
            </div>
          )}

          {plan === "business" && (
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-white">
                Industry
              </Label>
              <Input
                id="industry"
                name="industry"
                type="text"
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your industry"
              />
            </div>
          )}

          {plan === "team" && (
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-white">
                Team Name
              </Label>
              <Input
                id="teamName"
                name="teamName"
                type="text"
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your team name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Create a password (min 8 characters)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Confirm your password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
