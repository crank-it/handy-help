'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/booking/ProgressBar'
import { AddressAutocomplete } from '@/components/booking/AddressAutocomplete'

export default function AddressPage() {
  const router = useRouter()
  const { bookingData, updateBookingData } = useBooking()
  const [address, setAddress] = useState(bookingData.address || '')
  const [suburb, setSuburb] = useState(bookingData.suburb || '')
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (address.length < 5) {
      setError('Please enter a valid street address')
      return
    }

    updateBookingData({ address, suburb })
    router.push('/book/services')
  }

  const handleSuburbExtracted = (extractedSuburb: string) => {
    setSuburb(extractedSuburb)
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/"
          className="text-brand-primary hover:text-brand-secondary font-semibold mb-6 inline-block"
        >
          ← Back to home
        </Link>

        <ProgressBar currentStep={1} totalSteps={5} stepName="Address" />

        <div className="bg-white rounded-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Where&apos;s Your Lawn?
          </h1>
          <p className="text-text-secondary mb-8">
            Enter your address for professional lawn care.
          </p>

          <div className="space-y-6">
            <AddressAutocomplete
              value={address}
              onChange={(value) => {
                setAddress(value)
                setError('')
              }}
              onSuburbExtracted={handleSuburbExtracted}
              error={error}
              required
            />

            {suburb && (
              <div className="bg-bg-muted rounded-lg p-3">
                <p className="text-sm text-text-secondary">
                  <strong>Suburb:</strong> {suburb}
                </p>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleContinue}
            >
              Continue to Services →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
