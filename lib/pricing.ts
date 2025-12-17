import { LawnSize, Package, PricingInfo } from '@/types'

const PRICING_MATRIX = {
  small: { standard: 45, premium: 55 },
  medium: { standard: 60, premium: 70 },
  large: { standard: 80, premium: 95 },
}

export function getPrice(lawnSize: LawnSize, pkg: Package): number {
  return PRICING_MATRIX[lawnSize][pkg]
}

export function calculateAnnualCost(
  lawnSize: LawnSize,
  pkg: Package
): PricingInfo {
  const perVisit = getPrice(lawnSize, pkg)
  const estimatedAnnualVisits = pkg === 'standard' ? 9 : 17

  return {
    perVisit,
    estimatedAnnualVisits,
    estimatedAnnualCost: perVisit * estimatedAnnualVisits
  }
}
