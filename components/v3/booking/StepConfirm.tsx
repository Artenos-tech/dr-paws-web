"use client"

import { useState } from "react"
import type { CouponPriceResult } from "./CouponField"
import {
  CalendarDays,
  MapPin,
  Dog,
  Cat,
  Bird,
  HelpCircle,
  Star,
} from "lucide-react"
import { load } from "@cashfreepayments/cashfree-js"
import { useAppConfig } from "@/context/AppConfigContext"
import {
  v3InitiateVetAppointment,
  v3FetchVetPrice,
  type V3Pet,
  type V3Clinic,
  type V3Doctor,
  type V3TimeSlot,
  type V3Appointment,
} from "@/services/api.v3"
import CouponField from "./CouponField"

interface Props {
  pet: V3Pet
  clinic: V3Clinic
  doctor: V3Doctor
  date: string
  slot: V3TimeSlot
  priceInRupees?: number | null
  isSeniorVet?: boolean
  bookingFlowSessionId?: string | null
  onSuccess: (appointment: V3Appointment) => void
  onEdit: (section: "pet" | "clinic" | "datetime") => void
}

function PetIcon({ species }: { species?: string | null }) {
  const cls = "h-5 w-5 text-primary-2"
  if (species === "canine") return <Dog className={cls} />
  if (species === "feline") return <Cat className={cls} />
  if (species === "avian") return <Bird className={cls} />
  return <HelpCircle className={cls} />
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

export default function StepConfirm({
  pet,
  clinic,
  doctor,
  date,
  slot,
  priceInRupees,
  isSeniorVet,
  bookingFlowSessionId,
  onSuccess,
  onEdit,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [reasonError, setReasonError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // The coupon code that successfully applied; forwarded to initiate. null when
  // none is applied.
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  )
  const [discountedPriceInRupees, setDiscountedPriceInRupees] = useState<
    number | null
  >(null)
  const [originalPriceInRupees, setOriginalPriceInRupees] = useState<
    number | null
  >(null)
  const [discountInRupees, setDiscountInRupees] = useState<number | null>(null)
  const { clinicVisitPaymentsEnabled } = useAppConfig()

  function handleCouponResult(
    result: CouponPriceResult,
    appliedCode: string | null,
  ) {
    setAppliedCouponCode(appliedCode)
    if (appliedCode && result.discountInRupees != null) {
      setDiscountedPriceInRupees(result.priceInRupees)
      setOriginalPriceInRupees(result.originalPriceInRupees ?? null)
      setDiscountInRupees(result.discountInRupees)
    } else {
      setDiscountedPriceInRupees(null)
      setOriginalPriceInRupees(null)
      setDiscountInRupees(null)
    }
  }

  // The fee actually shown / charged: the discounted price when a coupon is
  // applied, otherwise the base price passed in by the parent.
  const effectivePriceInRupees =
    discountedPriceInRupees ?? priceInRupees ?? null
  // Until the flag resolves, fall back to the legacy "pay at clinic" copy so we
  // never wrongly promise an up-front charge. Booking behaviour itself is
  // server-driven (initiate returns PAYMENT_REQUIRED vs APPOINTMENT_CONFIRMED).
  const paymentsEnabled = clinicVisitPaymentsEnabled === true

  async function handleConfirm() {
    // The API still accepts a missing reason (older mobile clients), but new
    // bookings from this UI must always carry one.
    const trimmedReason = reason.trim()
    if (trimmedReason.length < 3) {
      setReasonError(
        "Please tell us the reason for the visit (at least 3 characters).",
      )
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await v3InitiateVetAppointment({
        clinicId: clinic.id,
        petId: pet.id,
        doctorId: doctor.id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        reasonForVisit: trimmedReason,
        couponCode: appliedCouponCode ?? undefined,
        bookingFlowSessionId: bookingFlowSessionId ?? undefined,
      })
      if (result.action === "APPOINTMENT_CONFIRMED") {
        onSuccess(result.appointment)
        return
      }
      const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as
        | "sandbox"
        | "production"
        | undefined
      if (!cashfreeEnv) {
        throw new Error("Payment environment is not configured")
      }
      const cashfree = await load({ mode: cashfreeEnv })
      await cashfree.checkout({
        paymentSessionId: result.order.paymentSessionId,
        returnUrl:
          window.location.origin +
          "/v3/book/clinic-visit/payment?order_id=" +
          result.order.orderId,
        redirectTarget: "_self",
      })
    } catch (e) {
      const err = e as { errorCode?: string; message?: string }
      setError(
        err.errorCode === "SLOT_UNAVAILABLE"
          ? "This slot is no longer available. Tap 'Vet & appointment time' above to choose a different time."
          : (err.message ?? "Failed to book appointment. Please try again."),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 mb-5">
        {/* Pet */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-2/10 flex items-center justify-center">
            <PetIcon species={pet.species} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Pet
            </div>
            <div className="font-semibold text-primary-1">{pet.name}</div>
          </div>
          <button
            onClick={() => onEdit("pet")}
            className="text-xs font-medium text-primary-2 hover:underline flex-shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Clinic */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-2/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              Clinic
            </div>
            <div className="font-semibold text-primary-1">{clinic.name}</div>
            {clinic.city && (
              <div className="text-sm text-gray-500">{clinic.city}</div>
            )}
          </div>
          <button
            onClick={() => onEdit("clinic")}
            className="text-xs font-medium text-primary-2 hover:underline flex-shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Vet, date & time — grouped as one section */}
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-2/10 flex items-center justify-center mt-0.5">
            <CalendarDays className="h-5 w-5 text-primary-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
              Vet &amp; schedule
            </div>
            <div className="font-semibold text-primary-1">{doctor.name}</div>
            <div className="text-sm text-gray-500 mt-0.5">
              {formatDate(date)}
            </div>
            <div className="text-sm text-gray-500">
              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
            </div>
          </div>
          <button
            onClick={() => onEdit("datetime")}
            className="text-xs font-medium text-primary-2 hover:underline flex-shrink-0 mt-0.5"
          >
            Edit
          </button>
        </div>
      </div>

      {isSeniorVet && (
        <div className="mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Senior Vet selected
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              A higher consultation fee applies for senior vet consultations.
            </p>
          </div>
        </div>
      )}

      <CouponField
        basePriceInRupees={priceInRupees ?? null}
        onFetchPrice={(code) =>
          v3FetchVetPrice({
            doctorId: doctor.id,
            isSenior: !!isSeniorVet,
            couponCode: code,
          })
        }
        onResult={handleCouponResult}
      />

      {effectivePriceInRupees != null && (
        <div
          className={[
            "mb-5 rounded-xl border px-4 py-3",
            isSeniorVet
              ? "border-amber-200 bg-amber-50"
              : "border-gray-200 bg-gray-50",
          ].join(" ")}
        >
          <div className="flex items-baseline justify-between">
            <span
              className={[
                "text-sm font-medium",
                isSeniorVet ? "text-amber-800" : "text-gray-700",
              ].join(" ")}
            >
              {isSeniorVet ? "Senior consultation fee" : "Consultation fee"}
            </span>
            {discountInRupees != null && originalPriceInRupees != null ? (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPriceInRupees}
                </span>
                <span className="font-semibold text-green-700">
                  ₹{effectivePriceInRupees}
                </span>
              </div>
            ) : (
              <span
                className={[
                  "font-semibold",
                  isSeniorVet ? "text-amber-900" : "text-primary-1",
                ].join(" ")}
              >
                ₹{effectivePriceInRupees}
              </span>
            )}
          </div>
          {discountInRupees != null && (
            <p className="mt-1 text-xs font-medium text-green-600">
              You save ₹{discountInRupees} with this offer
            </p>
          )}
          <p
            className={[
              "mt-1 text-xs",
              isSeniorVet ? "text-amber-700" : "text-gray-500",
            ].join(" ")}
          >
            {paymentsEnabled
              ? "Pay now to confirm your appointment."
              : "Payment collected at the clinic."}
          </p>
        </div>
      )}

      <div className="space-y-1 mb-5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Reason for visit <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
            if (reasonError) {
              setReasonError(null)
            }
          }}
          placeholder="e.g. Annual check-up, vaccination, not eating well…"
          rows={3}
          className={[
            "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 resize-none",
            reasonError
              ? "border-red-300 focus:border-red-400 focus:ring-red-400"
              : "border-gray-200 focus:border-primary-2 focus:ring-primary-2",
          ].join(" ")}
        />
        {reasonError && <p className="text-xs text-red-600">{reasonError}</p>}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading
          ? paymentsEnabled
            ? "Starting payment…"
            : "Booking…"
          : paymentsEnabled
            ? "Pay & confirm appointment"
            : "Confirm appointment"}
      </button>
    </div>
  )
}
