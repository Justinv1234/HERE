"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      await logout()
      router.push("/login")
    }

    performLogout()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p className="text-gray-400">Please wait while we log you out.</p>
      </div>
    </div>
  )
}
