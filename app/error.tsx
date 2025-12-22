'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  const isSupabaseError = error.message?.includes('Supabase')

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-page to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-brand-primary mb-4">⚠️</h1>
          <h2 className="text-3xl font-bold text-brand-primary mb-4">
            {isSupabaseError ? 'Configuration Required' : 'Something went wrong'}
          </h2>
          
          {isSupabaseError ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-yellow-900 mb-2">Database Not Configured</h3>
              <p className="text-yellow-800 mb-4">
                The Supabase environment variables are missing. Please add them in Vercel:
              </p>
              <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>SUPABASE_SERVICE_KEY</li>
              </ul>
              <p className="text-yellow-800 mt-4 text-sm">
                After adding the variables, redeploy the application.
              </p>
            </div>
          ) : (
            <p className="text-xl text-text-secondary mb-8">
              We encountered an unexpected error. Please try again.
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary">
              Go Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-sm text-text-muted">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}

