'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { calculateAnnualCost } from '@/lib/pricing'

export default function ConfirmPage() {
  const router = useRouter()
  const { bookingData, clearBookingData } = useBooking()

  useEffect(() => {
    // Redirect if booking incomplete
    if (!bookingData.name || !bookingData.phone || !bookingData.lawnSize || !bookingData.package) {
      router.push('/book/address')
    }
  }, [bookingData, router])

  const pricing = bookingData.lawnSize && bookingData.package
    ? calculateAnnualCost(bookingData.lawnSize, bookingData.package)
    : null

  const handleReturnHome = () => {
    clearBookingData()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-2xl">
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
                <h3 className="font-semibold text-text-primary mb-1">We'll review your booking</h3>
                <p className="text-sm text-text-secondary">Usually within 24 hours</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">You'll hear from us</h3>
                <p className="text-sm text-text-secondary">We'll text or call to confirm details</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">First visit</h3>
                <p className="text-sm text-text-secondary">You don't need to be home - we'll handle it</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Regular service</h3>
                <p className="text-sm text-text-secondary">Automatic reminders before each visit</p>
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
            <div className="flex justify-between">
              <span className="text-text-muted">Lawn Size</span>
              <span className="text-text-primary font-semibold capitalize">
                {bookingData.lawnSize}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Package</span>
              <span className="text-text-primary font-semibold capitalize">
                {bookingData.package}
              </span>
            </div>
            {pricing && (
              <>
                <div className="flex justify-between">
                  <span className="text-text-muted">Price per visit</span>
                  <span className="text-brand-primary font-mono font-bold">
                    ${pricing.perVisit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Estimated annual cost</span>
                  <span className="text-brand-primary font-mono font-bold">
                    ${pricing.estimatedAnnualCost}
                  </span>
                </div>
              </>
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
      </div>
    </div>
  )
}
