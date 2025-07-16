import { AppLayout } from "@/components/layout/app-layout"
import TeamClient from "./client"

// Make this route dynamic to fix the cookies() error
export const dynamic = "force-dynamic"

export default function TeamPage() {
  return (
    <AppLayout>
      <TeamClient />
    </AppLayout>
  )
}
