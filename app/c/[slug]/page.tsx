import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, CheckCircle, Clock, MapPin, MessageCircle, FileText } from 'lucide-react'
import Link from 'next/link'

async function getCustomerBySlug(slug: string) {
  const supabase = await createClient()

  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('url_slug', slug)
    .single()

  if (error || !customer) {
    return null
  }

  return customer
}

async function getCustomerVisits(customerId: string) {
  const supabase = await createClient()

  const { data: visits, error } = await supabase
    .from('visits')
    .select('*')
    .eq('customer_id', customerId)
    .gte('scheduled_date', new Date().toISOString().split('T')[0])
    .order('scheduled_date', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Error fetching visits:', error)
    return []
  }

  return visits || []
}

async function getCustomerProposals(customerId: string) {
  const supabase = await createClient()

  const { data: proposals, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching proposals:', error)
    return []
  }

  return proposals || []
}

async function getPortalMessages(customerId: string) {
  const supabase = await createClient()

  const { data: messages, error } = await supabase
    .from('portal_messages')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return messages || []
}

export default async function CustomerPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const customer = await getCustomerBySlug(slug)

  if (!customer) {
    notFound()
  }

  const [visits, proposals, messages] = await Promise.all([
    getCustomerVisits(customer.id),
    getCustomerProposals(customer.id),
    getPortalMessages(customer.id),
  ])

  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">● Active</Badge>
      case 'proposal_sent':
        return <Badge variant="info">● Proposal Sent</Badge>
      case 'paused':
        return <Badge variant="warning">● Paused</Badge>
      default:
        return <Badge variant="info">● {status}</Badge>
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
          Welcome, {customer.name.split(' ')[0]}!
        </h1>
        <div className="flex items-start gap-2 text-text-secondary mb-3">
          <MapPin size={20} className="mt-1 flex-shrink-0" />
          <div>
            {customer.address}
            {customer.suburb && <div className="text-text-muted">{customer.suburb}</div>}
          </div>
        </div>
        {getStatusBadge(customer.status)}
      </div>

      {/* Upcoming Visits Section */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-brand-primary" size={24} />
          <h2 className="text-2xl font-bold text-brand-primary">Upcoming Visits</h2>
        </div>

        {visits.length === 0 ? (
          <p className="text-text-muted text-center py-8">
            No upcoming visits scheduled yet.
          </p>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 bg-bg-muted rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-xs text-text-muted font-semibold">
                      {new Date(visit.scheduled_date).toLocaleDateString('en-NZ', {
                        weekday: 'short',
                      })}
                    </div>
                    <div className="text-2xl font-bold text-brand-primary">
                      {new Date(visit.scheduled_date).toLocaleDateString('en-NZ', {
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-xs text-text-muted">
                      {new Date(visit.scheduled_date).toLocaleDateString('en-NZ', {
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {visit.scheduled_time ? `${visit.scheduled_time} visit` : 'Scheduled visit'}
                    </div>
                    {visit.lawn_size && (
                      <div className="text-sm text-text-muted capitalize">
                        {visit.lawn_size} lawn • {visit.package_type} package
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-brand-primary">
                    ${(visit.price_cents / 100).toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Proposals Section */}
      {proposals.length > 0 && (
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-brand-primary" size={24} />
            <h2 className="text-2xl font-bold text-brand-primary">Proposals</h2>
          </div>

          <div className="space-y-4">
            {proposals.map((proposal) => {
              const isExpired = new Date() > new Date(proposal.expires_at)
              const canRespond = proposal.status === 'sent' && !isExpired

              return (
                <div
                  key={proposal.id}
                  className="p-4 bg-bg-muted rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-text-primary capitalize">
                        {proposal.lawn_size} Lawn • {proposal.package_type} Package
                      </div>
                      <div className="text-sm text-text-muted">
                        Every {proposal.visit_frequency_days} days
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-brand-primary text-xl">
                        ${(proposal.price_per_visit_cents / 100).toFixed(2)}
                      </div>
                      <div className="text-xs text-text-muted">per visit</div>
                    </div>
                  </div>

                  {proposal.custom_message && (
                    <div className="mb-3 p-3 bg-white rounded border border-border text-sm text-text-primary">
                      {proposal.custom_message}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {canRespond ? (
                      <>
                        <Link
                          href={`/proposal/${proposal.token}`}
                          className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg text-center font-semibold hover:bg-brand-secondary transition-colors"
                        >
                          View Full Proposal
                        </Link>
                      </>
                    ) : (
                      <div className="text-sm text-text-muted">
                        {proposal.status === 'accepted' && '✅ Accepted'}
                        {proposal.status === 'rejected' && '❌ Declined'}
                        {isExpired && proposal.status === 'sent' && '⏰ Expired'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Messages Section */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="text-brand-primary" size={24} />
          <h2 className="text-2xl font-bold text-brand-primary">Messages</h2>
        </div>

        {messages.length === 0 ? (
          <p className="text-text-muted text-center py-8">
            No messages yet. Will can send you updates here.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.sender === 'admin'
                    ? 'bg-blue-50 border-l-4 border-blue-400'
                    : 'bg-green-50 border-l-4 border-green-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-text-muted">
                    {message.sender === 'admin' ? 'Will from Handy Help' : 'You'}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(message.created_at).toLocaleDateString('en-NZ', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-text-primary whitespace-pre-wrap">{message.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Message Form */}
        <form action={`/api/portal/${slug}/messages`} method="POST" className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="message"
              placeholder="Type a message to Will..."
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-secondary transition-colors flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Send
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

