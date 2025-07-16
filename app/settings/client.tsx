"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"
import { BusinessSettings } from "@/components/settings/business-settings"
import { Card } from "@/components/ui/card"

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <Card className="p-6">
          <TabsContent value="profile" className="space-y-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="account" className="space-y-4">
            <AccountSettings />
          </TabsContent>
          <TabsContent value="business" className="space-y-4">
            <BusinessSettings />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <NotificationSettings />
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="appearance" className="space-y-4">
            <AppearanceSettings />
          </TabsContent>
          <TabsContent value="integrations" className="space-y-4">
            <IntegrationSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
