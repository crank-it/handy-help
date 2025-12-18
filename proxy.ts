import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Only protect /admin routes (except /admin/login and /admin/logout)
  if (request.nextUrl.pathname.startsWith('/admin') &&
      request.nextUrl.pathname !== '/admin/login' &&
      !request.nextUrl.pathname.startsWith('/admin/logout') &&
      !request.nextUrl.pathname.startsWith('/api/admin/auth')) {

    // Check for fallback session cookie first
    const fallbackSession = request.cookies.get('admin-session')
    if (fallbackSession?.value === 'authenticated') {
      // Fallback auth is active, allow access
      return NextResponse.next()
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured - redirect to login
      console.warn('Supabase environment variables not set - redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      let response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      })

      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              )
              response = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        // Not authenticated - redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      return response
    } catch (error) {
      // Error in middleware - redirect to login
      console.error('Middleware error:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
