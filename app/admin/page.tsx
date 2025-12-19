import Link from 'next/link'
import { Calendar, Clipboard, Users, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { Card } from '@/components/ui/Card'
import { getTodaysVisits, getUpcomingVisits, getVisits } from '@/lib/data/schedule'
import { getCustomers } from '@/lib/data/customers'

export default async function AdminDashboard() {
  // Fetch real data from Supabase
  const todayVisits = await getTodaysVisits()
  const upcomingVisits = await getUpcomingVisits(4)
  const customers = await getCustomers()

  // Calculate stats
  const activeCustomers = customers.filter(c => c.status === 'active').length

  // Get this week's visits
  const now = new Date()
  const weekEnd = new Date(now)
  weekEnd.setDate(now.getDate() + 7)
  const weekVisits = await getVisits({
    startDate: now.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0],
  })

  // Calculate this month's revenue from completed visits
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthVisits = await getVisits({
    startDate: monthStart.toISOString().split('T')[0],
    endDate: now.toISOString().split('T')[0],
    status: 'completed',
  })
  const monthRevenue = monthVisits.reduce((sum, v) => sum + (v.price_cents / 100), 0)
  const todayFormatted = now.toLocaleDateString('en-NZ', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-primary mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary">{todayFormatted}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Today's Jobs"
          value={todayVisits.length}
          icon={<Clipboard size={24} />}
          color="primary"
        />
        <StatCard
          label="This Week"
          value={weekVisits.length}
          icon={<Calendar size={24} />}
          color="secondary"
        />
        <StatCard
          label="Active Customers"
          value={activeCustomers}
          icon={<Users size={24} />}
          color="accent"
        />
        <StatCard
          label="This Month Revenue"
          value={`$${Math.round(monthRevenue)}`}
          icon={<DollarSign size={24} />}
          color="success"
        />
      </div>

      {/* Today's Schedule */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          Today&apos;s Schedule
        </h2>

        {todayVisits.length === 0 ? (
          <p className="text-text-muted text-center py-8">
            No visits scheduled for today. Enjoy your day off! 🌞
          </p>
        ) : (
          <div className="space-y-4">
            {todayVisits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between p-4 bg-bg-muted rounded-lg hover:bg-bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏡</span>
                  </div>
                  <div>
                    <Link
                      href={`/admin/customers/${visit.customer_id}`}
                      className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                    >
                      {visit.customer_name}
                    </Link>
                    <div className="text-sm text-text-muted">
                      {visit.customer_address}
                      {visit.customer_suburb && `, ${visit.customer_suburb}`}
                    </div>
                    <div className="text-xs text-text-muted capitalize">
                      {visit.lawn_size} lawn
                      {visit.scheduled_time && ` • ${visit.scheduled_time}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-brand-primary">
                    ${(visit.price_cents / 100).toFixed(0)}
                  </div>
                  <button className="text-sm text-success hover:text-success/80 font-semibold mt-1">
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upcoming Jobs */}
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-brand-primary">
            Upcoming Jobs
          </h2>
          <Link
            href="/admin/schedule"
            className="text-sm text-brand-primary hover:text-brand-secondary font-semibold"
          >
            View Full Schedule →
          </Link>
        </div>

        {upcomingVisits.length === 0 ? (
          <p className="text-text-muted text-center py-8">
            No upcoming visits scheduled.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingVisits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center justify-between p-3 bg-bg-muted rounded-lg hover:bg-bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center min-w-[60px]">
                    <div className="text-xs text-text-muted font-semibold">
                      {new Date(visit.scheduled_date).toLocaleDateString('en-NZ', {
                        weekday: 'short',
                      })}
                    </div>
                    <div className="text-lg font-bold text-brand-primary">
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
                  <div className="flex-1">
                    <Link
                      href={`/admin/customers/${visit.customer_id}`}
                      className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                    >
                      {visit.customer_name}
                    </Link>
                    <div className="text-sm text-text-muted">
                      {visit.customer_suburb || visit.customer_address}
                      {visit.scheduled_time && ` • ${visit.scheduled_time}`}
                    </div>
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

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/schedule"
            className="p-4 border-2 border-border hover:border-brand-primary rounded-lg text-left transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="font-semibold text-text-primary">View Schedule</div>
            <div className="text-sm text-text-muted">See upcoming visits</div>
          </Link>
          <Link
            href="/admin/customers"
            className="p-4 border-2 border-border hover:border-brand-primary rounded-lg text-left transition-colors"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-semibold text-text-primary">Manage Customers</div>
            <div className="text-sm text-text-muted">View all customers</div>
          </Link>
          <Link
            href="/admin/earnings"
            className="p-4 border-2 border-border hover:border-brand-primary rounded-lg text-left transition-colors"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold text-text-primary">Track Earnings</div>
            <div className="text-sm text-text-muted">Revenue & payments</div>
          </Link>
        </div>
      </Card>
    </div>
  )
}
