'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CalendlyEmbed } from '@/components/booking/CalendlyEmbed'
import { CheckCircle, Calendar } from 'lucide-react'

export default function ProposalAcceptedPage() {
  const params = useParams()
  const token = params?.token as string
  const [proposal, setProposal] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [firstVisitBooked, setFirstVisitBooked] = useState(false)

  useEffect(() => {
    // Fetch proposal details
    const fetchProposal = async () => {
      try {
        // In a real implementation, you'd fetch the proposal data from an API
        // For now, we'll assume the acceptance happened
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching proposal:', error)
        setIsLoading(false)
      }
    }

    if (token) {
      fetchProposal()
    }
  }, [token])

  const handleFirstVisitScheduled = () => {
    setFirstVisitBooked(true)
  }

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_FIRST_VISIT_URL || ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-success" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-brand-primary mb-2">
            Proposal Accepted!
          </h1>
          <p className="text-xl text-text-secondary">
            Welcome to Handy Help - we're excited to care for your lawn!
          </p>
        </div>

        {firstVisitBooked && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-semibold text-green-900">
                  First Visit Scheduled!
                </h3>
                <p className="text-sm text-green-700">
                  We'll see you at your scheduled time. You'll receive a reminder before we arrive.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* What Happens Next */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-brand-primary mb-4">
            What Happens Next
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  Your visits have been scheduled
                </h3>
                <p className="text-sm text-text-secondary">
                  We've created a year of visits based on your selected frequency
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  Book your first visit
                </h3>
                <p className="text-sm text-text-secondary">
                  Use the calendar below to choose a time that works for you
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  We'll send you reminders
                </h3>
                <p className="text-sm text-text-secondary">
                  You'll receive a text the day before each visit
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  Sit back and relax
                </h3>
                <p className="text-sm text-text-secondary">
                  You don't need to be home - we'll take care of everything
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Calendly Embed */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-brand-primary mb-4 flex items-center gap-2">
            <Calendar size={28} />
            Schedule Your First Visit
          </h2>

          {!calendlyUrl ? (
            <div className="text-center py-12">
              <p className="text-text-secondary mb-4">
                Calendly scheduling is not yet configured. We'll contact you to schedule your first visit.
              </p>
              <p className="text-sm text-text-tertiary">
                Add NEXT_PUBLIC_CALENDLY_FIRST_VISIT_URL to environment variables
              </p>
            </div>
          ) : (
            <CalendlyEmbed
              url={calendlyUrl}
              prefill={{
                name: customer?.name,
                email: customer?.email,
              }}
              onEventScheduled={handleFirstVisitScheduled}
            />
          )}
        </Card>

        {/* Contact */}
        <div className="text-center">
          <p className="text-text-secondary mb-4">
            Questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contact@handyhelp.nz"
              className="text-brand-primary hover:text-brand-secondary font-semibold"
            >
              contact@handyhelp.nz
            </a>
            <span className="hidden sm:inline text-text-tertiary">•</span>
            <a
              href="tel:0221234567"
              className="text-brand-primary hover:text-brand-secondary font-semibold"
            >
              022 123 4567
            </a>
          </div>

          <div className="mt-8">
            <Link href="/">
              <Button variant="secondary" size="lg">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
