import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TaskFlow Demo - Experience the Platform",
  description: "Try out TaskFlow's features with our interactive demo. No signup required.",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
