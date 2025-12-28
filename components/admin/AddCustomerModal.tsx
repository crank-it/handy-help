'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface AddCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    lawn_size: '',
    package_type: '',
    special_instructions: '',
    start_date: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create customer')
      }

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        suburb: '',
        lawn_size: '',
        package_type: '',
        special_instructions: '',
        start_date: '',
      })
      
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border-2 border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-brand-primary">Add New Customer</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-text-primary">Contact Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0412345678"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-text-primary">Address</h3>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div>
              <label htmlFor="suburb" className="block text-sm font-medium text-text-primary mb-1">
                Suburb
              </label>
              <Input
                id="suburb"
                name="suburb"
                value={formData.suburb}
                onChange={handleChange}
                placeholder="Sydney"
              />
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-text-primary">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lawn_size" className="block text-sm font-medium text-text-primary mb-1">
                  Lawn Size
                </label>
                <select
                  id="lawn_size"
                  name="lawn_size"
                  value={formData.lawn_size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                >
                  <option value="">Select size...</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label htmlFor="package_type" className="block text-sm font-medium text-text-primary mb-1">
                  Package Type
                </label>
                <select
                  id="package_type"
                  name="package_type"
                  value={formData.package_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                >
                  <option value="">Select package...</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-text-primary mb-1">
                Start Date
              </label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="special_instructions" className="block text-sm font-medium text-text-primary mb-1">
                Special Instructions
              </label>
              <Textarea
                id="special_instructions"
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                placeholder="Any special notes or instructions..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

