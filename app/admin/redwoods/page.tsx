import { getRedwoodsCustomers, getRedwoodsStats } from '@/lib/data/redwoods'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, Home, Calendar, DollarSign, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RedwoodsLanePage() {
  const customers = await getRedwoodsCustomers()
  const stats = await getRedwoodsStats()

  const activeCustomers = customers.filter(c => c.is_active)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Redwoods Lane</h1>
          <p className="text-text-muted mt-1">Manage your local neighborhood business</p>
        </div>
        <Link href="/admin/redwoods/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats.activeCustomers}</div>
              <div className="text-sm text-text-muted">Active Customers</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats.upcomingJobs}</div>
              <div className="text-sm text-text-muted">Upcoming Jobs</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats.completedThisMonth}</div>
              <div className="text-sm text-text-muted">Completed This Month</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">
                ${(stats.earningsThisMonth / 100).toFixed(2)}
              </div>
              <div className="text-sm text-text-muted">Earned This Month</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Customers List */}
      <Card>
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Customers</h2>
        </div>
        <div className="divide-y divide-border">
          {activeCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <Home className="mx-auto text-text-muted mb-4" size={48} />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No customers yet</h3>
              <p className="text-text-muted mb-4">Add your first Redwoods Lane customer to get started!</p>
              <Link href="/admin/redwoods/new">
                <Button>
                  <Plus size={20} className="mr-2" />
                  Add Customer
                </Button>
              </Link>
            </div>
          ) : (
            activeCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/redwoods/${customer.id}`}
                className="block p-6 hover:bg-bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.house_number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{customer.customer_name}</h3>
                      <p className="text-sm text-text-muted">
                        {customer.house_number} Redwoods Lane
                      </p>
                      {customer.phone && (
                        <p className="text-sm text-text-muted">{customer.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">
                      ${(customer.agreed_price_cents / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-text-muted capitalize">
                      {customer.payment_frequency.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                {customer.expectations && (
                  <div className="mt-3 text-sm text-text-muted">
                    <strong>Expectations:</strong> {customer.expectations}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

