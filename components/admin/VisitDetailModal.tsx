'use client'

import { useState } from 'react'
import { X, Clock, MapPin, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import type { Visit } from '@/types'

interface VisitDetailModalProps {
  visit: Visit
  isOpen: boolean
  onClose: () => void
  onSave: (updatedVisit: Visit) => void
}

export function VisitDetailModal({
  visit,
  isOpen,
  onClose,
  onSave,
}: VisitDetailModalProps) {
  const [actualStartTime, setActualStartTime] = useState(
    visit.actual_start_time || ''
  )
  const [actualEndTime, setActualEndTime] = useState(visit.actual_end_time || '')
  const [completionNotes, setCompletionNotes] = useState(
    visit.completion_notes || ''
  )
  const [propertyIssues, setPropertyIssues] = useState(visit.property_issues || '')
  const [customerIssues, setCustomerIssues] = useState(visit.customer_issues || '')
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const calculateDuration = () => {
    if (!actualStartTime || !actualEndTime) return null

    const start = new Date(`2000-01-01T${actualStartTime}`)
    const end = new Date(`2000-01-01T${actualEndTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.round(diffMs / 60000)

    return diffMins > 0 ? diffMins : null
  }

  const duration = calculateDuration()

  const handleSave = async () => {
    setIsSaving(true)

    const updatedVisit: Visit = {
      ...visit,
      actual_start_time: actualStartTime || undefined,
      actual_end_time: actualEndTime || undefined,
      actual_duration_minutes: duration || undefined,
      completion_notes: completionNotes || undefined,
      property_issues: propertyIssues || undefined,
      customer_issues: customerIssues || undefined,
      status:
        visit.status === 'scheduled' && (actualStartTime || actualEndTime)
          ? 'completed'
          : visit.status,
      completed_at:
        visit.status === 'scheduled' && (actualStartTime || actualEndTime)
          ? new Date().toISOString()
          : visit.completed_at,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onSave(updatedVisit)
    setIsSaving(false)
    onClose()
  }

  const isPastVisit = visit.status === 'completed'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-primary">
              {visit.customer_name || 'Visit Details'}
            </h2>
            <p className="text-sm text-text-muted">
              {new Date(visit.scheduled_date).toLocaleDateString('en-NZ', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Visit Info */}
          <div className="flex items-center justify-between p-4 bg-bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-text-muted" />
              <div>
                <div className="font-semibold text-text-primary">
                  {visit.customer_address}
                </div>
                {visit.customer_suburb && (
                  <div className="text-sm text-text-muted">
                    {visit.customer_suburb}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="font-mono font-bold text-brand-primary">
                ${(visit.price_cents / 100).toFixed(0)}
              </div>
              {visit.status === 'completed' ? (
                <Badge variant="success">Completed</Badge>
              ) : (
                <Badge variant="info">Scheduled</Badge>
              )}
            </div>
          </div>

          {/* Time Tracking */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Clock size={20} />
              Time Tracking
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Start Time"
                type="time"
                value={actualStartTime}
                onChange={(e) => setActualStartTime(e.target.value)}
                placeholder="HH:MM"
              />

              <Input
                label="End Time"
                type="time"
                value={actualEndTime}
                onChange={(e) => setActualEndTime(e.target.value)}
                placeholder="HH:MM"
              />
            </div>

            {duration !== null && (
              <div className="p-3 bg-brand-primary/5 rounded-lg border-2 border-brand-primary/20">
                <div className="text-sm text-text-muted mb-1">Duration</div>
                <div className="font-mono text-2xl font-bold text-brand-primary">
                  {duration} minutes
                </div>
                {duration > 0 && (
                  <div className="text-sm text-text-muted mt-1">
                    ({Math.floor(duration / 60)}h {duration % 60}m)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completion Notes */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <CheckCircle2 size={20} />
              Completion Notes
            </h3>
            <Textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="What was done? Any special observations? Weather conditions?"
              rows={4}
              helperText="These notes will be saved to the customer's visit history"
            />
          </div>

          {/* Issues */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <AlertTriangle size={20} className="text-warning" />
              Issues & Concerns
            </h3>

            <div className="space-y-4">
              <Textarea
                label="Property Issues"
                value={propertyIssues}
                onChange={(e) => setPropertyIssues(e.target.value)}
                placeholder="e.g., Broken sprinkler head, uneven ground discovered, new obstacles"
                rows={3}
                helperText="Issues related to the property or lawn"
              />

              <Textarea
                label="Customer Issues"
                value={customerIssues}
                onChange={(e) => setCustomerIssues(e.target.value)}
                placeholder="e.g., Customer requested change, access issues, scheduling concerns"
                rows={3}
                helperText="Issues related to customer communication or service"
              />
            </div>

            {(propertyIssues || customerIssues) && (
              <div className="mt-3 p-3 bg-warning/10 rounded-lg border-2 border-warning/30">
                <p className="text-sm text-text-primary">
                  <strong>Note:</strong> These issues will be added to the customer's
                  profile for future reference.
                </p>
              </div>
            )}
          </div>

          {/* Historical Info (for completed visits) */}
          {isPastVisit && visit.completed_at && (
            <div className="p-4 bg-bg-muted rounded-lg">
              <h3 className="font-semibold text-text-primary mb-2 text-sm">
                Visit History
              </h3>
              <div className="text-sm text-text-muted">
                Completed on{' '}
                {new Date(visit.completed_at).toLocaleDateString('en-NZ', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
            Save Details
          </Button>
        </div>
      </div>
    </div>
  )
}
