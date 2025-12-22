'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewRedwoodsCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    house_number: '',
    customer_name: '',
    phone: '',
    email: '',
    agreed_price_cents: '',
    payment_frequency: 'per_visit',
    expectations: '',
    special_notes: '',
    start_date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/redwoods/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agreed_price_cents: Math.round(parseFloat(formData.agreed_price_cents) * 100),
          is_active: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create customer')
      }

      router.push('/admin/redwoods')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/redwoods"
          className="inline-flex items-center gap-2 text-text-muted hover:text-brand-primary mb-4"
        >
          <ArrowLeft size={20} />
          Back to Redwoods Lane
        </Link>
        <h1 className="text-3xl font-bold text-text-primary">Add New Customer</h1>
        <p className="text-text-muted mt-1">Add a new house on Redwoods Lane</p>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                House Number *
              </label>
              <Input
                type="text"
                value={formData.house_number}
                onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                placeholder="e.g., 1, 2A, 15"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Customer Name *
              </label>
              <Input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Phone
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+64 21 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Agreed Price ($) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.agreed_price_cents}
                onChange={(e) => setFormData({ ...formData, agreed_price_cents: e.target.value })}
                placeholder="20.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Payment Frequency *
              </label>
              <select
                value={formData.payment_frequency}
                onChange={(e) => setFormData({ ...formData, payment_frequency: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="per_visit">Per Visit</option>
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Customer Expectations
            </label>
            <Textarea
              value={formData.expectations}
              onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
              placeholder="What does the customer expect? (e.g., mow lawn, trim edges, clean up leaves)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Special Notes
            </label>
            <Textarea
              value={formData.special_notes}
              onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
              placeholder="Any special instructions or notes (e.g., gate code, dog in backyard)"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Customer'}
            </Button>
            <Link href="/admin/redwoods" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

