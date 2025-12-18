'use client'

import { useEffect } from 'react'
import { InlineWidget } from 'react-calendly'

interface CalendlyPrefill {
  name?: string
  email?: string
  customAnswers?: {
    a1?: string // Phone number
  }
}

interface CalendlyEmbedProps {
  url: string
  prefill?: CalendlyPrefill
  onEventScheduled?: (event: {
    event_uri: string
    invitee_uri: string
  }) => void
}

export function CalendlyEmbed({
  url,
  prefill,
  onEventScheduled,
}: CalendlyEmbedProps) {
  useEffect(() => {
    // Listen for Calendly events
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        if (onEventScheduled) {
          onEventScheduled({
            event_uri: e.data.payload.event.uri,
            invitee_uri: e.data.payload.invitee.uri,
          })
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onEventScheduled])

  if (!url) {
    return (
      <div className="p-8 bg-bg-muted rounded-lg border-2 border-border text-center">
        <p className="text-text-secondary">
          Calendly URL not configured. Please add NEXT_PUBLIC_CALENDLY_INSPECTION_URL
          to your environment variables.
        </p>
      </div>
    )
  }

  return (
    <div className="calendly-embed-wrapper">
      <InlineWidget
        url={url}
        prefill={prefill}
        styles={{
          height: '700px',
          minWidth: '100%',
        }}
        pageSettings={{
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
          primaryColor: '4A8B3A', // Brand color
        }}
      />
    </div>
  )
}
