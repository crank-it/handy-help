'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react'
import { useBooking } from '@/contexts/BookingContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CalendlyEmbed } from '@/components/booking/CalendlyEmbed'
import { ProgressBar } from '@/components/booking/ProgressBar'

export default function InspectionPage() {
  const router = useRouter()
  const { bookingData, updateBookingData } = useBooking()
  const [isBooked, setIsBooked] = useState(bookingData.inspectionBooked || false)
  const [calendlyUrl, setCalendlyUrl] = useState('')

  // Redirect if previous steps not completed
  useEffect(() => {
    if (!bookingData.address) {
      router.push('/book/address')
      return
    }
    if (!bookingData.services || bookingData.services.length === 0) {
      router.push('/book/services')
      return
    }
    if (!bookingData.name || !bookingData.phone) {
      router.push('/book/details')
      return
    }

    // Get Calendly URL from environment
    const url = process.env.NEXT_PUBLIC_CALENDLY_INSPECTION_URL || ''
    setCalendlyUrl(url)
  }, [bookingData, router])

  const handleEventScheduled = (event: {
    event_uri: string
    invitee_uri: string
  }) => {
    setIsBooked(true)
    updateBookingData({
      inspectionBooked: true,
    })
  }

  const handleContinue = () => {
    router.push('/book/confirm')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Link
          href="/book/details"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        <ProgressBar currentStep={4} totalSteps={5} />

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
            Book Your Site Inspection
          </h1>
          <p className="text-text-secondary">
            Please find a time here to book us a site inspection
          </p>
        </div>

        {isBooked && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-green-900">
                  Inspection Booked!
                </h3>
                <p className="text-sm text-green-700">
                  We'll visit your property at the scheduled time and send you a
                  custom proposal based on what we find.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="mb-6">
          {!calendlyUrl && (
            <div className="text-center py-12">
              <Calendar className="mx-auto mb-4 text-text-secondary" size={48} />
              <h3 className="font-semibold text-text-primary mb-2">
                Calendly Not Configured
              </h3>
              <p className="text-text-secondary mb-4">
                The inspection booking calendar is not yet set up. Please add
                your Calendly URL to the environment variables.
              </p>
              <p className="text-sm text-text-tertiary">
                Add NEXT_PUBLIC_CALENDLY_INSPECTION_URL to .env.local
              </p>
            </div>
          )}

          {calendlyUrl && (
            <CalendlyEmbed
              url={calendlyUrl}
              prefill={{
                name: bookingData.name,
                email: bookingData.email,
                customAnswers: {
                  a1: bookingData.phone, // Phone number as custom answer
                },
              }}
              onEventScheduled={handleEventScheduled}
            />
          )}
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleContinue}
            variant={isBooked ? 'primary' : 'secondary'}
            className="flex-1"
            size="lg"
          >
            {isBooked ? 'Continue' : 'Skip for Now'}
          </Button>

          {!isBooked && (
            <div className="text-center text-sm text-text-secondary sm:hidden">
              You can also book your inspection later
            </div>
          )}
        </div>

        {!isBooked && (
          <p className="text-center text-sm text-text-secondary mt-4 hidden sm:block">
            You can also book your inspection later by phone or email
          </p>
        )}
      </div>
    </div>
  )
}
