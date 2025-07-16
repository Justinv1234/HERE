import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider defaultSettings={{ theme: "dark" }}>
      <div className="flex min-h-screen flex-col bg-black text-white">
        <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold">TaskFlow</span>
              </Link>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/features" className="transition-colors hover:text-gray-300">
                  Features
                </Link>
                <Link href="/pricing" className="transition-colors hover:text-gray-300">
                  Pricing
                </Link>
                <Link href="/docs" className="transition-colors hover:text-gray-300">
                  Documentation
                </Link>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-800 bg-black py-6 text-center text-sm">
          <div className="container">
            <p className="text-gray-500">© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/terms" className="text-gray-500 hover:text-gray-400">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-400">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-400">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
