'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Call the auth API endpoint
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Login successful
        console.log('Login successful using:', data.method)

        // If using Supabase method, also sign in on client side
        if (data.method === 'supabase') {
          const supabase = createClient()
          await supabase.auth.signInWithPassword({ email, password })
        }

        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-page to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-border p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Handy Help"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-brand-primary text-center mb-2">
            Admin Login
          </h1>
          <p className="text-text-muted text-center mb-8">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ben@yoonet.io"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-brand-primary hover:text-brand-secondary"
            >
              ← Back to website
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Handy Help NZ Admin Panel
        </p>
      </div>
    </div>
  )
}
