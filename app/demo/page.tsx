import { DemoClient } from "./client"
import { AppLayout } from "@/components/layout/app-layout"

export const metadata = {
  title: "TaskFlow Demo - Experience the Platform",
  description: "Try out TaskFlow's features with our interactive demo. No signup required.",
}

export default function DemoPage() {
  return (
    <AppLayout>
      <DemoClient />
    </AppLayout>
  )
}
