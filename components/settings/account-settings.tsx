"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const accountFormSchema = z.object({
  subscriptionPlan: z.enum(["free", "pro", "business"], {
    required_error: "You need to select a subscription plan.",
  }),
  emailUpdates: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  timezone: z.string({
    required_error: "Please select a timezone.",
  }),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], {
    required_error: "Please select a date format.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountSettings() {
  const { toast } = useToast()
  const [isDowngrading, setIsDowngrading] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // This would come from your API or auth provider
  const defaultValues: Partial<AccountFormValues> = {
    subscriptionPlan: "pro",
    emailUpdates: true,
    marketingEmails: false,
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
    // Show loading state
    const loadingToast = toast({
      title: "Updating account settings...",
      description: "Your account settings are being updated.",
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the toast with success message
    toast({
      id: loadingToast.id,
      title: "Account settings updated",
      description: "Your account settings have been updated successfully.",
      variant: "success",
    })

    // In a real app, you would update the account settings via an API call
    console.log("Account settings submitted:", data)
  }

  const handleUpgrade = async (plan: string) => {
    setIsUpgrading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsUpgrading(false)
    toast({
      title: "Subscription upgraded",
      description: `Your subscription has been upgraded to the ${plan} plan.`,
      variant: "success",
    })

    // Update the form value
    form.setValue("subscriptionPlan", plan as "pro" | "business")
  }

  const handleDowngrade = async (plan: string) => {
    setIsDowngrading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsDowngrading(false)
    toast({
      title: "Subscription downgraded",
      description: `Your subscription has been downgraded to the ${plan} plan.`,
      variant: "success",
    })

    // Update the form value
    form.setValue("subscriptionPlan", plan as "free" | "pro")
  }

  const handleCancelSubscription = async () => {
    setShowCancelConfirm(false)

    // Show loading state
    const loadingToast = toast({
      title: "Cancelling subscription...",
      description: "Your subscription is being cancelled.",
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update the toast with success message
    toast({
      id: loadingToast.id,
      title: "Subscription cancelled",
      description:
        "Your subscription has been cancelled successfully. You will have access until the end of your billing period.",
      variant: "success",
    })

    // Update the form value
    form.setValue("subscriptionPlan", "free")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">Manage your account settings and subscription plan.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Subscription Plan</h4>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className={form.watch("subscriptionPlan") === "free" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>For individuals just getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$0</p>
                <p className="text-muted-foreground">per month</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Up to 5 projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Basic task management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Limited time tracking
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {form.watch("subscriptionPlan") === "free" ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleDowngrade("free")}
                    disabled={isDowngrading}
                  >
                    {isDowngrading ? "Downgrading..." : "Downgrade"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className={form.watch("subscriptionPlan") === "pro" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For small teams and freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$19</p>
                <p className="text-muted-foreground">per month</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Advanced task management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Unlimited time tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Team collaboration
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {form.watch("subscriptionPlan") === "pro" ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : form.watch("subscriptionPlan") === "free" ? (
                  <Button className="w-full" onClick={() => handleUpgrade("pro")} disabled={isUpgrading}>
                    {isUpgrading ? "Upgrading..." : "Upgrade"}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleDowngrade("pro")}
                    disabled={isDowngrading}
                  >
                    {isDowngrading ? "Downgrading..." : "Downgrade"}
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className={form.watch("subscriptionPlan") === "business" ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <CardDescription>For larger teams and businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">$49</p>
                <p className="text-muted-foreground">per month</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Invoicing and billing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                    Advanced AI features
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {form.watch("subscriptionPlan") === "business" ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleUpgrade("business")} disabled={isUpgrading}>
                    {isUpgrading ? "Upgrading..." : "Upgrade"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {form.watch("subscriptionPlan") !== "free" && (
            <div className="mt-4 flex justify-end">
              <Button variant="link" className="text-destructive" onClick={() => setShowCancelConfirm(true)}>
                Cancel subscription
              </Button>
            </div>
          )}

          {showCancelConfirm && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Are you sure you want to cancel your subscription?</AlertTitle>
              <AlertDescription>
                You will lose access to premium features at the end of your billing period.
                <div className="mt-4 flex gap-4">
                  <Button variant="destructive" size="sm" onClick={handleCancelSubscription}>
                    Yes, cancel subscription
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCancelConfirm(false)}>
                    No, keep subscription
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                      <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Your timezone will be used for displaying dates and times.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Date Format</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="MM/DD/YYYY" />
                        </FormControl>
                        <FormLabel className="font-normal">MM/DD/YYYY (e.g., 12/31/2023)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="DD/MM/YYYY" />
                        </FormControl>
                        <FormLabel className="font-normal">DD/MM/YYYY (e.g., 31/12/2023)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="YYYY-MM-DD" />
                        </FormControl>
                        <FormLabel className="font-normal">YYYY-MM-DD (e.g., 2023-12-31)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Choose how dates should be displayed throughout the application.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>Receive email notifications about your account activity.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Marketing Emails</FormLabel>
                    <FormDescription>Receive emails about new features, tips, and promotions.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
