'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { X, Send, CheckCircle, Loader2 } from 'lucide-react'
import { LawnSize, Package, Service } from '@/types'
import { getPrice } from '@/lib/pricing'

interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address: string
  suburb?: string
}

interface CreateProposalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const SERVICE_OPTIONS: { value: Service; label: string; description: string }[] = [
  { value: 'lawn_clearing', label: 'Lawn Clearing', description: 'Regular lawn mowing and maintenance' },
  { value: 'edge_trimming', label: 'Edge Trimming', description: 'Trimming edges and borders' },
  { value: 'hedging', label: 'Hedging', description: 'Hedge trimming and shaping' },
  { value: 'other', label: 'Other Services', description: 'Custom services as needed' },
]

const LAWN_SIZES: { value: LawnSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

const PACKAGES: { value: Package; label: string; description: string; visits: number }[] = [
  { value: 'standard', label: 'Standard', description: 'Regular maintenance', visits: 9 },
  { value: 'premium', label: 'Premium', description: 'Enhanced care', visits: 17 },
]

const FREQUENCIES = [
  { value: 7, label: 'Weekly (7 days)' },
  { value: 10, label: 'Every 10 days' },
  { value: 14, label: 'Fortnightly (14 days)' },
  { value: 21, label: 'Every 3 weeks (21 days)' },
  { value: 28, label: 'Monthly (28 days)' },
]

export function CreateProposalModal({ isOpen, onClose, onSuccess }: CreateProposalModalProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [lawnSize, setLawnSize] = useState<LawnSize>('medium')
  const [packageType, setPackageType] = useState<Package>('standard')
  const [visitFrequency, setVisitFrequency] = useState(14)
  const [selectedServices, setSelectedServices] = useState<Service[]>(['lawn_clearing'])
  const [customMessage, setCustomMessage] = useState('')
  const [notes, setNotes] = useState('')

  // Load customers
  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  // Calculate pricing
  const pricePerVisit = getPrice(lawnSize, packageType)
  const selectedPackage = PACKAGES.find(p => p.value === packageType)!
  const estimatedAnnualVisits = selectedPackage.visits
  const estimatedAnnualCost = pricePerVisit * estimatedAnnualVisits

  const handleSubmit = async () => {
    if (!selectedCustomer) return

    setIsSending(true)

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          lawnSize,
          packageType,
          visitFrequencyDays: visitFrequency,
          pricePerVisitCents: pricePerVisit * 100,
          estimatedAnnualVisits,
          includedServices: selectedServices,
          notes,
          customMessage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Server returned an error
        alert(`Error: ${data.error || 'Failed to create proposal'}${data.details ? `\n\nDetails: ${data.details}` : ''}`)
        return
      }

      if (data.success) {
        // Show success message even if email failed
        if (data.emailSent) {
          alert('Proposal created and sent successfully!')
        } else {
          alert(`Proposal created successfully!\n\nNote: Email could not be sent${data.emailError ? `: ${data.emailError}` : ''}`)
        }
        onSuccess?.()
        onClose()
        resetForm()
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating proposal:', error)
      alert('Failed to create proposal. Please check the console for details.')
    } finally {
      setIsSending(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedCustomer(null)
    setLawnSize('medium')
    setPackageType('standard')
    setVisitFrequency(14)
    setSelectedServices(['lawn_clearing'])
    setCustomMessage('')
    setNotes('')
    setSearchTerm('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-brand-primary">Create Proposal</h2>
            <p className="text-sm text-text-secondary mt-1">
              Step {step} of 3: {step === 1 ? 'Select Customer' : step === 2 ? 'Configure Services' : 'Review & Send'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
            disabled={isSending}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Select Customer */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Search Customer
                </label>
                <Input
                  type="text"
                  placeholder="Search by name, address, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                    <p className="text-text-secondary">Loading customers...</p>
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-text-secondary">No customers found</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCustomer?.id === customer.id
                          ? 'ring-2 ring-brand-primary bg-brand-primary/5'
                          : ''
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-text-primary">{customer.name}</h3>
                          <p className="text-sm text-text-secondary">
                            {customer.address}
                            {customer.suburb && `, ${customer.suburb}`}
                          </p>
                          <p className="text-sm text-text-muted">{customer.phone}</p>
                        </div>
                        {selectedCustomer?.id === customer.id && (
                          <CheckCircle className="text-brand-primary" size={24} />
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Configure Services */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Lawn Size */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Lawn Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {LAWN_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setLawnSize(size.value)}
                      className={`p-4 border-2 rounded-lg font-semibold transition-all ${
                        lawnSize === size.value
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                          : 'border-border hover:border-brand-primary/50'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Type */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Package Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.value}
                      onClick={() => setPackageType(pkg.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        packageType === pkg.value
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-border hover:border-brand-primary/50'
                      }`}
                    >
                      <div className="font-semibold text-text-primary">{pkg.label}</div>
                      <div className="text-sm text-text-secondary">{pkg.description}</div>
                      <div className="text-xs text-text-muted mt-1">~{pkg.visits} visits/year</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visit Frequency */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Visit Frequency
                </label>
                <select
                  value={visitFrequency}
                  onChange={(e) => setVisitFrequency(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-brand-primary focus:outline-none"
                >
                  {FREQUENCIES.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Included Services
                </label>
                <div className="space-y-2">
                  {SERVICE_OPTIONS.map((service) => (
                    <label
                      key={service.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedServices.includes(service.value)
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-border hover:border-brand-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.value)}
                        onChange={() => handleServiceToggle(service.value)}
                        className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-semibold text-text-primary">{service.label}</div>
                        <div className="text-sm text-text-secondary">{service.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Internal Notes (optional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any internal notes about this proposal..."
                  rows={3}
                />
              </div>

              {/* Pricing Preview */}
              <Card className="bg-brand-primary/5 border-brand-primary/20">
                <h3 className="font-semibold text-brand-primary mb-3">Pricing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Price per visit</span>
                    <span className="font-mono font-bold text-brand-primary">
                      ${pricePerVisit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Estimated annual visits</span>
                    <span className="font-semibold">~{estimatedAnnualVisits}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-brand-primary/20">
                    <span className="font-semibold">Estimated annual cost</span>
                    <span className="font-mono font-bold text-brand-primary text-lg">
                      ${estimatedAnnualCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {step === 3 && selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <Card className="bg-gray-50">
                <h3 className="font-semibold text-brand-primary mb-2">Customer</h3>
                <p className="font-semibold text-text-primary">{selectedCustomer.name}</p>
                <p className="text-sm text-text-secondary">{selectedCustomer.address}</p>
                <p className="text-sm text-text-muted">{selectedCustomer.phone}</p>
                {selectedCustomer.email && (
                  <p className="text-sm text-text-muted">{selectedCustomer.email}</p>
                )}
              </Card>

              {/* Proposal Summary */}
              <Card>
                <h3 className="font-semibold text-brand-primary mb-3">Proposal Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Lawn Size</span>
                    <span className="capitalize font-semibold">{lawnSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Package</span>
                    <span className="capitalize font-semibold">{packageType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Visit Frequency</span>
                    <span className="font-semibold">Every {visitFrequency} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Services</span>
                    <span className="font-semibold">{selectedServices.length} selected</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Price per visit</span>
                    <span className="font-mono font-bold text-brand-primary">
                      ${pricePerVisit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Custom Message (optional)
                </label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personalized message for the customer..."
                  rows={4}
                />
                <p className="text-xs text-text-muted mt-1">
                  This message will be included in the proposal email to the customer.
                </p>
              </div>

              {/* Email Preview */}
              <Card className="bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📧 Email Preview</h3>
                <p className="text-sm text-blue-800">
                  An email will be sent to {selectedCustomer.email || selectedCustomer.phone} with:
                </p>
                <ul className="text-sm text-blue-800 mt-2 ml-4 space-y-1 list-disc">
                  <li>Complete proposal details</li>
                  <li>Pricing breakdown</li>
                  <li>Accept and Reject buttons</li>
                  {customMessage && <li>Your custom message</li>}
                </ul>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div>
            {step > 1 && (
              <Button
                variant="secondary"
                onClick={() => setStep(step - 1)}
                disabled={isSending}
              >
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isSending}
            >
              Cancel
            </Button>

            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedCustomer}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSending || !selectedCustomer}
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Send Proposal
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

