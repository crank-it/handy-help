'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/booking/ProgressBar'
import { generateSchedule } from '@/lib/scheduling'
import { calculateAnnualCost } from '@/lib/pricing'

export default function SchedulePage() {
  const router = useRouter()
  const { bookingData } = useBooking()

  useEffect(() => {
    // Redirect if no package selected
    if (!bookingData.package || !bookingData.lawnSize) {
      router.push('/book/package')
    }
  }, [bookingData.package, bookingData.lawnSize, router])

  const schedule = useMemo(() => {
    if (!bookingData.package) return []
    return generateSchedule(bookingData.package, new Date())
  }, [bookingData.package])

  const pricing = useMemo(() => {
    if (!bookingData.lawnSize || !bookingData.package) return null
    return calculateAnnualCost(bookingData.lawnSize, bookingData.package)
  }, [bookingData.lawnSize, bookingData.package])

  // Group visits by season
  const visitsBySeason = useMemo(() => {
    return schedule.reduce((acc, visit) => {
      if (!acc[visit.season]) {
        acc[visit.season] = []
      }
      acc[visit.season].push(visit)
      return acc
    }, {} as Record<string, typeof schedule>)
  }, [schedule])

  const seasonOrder = ['summer', 'autumn', 'winter', 'spring'] as const
  const seasonEmoji: Record<string, string> = {
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
    spring: '🌸'
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/book/package"
          className="text-brand-primary hover:text-brand-secondary font-semibold mb-6 inline-block"
        >
          ← Back
        </Link>

        <ProgressBar currentStep={4} totalSteps={5} stepName="Schedule" />

        <div className="bg-white rounded-xl p-8 border border-border mb-6">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Your Seasonal Schedule
          </h1>
          <p className="text-text-secondary mb-8">
            When we'll visit over the next 12 months.
          </p>

          {/* Pricing Summary */}
          {pricing && (
            <Card className="bg-brand-primary/5 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm text-text-muted mb-1">Price per visit</p>
                  <p className="text-3xl font-mono font-bold text-brand-primary">
                    ${pricing.perVisit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Estimated annual visits</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {pricing.estimatedAnnualVisits} visits
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Estimated annual cost</p>
                  <p className="text-2xl font-bold text-text-primary">
                    ${pricing.estimatedAnnualCost}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Season-by-season timeline */}
          <div className="space-y-6">
            {seasonOrder.map((season) => {
              const visits = visitsBySeason[season] || []
              if (visits.length === 0) return null

              return (
                <div key={season}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{seasonEmoji[season]}</span>
                    <h3 className="text-xl font-bold text-brand-primary capitalize">
                      {season}
                    </h3>
                    <span className="text-sm text-text-muted">
                      ({visits.length} visit{visits.length > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {visits.map((visit, idx) => (
                      <div
                        key={idx}
                        className="bg-bg-muted rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="text-text-primary">
                          {visit.date.toLocaleDateString('en-NZ', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-sm text-text-muted">{visit.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-text-primary">
              <strong>Note:</strong> Actual visit dates may be adjusted based on weather conditions
              and your lawn's specific needs. We'll always notify you in advance.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-8"
            onClick={() => router.push('/book/details')}
          >
            Looks Good - Continue →
          </Button>
        </div>
      </div>
    </div>
  )
}
