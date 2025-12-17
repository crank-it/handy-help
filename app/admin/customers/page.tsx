'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

// Mock data - will be replaced with Supabase data
const mockCustomers = [
  {
    id: '1',
    name: 'John Smith',
    phone: '021 123 4567',
    email: 'john@example.com',
    address: '123 Main St',
    suburb: 'Roslyn',
    lawn_size: 'medium',
    package: 'standard',
    price_per_visit: 60,
    status: 'pending_assessment' as const,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '021 234 5678',
    email: 'sarah@example.com',
    address: '456 Oak Ave',
    suburb: 'Maori Hill',
    lawn_size: 'large',
    package: 'premium',
    price_per_visit: 95,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Mike Wilson',
    phone: '021 345 6789',
    email: null,
    address: '789 Pine Rd',
    suburb: 'Wakari',
    lawn_size: 'small',
    package: 'standard',
    price_per_visit: 45,
    status: 'active' as const,
  },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-brand-primary">
          Customers
        </h1>
        <Button variant="primary">+ Add Customer</Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
        >
          <option value="all">All Statuses</option>
          <option value="pending_assessment">Pending Assessment</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border-2 border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-muted">
            <tr>
              <th className="text-left p-4 font-semibold text-text-primary">Customer</th>
              <th className="text-left p-4 font-semibold text-text-primary">Address</th>
              <th className="text-left p-4 font-semibold text-text-primary">Package</th>
              <th className="text-left p-4 font-semibold text-text-primary">Price</th>
              <th className="text-left p-4 font-semibold text-text-primary">Status</th>
              <th className="text-left p-4 font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t border-border hover:bg-bg-muted transition-colors"
              >
                <td className="p-4">
                  <div className="font-semibold text-text-primary">{customer.name}</div>
                  <div className="text-sm text-text-muted">{customer.phone}</div>
                </td>
                <td className="p-4 text-text-primary">
                  {customer.address}
                  {customer.suburb && (
                    <span className="text-text-muted">, {customer.suburb}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="capitalize text-text-primary">{customer.package}</span>
                  <span className="text-xs text-text-muted block">({customer.lawn_size})</span>
                </td>
                <td className="p-4 font-mono font-semibold text-brand-primary">
                  ${customer.price_per_visit}
                </td>
                <td className="p-4">{getStatusBadge(customer.status)}</td>
                <td className="p-4">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-brand-primary hover:text-brand-secondary font-semibold"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.map((customer) => (
          <Link
            key={customer.id}
            href={`/admin/customers/${customer.id}`}
            className="block bg-white rounded-xl border-2 border-border hover:border-brand-secondary p-4 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-text-primary">{customer.name}</div>
                <div className="text-sm text-text-muted">{customer.phone}</div>
              </div>
              {getStatusBadge(customer.status)}
            </div>

            <div className="text-sm text-text-muted mb-2">{customer.address}</div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm capitalize">
                {customer.package} ({customer.lawn_size})
              </span>
              <span className="font-mono font-semibold text-brand-primary">
                ${customer.price_per_visit}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-border">
          <p className="text-text-muted">No customers found</p>
        </div>
      )}
    </div>
  )
}
