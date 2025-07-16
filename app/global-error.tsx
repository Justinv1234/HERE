"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-black text-white">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6 text-gray-300">
            We're sorry, but there was an error loading this page. Our team has been notified.
          </p>
          {error.digest && <p className="text-sm text-gray-400 mb-6">Error reference: {error.digest}</p>}
          <div className="flex gap-4">
            <Button onClick={() => (window.location.href = "/")} className="dark-button">
              Go to Home
            </Button>
            <Button variant="outline" onClick={() => reset()} className="dark-button-outline">
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
