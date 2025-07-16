"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Mail, Smartphone } from "lucide-react"

const notificationFormSchema = z.object({
  // Email notifications
  emailTaskAssigned: z.boolean().default(true),
  emailTaskCompleted: z.boolean().default(true),
  emailProjectUpdates: z.boolean().default(true),
  emailTeamActivity: z.boolean().default(true),
  emailInvoiceStatus: z.boolean().default(true),
  emailWeeklyReports: z.boolean().default(true),
  emailMarketingEmails: z.boolean().default(false),

  // Push notifications
  pushTaskAssigned: z.boolean().default(true),
  pushTaskCompleted: z.boolean().default(true),
  pushProjectUpdates: z.boolean().default(false),
  pushTeamActivity: z.boolean().default(true),
  pushInvoiceStatus: z.boolean().default(false),

  // SMS notifications
  smsTaskAssigned: z.boolean().default(false),
  smsTaskCompleted: z.boolean().default(false),
  smsProjectUpdates: z.boolean().default(false),
  smsTeamActivity: z.boolean().default(false),
  smsInvoiceStatus: z.boolean().default(true),
})

type NotificationFormValues = z.infer<typeof notificationFormSchema>

export function NotificationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // This would come from your API in a real application
  const defaultValues: NotificationFormValues = {
    emailTaskAssigned: true,
    emailTaskCompleted: true,
    emailProjectUpdates: true,
    emailTeamActivity: true,
    emailInvoiceStatus: true,
    emailWeeklyReports: true,
    emailMarketingEmails: false,

    pushTaskAssigned: true,
    pushTaskCompleted: true,
    pushProjectUpdates: false,
    pushTeamActivity: true,
    pushInvoiceStatus: false,

    smsTaskAssigned: false,
    smsTaskCompleted: false,
    smsProjectUpdates: false,
    smsTeamActivity: false,
    smsInvoiceStatus: true,
  }

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
  })

  async function onSubmit(data: NotificationFormValues) {
    setIsLoading(true)

    try {
      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Notification settings:", data)

      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your notification settings were not updated. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAll = (type: string, value: boolean) => {
    if (type === "email") {
      form.setValue("emailTaskAssigned", value)
      form.setValue("emailTaskCompleted", value)
      form.setValue("emailProjectUpdates", value)
      form.setValue("emailTeamActivity", value)
      form.setValue("emailInvoiceStatus", value)
      form.setValue("emailWeeklyReports", value)
      form.setValue("emailMarketingEmails", value)
    } else if (type === "push") {
      form.setValue("pushTaskAssigned", value)
      form.setValue("pushTaskCompleted", value)
      form.setValue("pushProjectUpdates", value)
      form.setValue("pushTeamActivity", value)
      form.setValue("pushInvoiceStatus", value)
    } else if (type === "sms") {
      form.setValue("smsTaskAssigned", value)
      form.setValue("smsTaskCompleted", value)
      form.setValue("smsProjectUpdates", value)
      form.setValue("smsTeamActivity", value)
      form.setValue("smsInvoiceStatus", value)
    }

    toast({
      title: `${value ? "Enabled" : "Disabled"} all ${type} notifications`,
      description: `All ${type} notifications have been ${value ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">Manage how and when you receive notifications.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>Manage notifications sent to your email address.</CardDescription>
              <div className="flex gap-4 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleToggleAll("email", true)}>
                  Enable all
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleToggleAll("email", false)}>
                  Disable all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emailTaskAssigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Assignments</FormLabel>
                      <FormDescription>When a task is assigned to you.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailTaskCompleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Completions</FormLabel>
                      <FormDescription>When a task you created or are watching is completed.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailProjectUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Project Updates</FormLabel>
                      <FormDescription>When there are updates to projects you're a part of.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailTeamActivity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Team Activity</FormLabel>
                      <FormDescription>When team members join, leave, or change roles.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailInvoiceStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Invoice Status</FormLabel>
                      <FormDescription>When invoices are paid, overdue, or require attention.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailWeeklyReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Weekly Reports</FormLabel>
                      <FormDescription>Receive a weekly summary of your activity and team progress.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailMarketingEmails"
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Push Notifications</CardTitle>
              </div>
              <CardDescription>Manage notifications sent to your browser or desktop.</CardDescription>
              <div className="flex gap-4 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleToggleAll("push", true)}>
                  Enable all
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleToggleAll("push", false)}>
                  Disable all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="pushTaskAssigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Assignments</FormLabel>
                      <FormDescription>When a task is assigned to you.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pushTaskCompleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Completions</FormLabel>
                      <FormDescription>When a task you created or are watching is completed.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pushProjectUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Project Updates</FormLabel>
                      <FormDescription>When there are updates to projects you're a part of.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pushTeamActivity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Team Activity</FormLabel>
                      <FormDescription>When team members join, leave, or change roles.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pushInvoiceStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Invoice Status</FormLabel>
                      <FormDescription>When invoices are paid, overdue, or require attention.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <CardTitle>SMS Notifications</CardTitle>
              </div>
              <CardDescription>Manage notifications sent to your phone via SMS.</CardDescription>
              <div className="flex gap-4 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleToggleAll("sms", true)}>
                  Enable all
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleToggleAll("sms", false)}>
                  Disable all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="smsTaskAssigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Assignments</FormLabel>
                      <FormDescription>When a task is assigned to you.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smsTaskCompleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Completions</FormLabel>
                      <FormDescription>When a task you created or are watching is completed.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smsProjectUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Project Updates</FormLabel>
                      <FormDescription>When there are updates to projects you're a part of.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smsTeamActivity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Team Activity</FormLabel>
                      <FormDescription>When team members join, leave, or change roles.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smsInvoiceStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Invoice Status</FormLabel>
                      <FormDescription>When invoices are paid, overdue, or require attention.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save preferences"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
