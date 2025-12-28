'use client'

import { useState } from 'react'
import { X, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export interface MessageRecipient {
  id: string
  name: string
  phone: string
  address?: string
}

interface MessageDialogProps {
  isOpen: boolean
  onClose: () => void
  recipients: MessageRecipient[]
}

export function MessageDialog({ isOpen, onClose, recipients }: MessageDialogProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!message.trim() || recipients.length === 0) return

    setSending(true)
    setError(null)

    try {
      // Send messages to all recipients
      const results = await Promise.allSettled(
        recipients.map(async (recipient) => {
          const response = await fetch('/api/messages/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: recipient.phone,
              message: message,
              customerId: recipient.id,
            }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to send message')
          }

          return response.json()
        })
      )

      const failures = results.filter((r) => r.status === 'rejected')
      
      if (failures.length > 0) {
        if (failures.length === recipients.length) {
          throw new Error('Failed to send all messages')
        } else {
          setError(`${failures.length} of ${recipients.length} messages failed to send`)
        }
      }

      setSent(true)
      setTimeout(() => {
        setSent(false)
        setMessage('')
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setMessage('')
    setError(null)
    setSent(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border-2 border-border w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-brand-primary" size={20} />
            <h2 className="text-xl font-bold text-brand-primary">
              Send Message
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-text-primary transition-colors"
            disabled={sending}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Recipients ({recipients.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {recipients.map((recipient) => (
                <span
                  key={recipient.id}
                  className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium"
                >
                  {recipient.name}
                </span>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              disabled={sending || sent}
            />
            <p className="text-xs text-text-muted mt-1">
              This message will be sent via WhatsApp/SMS
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {sent && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span className="text-lg">✓</span>
              Message sent successfully!
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-border">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={sending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={sending || sent || !message.trim()}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {sending ? (
              'Sending...'
            ) : sent ? (
              'Sent!'
            ) : (
              <>
                <Send size={16} />
                Send Message
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

