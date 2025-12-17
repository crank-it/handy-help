import { Season, Package, ScheduledVisit } from '@/types'

export function getSeason(date: Date): Season {
  const month = date.getMonth() // 0-11
  if (month >= 11 || month <= 1) return 'summer'  // Dec, Jan, Feb
  if (month >= 2 && month <= 3) return 'autumn'   // Mar, Apr
  if (month >= 4 && month <= 7) return 'winter'   // May-Aug
  return 'spring'                                  // Sep, Oct, Nov
}

export function getFrequencyDays(season: Season, pkg: Package): number | null {
  const frequencies = {
    standard: {
      summer: 28,   // 4 weeks
      autumn: 35,   // 5 weeks
      winter: null, // paused
      spring: 28    // 4 weeks
    },
    premium: {
      summer: 14,   // 2 weeks
      autumn: 21,   // 3 weeks
      winter: 30,   // 1 month
      spring: 18    // 2-3 weeks average
    }
  }
  return frequencies[pkg][season]
}

export function generateSchedule(
  pkg: Package,
  startDate: Date,
  months: number = 12
): ScheduledVisit[] {
  const visits: ScheduledVisit[] = []
  let currentDate = new Date(startDate)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + months)

  while (currentDate < endDate) {
    const season = getSeason(currentDate)
    const frequencyDays = getFrequencyDays(season, pkg)

    if (frequencyDays !== null) {
      visits.push({
        date: new Date(currentDate),
        season,
        frequency: `Every ${frequencyDays / 7} weeks`
      })
      currentDate.setDate(currentDate.getDate() + frequencyDays)
    } else {
      // Winter pause for standard - skip to spring (September)
      currentDate.setMonth(8)
      currentDate.setDate(1)
      if (currentDate <= startDate) {
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      }
    }
  }

  return visits
}
