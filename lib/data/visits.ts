import { Package } from '@/types'
import { getPrice } from '@/lib/pricing'

/**
 * Generate customer visits with simplified fixed frequency scheduling
 * (Seasonal scheduling has been replaced with consistent year-round service)
 */
export function generateCustomerVisits(
  customerId: string,
  packageType: Package,
  lawnSize: 'small' | 'medium' | 'large' = 'medium',
  startDate: Date = new Date()
) {
  const visits = []
  let currentDate = new Date(startDate)
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

  // Fixed frequency (days between visits)
  const frequencyDays = getFrequencyDays(packageType)

  // Calculate price for visits
  const price = getPrice(lawnSize, packageType)

  while (currentDate <= endDate) {
    // Create visit
    visits.push({
      customer_id: customerId,
      scheduled_date: currentDate.toISOString().split('T')[0],
      status: 'scheduled',
      estimated_duration_minutes: getEstimatedDuration(lawnSize),
      price_cents: Math.round(price * 100),
      // Note: season field deprecated for new visits
    })

    // Move to next visit date
    currentDate = new Date(currentDate)
    currentDate.setDate(currentDate.getDate() + frequencyDays)
  }

  return visits
}

/**
 * Get fixed frequency in days based on package type
 * Standard: Every 4 weeks (28 days)
 * Premium: Every 2 weeks (14 days)
 */
function getFrequencyDays(packageType: Package): number {
  const frequencies: Record<Package, number> = {
    standard: 28,  // Every 4 weeks
    premium: 14,   // Every 2 weeks
  }
  return frequencies[packageType]
}

function getEstimatedDuration(lawnSize: string): number {
  const durations: Record<string, number> = {
    small: 30,
    medium: 45,
    large: 60,
  }
  return durations[lawnSize] || 45
}
