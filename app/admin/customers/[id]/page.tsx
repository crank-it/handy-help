import Link from 'next/link'
import { Phone, Mail, MapPin, ArrowLeft, ClipboardCheck, AlertCircle, Clock, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Mock data - will be replaced with Supabase data
const mockCustomer = {
  id: '1',
  name: 'John Smith',
  phone: '021 123 4567',
  email: 'john@example.com',
  address: '123 Main St',
  suburb: 'Roslyn',
  lawn_size: 'medium',
  package: 'standard',
  price_per_visit: 60,
  status: 'pending_assessment' as const, // Changed to pending_assessment to show the flow
  notes: 'Gate code: 1234. Dog in backyard on Mondays.',
  created_at: '2025-01-15',
  has_assessment: false, // Track if assessment is completed
  average_completion_time: 48, // in minutes
  stats: {
    total_visits: 8,
    completed_visits: 6,
    total_paid: 360,
  },
  visits: [
    {
      id: '1',
      scheduled_date: '2025-02-15',
      status: 'scheduled',
      price: 60,
    },
    {
      id: '2',
      scheduled_date: '2025-01-18',
      status: 'completed',
      price: 60,
      completed_at: '2025-01-18T14:30:00',
      actual_duration_minutes: 45,
      completion_notes: 'Lawn in excellent condition. Trimmed edges.',
    },
    {
      id: '3',
      scheduled_date: '2025-01-04',
      status: 'completed',
      price: 60,
      completed_at: '2025-01-04T10:15:00',
      actual_duration_minutes: 50,
      completion_notes: 'Lawn was quite long, took a bit more time.',
      property_issues: 'Small hole near the tree - customer aware',
    },
  ],
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = mockCustomer

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
      {customer.status === 'pending_assessment' && !customer.has_assessment && (
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
                <span className="font-semibold capitalize">{customer.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Lawn Size:</span>
                <span className="font-semibold capitalize">{customer.lawn_size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Price per visit:</span>
                <span className="font-mono font-bold text-brand-primary">
                  ${customer.price_per_visit}
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

        {customer.notes && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm text-text-muted mb-2 font-semibold">Notes</h3>
            <p className="text-text-primary">{customer.notes}</p>
          </div>
        )}

        {/* Assessment Summary (shown when completed) */}
        {customer.has_assessment && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-text-muted font-semibold flex items-center gap-2">
                <ClipboardCheck size={16} />
                Property Assessment
              </h3>
              <Link
                href={`/admin/customers/${customer.id}/assessment`}
                className="text-sm text-brand-primary hover:text-brand-secondary font-semibold"
              >
                View Full Assessment →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Access:</span>
                <span className="ml-2 text-text-primary font-semibold">
                  Gate code documented
                </span>
              </div>
              <div>
                <span className="text-text-muted">Lawn Condition:</span>
                <span className="ml-2 text-text-primary font-semibold capitalize">
                  Good
                </span>
              </div>
              <div>
                <span className="text-text-muted">Equipment:</span>
                <span className="ml-2 text-text-primary font-semibold">
                  Trimmer, Blower
                </span>
              </div>
              <div>
                <span className="text-text-muted">Est. Time:</span>
                <span className="ml-2 text-text-primary font-semibold">45 mins</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-brand-primary mb-1">
            {customer.stats.total_visits}
          </div>
          <div className="text-sm text-text-muted">Total Visits</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-success mb-1">
            {customer.stats.completed_visits}
          </div>
          <div className="text-sm text-text-muted">Completed</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-brand-primary mb-1">
            ${customer.stats.total_paid}
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
          {customer.visits.map((visit) => (
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
                    ${visit.price}
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
    </div>
  )
}
