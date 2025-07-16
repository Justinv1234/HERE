"use client"

import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Menu } from "lucide-react"
import { AuthProvider } from "@/lib/auth-context"
import { ErrorBoundary } from "react-error-boundary"

interface AppLayoutProps {
  children: ReactNode
}

// Simple fallback component for error boundary
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-4 text-gray-400">{error.message}</p>
        <button onClick={resetErrorBoundary} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Try again
        </button>
      </div>
    </div>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen bg-black text-white">
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-gray-800 bg-black/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-black/60">
                <SidebarTrigger>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </SidebarTrigger>
                <div className="flex-1" />
              </header>
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
