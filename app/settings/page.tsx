import type { Metadata } from "next"
import { SettingsClient } from "./client"
import { AppLayout } from "@/components/layout/app-layout"

export const metadata: Metadata = {
  title: "Settings | TaskFlow",
  description: "Manage your account and application settings",
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsClient />
    </AppLayout>
  )
}
