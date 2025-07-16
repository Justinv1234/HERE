"use client"

import dynamic from "next/dynamic"

// Import the client-side only component with ssr: false
const InvoicesManagement = dynamic(() => import("@/components/invoices/invoices-management"), { ssr: false })

export default function InvoicesClient() {
  return <InvoicesManagement />
}
