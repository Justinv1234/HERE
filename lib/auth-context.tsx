"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: number
  name: string
  email: string
  role: string
  business_id?: number
}

type Business = {
  id: number
  name: string
  slug: string
  owner_id: number
  plan: string
  status: string
}

type AuthContextType = {
  user: User | null
  business: Business | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// List of public paths that don't require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/get-started",
  "/forgot-password",
  "/reset-password",
  "/demo",
  "/features",
  "/pricing",
  "/docs",
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshUser = async () => {
    try {
      // Check if we're on a public path
      const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname?.startsWith(`${path}/`))

      console.log("Fetching user data from API")
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          console.log("User data received:", data)
          setUser(data.user)

          // Try to fetch business data, but don't fail if it doesn't work
          if (data.user?.business_id) {
            try {
              console.log("Attempting to fetch business data for business_id:", data.user.business_id)
              const businessRes = await fetch(`/api/businesses/${data.user.business_id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              })

              if (businessRes.ok) {
                const businessData = await businessRes.json()
                console.log("Business data received:", businessData)
                setBusiness(businessData.business)
              } else {
                console.log("Business API returned error, using default business")
                // Create a default business if API fails
                setBusiness({
                  id: data.user.business_id,
                  name: "Default Business",
                  slug: "default",
                  owner_id: data.user.id,
                  plan: "freelancer",
                  status: "active",
                })
              }
            } catch (businessError) {
              console.log("Business fetch failed (this is OK if businesses table doesn't exist):", businessError)
              // Create a default business if fetch fails
              setBusiness({
                id: data.user.business_id || 1,
                name: "Default Business",
                slug: "default",
                owner_id: data.user.id,
                plan: "freelancer",
                status: "active",
              })
            }
          } else {
            console.log("User has no business_id, creating default business")
            // Create a default business for the user
            setBusiness({
              id: 1,
              name: "Default Business",
              slug: "default",
              owner_id: data.user?.id || 1,
              plan: "freelancer",
              status: "active",
            })
          }
        } else {
          console.log("API returned non-JSON response")
          setUser(null)
          setBusiness(null)
        }
      } else if (res.status === 401) {
        // 401 is expected for unauthenticated users
        if (!isPublicPath) {
          console.log("User not authenticated")
        }
        setUser(null)
        setBusiness(null)
      } else {
        console.error("Failed to fetch user data:", res.status, res.statusText)
        setUser(null)
        setBusiness(null)
      }
    } catch (error) {
      console.log("Error refreshing user (this is OK during development):", error)
      setUser(null)
      setBusiness(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [pathname])

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Login failed" }))
        console.log("Login failed:", errorData)
        return { success: false, message: errorData.message || "Login failed" }
      }

      console.log("Login successful, refreshing user data")
      await refreshUser()
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during login. Please try again." }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      setBusiness(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Clear state anyway in case of error
      setUser(null)
      setBusiness(null)
      router.push("/login")
    }
  }

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    business,
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
