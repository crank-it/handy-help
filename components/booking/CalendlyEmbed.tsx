'use client'

import { useEffect, useRef } from 'react'

interface CalendlyEmbedProps {
  url: string
  prefill?: {
    name?: string
    email?: string
    phone?: string
  }
  onEventScheduled?: () => void
}

export function CalendlyEmbed({ url, prefill, onEventScheduled }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    // Listen for Calendly events
    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://calendly.com' && e.data.event === 'calendly.event_scheduled') {
        onEventScheduled?.()
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      // Cleanup
      document.body.removeChild(script)
      window.removeEventListener('message', handleMessage)
    }
  }, [onEventScheduled])

  // Build URL with prefill params
  const buildUrl = () => {
    const baseUrl = new URL(url)
    if (prefill?.name) baseUrl.searchParams.set('name', prefill.name)
    if (prefill?.email) baseUrl.searchParams.set('email', prefill.email)
    if (prefill?.phone) baseUrl.searchParams.set('a1', prefill.phone)
    return baseUrl.toString()
  }

  if (!url) {
    return (
      <div className="text-center py-12 text-text-secondary">
        Calendly URL not configured
      </div>
    )
  }

  return (
    <div ref={containerRef} className="calendly-embed">
      <div
        className="calendly-inline-widget"
        data-url={buildUrl()}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  )
}

