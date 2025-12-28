import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import type { Proposal } from '@/types'

async function getProposal(token: string) {
  const supabase = await createClient()

  const { data: proposal, error } = await supabase
    .from('proposals')
    .select(`
      *,
      customers:customer_id (
        name,
        address,
        suburb,
        services,
        other_service_description
      )
    `)
    .eq('token', token)
    .single()

  if (error || !proposal) {
    return null
  }

  return proposal
}

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const proposal = await getProposal(token)

  if (!proposal) {
    notFound()
  }

  // Check if already accepted
  if (proposal.status === 'accepted') {
    redirect(`/proposal/${token}/accepted`)
  }

  // Check if expired
  const now = new Date()
  const expiresAt = new Date(proposal.expires_at)
  const isExpired = now > expiresAt || proposal.status === 'expired'

  // Calculate total annual cost
  const annualCost = (proposal.price_per_visit_cents / 100) * proposal.estimated_annual_visits

  // Format services
  const serviceLabels: Record<string, string> = {
    lawn_clearing: 'Lawn Clearing',
    edge_trimming: 'Edge Trimming',
    hedging: 'Hedging',
    other: 'Other Services',
  }

  const customer = proposal.customers as any

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary py-12">
      <div className="container max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-primary mb-2">
            Your Lawn Care Proposal
          </h1>
          <p className="text-xl text-text-secondary">
            {customer?.name}
          </p>
        </div>

        {/* Status Banner */}
        {isExpired && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <XCircle className="text-red-600" size={24} />
              <div>
                <h3 className="font-semibold text-red-900">Proposal Expired</h3>
                <p className="text-sm text-red-700">
                  This proposal expired on {expiresAt.toLocaleDateString()}. Please contact us for a new quote.
                </p>
              </div>
            </div>
          </Card>
        )}

        {proposal.status === 'rejected' && (
          <Card className="mb-6 bg-gray-50 border-gray-200">
            <div className="flex items-center gap-3">
              <XCircle className="text-gray-600" size={24} />
              <div>
                <h3 className="font-semibold text-gray-900">Proposal Declined</h3>
                <p className="text-sm text-gray-700">
                  You declined this proposal. Contact us if you've changed your mind!
                </p>
              </div>
            </div>
          </Card>
        )}

        {!isExpired && proposal.status === 'sent' && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900">Expires {expiresAt.toLocaleDateString()}</h3>
                <p className="text-sm text-blue-700">
                  This proposal is valid until {expiresAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Proposal Details */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-brand-primary mb-4">
            Service Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-text-muted">Property</span>
              <span className="text-text-primary font-semibold text-right">
                {customer?.address}
                {customer?.suburb && `, ${customer.suburb}`}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-text-muted">Lawn Size</span>
              <span className="text-text-primary font-semibold capitalize">
                {proposal.lawn_size}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-text-muted">Package</span>
              <span className="text-text-primary font-semibold capitalize">
                {proposal.package_type}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-text-muted">Visit Frequency</span>
              <span className="text-text-primary font-semibold">
                Every {proposal.visit_frequency_days} days
              </span>
            </div>

            <div>
              <span className="text-text-muted block mb-2">Services Included</span>
              <div className="flex flex-wrap gap-2">
                {proposal.included_services.map((service: string) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-semibold flex items-center gap-1"
                  >
                    <CheckCircle size={16} />
                    {serviceLabels[service] || service}
                  </span>
                ))}
              </div>
            </div>

            {proposal.notes && (
              <div className="pt-3 border-t border-border">
                <span className="text-text-muted block mb-2">Notes</span>
                <p className="text-text-primary">{proposal.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Pricing */}
        <Card className="mb-6 bg-brand-primary/5">
          <h2 className="text-2xl font-bold text-brand-primary mb-4">
            Pricing
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-lg">
              <span className="text-text-primary font-semibold">Price per visit</span>
              <span className="text-brand-primary font-mono font-bold text-2xl">
                ${(proposal.price_per_visit_cents / 100).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-brand-primary/20">
              <span className="text-text-muted">Estimated visits per year</span>
              <span className="text-text-primary font-semibold">
                ~{proposal.estimated_annual_visits} visits
              </span>
            </div>

            <div className="flex justify-between items-center text-lg pt-3 border-t border-brand-primary/20">
              <span className="text-text-primary font-semibold">Estimated annual cost</span>
              <span className="text-brand-primary font-mono font-bold text-2xl">
                ${annualCost.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        {!isExpired && proposal.status === 'sent' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <form action={`/api/proposals/${token}/accept`} method="POST" className="flex-1">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
              >
                ✅ Accept Proposal
              </Button>
            </form>

            <form action={`/api/proposals/${token}/reject`} method="POST" className="flex-1">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                ❌ Decline
              </Button>
            </form>
          </div>
        )}

        {/* Contact Link */}
        {!isExpired && proposal.status === 'sent' && (
          <div className="text-center mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = 'mailto:contact@handyhelp.nz?subject=Proposal Question'}
            >
              Have questions? Contact Us
            </Button>
          </div>
        )}

        {/* Contact Info */}
        <div className="text-center mt-8 text-text-secondary">
          <p className="mb-2">Questions about your proposal?</p>
          <a
            href="mailto:contact@handyhelp.nz"
            className="text-brand-primary hover:text-brand-secondary font-semibold"
          >
            contact@handyhelp.nz
          </a>
          <span className="mx-2">•</span>
          <a
            href="tel:0221234567"
            className="text-brand-primary hover:text-brand-secondary font-semibold"
          >
            022 123 4567
          </a>
        </div>
      </div>
    </div>
  )
}
