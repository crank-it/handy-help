'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { LawnSize } from '@/types'
import { SelectionCard } from '@/components/booking/SelectionCard'
import { ProgressBar } from '@/components/booking/ProgressBar'

export default function SizePage() {
  const router = useRouter()
  const { bookingData, updateBookingData } = useBooking()

  useEffect(() => {
    // Redirect if no address
    if (!bookingData.address) {
      router.push('/book/address')
    }
  }, [bookingData.address, router])

  const handleSelectSize = (size: LawnSize) => {
    updateBookingData({ lawnSize: size })
    // Auto-advance after 300ms
    setTimeout(() => {
      router.push('/book/package')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/book/address"
          className="text-brand-primary hover:text-brand-secondary font-semibold mb-6 inline-block"
        >
          ← Back
        </Link>

        <ProgressBar currentStep={2} totalSteps={5} stepName="Lawn Size" />

        <div className="bg-white rounded-xl p-8 border border-border mb-6">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            How Big Is Your Lawn?
          </h1>
          <p className="text-text-secondary mb-8">
            Select the size that best matches your property.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <SelectionCard
              icon="🏡"
              title="Small"
              description="Townhouse, unit, small courtyard"
              details="Up to 100m²"
              selected={bookingData.lawnSize === 'small'}
              onClick={() => handleSelectSize('small')}
            />
            <SelectionCard
              icon="🏠"
              title="Medium"
              description="Average suburban home"
              details="100-300m²"
              selected={bookingData.lawnSize === 'medium'}
              onClick={() => handleSelectSize('medium')}
            />
            <SelectionCard
              icon="🏘️"
              title="Large"
              description="Large section, double lot"
              details="300m²+"
              selected={bookingData.lawnSize === 'large'}
              onClick={() => handleSelectSize('large')}
            />
          </div>
        </div>

        <p className="text-center text-sm text-text-muted">
          Not sure? Choose the closest. We'll confirm on the first visit.
        </p>
      </div>
    </div>
  )
}
