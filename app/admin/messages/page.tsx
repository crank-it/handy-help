'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageCircle,
  Send,
  Inbox,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Message, MessageStatus } from '@/types'

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    customer_id: '1',
    customer_name: 'John Smith',
    phone_number: '+64211234567',
    message_body: "Hi John, just a reminder that your lawn service is scheduled for tomorrow. See you then! - Handy Help",
    direction: 'outbound',
    status: 'delivered',
    context_type: 'reminder',
    sent_at: '2025-12-16T09:00:00',
    delivered_at: '2025-12-16T09:00:05',
    created_at: '2025-12-16T09:00:00',
  },
  {
    id: '2',
    customer_id: '1',
    customer_name: 'John Smith',
    phone_number: '+64211234567',
    message_body: "Thanks! See you tomorrow",
    direction: 'inbound',
    status: 'read',
    context_type: 'reply',
    created_at: '2025-12-16T09:15:00',
  },
  {
    id: '3',
    customer_id: '2',
    customer_name: 'Sarah Johnson',
    phone_number: '+64222345678',
    message_body: "Hi Sarah, I'm on my way to your place now. Should be there in about 15 minutes! - Will from Handy Help",
    direction: 'outbound',
    status: 'delivered',
    context_type: 'on_the_way',
    sent_at: '2025-12-15T14:00:00',
    delivered_at: '2025-12-15T14:00:03',
    created_at: '2025-12-15T14:00:00',
  },
  {
    id: '4',
    customer_id: '3',
    customer_name: 'Mike Wilson',
    phone_number: '+64273456789',
    message_body: "Hi Mike, there's a 50% chance of rain tomorrow which may affect your scheduled visit. I'll keep an eye on the forecast and let you know if we need to reschedule. - Will from Handy Help",
    direction: 'outbound',
    status: 'sent',
    context_type: 'weather',
    sent_at: '2025-12-14T18:00:00',
    created_at: '2025-12-14T18:00:00',
  },
]

const statusConfig: Record<MessageStatus, { icon: typeof CheckCircle; label: string; color: string }> = {
  pending: { icon: Clock, label: 'Pending', color: 'text-amber-500' },
  sent: { icon: Send, label: 'Sent', color: 'text-blue-500' },
  delivered: { icon: CheckCircle, label: 'Delivered', color: 'text-green-500' },
  read: { icon: CheckCircle, label: 'Read', color: 'text-green-600' },
  failed: { icon: AlertCircle, label: 'Failed', color: 'text-red-500' },
}

const contextLabels: Record<string, string> = {
  manual: 'Manual',
  reminder: 'Reminder',
  weather: 'Weather',
  delay: 'Delay',
  on_the_way: 'On The Way',
  sick_day: 'Sick Day',
  follow_up: 'Follow Up',
  bulk: 'Bulk',
  reply: 'Reply',
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [filter, setFilter] = useState<'all' | 'outbound' | 'inbound'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    todayCount: 0,
  })

  // In production, fetch real data
  useEffect(() => {
    // fetchMessages()
    // fetchStats()

    // Mock stats
    setStats({
      totalSent: 45,
      totalDelivered: 42,
      totalFailed: 1,
      todayCount: 5,
    })
  }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true
    return msg.direction === filter
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-NZ', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-NZ', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-NZ', {
        day: 'numeric',
        month: 'short',
      })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-brand-primary">Messages</h1>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchMessages}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-brand-primary mb-1">
            {stats.todayCount}
          </div>
          <div className="text-sm text-text-muted">Today</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-blue-600 mb-1">
            {stats.totalSent}
          </div>
          <div className="text-sm text-text-muted">Sent</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-success mb-1">
            {stats.totalDelivered}
          </div>
          <div className="text-sm text-text-muted">Delivered</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-error mb-1">
            {stats.totalFailed}
          </div>
          <div className="text-sm text-text-muted">Failed</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-brand-primary text-white'
              : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('outbound')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            filter === 'outbound'
              ? 'bg-brand-primary text-white'
              : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
          }`}
        >
          <Send size={16} />
          Sent
        </button>
        <button
          onClick={() => setFilter('inbound')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            filter === 'inbound'
              ? 'bg-brand-primary text-white'
              : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
          }`}
        >
          <Inbox size={16} />
          Received
        </button>
      </div>

      {/* Message List */}
      <Card>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-muted">No messages yet</p>
            <p className="text-sm text-text-muted mt-1">
              Send your first WhatsApp message from a customer or schedule page
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMessages.map((message) => {
              const statusInfo = statusConfig[message.status]
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-bg-muted/50 transition-colors ${
                    message.direction === 'inbound' ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Direction Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.direction === 'outbound'
                              ? 'bg-brand-primary/10'
                              : 'bg-blue-100'
                          }`}
                        >
                          {message.direction === 'outbound' ? (
                            <Send size={14} className="text-brand-primary" />
                          ) : (
                            <Inbox size={14} className="text-blue-600" />
                          )}
                        </div>

                        {/* Customer Name */}
                        {message.customer_id ? (
                          <Link
                            href={`/admin/customers/${message.customer_id}`}
                            className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                          >
                            {message.customer_name || 'Unknown'}
                          </Link>
                        ) : (
                          <span className="font-semibold text-text-primary flex items-center gap-1">
                            <User size={14} />
                            {message.phone_number}
                          </span>
                        )}

                        {/* Context Badge */}
                        {message.context_type && (
                          <Badge variant="info" className="text-xs">
                            {contextLabels[message.context_type] || message.context_type}
                          </Badge>
                        )}
                      </div>

                      {/* Message Body */}
                      <div className="text-text-primary ml-10 mb-2">
                        {message.message_body}
                      </div>

                      {/* Status & Time */}
                      <div className="flex items-center gap-4 ml-10 text-sm">
                        <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                          <StatusIcon size={14} />
                          <span>{statusInfo.label}</span>
                        </div>
                        <span className="text-text-muted">
                          {formatTime(message.sent_at || message.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
