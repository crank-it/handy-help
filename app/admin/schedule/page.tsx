'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ActivityFeed } from '@/components/admin/ActivityFeed'
import type { Visit } from '@/types'

// Mock customer phone data (in production this would come from the database)
const customerPhones: Record<string, string> = {
  '1': '021 123 4567',
  '2': '022 234 5678',
  '3': '027 345 6789',
}

// Mock data - will be replaced with Supabase data
const mockVisits: Visit[] = [
  // Upcoming visits
  {
    id: '1',
    customer_id: '1',
    customer_name: 'John Smith',
    customer_address: '123 Main St',
    customer_suburb: 'Roslyn',
    scheduled_date: '2025-12-19',
    scheduled_time: 'morning',
    status: 'scheduled',
    price_cents: 6000,
    created_at: '2025-12-01',
    updated_at: '2025-12-01',
  },
  {
    id: '2',
    customer_id: '2',
    customer_name: 'Sarah Johnson',
    customer_address: '456 Oak Ave',
    customer_suburb: 'Maori Hill',
    scheduled_date: '2025-12-20',
    scheduled_time: 'afternoon',
    status: 'scheduled',
    price_cents: 9500,
    created_at: '2025-12-01',
    updated_at: '2025-12-01',
  },
  {
    id: '3',
    customer_id: '3',
    customer_name: 'Mike Wilson',
    customer_address: '789 Pine Rd',
    customer_suburb: 'Wakari',
    scheduled_date: '2025-12-22',
    scheduled_time: 'morning',
    status: 'scheduled',
    price_cents: 4500,
    created_at: '2025-12-01',
    updated_at: '2025-12-01',
  },
  // Past visits (completed)
  {
    id: '4',
    customer_id: '1',
    customer_name: 'John Smith',
    customer_address: '123 Main St',
    customer_suburb: 'Roslyn',
    scheduled_date: '2025-12-05',
    scheduled_time: 'morning',
    status: 'completed',
    price_cents: 6000,
    completed_at: '2025-12-05T10:30:00',
    actual_start_time: '09:15',
    actual_end_time: '10:00',
    actual_duration_minutes: 45,
    completion_notes: 'Good condition, trimmed edges. Weather was perfect.',
    created_at: '2025-11-20',
    updated_at: '2025-12-05',
  },
  {
    id: '5',
    customer_id: '2',
    customer_name: 'Sarah Johnson',
    customer_address: '456 Oak Ave',
    customer_suburb: 'Maori Hill',
    scheduled_date: '2025-12-06',
    scheduled_time: 'afternoon',
    status: 'completed',
    price_cents: 9500,
    completed_at: '2025-12-06T15:45:00',
    actual_start_time: '14:20',
    actual_end_time: '15:30',
    actual_duration_minutes: 70,
    completion_notes: 'Large lawn took a bit longer. Used edger on driveway.',
    property_issues: 'Sprinkler head slightly damaged near the fence',
    created_at: '2025-11-20',
    updated_at: '2025-12-06',
  },
  {
    id: '6',
    customer_id: '3',
    customer_name: 'Mike Wilson',
    customer_address: '789 Pine Rd',
    customer_suburb: 'Wakari',
    scheduled_date: '2025-12-08',
    scheduled_time: 'morning',
    status: 'completed',
    price_cents: 4500,
    completed_at: '2025-12-08T11:00:00',
    actual_start_time: '10:30',
    actual_end_time: '11:00',
    actual_duration_minutes: 30,
    completion_notes: 'Quick job, small lawn.',
    created_at: '2025-11-20',
    updated_at: '2025-12-08',
  },
]

