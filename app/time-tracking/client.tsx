"use client"

import dynamic from "next/dynamic"
import { AppLayout } from "@/components/layout/app-layout"

// Import the client-side only component with ssr: false
const TimeTrackingClient = dynamic(() => import("@/components/time-tracking/time-tracking-client"), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading time tracking...</div>,
})

export default function TimeTrackingClientWrapper() {
  return (
    <AppLayout>
      <TimeTrackingClient />
    </AppLayout>
  )
}
