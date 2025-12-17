import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Temporary fallback credentials while Supabase user is being created
const FALLBACK_EMAIL = 'ben@yoonet.io'
const FALLBACK_PASSWORD = 'admin1234'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Try Supabase authentication first
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error && data.user) {
        // Supabase auth successful
        return NextResponse.json({ success: true, method: 'supabase' })
      }

      // If Supabase auth failed, log the error but continue to fallback
      console.log('Supabase auth failed, trying fallback:', error?.message)
    } catch (supabaseError) {
      console.log('Supabase not available, using fallback auth:', supabaseError)
    }

    // Fallback authentication (temporary)
    if (email === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
      // Create a simple session cookie
      const response = NextResponse.json({ success: true, method: 'fallback' })

      // Set a secure session cookie
      response.cookies.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
