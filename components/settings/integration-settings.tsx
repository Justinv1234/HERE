"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, MessageSquare, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState({
    googleCalendar: {
      enabled: false,
      connected: false,
      lastSync: null,
    },
    slack: {
      enabled: false,
      connected: false,
      webhook: "",
    },
    email: {
      enabled: true,
      notifications: true,
      reports: true,
    },
    timeTracking: {
      autoStart: false,
      reminderInterval: 30,
      idleDetection: true,
    },
    invoicing: {
      autoGenerate: false,
      template: "standard",
      currency: "USD",
    },
  })

  const handleToggleIntegration = (integration: string, field: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        [field]: !prev[integration as keyof typeof prev][field as keyof (typeof prev)[typeof integration]],
      },
    }))
  }

  const handleInputChange = (integration: string, field: string, value: string | number) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleConnectGoogle = () => {
    // Simulate Google Calendar connection
    setIntegrations((prev) => ({
      ...prev,
      googleCalendar: {
        ...prev.googleCalendar,
        connected: true,
        lastSync: new Date().toISOString(),
      },
    }))
  }

  const handleDisconnectGoogle = () => {
    setIntegrations((prev) => ({
      ...prev,
      googleCalendar: {
        ...prev.googleCalendar,
        connected: false,
        enabled: false,
        lastSync: null,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools and services to streamline your workflow.
        </p>
      </div>

      {/* Google Calendar Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-base">Google Calendar</CardTitle>
                <CardDescription>Sync your time entries with Google Calendar</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {integrations.googleCalendar.connected ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Not Connected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="google-calendar-sync">Enable Calendar Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically create calendar events for your time entries
              </p>
            </div>
            <Switch
              id="google-calendar-sync"
              checked={integrations.googleCalendar.enabled}
              onCheckedChange={() => handleToggleIntegration("googleCalendar", "enabled")}
              disabled={!integrations.googleCalendar.connected}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            {integrations.googleCalendar.connected ? (
              <div className="space-y-1">
                <p className="text-sm font-medium">Connected to Google Calendar</p>
                {integrations.googleCalendar.lastSync && (
                  <p className="text-xs text-muted-foreground">
                    Last synced: {new Date(integrations.googleCalendar.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium">Connect your Google Calendar</p>
                <p className="text-xs text-muted-foreground">Authorize access to sync your time entries</p>
              </div>
            )}

            {integrations.googleCalendar.connected ? (
              <Button variant="outline" onClick={handleDisconnectGoogle}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnectGoogle}>Connect</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Slack Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <div>
              <CardTitle className="text-base">Slack</CardTitle>
              <CardDescription>Send notifications and updates to Slack</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slack-webhook">Webhook URL</Label>
            <Input
              id="slack-webhook"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={integrations.slack.webhook}
              onChange={(e) => handleInputChange("slack", "webhook", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Create a webhook in your Slack workspace to receive notifications
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="slack-notifications">Enable Slack Notifications</Label>
              <p className="text-sm text-muted-foreground">Send project updates and time tracking notifications</p>
            </div>
            <Switch
              id="slack-notifications"
              checked={integrations.slack.enabled}
              onCheckedChange={() => handleToggleIntegration("slack", "enabled")}
              disabled={!integrations.slack.webhook}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-red-600" />
            <div>
              <CardTitle className="text-base">Email Notifications</CardTitle>
              <CardDescription>Configure email notification preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">General Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
            </div>
            <Switch
              id="email-notifications"
              checked={integrations.email.notifications}
              onCheckedChange={() => handleToggleIntegration("email", "notifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-reports">Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly time tracking and project reports</p>
            </div>
            <Switch
              id="email-reports"
              checked={integrations.email.reports}
              onCheckedChange={() => handleToggleIntegration("email", "reports")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Time Tracking Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle className="text-base">Time Tracking</CardTitle>
              <CardDescription>Configure automatic time tracking features</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-start">Auto-start Timer</Label>
              <p className="text-sm text-muted-foreground">Automatically start timer when you begin working</p>
            </div>
            <Switch
              id="auto-start"
              checked={integrations.timeTracking.autoStart}
              onCheckedChange={() => handleToggleIntegration("timeTracking", "autoStart")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="idle-detection">Idle Detection</Label>
              <p className="text-sm text-muted-foreground">Pause timer when you're away from your computer</p>
            </div>
            <Switch
              id="idle-detection"
              checked={integrations.timeTracking.idleDetection}
              onCheckedChange={() => handleToggleIntegration("timeTracking", "idleDetection")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-interval">Reminder Interval (minutes)</Label>
            <Input
              id="reminder-interval"
              type="number"
              min="5"
              max="120"
              value={integrations.timeTracking.reminderInterval}
              onChange={(e) => handleInputChange("timeTracking", "reminderInterval", Number.parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">How often to remind you to track your time</p>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-orange-600" />
            <div>
              <CardTitle className="text-base">Invoice Management</CardTitle>
              <CardDescription>Configure invoice generation and formatting</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-generate">Auto-generate Invoices</Label>
              <p className="text-sm text-muted-foreground">Automatically create invoices from time entries</p>
            </div>
            <Switch
              id="auto-generate"
              checked={integrations.invoicing.autoGenerate}
              onCheckedChange={() => handleToggleIntegration("invoicing", "autoGenerate")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-template">Invoice Template</Label>
            <select
              id="invoice-template"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={integrations.invoicing.template}
              onChange={(e) => handleInputChange("invoicing", "template", e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <select
              id="currency"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={integrations.invoicing.currency}
              onChange={(e) => handleInputChange("invoicing", "currency", e.target.value)}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Integration Settings</Button>
      </div>
    </div>
  )
}
