'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageCircle,
  User,
  RefreshCw,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface PortalMessage {
  id: string
  customer_id: string
  sender: 'customer' | 'admin'
  message: string
  created_at: string
  customer_name?: string
  customer_address?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<PortalMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'customer' | 'admin'>('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('portal_messages')
        .select(`
          *,
          customers:customer_id (
            name,
            address
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          customer_id: msg.customer_id,
          sender: msg.sender,
          message: msg.message,
          created_at: msg.created_at,
          customer_name: msg.customers?.name,
          customer_address: msg.customers?.address,
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true
    return msg.sender === filter
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

  // Stats
  const stats = {
    total: messages.length,
    fromCustomers: messages.filter(m => m.sender === 'customer').length,
    fromYou: messages.filter(m => m.sender === 'admin').length,
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">Portal Messages</h1>
          <p className="text-text-secondary">Customer communications from portals</p>
        </div>

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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-brand-primary mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-text-muted">Total Messages</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-blue-600 mb-1">
            {stats.fromCustomers}
          </div>
          <div className="text-sm text-text-muted">From Customers</div>
        </Card>
        <Card className="text-center">
          <div className="font-mono text-2xl font-bold text-green-600 mb-1">
            {stats.fromYou}
          </div>
          <div className="text-sm text-text-muted">From You</div>
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
          onClick={() => setFilter('customer')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'customer'
              ? 'bg-brand-primary text-white'
              : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
          }`}
        >
          From Customers
        </button>
        <button
          onClick={() => setFilter('admin')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'admin'
              ? 'bg-brand-primary text-white'
              : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
          }`}
        >
          From You
        </button>
      </div>

      {/* Message List */}
      <Card>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-muted">No messages yet</p>
            <p className="text-sm text-text-muted mt-1">
              Portal messages will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMessages.map((message) => {
              return (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-bg-muted/50 transition-colors ${
                    message.sender === 'customer' ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Sender Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'admin'
                              ? 'bg-green-100'
                              : 'bg-blue-100'
                          }`}
                        >
                          <User size={14} className={message.sender === 'admin' ? 'text-green-600' : 'text-blue-600'} />
                        </div>

                        {/* Customer Name */}
                        <Link
                          href={`/admin/customers/${message.customer_id}`}
                          className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                        >
                          {message.customer_name || 'Unknown'}
                        </Link>

                        {/* Sender Badge */}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.sender === 'admin' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {message.sender === 'admin' ? 'You' : 'Customer'}
                        </span>
                      </div>

                      {/* Address */}
                      {message.customer_address && (
                        <div className="text-xs text-text-muted ml-10 mb-1">
                          {message.customer_address}
                        </div>
                      )}

                      {/* Message Body */}
                      <div className="text-text-primary ml-10 mb-2 whitespace-pre-wrap">
                        {message.message}
                      </div>

                      {/* Time */}
                      <div className="ml-10 text-sm text-text-muted">
                        {formatTime(message.created_at)}
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
