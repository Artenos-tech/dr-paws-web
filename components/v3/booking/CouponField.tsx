"use client"

import { useState } from "react"
import { Tag, X } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"

// The subset of the price response the CouponField cares about. Each flow
// passes a fetcher that hits its own price endpoint, so this component stays
// service-agnostic.
export interface CouponPriceResult {
  priceInRupees: number
  originalPriceInRupees?: number
  discountInRupees?: number
  couponApplied?: string
  couponError?: string | null
}

interface Props {
  // Fetches the price for a given coupon code (undefined = base price). The
  // parent owns the resulting price state; this component only drives the input
  // and renders applied/rejected feedback.
  onFetchPrice: (couponCode?: string) => Promise<CouponPriceResult>
  // The price before any coupon, used to derive the discount/strikethrough
  // shown here — the server only ever returns the resulting priceInRupees and
  // a couponError, never a discount breakdown, so it's computed client-side.
  basePriceInRupees: number | null
  // Prefill value (e.g. a coupon code that arrived via the URL).
  initialCouponCode?: string
  // Fired whenever a fetch resolves, so the parent can update its price display
  // and decide whether to forward the coupon to the initiate call.
  onResult: (
    result: CouponPriceResult,
    appliedCouponCode: string | null,
  ) => void
}

export default function CouponField({
  onFetchPrice,
  basePriceInRupees,
  initialCouponCode,
  onResult,
}: Props) {
  const [couponCode, setCouponCode] = useState(initialCouponCode ?? "")
  const [applying, setApplying] = useState(false)
  // The currently applied (successful) coupon, or null when none is applied.
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discountInRupees, setDiscountInRupees] = useState<number | null>(null)
  const [originalPriceInRupees, setOriginalPriceInRupees] = useState<
    number | null
  >(null)
  const [newPriceInRupees, setNewPriceInRupees] = useState<number | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)

  async function handleApply() {
    const code = couponCode.trim()
    if (!code) {
      return
    }
    setApplying(true)
    setCouponError(null)
    setRequestError(null)
    try {
      const result = await onFetchPrice(code)
      // The server only ever signals rejection via couponError — it never
      // sends a couponApplied flag, so gating on that (as this used to)
      // treated every successful application as invalid.
      if (result.couponError) {
        setAppliedCoupon(null)
        setDiscountInRupees(null)
        setOriginalPriceInRupees(null)
        setNewPriceInRupees(null)
        setCouponError(result.couponError)
        onResult(result, null)
        return
      }
      const discount =
        basePriceInRupees != null
          ? Math.max(0, basePriceInRupees - result.priceInRupees)
          : null
      setAppliedCoupon(code)
      setDiscountInRupees(discount)
      setOriginalPriceInRupees(basePriceInRupees)
      setNewPriceInRupees(result.priceInRupees)
      onResult(
        {
          ...result,
          discountInRupees: discount ?? undefined,
          originalPriceInRupees: basePriceInRupees ?? undefined,
          couponApplied: code,
        },
        code,
      )
    } catch (e) {
      setRequestError(
        (e as Error).message ?? "Couldn't apply that coupon. Try again.",
      )
    } finally {
      setApplying(false)
    }
  }

  async function handleRemove() {
    setApplying(true)
    setCouponError(null)
    setRequestError(null)
    try {
      const result = await onFetchPrice(undefined)
      setAppliedCoupon(null)
      setCouponCode("")
      setDiscountInRupees(null)
      setOriginalPriceInRupees(null)
      setNewPriceInRupees(null)
      onResult(result, null)
    } catch (e) {
      setRequestError(
        (e as Error).message ?? "Couldn't remove the coupon. Try again.",
      )
    } finally {
      setApplying(false)
    }
  }

  if (appliedCoupon) {
    return (
      <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Tag className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-green-700">
                Coupon {appliedCoupon} applied
              </div>
              {originalPriceInRupees !== null && newPriceInRupees !== null && (
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="text-sm text-gray-400 line-through">
                    ₹{originalPriceInRupees}
                  </span>
                  <span className="text-sm font-semibold text-green-700">
                    ₹{newPriceInRupees}
                  </span>
                </div>
              )}
              {discountInRupees !== null && (
                <p className="mt-0.5 text-xs font-medium text-green-600">
                  You save ₹{discountInRupees}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={applying}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-60 flex-shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Have a coupon code?
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
          className={[
            "flex-1 rounded-lg border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1",
            couponError
              ? "border-amber-300 focus:border-amber-400 focus:ring-amber-400"
              : "border-gray-200 focus:border-primary-2 focus:ring-primary-2",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={applying || !couponCode.trim()}
          className="rounded-lg bg-secondary-1 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {applying ? <ClipLoader color="#ffffff" size={14} /> : "Apply"}
        </button>
      </div>
      {couponError && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {couponError}
        </p>
      )}
      {requestError && (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {requestError}
        </p>
      )}
    </div>
  )
}
