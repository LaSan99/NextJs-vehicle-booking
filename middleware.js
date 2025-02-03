import { NextResponse } from 'next/server'
import { verifyTokenEdge } from '@/app/utils/auth'

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get token from cookie
  const token = request.cookies.get('token')

  if (!token || !token.value) {
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verify the token
    const decoded = verifyTokenEdge(token.value)
    
    if (!decoded) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }

    // Handle admin routes
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
      if (decoded.role !== 'ADMIN') {
        if (path.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 })
        }
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Handle profile access for admins
    if (path === '/profile' && decoded.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Add user ID and role to headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', decoded.userId)
    requestHeaders.set('x-user-role', decoded.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Handle token verification error
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('token')
    return response
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/profile/:path*',
    '/api/user/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/bookings/:path*'
  ]
} 