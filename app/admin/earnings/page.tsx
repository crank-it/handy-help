import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Mock data - will be replaced with Supabase data
const mockData = {
  monthEarnings: 1840,
  lastMonthEarnings: 1620,
  outstanding: 240,
  unpaidVisits: 4,
  allTimeEarnings: 12360,
  allTimeVisits: 206,
  recentPayments: [
    {
      id: '1',
      customer_name: 'John Smith',
      customer_id: '1',
      amount: 60,
      method: 'bank_transfer',
      status: 'paid',
      created_at: '2025-12-15',
    },
    {
      id: '2',
      customer_name: 'Sarah Johnson',
      customer_id: '2',
      amount: 95,
      method: 'cash',
      status: 'paid',
      created_at: '2025-12-14',
    },
    {
      id: '3',
      customer_name: 'Mike Wilson',
      customer_id: '3',
      amount: 45,
      method: 'bank_transfer',
      status: 'pending',
      created_at: '2025-12-13',
    },
  ],
}

export default function EarningsPage() {
  const getPaymentStatusBadge = (status: string) => {
    return status === 'paid' ? (
      <Badge variant="success">Paid</Badge>
    ) : (
      <Badge variant="warning">Pending</Badge>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-primary mb-6">Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-sm text-text-muted mb-2">This Month</div>
          <div className="font-mono text-3xl font-bold text-brand-primary mb-1">
            ${mockData.monthEarnings}
          </div>
          <div className="text-sm text-success">
            +${mockData.monthEarnings - mockData.lastMonthEarnings} from last month
          </div>
        </Card>

        <Card>
          <div className="text-sm text-text-muted mb-2">Outstanding</div>
          <div className="font-mono text-3xl font-bold text-warning mb-1">
            ${mockData.outstanding}
          </div>
          <div className="text-sm text-text-muted">
            {mockData.unpaidVisits} unpaid visits
          </div>
        </Card>

        <Card>
          <div className="text-sm text-text-muted mb-2">All Time</div>
          <div className="font-mono text-3xl font-bold text-brand-primary mb-1">
            ${mockData.allTimeEarnings}
          </div>
          <div className="text-sm text-text-muted">
            {mockData.allTimeVisits} visits completed
          </div>
        </Card>
      </div>

      {/* Monthly Chart Placeholder */}
      <Card className="mb-8">
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          Revenue (Last 6 Months)
        </h2>
        <div className="h-64 flex items-center justify-center bg-bg-muted rounded-lg">
          <p className="text-text-muted">Chart coming soon</p>
        </div>
      </Card>

      {/* Recent Payments */}
      <Card>
        <h2 className="text-xl font-semibold text-brand-primary mb-4">
          Recent Payments
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 text-sm font-semibold text-text-muted">Date</th>
                <th className="text-left p-3 text-sm font-semibold text-text-muted">Customer</th>
                <th className="text-left p-3 text-sm font-semibold text-text-muted">Method</th>
                <th className="text-right p-3 text-sm font-semibold text-text-muted">Amount</th>
                <th className="text-right p-3 text-sm font-semibold text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockData.recentPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-sm text-text-muted">
                    {new Date(payment.created_at).toLocaleDateString('en-NZ', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-3">
                    <a
                      href={`/admin/customers/${payment.customer_id}`}
                      className="text-brand-primary hover:text-brand-secondary font-semibold"
                    >
                      {payment.customer_name}
                    </a>
                  </td>
                  <td className="p-3 text-sm capitalize text-text-primary">
                    {payment.method.replace('_', ' ')}
                  </td>
                  <td className="p-3 text-right font-mono font-semibold text-brand-primary">
                    ${payment.amount}
                  </td>
                  <td className="p-3 text-right">
                    {getPaymentStatusBadge(payment.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
