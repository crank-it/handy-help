'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

export default function ProposalAcceptedPage() {
  const params = useParams()
  const token = params?.token as string
  const [proposal, setProposal] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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
                  We'll contact you
                </h3>
                <p className="text-sm text-text-secondary">
                  Will will reach out to schedule your first visit at a time that works for you
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  Regular service begins
                </h3>
                <p className="text-sm text-text-secondary">
                  After your first visit, we'll maintain your lawn on the agreed schedule
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">
                  Enjoy your beautiful lawn
                </h3>
                <p className="text-sm text-text-secondary">
                  Sit back and relax while we take care of your lawn care needs
                </p>
              </div>
            </div>
          </div>
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
