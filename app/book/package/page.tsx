'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBooking } from '@/contexts/BookingContext'
import { Package } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/booking/ProgressBar'
import { cn } from '@/lib/utils'

export default function PackagePage() {
  const router = useRouter()
  const { bookingData, updateBookingData } = useBooking()

  useEffect(() => {
    // Redirect if no lawn size selected
    if (!bookingData.lawnSize) {
      router.push('/book/size')
    }
  }, [bookingData.lawnSize, router])

  const handleSelectPackage = (pkg: Package) => {
    updateBookingData({ package: pkg })
    router.push('/book/schedule')
  }

  return (
    <div className="min-h-screen bg-bg-page py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/book/size"
          className="text-brand-primary hover:text-brand-secondary font-semibold mb-6 inline-block"
        >
          ← Back
        </Link>

        <ProgressBar currentStep={3} totalSteps={5} stepName="Package" />

        <div className="bg-white rounded-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Choose Your Package
          </h1>
          <p className="text-text-secondary mb-8">
            Select the service level that works for you.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard Package */}
            <Card
              className={cn(
                'cursor-pointer transition-all',
                bookingData.package === 'standard' && 'border-brand-primary shadow-lg'
              )}
              onClick={() => handleSelectPackage('standard')}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-brand-primary">Standard Package</h3>
                <Badge variant="info">Popular</Badge>
              </div>
              <p className="text-3xl font-mono font-bold text-brand-primary mb-4">
                $45 – $80 <span className="text-sm font-normal text-text-muted">per visit</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">~8-10 visits per year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Every 4 weeks in summer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Paused during winter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Mowing + clippings removed</span>
                </li>
              </ul>
              <Button
                variant={bookingData.package === 'standard' ? 'primary' : 'secondary'}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectPackage('standard')
                }}
              >
                {bookingData.package === 'standard' ? 'Selected ✓' : 'Select Standard'}
              </Button>
            </Card>

            {/* Premium Package */}
            <Card
              className={cn(
                'cursor-pointer transition-all',
                bookingData.package === 'premium' && 'border-brand-primary shadow-lg'
              )}
              onClick={() => handleSelectPackage('premium')}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-brand-primary">Premium Package</h3>
                <Badge variant="success">Best Value</Badge>
              </div>
              <p className="text-3xl font-mono font-bold text-brand-primary mb-4">
                $55 – $95 <span className="text-sm font-normal text-text-muted">per visit</span>
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">~15-20 visits per year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Every 2 weeks in summer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Monthly visits in winter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Everything in Standard +</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Edge trimming every visit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-text-primary">Priority scheduling</span>
                </li>
              </ul>
              <Button
                variant={bookingData.package === 'premium' ? 'success' : 'secondary'}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectPackage('premium')
                }}
              >
                {bookingData.package === 'premium' ? 'Selected ✓' : 'Select Premium'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
