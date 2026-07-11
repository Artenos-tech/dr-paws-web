// Frontend-only config for known discount codes: the discount-code-applications
// backend only confirms/records an application, it never returns a discount
// amount, so the amount and which offerings a code applies to are configured
// here. Different offerings (vet consultation, grooming, ...) can have
// different codes — a code only takes effect for the offerings listed in
// `appliesTo`.
export type AppointmentOfferingType = "VET_CONSULTATION" | "GROOMING"

export type DiscountCodeConfig = {
  type: "percentage"
  value: number
  appliesTo: AppointmentOfferingType[]
}

export const DISCOUNT_CODES: Record<string, DiscountCodeConfig> = {
  PAWS50: { type: "percentage", value: 50, appliesTo: ["VET_CONSULTATION"] },
}

export function getApplicableDiscount(
  code: string | null | undefined,
  offeringType: string | null | undefined,
): DiscountCodeConfig | undefined {
  if (!code) return undefined
  const config = DISCOUNT_CODES[code.toUpperCase()]
  if (!config) return undefined
  if (!offeringType) return undefined
  if (!config.appliesTo.includes(offeringType as AppointmentOfferingType)) {
    return undefined
  }
  return config
}
