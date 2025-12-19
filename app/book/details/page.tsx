'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/booking/ProgressBar'

export default function DetailsPage() {
  const router = useRouter()
  const { bookingData, updateBookingData } = useBooking()
  const [name, setName] = useState(bookingData.name || '')
  const [phone, setPhone] = useState(bookingData.phone || '')
  const [email, setEmail] = useState(bookingData.email || '')
  const [notes, setNotes] = useState(bookingData.notes || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Redirect if previous steps not completed
    if (!bookingData.address) {
      router.push('/book/address')
      return
    }
    if (!bookingData.services || bookingData.services.length === 0) {
      router.push('/book/services')
    }
  }, [bookingData.address, bookingData.services, router])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name || name.trim().length < 2) {
      newErrors.name = 'Please enter your name'
    }
    if (!phone || phone.trim().length < 8) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validate()) return

    // Save contact details to booking context
    updateBookingData({
      name,
      phone,
      email: email || undefined,
      notes: notes || undefined,
    })

    // Navigate to inspection booking
    router.push('/book/inspection')
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          href="/book/services"
          className="text-brand-primary hover:text-brand-secondary font-semibold mb-6 inline-block"
        >
          ← Back
        </Link>

        <ProgressBar currentStep={3} totalSteps={5} stepName="Your Details" />

        <div className="bg-white rounded-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Almost Done!
          </h1>
          <p className="text-text-secondary mb-8">
            Just need a few details to complete your booking.
          </p>

          <div className="space-y-6">
            <Input
              label="Name"
              placeholder="John Smith"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors({ ...errors, name: '' })
              }}
              error={errors.name}
              required
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="021 123 4567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setErrors({ ...errors, phone: '' })
              }}
              error={errors.phone}
              helperText="We'll text you the day before each visit"
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors({ ...errors, email: '' })
              }}
              error={errors.email}
              helperText="Optional - for booking confirmations and receipts"
            />

            <Textarea
              label="Special Instructions"
              placeholder="Gate code, dog in yard, specific areas to focus on..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={500}
              helperText="Optional - anything we should know?"
            />

            <div className="bg-bg-muted rounded-lg p-4">
              <p className="text-sm text-text-secondary">
                <strong>Privacy:</strong> We'll only use your information to manage your lawn service. No spam, no sharing.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleContinue}
            >
              Continue to Inspection Booking →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
