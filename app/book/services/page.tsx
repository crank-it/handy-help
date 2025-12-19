'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useBooking } from '@/contexts/BookingContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/booking/ProgressBar'
import type { Service } from '@/types'

const SERVICES = [
  {
    id: 'lawn_clearing' as Service,
    label: 'Lawn Clearing',
    description: 'Regular mowing and grass maintenance',
  },
  {
    id: 'edge_trimming' as Service,
    label: 'Edge Trimming',
    description: 'Trimming along paths, driveways, and garden beds',
  },
  {
    id: 'hedging' as Service,
    label: 'Hedging',
    description: 'Hedge trimming and shaping',
  },
  {
    id: 'other' as Service,
    label: 'Something Else',
    description: 'Other lawn care or garden services',
  },
]

export default function ServicesPage() {
  const router = useRouter()
  const { bookingData, updateBookingData } = useBooking()
  const [selectedServices, setSelectedServices] = useState<Service[]>(
    bookingData.services || []
  )
  const [otherDescription, setOtherDescription] = useState(
    bookingData.otherServiceDescription || ''
  )
  const [error, setError] = useState('')

  // Redirect if address not set
  useEffect(() => {
    if (!bookingData.address) {
      router.push('/book/address')
    }
  }, [bookingData.address, router])

  const handleServiceToggle = (serviceId: Service) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        // Remove service
        const updated = prev.filter((s) => s !== serviceId)
        // Clear "other" description if unchecked
        if (serviceId === 'other') {
          setOtherDescription('')
        }
        return updated
      } else {
        // Add service
        return [...prev, serviceId]
      }
    })
    setError('')
  }

  const handleContinue = () => {
    // Validation
    if (selectedServices.length === 0) {
      setError('Please select at least one service')
      return
    }

    if (
      selectedServices.includes('other') &&
      !otherDescription.trim()
    ) {
      setError('Please describe the other service you need')
      return
    }

    // Update booking data
    updateBookingData({
      services: selectedServices,
      otherServiceDescription: otherDescription.trim() || undefined,
    })

    // Navigate to next step
    router.push('/book/details')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Link
          href="/book/address"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        <ProgressBar currentStep={2} totalSteps={5} />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
          What services do you need?
        </h1>
        <p className="text-text-secondary mb-8">
          Select all services you're interested in
        </p>

        <Card className="mb-6">
          <div className="space-y-3">
            {SERVICES.map((service) => (
              <div key={service.id}>
                <label
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-border bg-white hover:border-brand-primary/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-text-primary">
                      {service.label}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {service.description}
                    </div>
                  </div>
                </label>

                {/* Conditional "Other" description input */}
                {service.id === 'other' && selectedServices.includes('other') && (
                  <div className="mt-3 ml-9">
                    <Input
                      placeholder="Please describe what you need..."
                      value={otherDescription}
                      onChange={(e) => {
                        setOtherDescription(e.target.value)
                        setError('')
                      }}
                      required
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </Card>

        <Button
          onClick={handleContinue}
          variant="primary"
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
