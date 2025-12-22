import { getRedwoodsCustomer, getRedwoodsJobs } from '@/lib/data/redwoods'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { ArrowLeft, Plus, Phone, Mail, Calendar, DollarSign, Edit } from 'lucide-react'
import { notFound } from 'next/navigation'
import { RedwoodsJobsList } from '@/components/admin/RedwoodsJobsList'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RedwoodsCustomerPage({ params }: PageProps) {
  const { id } = await params
  const customer = await getRedwoodsCustomer(id)
  
  if (!customer) {
    notFound()
  }

  const jobs = await getRedwoodsJobs(id)
  
  const completedJobs = jobs.filter(j => j.status === 'completed')
  const upcomingJobs = jobs.filter(j => j.status === 'scheduled')
  const totalEarned = completedJobs
    .filter(j => j.payment_status === 'paid')
    .reduce((sum, j) => sum + j.price_cents, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/redwoods"
          className="inline-flex items-center gap-2 text-text-muted hover:text-brand-primary mb-4"
        >
          <ArrowLeft size={20} />
          Back to Redwoods Lane
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{customer.customer_name}</h1>
            <p className="text-text-muted mt-1">{customer.house_number} Redwoods Lane</p>
          </div>
          <Link href={`/admin/redwoods/${id}/edit`}>
            <Button variant="outline">
              <Edit size={20} className="mr-2" />
              Edit Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-text-muted" />
                  <div>
                    <div className="text-sm text-text-muted">Phone</div>
                    <div className="font-medium text-text-primary">{customer.phone}</div>
                  </div>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-text-muted" />
                  <div>
                    <div className="text-sm text-text-muted">Email</div>
                    <div className="font-medium text-text-primary">{customer.email}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-text-muted" />
                <div>
                  <div className="text-sm text-text-muted">Agreed Price</div>
                  <div className="font-medium text-text-primary">
                    ${(customer.agreed_price_cents / 100).toFixed(2)} 
                    <span className="text-sm text-text-muted ml-2 capitalize">
                      ({customer.payment_frequency.replace('_', ' ')})
                    </span>
                  </div>
                </div>
              </div>
              {customer.start_date && (
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-text-muted" />
                  <div>
                    <div className="text-sm text-text-muted">Start Date</div>
                    <div className="font-medium text-text-primary">
                      {new Date(customer.start_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {customer.expectations && (
              <div className="mb-4">
                <div className="text-sm font-semibold text-text-primary mb-2">Expectations</div>
                <div className="text-text-secondary">{customer.expectations}</div>
              </div>
            )}
            {customer.special_notes && (
              <div>
                <div className="text-sm font-semibold text-text-primary mb-2">Special Notes</div>
                <div className="text-text-secondary">{customer.special_notes}</div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-2xl font-bold text-text-primary">{completedJobs.length}</div>
          <div className="text-sm text-text-muted">Completed Jobs</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-text-primary">{upcomingJobs.length}</div>
          <div className="text-sm text-text-muted">Upcoming Jobs</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold text-text-primary">
            ${(totalEarned / 100).toFixed(2)}
          </div>
          <div className="text-sm text-text-muted">Total Earned</div>
        </Card>
      </div>

      {/* Jobs */}
      <Card>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Jobs</h2>
          <Link href={`/admin/redwoods/${id}/jobs/new`}>
            <Button>
              <Plus size={20} className="mr-2" />
              Schedule Job
            </Button>
          </Link>
        </div>
        <RedwoodsJobsList jobs={jobs} customerId={id} />
      </Card>
    </div>
  )
}

