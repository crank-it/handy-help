'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FileText, Copy, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Proposal } from '@/types'

type ProposalWithCustomer = Proposal & {
  customers?: {
    name: string
    phone: string
    email?: string
    address?: string
    suburb?: string
  }
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<ProposalWithCustomer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'sent' | 'accepted' | 'rejected' | 'expired'>('all')

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals')
      const data = await response.json()
      setProposals(data.proposals || [])
    } catch (error) {
      console.error('Error fetching proposals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyProposalLink = (token: string) => {
    const url = `${window.location.origin}/proposal/${token}`
    navigator.clipboard.writeText(url)
    alert('Proposal link copied to clipboard!')
  }

  const filteredProposals = proposals.filter(p =>
    filter === 'all' ? true : p.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock size={16} />
      case 'accepted': return <CheckCircle size={16} />
      case 'rejected': return <XCircle size={16} />
      case 'expired': return <AlertCircle size={16} />
      default: return null
    }
  }

  const stats = {
    total: proposals.length,
    sent: proposals.filter(p => p.status === 'sent').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    expired: proposals.filter(p => p.status === 'expired').length,
  }

  const acceptanceRate = proposals.length > 0
    ? ((stats.accepted / proposals.length) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="pb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          Proposals
        </h1>
        <p className="text-text-secondary">
          Manage customer proposals and track acceptance rates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-brand-primary">{stats.total}</div>
          <div className="text-sm text-text-secondary">Total</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
          <div className="text-sm text-text-secondary">Sent</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-success">{stats.accepted}</div>
          <div className="text-sm text-text-secondary">Accepted</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-text-secondary">Rejected</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-brand-primary">{acceptanceRate}%</div>
          <div className="text-sm text-text-secondary">Acceptance Rate</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['all', 'sent', 'accepted', 'rejected', 'expired'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Proposals List */}
      {isLoading ? (
        <Card>
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mb-4"></div>
            <p className="text-text-secondary">Loading proposals...</p>
          </div>
        </Card>
      ) : filteredProposals.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-text-tertiary" size={48} />
            <h3 className="font-semibold text-text-primary mb-2">
              No proposals found
            </h3>
            <p className="text-text-secondary">
              {filter === 'all'
                ? 'Create proposals from the customer assessment page'
                : `No ${filter} proposals`
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-text-primary text-lg">
                      {proposal.customers?.name || 'Unknown Customer'}
                    </h3>
                    <Badge className={getStatusColor(proposal.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                      </span>
                    </Badge>
                  </div>

                  <div className="text-sm text-text-secondary space-y-1">
                    <p>{proposal.customers?.address}, {proposal.customers?.suburb}</p>
                    <p>
                      <span className="font-semibold capitalize">{proposal.lawn_size}</span> lawn •
                      <span className="capitalize"> {proposal.package_type}</span> package •
                      Every {proposal.visit_frequency_days} days
                    </p>
                    <p className="text-brand-primary font-mono font-semibold">
                      ${(proposal.price_per_visit_cents / 100).toFixed(2)}/visit
                    </p>
                  </div>

                  <div className="text-xs text-text-tertiary mt-2">
                    Created: {new Date(proposal.created_at).toLocaleDateString()} •
                    Expires: {new Date(proposal.expires_at).toLocaleDateString()}
                    {proposal.accepted_at && (
                      <> • Accepted: {new Date(proposal.accepted_at).toLocaleDateString()}</>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyProposalLink(proposal.token)}
                  >
                    <Copy size={16} />
                    Copy Link
                  </Button>
                  <Link href={`/admin/customers/${proposal.customer_id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      View Customer
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
