import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Define public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/demo",
    "/features",
    "/pricing",
    "/docs",
  ]
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
  )

  // Check if the path is for static assets
  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.includes(".")

  // Allow public paths and static assets without any redirects
  if (isPublicPath || isStaticAsset) {
    return NextResponse.next()
  }

  // For simplicity in the preview environment, allow all access
  const isPreview =
    process.env.VERCEL_ENV === "preview" || request.headers.get("x-vercel-deployment-url")?.includes("vercel.app")

  if (isPreview) {
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get("auth_token")?.value || request.cookies.get("session_token")?.value

  // If no token is found, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow access to all routes if token exists
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
