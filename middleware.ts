import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /doctor)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/login", "/signup"]

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path)

  // For the root path, always allow and let the component handle redirection
  if (path === "/") {
    return NextResponse.next()
  }

  // If it's not a public path, let the component handle auth checking
  // This avoids issues with server-side token checking
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
