'use client'

import { RedwoodsJob } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RedwoodsJobsListProps {
  jobs: RedwoodsJob[]
  customerId: string
}

export function RedwoodsJobsList({ jobs, customerId }: RedwoodsJobsListProps) {
  const router = useRouter()
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null)

  const handleMarkComplete = async (jobId: string) => {
    setUpdatingJobId(jobId)
    try {
      const response = await fetch(`/api/redwoods/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('Failed to update job')
      
      router.refresh()
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Failed to update job')
    } finally {
      setUpdatingJobId(null)
    }
  }

  const handleMarkPaid = async (jobId: string) => {
    setUpdatingJobId(jobId)
    try {
      const response = await fetch(`/api/redwoods/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: 'paid'
        })
      })

      if (!response.ok) throw new Error('Failed to update job')
      
      router.refresh()
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Failed to update job')
    } finally {
      setUpdatingJobId(null)
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="p-12 text-center">
        <Calendar className="mx-auto text-text-muted mb-4" size={48} />
        <h3 className="text-lg font-semibold text-text-primary mb-2">No jobs scheduled</h3>
        <p className="text-text-muted">Schedule the first job for this customer!</p>
      </div>
    )
  }

  const sortedJobs = [...jobs].sort((a, b) => 
    new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime()
  )

  return (
    <div className="divide-y divide-border">
      {sortedJobs.map((job) => (
        <div key={job.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  variant={
                    job.status === 'completed' ? 'success' :
                    job.status === 'cancelled' ? 'error' :
                    'default'
                  }
                >
                  {job.status}
                </Badge>
                {job.payment_status === 'paid' && (
                  <Badge variant="success">Paid</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar size={16} />
                  <span>{new Date(job.scheduled_date).toLocaleDateString('en-NZ', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  {job.scheduled_time && (
                    <>
                      <Clock size={16} className="ml-2" />
                      <span>{job.scheduled_time}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-text-secondary">
                  <DollarSign size={16} />
                  <span className="font-semibold">${(job.price_cents / 100).toFixed(2)}</span>
                </div>

                {job.duration_minutes && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock size={16} />
                    <span>{job.duration_minutes} minutes</span>
                  </div>
                )}

                {job.notes && (
                  <div className="text-sm text-text-muted mt-2">
                    <strong>Notes:</strong> {job.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              {job.status === 'scheduled' && (
                <Button
                  size="sm"
                  onClick={() => handleMarkComplete(job.id)}
                  disabled={updatingJobId === job.id}
                >
                  <CheckCircle size={16} className="mr-1" />
                  Complete
                </Button>
              )}
              {job.status === 'completed' && job.payment_status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkPaid(job.id)}
                  disabled={updatingJobId === job.id}
                >
                  <DollarSign size={16} className="mr-1" />
                  Mark Paid
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

