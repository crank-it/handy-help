import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.log('Supabase signout error (may not be configured):', error)
  }

  // Clear fallback session cookie
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')

  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'))
  response.cookies.delete('admin-session')
  return response
}

export async function GET() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.log('Supabase signout error (may not be configured):', error)
  }

  // Clear fallback session cookie
  const cookieStore = await cookies()
  cookieStore.delete('admin-session')

  const response = NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'))
  response.cookies.delete('admin-session')
  return response
}
