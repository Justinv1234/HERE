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
import { Building2, Users, User, ArrowRight, Check } from "lucide-react"

type PlanType = "business" | "team" | "freelancer"

export function GetStartedForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState<PlanType>("team")
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
      console.error("Get started form error:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    {
      id: "freelancer" as PlanType,
      name: "Freelancer",
      price: "$29/month",
      description: "Perfect for individual freelancers and solo entrepreneurs",
      icon: User,
    },
    {
      id: "team" as PlanType,
      name: "Team",
      price: "$79/month",
      description: "Ideal for small to medium teams that need collaboration",
      icon: Users,
      popular: true,
    },
    {
      id: "business" as PlanType,
      name: "Business",
      price: "$199/month",
      description: "For larger organizations with advanced requirements",
      icon: Building2,
    },
  ]

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-2xl">Choose Your Plan</CardTitle>
        <CardDescription className="text-gray-400">
          Select the plan that best fits your needs and create your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Plan Selection */}
          <div className="space-y-4">
            <Label className="text-white text-lg">Select Your Plan</Label>
            <div className="grid grid-cols-1 gap-4">
              {plans.map((planOption) => {
                const Icon = planOption.icon
                const isSelected = plan === planOption.id

                return (
                  <div
                    key={planOption.id}
                    className={`relative flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50"
                    }`}
                    onClick={() => setPlan(planOption.id)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-primary bg-primary" : "border-gray-400"
                      }`}
                    >
                      {isSelected && <Check className="w-2 h-2 text-white" />}
                    </div>
                    <Icon className="h-6 w-6 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {planOption.name} - {planOption.price}
                        </span>
                        {planOption.popular && (
                          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{planOption.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Email Address
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
            </div>
          </div>

          {/* Conditional fields based on plan */}
          {plan === "business" && (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="e.g., Technology, Marketing"
                  />
                </div>
              </div>
            </div>
          )}

          {plan === "team" && (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium">Team Information</h3>
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
            </div>
          )}

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-medium">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account & Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
