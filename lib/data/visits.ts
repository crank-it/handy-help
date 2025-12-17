import { Package, Season } from '@/types'
import { getSeason, getSeasonDates } from '@/lib/scheduling'
import { getPrice } from '@/lib/pricing'

export function generateCustomerVisits(
  customerId: string,
  packageType: Package,
  lawnSize: string = 'medium',
  startDate: Date = new Date()
) {
  const visits = []
  let currentDate = new Date(startDate)
  const endDate = new Date(startDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

  // Skip to start of next season if we're mid-season
  const currentSeason = getSeason(currentDate)
  const seasonDates = getSeasonDates(currentDate.getFullYear())
  const nextSeasonStart = seasonDates.find(
    (s) => s.season === currentSeason
  )?.endDate
  if (nextSeasonStart) {
    currentDate = new Date(nextSeasonStart)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  while (currentDate <= endDate) {
    const season = getSeason(currentDate)

    // Get frequency for this season and package
    const frequency = getFrequency(season, packageType)

    // Skip winter for standard package
    if (frequency === 0) {
      // Move to next season
      const seasonEnd = getSeasonDates(currentDate.getFullYear()).find(
        (s) => s.season === season
      )?.endDate
      if (seasonEnd) {
        currentDate = new Date(seasonEnd)
        currentDate.setDate(currentDate.getDate() + 1)
      } else {
        break
      }
      continue
    }

    // Calculate price for this visit
    const price = getPrice(lawnSize, packageType)

    // Create visit
    visits.push({
      customer_id: customerId,
      scheduled_date: currentDate.toISOString().split('T')[0],
      status: 'scheduled',
      estimated_duration_minutes: getEstimatedDuration(lawnSize),
      price_cents: Math.round(price * 100),
      season,
    })

    // Move to next visit date
    currentDate = new Date(currentDate)
    currentDate.setDate(currentDate.getDate() + frequency)
  }

  return visits
}

function getFrequency(season: Season, packageType: Package): number {
  const frequencies: Record<Season, Record<Package, number>> = {
    summer: { standard: 28, premium: 14 },
    autumn: { standard: 35, premium: 21 },
    winter: { standard: 0, premium: 30 },
    spring: { standard: 28, premium: 18 },
  }
  return frequencies[season][packageType]
}

function getEstimatedDuration(lawnSize: string): number {
  const durations: Record<string, number> = {
    small: 30,
    medium: 45,
    large: 60,
  }
  return durations[lawnSize] || 45
}
