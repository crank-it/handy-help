'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ActivityFeed } from '@/components/admin/ActivityFeed'
import type { Visit } from '@/types'

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
    services: ['lawn_mowing'],
    price: 60,
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
    services: ['lawn_mowing'],
    price: 95,
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
    services: ['lawn_mowing'],
    price: 45,
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
    services: ['lawn_mowing'],
    price: 60,
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
    services: ['lawn_mowing', 'edging'],
    price: 95,
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
    services: ['lawn_mowing'],
    price: 45,
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
                    <Link
                      key={visit.id}
                      href={`/admin/customers/${visit.customer_id}`}
                      className="block w-full p-2 text-left bg-brand-primary/10 hover:bg-brand-primary/20 rounded border-l-4 border-brand-primary transition-colors"
                    >
                      <div className="text-xs font-semibold text-brand-primary hover:text-brand-secondary truncate transition-colors">
                        {visit.customer_name}
                      </div>
                      <div className="text-xs text-text-muted truncate">
                        {visit.customer_suburb}
                      </div>
                    </Link>
                  ))}
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
        <ActivityFeed visits={visits} onVisitUpdate={handleVisitUpdate} />
      </div>
    </div>
  )
}
