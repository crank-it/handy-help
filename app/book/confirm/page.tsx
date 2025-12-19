'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/booking/ProgressBar'

export default function ConfirmPage() {
  const router = useRouter()
  const { bookingData, clearBookingData, updateBookingData } = useBooking()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Redirect if booking incomplete
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

    // Submit booking if not already submitted
    if (!hasSubmitted && !isSubmitting) {
      submitBooking()
    }
  }, [bookingData, router, hasSubmitted, isSubmitting])

  const submitBooking = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: bookingData.address,
          suburb: bookingData.suburb,
          services: bookingData.services,
          otherServiceDescription: bookingData.otherServiceDescription,
          name: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
          specialInstructions: bookingData.notes,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const data = await response.json()

      updateBookingData({
        customerId: data.customerId,
      })

      setHasSubmitted(true)
    } catch (error) {
      console.error('Booking error:', error)
      setError('Failed to create booking. Please contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReturnHome = () => {
    clearBookingData()
    router.push('/')
  }

  // Format services for display
  const serviceLabels: Record<string, string> = {
    lawn_clearing: 'Lawn Clearing',
    edge_trimming: 'Edge Trimming',
    hedging: 'Hedging',
    other: bookingData.otherServiceDescription || 'Other Service',
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/book/inspection"
          className="text-brand-primary hover:text-brand-secondary font-semibold mb-6 inline-block"
        >
          ← Back
        </Link>

        <ProgressBar currentStep={5} totalSteps={5} stepName="Confirmation" />

        {isSubmitting && (
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
            <p className="text-text-secondary">Submitting your booking...</p>
          </div>
        )}

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="text-center">
              <p className="text-red-800 mb-4">{error}</p>
              <p className="text-sm text-red-600">
                Please call us at 022 123 4567 or email contact@handyhelp.nz
              </p>
            </div>
          </Card>
        )}

        {hasSubmitted && !error && (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">✓</span>
              </div>
              <h1 className="text-4xl font-bold text-brand-primary mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-xl text-text-secondary">
                Thanks {bookingData.name}, you're all set!
              </p>
            </div>

        {/* What Happens Next */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-brand-primary mb-4">
            What Happens Next
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  {bookingData.inspectionBooked ? "We'll visit at your scheduled time" : "We'll contact you to schedule an inspection"}
                </h3>
                <p className="text-sm text-text-secondary">
                  {bookingData.inspectionBooked ? "At the time you selected in Calendly" : "Usually within 24 hours"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Site inspection</h3>
                <p className="text-sm text-text-secondary">
                  We'll assess your property and services needed
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Custom proposal</h3>
                <p className="text-sm text-text-secondary">
                  You'll receive a tailored quote based on your property
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Service begins</h3>
                <p className="text-sm text-text-secondary">
                  Once you accept, we'll start your regular service
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Booking Summary */}
        <Card className="mb-6 bg-bg-muted">
          <h2 className="text-xl font-bold text-brand-primary mb-4">
            Booking Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-muted">Address</span>
              <span className="text-text-primary font-semibold text-right">
                {bookingData.address}
                {bookingData.suburb && `, ${bookingData.suburb}`}
              </span>
            </div>
            <div>
              <span className="text-text-muted block mb-2">Services Requested</span>
              <div className="flex flex-wrap gap-2">
                {bookingData.services?.map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold"
                  >
                    {serviceLabels[service]}
                  </span>
                ))}
              </div>
            </div>
            {bookingData.inspectionBooked && (
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Inspection</span>
                <span className="text-success font-semibold flex items-center gap-1">
                  <span className="text-lg">✓</span> Scheduled
                </span>
              </div>
            )}
          </div>
        </Card>

            {/* Contact */}
            <div className="text-center mb-6">
              <p className="text-text-secondary mb-2">
                Questions? Contact us anytime
              </p>
              <a
                href="mailto:contact@handyhelp.nz"
                className="text-brand-primary hover:text-brand-secondary font-semibold"
              >
                contact@handyhelp.nz
              </a>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleReturnHome}
            >
              Return to Homepage
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
