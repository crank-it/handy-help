'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, MapPin, CheckCircle2, Calendar, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { VisitDetailModal } from './VisitDetailModal'
import type { Visit } from '@/types'

interface ActivityFeedProps {
  visits: Visit[]
  onVisitUpdate?: (visit: Visit) => void
}

export function ActivityFeed({ visits, onVisitUpdate }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingVisits = visits
    .filter((visit) => {
      const visitDate = new Date(visit.scheduled_date)
      visitDate.setHours(0, 0, 0, 0)
      return visitDate >= today && visit.status !== 'completed'
    })
    .sort(
      (a, b) =>
        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
    )

  const pastVisits = visits
    .filter((visit) => {
      const visitDate = new Date(visit.scheduled_date)
      visitDate.setHours(0, 0, 0, 0)
      return visitDate < today || visit.status === 'completed'
    })
    .sort(
      (a, b) =>
        new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
    )

  const displayedVisits = activeTab === 'upcoming' ? upcomingVisits : pastVisits

  const handleVisitClick = (visit: Visit) => {
    setSelectedVisit(visit)
  }

  const handleVisitSave = (updatedVisit: Visit) => {
    if (onVisitUpdate) {
      onVisitUpdate(updatedVisit)
    }
    setSelectedVisit(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const isToday = date.toDateString() === today.toDateString()
    const isTomorrow = date.toDateString() === tomorrow.toDateString()

    if (isToday) return 'Today'
    if (isTomorrow) return 'Tomorrow'

    return date.toLocaleDateString('en-NZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-brand-primary">
            Activity Feed
          </h2>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
              }`}
            >
              Upcoming ({upcomingVisits.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'past'
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-text-primary hover:bg-bg-muted border border-border'
              }`}
            >
              Past ({pastVisits.length})
            </button>
          </div>
        </div>

        {/* Visit List */}
        {displayedVisits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-text-muted mb-3" />
            <p className="text-text-muted">
              {activeTab === 'upcoming'
                ? 'No upcoming visits scheduled'
                : 'No past visits to show'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedVisits.map((visit) => (
              <button
                key={visit.id}
                onClick={() => handleVisitClick(visit)}
                className="w-full text-left p-4 bg-bg-muted hover:bg-bg-muted/70 rounded-lg transition-colors border-2 border-transparent hover:border-brand-primary"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Customer & Location */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Link
                        href={`/admin/customers/${visit.customer_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                      >
                        {visit.customer_name}
                      </Link>
                      {visit.status === 'completed' && (
                        <CheckCircle2 size={16} className="text-success" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{visit.customer_suburb || visit.customer_address}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(visit.scheduled_date)}</span>
                      </div>

                      {visit.scheduled_time && (
                        <Badge variant="info" className="capitalize">
                          {visit.scheduled_time}
                        </Badge>
                      )}
                    </div>

                    {/* Duration & Notes Preview */}
                    {visit.actual_duration_minutes && (
                      <div className="flex items-center gap-1 text-sm text-text-muted mb-1">
                        <Clock size={14} />
                        <span className="font-semibold">
                          {visit.actual_duration_minutes} mins
                        </span>
                      </div>
                    )}

                    {visit.completion_notes && (
                      <div className="text-sm text-text-muted truncate">
                        {visit.completion_notes}
                      </div>
                    )}

                    {/* Issues indicators */}
                    <div className="flex gap-2 mt-2">
                      {visit.property_issues && (
                        <Badge variant="warning" className="text-xs">
                          <AlertTriangle size={12} />
                          Property Issue
                        </Badge>
                      )}
                      {visit.customer_issues && (
                        <Badge variant="warning" className="text-xs">
                          <AlertTriangle size={12} />
                          Customer Issue
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="text-right">
                    <div className="font-mono font-bold text-brand-primary text-lg">
                      ${visit.price}
                    </div>
                    {activeTab === 'upcoming' && (
                      <div className="text-xs text-text-muted mt-1">
                        Click to add details
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <VisitDetailModal
          visit={selectedVisit}
          isOpen={!!selectedVisit}
          onClose={() => setSelectedVisit(null)}
          onSave={handleVisitSave}
        />
      )}
    </>
  )
}
