import { AppLayout } from "@/components/layout/app-layout"
import { ReportsClient } from "./client"

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-3xl font-bold">Reports & Analytics</h1>
        <ReportsClient />
      </div>
    </AppLayout>
  )
}
