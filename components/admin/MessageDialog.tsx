'use client'

import { useState, useEffect } from 'react'
import {
  X,
  MessageCircle,
  Send,
  Users,
  Clock,
  CloudRain,
  Car,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import type { MessageTemplate, Customer, Visit } from '@/types'

// Recipient type for the dialog
export interface MessageRecipient {
  id?: string
  name: string
  phone: string
  address?: string
}

interface MessageDialogProps {
  isOpen: boolean
  onClose: () => void
  recipients: MessageRecipient[]
  // Optional context
  visit?: Visit
  contextType?: 'manual' | 'reminder' | 'weather' | 'delay' | 'on_the_way' | 'sick_day'
}

// Template categories with icons
const categoryConfig: Record<string, { icon: typeof MessageCircle; label: string; color: string }> = {
  reminder: { icon: Clock, label: 'Reminders', color: 'text-blue-600' },
  weather: { icon: CloudRain, label: 'Weather', color: 'text-cyan-600' },
  delay: { icon: AlertTriangle, label: 'Delays', color: 'text-amber-600' },
  on_the_way: { icon: Car, label: 'On The Way', color: 'text-green-600' },
  sick_day: { icon: AlertTriangle, label: 'Sick Day', color: 'text-red-600' },
  follow_up: { icon: CheckCircle, label: 'Follow Up', color: 'text-purple-600' },
  general: { icon: MessageCircle, label: 'General', color: 'text-gray-600' },
}

export function MessageDialog({
  isOpen,
  onClose,
  recipients,
  visit,
  contextType = 'manual',
}: MessageDialogProps) {
  const [templates, setTemplates] = useState<Record<string, MessageTemplate[]>>({})
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [message, setMessage] = useState('')
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({})
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{
    success: boolean
    message: string
    sent?: number
    failed?: number
  } | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Fetch templates on mount
  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen])

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setMessage('')
      setSelectedTemplate(null)
      setSendResult(null)
      setCustomVariables({})

      // Set default variables
      const defaultVars: Record<string, string> = {}
      if (recipients.length === 1) {
        defaultVars.customer_name = recipients[0].name
        defaultVars.address = recipients[0].address || ''
      }
      if (visit) {
        const date = new Date(visit.scheduled_date)
        defaultVars.date = date.toLocaleDateString('en-NZ', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
        defaultVars.time = visit.scheduled_time || 'morning'
      }
      // Common defaults
      defaultVars.eta = '15'
      defaultVars.new_time = ''
      defaultVars.weather_chance = '50'
      defaultVars.original_date = ''
      defaultVars.new_date = ''
      defaultVars.message = ''

      setCustomVariables(defaultVars)
    }
  }, [isOpen, recipients, visit])

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/messages/templates')
      const data = await res.json()
      setTemplates(data.grouped || {})
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    }
  }

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setMessage(template.template_body)
  }

  const getPreviewMessage = () => {
    let preview = message

    // Replace variables with actual values or placeholders
    for (const [key, value] of Object.entries(customVariables)) {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`)
    }

    return preview
  }

  const handleSend = async () => {
    if (!message.trim()) return

    setIsSending(true)
    setSendResult(null)

    try {
      // Build the final message with variables
      const finalMessage = getPreviewMessage()

      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerIds: recipients.map((r) => r.id).filter(Boolean),
          phoneNumbers: recipients.filter((r) => !r.id).map((r) => r.phone),
          message: finalMessage,
          templateId: selectedTemplate?.id,
          contextType,
          contextId: visit?.id,
        }),
      })

      const result = await res.json()

      if (res.ok) {
        setSendResult({
          success: true,
          message: result.whatsappConfigured
            ? `Message sent to ${result.sent} recipient${result.sent !== 1 ? 's' : ''}`
            : `Message saved (WhatsApp not configured yet)`,
          sent: result.sent,
          failed: result.failed,
        })

        // Close after short delay on success
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setSendResult({
          success: false,
          message: result.error || 'Failed to send message',
        })
      }
    } catch {
      setSendResult({
        success: false,
        message: 'Network error - please try again',
      })
    } finally {
      setIsSending(false)
    }
  }

  // Extract variables from template
  const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{(\w+)}}/g) || []
    return [...new Set(matches.map((m) => m.replace(/[{}]/g, '')))]
  }

  const currentVariables = extractVariables(message)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-primary">Send WhatsApp Message</h2>
              <p className="text-sm text-text-muted">
                {recipients.length === 1
                  ? `To: ${recipients[0].name}`
                  : `To: ${recipients.length} recipients`}
              </p>
            </div>
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
          {/* Recipients preview */}
          {recipients.length > 1 && (
            <div className="p-4 bg-bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-text-muted" />
                <span className="font-semibold text-text-primary">
                  {recipients.length} Recipients
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipients.slice(0, 5).map((r, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white rounded-md text-sm text-text-muted"
                  >
                    {r.name}
                  </span>
                ))}
                {recipients.length > 5 && (
                  <span className="px-2 py-1 bg-white rounded-md text-sm text-text-muted">
                    +{recipients.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Template Selection */}
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Quick Templates</h3>
            <div className="space-y-2">
              {Object.entries(templates).map(([category, categoryTemplates]) => {
                const config = categoryConfig[category] || categoryConfig.general
                const Icon = config.icon
                const isExpanded = expandedCategory === category

                return (
                  <div key={category} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : category)
                      }
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={config.color} />
                        <span className="font-medium text-text-primary">
                          {config.label}
                        </span>
                        <span className="text-xs text-text-muted bg-bg-muted px-2 py-0.5 rounded-full">
                          {categoryTemplates.length}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={18} className="text-text-muted" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border bg-bg-muted/50 p-2 space-y-1">
                        {categoryTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedTemplate?.id === template.id
                                ? 'bg-brand-primary/10 border-2 border-brand-primary'
                                : 'hover:bg-white border-2 border-transparent'
                            }`}
                          >
                            <div className="font-medium text-sm text-text-primary">
                              {template.name}
                            </div>
                            <div className="text-xs text-text-muted line-clamp-2 mt-1">
                              {template.template_body}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">Message</h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-brand-primary hover:underline"
              >
                {showPreview ? 'Edit Message' : 'Preview'}
              </button>
            </div>

            {showPreview ? (
              <div className="p-4 bg-bg-muted rounded-lg border-2 border-border">
                <p className="text-text-primary whitespace-pre-wrap">
                  {getPreviewMessage()}
                </p>
              </div>
            ) : (
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here or select a template above..."
                rows={5}
                helperText="Use {{variable}} for dynamic content"
              />
            )}
          </div>

          {/* Variable Inputs */}
          {currentVariables.length > 0 && !showPreview && (
            <div>
              <h3 className="font-semibold text-text-primary mb-3">
                Fill in Variables
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {currentVariables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      {variable.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={customVariables[variable] || ''}
                      onChange={(e) =>
                        setCustomVariables({
                          ...customVariables,
                          [variable]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Result */}
          {sendResult && (
            <div
              className={`p-4 rounded-lg ${
                sendResult.success
                  ? 'bg-success/10 border-2 border-success/30'
                  : 'bg-error/10 border-2 border-error/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {sendResult.success ? (
                  <CheckCircle size={20} className="text-success" />
                ) : (
                  <AlertTriangle size={20} className="text-error" />
                )}
                <span
                  className={
                    sendResult.success ? 'text-success' : 'text-error'
                  }
                >
                  {sendResult.message}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-text-muted">
            {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              isLoading={isSending}
              disabled={!message.trim()}
              className="flex items-center gap-2"
            >
              <Send size={18} />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
