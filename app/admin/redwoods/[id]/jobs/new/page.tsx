'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RedwoodsCustomer } from '@/types'

export default function NewRedwoodsJobPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customer, setCustomer] = useState<RedwoodsCustomer | null>(null)

  const [formData, setFormData] = useState({
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '',
    price_cents: '',
    notes: ''
  })

  useEffect(() => {
    // Fetch customer to get default price
    fetch(`/api/redwoods/customers/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setCustomer(data)
        setFormData(prev => ({
          ...prev,
          price_cents: (data.agreed_price_cents / 100).toString()
        }))
      })
      .catch(err => console.error('Error fetching customer:', err))
  }, [customerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/redwoods/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          scheduled_date: formData.scheduled_date,
          scheduled_time: formData.scheduled_time || null,
          price_cents: Math.round(parseFloat(formData.price_cents) * 100),
          status: 'scheduled',
          payment_status: 'pending',
          notes: formData.notes || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create job')
      }

      router.push(`/admin/redwoods/${customerId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!customer) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/redwoods/${customerId}`}
          className="inline-flex items-center gap-2 text-text-muted hover:text-brand-primary mb-4"
        >
          <ArrowLeft size={20} />
          Back to {customer.customer_name}
        </Link>
        <h1 className="text-3xl font-bold text-text-primary">Schedule New Job</h1>
        <p className="text-text-muted mt-1">
          {customer.house_number} Redwoods Lane - {customer.customer_name}
        </p>
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
                Date *
              </label>
              <Input
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Time (optional)
              </label>
              <Input
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Price ($) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price_cents}
              onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
              placeholder="20.00"
              required
            />
            <p className="text-sm text-text-muted mt-1">
              Default: ${(customer.agreed_price_cents / 100).toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Notes
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special notes for this job..."
              rows={4}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Scheduling...' : 'Schedule Job'}
            </Button>
            <Link href={`/admin/redwoods/${customerId}`} className="flex-1">
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

