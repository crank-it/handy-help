'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, ArrowLeft, ClipboardCheck, AlertCircle, Clock, AlertTriangle, MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MessageDialog, type MessageRecipient } from '@/components/admin/MessageDialog'
import { createClient } from '@/lib/supabase/client'
import { Customer, Visit } from '@/types'

// Helper to calculate price per visit
function getPricePerVisit(lawnSize: string, packageType: string): number {
  const pricing: Record<string, Record<string, number>> = {
    small: { standard: 45, premium: 55 },
    medium: { standard: 60, premium: 70 },
    large: { standard: 80, premium: 95 },
  }
  return pricing[lawnSize]?.[packageType] || 0
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchCustomerData() {
      const supabase = createClient()

      // Fetch customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', params.id)
        .single()

      if (customerError) {
        console.error('Error fetching customer:', customerError)
        setLoading(false)
        return
      }

      // Fetch visits
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('*')
        .eq('customer_id', params.id)
        .order('scheduled_date', { ascending: false })

      if (visitsError) {
        console.error('Error fetching visits:', visitsError)
      }

      // Calculate stats
      const totalVisits = visitsData?.length || 0
      const completedVisits = visitsData?.filter(v => v.status === 'completed').length || 0
      const totalPaid = visitsData
        ?.filter(v => v.status === 'completed')
        .reduce((sum, v) => sum + (v.price_cents || 0), 0) || 0

      // Calculate average completion time
      const completedVisitsWithTime = visitsData?.filter(v =>
        v.status === 'completed' && v.actual_duration_minutes
      ) || []
      const avgTime = completedVisitsWithTime.length > 0
        ? Math.round(
            completedVisitsWithTime.reduce((sum, v) => sum + v.actual_duration_minutes, 0) /
            completedVisitsWithTime.length
          )
        : null

      setCustomer({
        ...customerData,
        stats: {
          total_visits: totalVisits,
          completed_visits: completedVisits,
          total_paid: totalPaid / 100, // Convert cents to dollars
        },
        average_completion_time: avgTime,
        has_assessment: customerData.status !== 'pending_assessment', // Simplified check
      })
      setVisits(visitsData || [])
      setLoading(false)
    }

    fetchCustomerData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-text-muted">Loading customer details...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-text-muted mb-4">Customer not found</p>
        <Link href="/admin/customers" className="text-brand-primary hover:text-brand-secondary">
          ← Back to Customers
        </Link>
      </div>
    )
  }

  // Build recipient for messaging
  const messageRecipient: MessageRecipient = {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_assessment':
        return <Badge variant="warning">● Pending Assessment</Badge>
      case 'active':
        return <Badge variant="success">● Active</Badge>
      case 'paused':
        return <Badge variant="warning">● Paused</Badge>
      case 'cancelled':
        return <Badge variant="error">● Cancelled</Badge>
      default:
        return <Badge variant="info">● {status}</Badge>
    }
  }

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-semibold mb-6"
      >
        <ArrowLeft size={20} />
        Back to Customers
      </Link>

      {/* Assessment Alert */}
      {customer.status === 'pending_assessment' && (
        <Card className="mb-6 border-2 border-warning bg-warning/5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <AlertCircle size={24} className="text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-text-primary mb-1">
                Property Assessment Required
              </h3>
              <p className="text-text-secondary mb-4">
                Complete the initial property assessment on your first visit to document
                access details, obstacles, and service requirements.
              </p>
              <Link href={`/admin/customers/${customer.id}/assessment`}>
                <Button variant="primary" size="sm">
                  <ClipboardCheck size={18} />
                  Start Assessment
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Customer Info Card */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary mb-2">
              {customer.name}
            </h1>
            {getStatusBadge(customer.status)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsMessageDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Message
            </Button>
            <Button variant="secondary" size="sm">Edit</Button>
            <Button variant="secondary" size="sm">⋮</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm text-text-muted mb-3 font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-text-muted" />
                <a
                  href={`tel:${customer.phone}`}
                  className="text-brand-primary hover:text-brand-secondary"
                >
                  {customer.phone}
                </a>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-text-muted" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-brand-primary hover:text-brand-secondary"
                  >
                    {customer.email}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-text-muted mt-1" />
                <div>
                  {customer.address}
                  {customer.suburb && <div className="text-text-muted">{customer.suburb}</div>}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-text-muted mb-3 font-semibold">Service Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Package:</span>
                <span className="font-semibold capitalize">{customer.package_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Lawn Size:</span>
                <span className="font-semibold capitalize">{customer.lawn_size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Price per visit:</span>
                <span className="font-mono font-bold text-brand-primary">
                  ${getPricePerVisit(customer.lawn_size || 'medium', customer.package_type || 'standard')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Customer since:</span>
                <span className="font-semibold">
                  {new Date(customer.created_at).toLocaleDateString('en-NZ', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {customer.special_instructions && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm text-text-muted mb-2 font-semibold">Special Instructions</h3>
            <p className="text-text-primary">{customer.special_instructions}</p>
          </div>
        )}
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-brand-primary mb-1">
            {customer.total_visits || 0}
          </div>
          <div className="text-sm text-text-muted">Total Visits</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-success mb-1">
            {customer.completed_visits || 0}
          </div>
          <div className="text-sm text-text-muted">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-brand-primary mb-1">
            ${(customer.total_paid_cents || 0) / 100}
          </div>
          <div className="text-sm text-text-muted">Total Paid</div>
        </Card>
        {customer.average_completion_time && (
          <Card className="text-center">
            <div className="font-mono text-2xl font-bold text-brand-secondary mb-1">
              {customer.average_completion_time}m
            </div>
            <div className="text-sm text-text-muted">Avg. Time</div>
          </Card>
        )}
      </div>

      {/* Visit History */}
      <Card>
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          Visit History
        </h2>

        <div className="space-y-3">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className="p-4 bg-bg-muted rounded-lg"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      visit.status === 'completed'
                        ? 'bg-success/10'
                        : visit.status === 'scheduled'
                        ? 'bg-brand-primary/10'
                        : 'bg-text-muted/10'
                    }`}
                  >
                    {visit.status === 'completed' ? '✓' : '📅'}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {new Date(visit.scheduled_date).toLocaleDateString('en-NZ', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-text-muted capitalize">{visit.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-brand-primary">
                    ${(visit.price_cents / 100).toFixed(0)}
                  </div>
                  {visit.status === 'scheduled' && (
                    <button className="text-sm text-brand-primary hover:text-brand-secondary font-semibold">
                      Mark done
                    </button>
                  )}
                </div>
              </div>

              {/* Additional visit details for completed visits */}
              {visit.status === 'completed' && (
                <div className="ml-14 space-y-2">
                  {visit.actual_duration_minutes && (
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Clock size={14} />
                      <span className="font-semibold">{visit.actual_duration_minutes} minutes</span>
                    </div>
                  )}

                  {visit.completion_notes && (
                    <div className="text-sm text-text-primary bg-white p-2 rounded border border-border">
                      {visit.completion_notes}
                    </div>
                  )}

                  {visit.property_issues && (
                    <div className="flex items-start gap-2 text-sm bg-warning/10 p-2 rounded border border-warning/30">
                      <AlertTriangle size={14} className="text-warning mt-0.5" />
                      <div>
                        <div className="font-semibold text-warning">Property Issue:</div>
                        <div className="text-text-primary">{visit.property_issues}</div>
                      </div>
                    </div>
                  )}

                  {visit.customer_issues && (
                    <div className="flex items-start gap-2 text-sm bg-warning/10 p-2 rounded border border-warning/30">
                      <AlertTriangle size={14} className="text-warning mt-0.5" />
                      <div>
                        <div className="font-semibold text-warning">Customer Issue:</div>
                        <div className="text-text-primary">{visit.customer_issues}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => setIsMessageDialogOpen(false)}
        recipients={[messageRecipient]}
      />
    </div>
  )
}