export default function SchedulePage() {
  const [view, setView] = useState<'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [visits, setVisits] = useState<Visit[]>(mockVisits)

  // Messaging state
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [selectedVisits, setSelectedVisits] = useState<Set<string>>(new Set())
  const [messageRecipients, setMessageRecipients] = useState<MessageRecipient[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)

  // Toggle selection mode
  const toggleSelectMode = () => {
    if (isSelectMode) {
      setSelectedVisits(new Set())
    }
    setIsSelectMode(!isSelectMode)
  }

  // Toggle visit selection
  const toggleVisitSelection = (visitId: string) => {
    const newSelection = new Set(selectedVisits)
    if (newSelection.has(visitId)) {
      newSelection.delete(visitId)
    } else {
      newSelection.add(visitId)
    }
    setSelectedVisits(newSelection)
  }

  // Open message dialog for selected visits
  const openBulkMessage = () => {
    const recipients: MessageRecipient[] = []
    const seenCustomers = new Set<string>()

    visits
      .filter((v) => selectedVisits.has(v.id))
      .forEach((visit) => {
        // Avoid duplicate customers
        if (visit.customer_id && !seenCustomers.has(visit.customer_id)) {
          seenCustomers.add(visit.customer_id)
          recipients.push({
            id: visit.customer_id,
            name: visit.customer_name || 'Customer',
            phone: customerPhones[visit.customer_id] || '',
            address: visit.customer_address,
          })
        }
      })

    setMessageRecipients(recipients)
    setIsMessageDialogOpen(true)
  }

  // Open message dialog for a single visit
  const openSingleMessage = (visit: Visit) => {
    setMessageRecipients([
      {
        id: visit.customer_id,
        name: visit.customer_name || 'Customer',
        phone: customerPhones[visit.customer_id] || '',
        address: visit.customer_address,
      },
    ])
    setIsMessageDialogOpen(true)
  }

  // Send message to all customers for a specific day
  const openDayMessage = (dayVisits: Visit[]) => {
    const recipients: MessageRecipient[] = []
    const seenCustomers = new Set<string>()

    dayVisits.forEach((visit) => {
      if (visit.customer_id && !seenCustomers.has(visit.customer_id)) {
        seenCustomers.add(visit.customer_id)
        recipients.push({
          id: visit.customer_id,
          name: visit.customer_name || 'Customer',
          phone: customerPhones[visit.customer_id] || '',
          address: visit.customer_address,
        })
      }
    })

    setMessageRecipients(recipients)
    setIsMessageDialogOpen(true)
  }

  const handleVisitUpdate = (updatedVisit: Visit) => {
    setVisits((prev) =>
      prev.map((visit) => (visit.id === updatedVisit.id ? updatedVisit : visit))
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })
  }

  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const weekStart = getWeekStart(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return {
      date,
      visits: visits.filter(
        (v) => new Date(v.scheduled_date).toDateString() === date.toDateString()
      ),
    }
  })

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-brand-primary">Schedule</h1>

        <div className="flex items-center gap-2">
          {/* Bulk Message Actions */}
          <Button
            variant={isSelectMode ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleSelectMode}
            className="flex items-center gap-2"
          >
            {isSelectMode ? (
              <>
                <X size={16} />
                Cancel
              </>
            ) : (
              <>
                <Users size={16} />
                Select
              </>
            )}
          </Button>

          {selectedVisits.size > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={openBulkMessage}
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Message ({selectedVisits.size})
            </Button>
          )}

          <div className="w-px h-8 bg-border mx-2" />

          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              view === 'week'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              view === 'month'
                ? 'bg-brand-primary text-white'
                : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevious}
          className="p-2 hover:bg-bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-xl font-semibold text-brand-primary">
          {view === 'week'
            ? `Week of ${weekStart.toLocaleDateString('en-NZ', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}`
            : formatDate(currentDate)}
        </div>

        <button
          onClick={goToNext}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Week View */}
      {view === 'week' && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <div key={day.date.toISOString()} className="space-y-2">
                {/* Day header */}
                <div
                  className={`text-center p-2 rounded-lg ${
                    isToday(day.date)
                      ? 'bg-brand-primary text-white'
                      : 'bg-bg-muted text-text-primary'
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {day.date.toLocaleDateString('en-NZ', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {day.date.toLocaleDateString('en-NZ', { day: 'numeric' })}
                  </div>
                </div>

                {/* Visits for this day */}
                <div className="space-y-2">
                  {day.visits.map((visit) => (
                    <div
                      key={visit.id}
                      className={`relative group p-2 rounded border-l-4 transition-colors ${
                        selectedVisits.has(visit.id)
                          ? 'bg-brand-primary/30 border-brand-primary'
                          : 'bg-brand-primary/10 hover:bg-brand-primary/20 border-brand-primary'
                      }`}
                    >
                      {/* Selection checkbox in select mode */}
                      {isSelectMode && (
                        <button
                          onClick={() => toggleVisitSelection(visit.id)}
                          className="absolute -left-1 -top-1 w-5 h-5 rounded-full bg-white border-2 border-brand-primary flex items-center justify-center"
                        >
                          {selectedVisits.has(visit.id) && (
                            <div className="w-3 h-3 rounded-full bg-brand-primary" />
                          )}
                        </button>
                      )}

                      <Link
                        href={`/admin/customers/${visit.customer_id}`}
                        className="block"
                      >
                        <div className="text-xs font-semibold text-brand-primary hover:text-brand-secondary truncate transition-colors">
                          {visit.customer_name}
                        </div>
                        <div className="text-xs text-text-muted truncate">
                          {visit.customer_suburb}
                        </div>
                      </Link>

                      {/* Quick message button on hover */}
                      {!isSelectMode && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            openSingleMessage(visit)
                          }}
                          className="absolute right-1 top-1 p-1 rounded bg-brand-primary text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Send message"
                        >
                          <MessageCircle size={12} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Message all for this day button */}
                  {day.visits.length > 0 && !isSelectMode && (
                    <button
                      onClick={() => openDayMessage(day.visits)}
                      className="w-full p-1 text-xs text-brand-primary hover:bg-brand-primary/10 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageCircle size={12} />
                      Message all
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Month View - Simplified for now */}
      {view === 'month' && (
        <Card>
          <p className="text-center text-text-muted py-12">
            Month view coming soon! Use week view for now.
          </p>
        </Card>
      )}

      {/* Activity Feed */}
      <div className="mt-8">
        <ActivityFeed
          visits={visits}
          onVisitUpdate={handleVisitUpdate}
          onMessageCustomer={(visit) => openSingleMessage(visit)}
        />
      </div>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={isMessageDialogOpen}
        onClose={() => {
          setIsMessageDialogOpen(false)
          setMessageRecipients([])
        }}
        recipients={messageRecipients}
      />
    </div>
  )
}
