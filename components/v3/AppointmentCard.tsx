import { useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
  Home,
  X,
  Scissors,
} from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import type { V3AppointmentListItem } from "@/services/api.v3"
import {
  formatDate,
  formatTime,
  formatAppointmentType,
  displayReason,
  statusPillClasses,
  isCancellableStatus,
} from "@/lib/appointmentFormatters"

interface Props {
  item: V3AppointmentListItem
  href?: string
  onCancel?: (id: string) => Promise<void>
}

export default function AppointmentCard({ item, href, onCancel }: Props) {
  const isHomeVisit = item.bookingType === "HOME_VISIT"
  const isGrooming = item.category === "grooming"
  const status = isHomeVisit ? item.visitStatus : item.clinicStatus
  const reason = displayReason(item.reasonForVisit, isHomeVisit)
  const apptType = !isHomeVisit
    ? formatAppointmentType(item.appointmentTypeName)
    : null

  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmCancel = async () => {
    if (!onCancel) return
    setCancelling(true)
    setError(null)
    try {
      await onCancel(item.id)
      setConfirming(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to cancel appointment")
    } finally {
      setCancelling(false)
    }
  }

  // The Dr Paws refund-window policy doesn't disable cancellation itself
  // — it only affects whether a refund is issued. Past-window cancellations
  // are still allowed; the confirm dialog explains the refund consequence.
  const hvCancellation = isHomeVisit ? item.cancellation : null
  const refundOnCancel = hvCancellation?.refund ?? null
  const refundDeclinedReason = hvCancellation?.refundDeclinedReason ?? null

  const cardContent = (
    <>
      {/* Header band */}
      <div
        className={`px-4 pt-3 pb-2 flex items-start justify-between gap-3 ${
          isHomeVisit ? "bg-primary-2/25" : "bg-secondary-1/20"
        }`}
      >
        <div className="min-w-0 flex items-start gap-2.5">
          <div
            className={`mt-0.5 shrink-0 rounded-full p-1.5 ${
              isHomeVisit
                ? "bg-primary-2 text-primary-1"
                : "bg-secondary-1 text-white"
            }`}
          >
            {isHomeVisit ? (
              <Home className="h-3.5 w-3.5" />
            ) : isGrooming ? (
              <Scissors className="h-3.5 w-3.5" />
            ) : (
              <Stethoscope className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-primary-1 truncate">
                {item.petName}
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2.5 py-0.5 ${
                  isHomeVisit
                    ? "bg-primary-2 text-primary-1"
                    : "bg-secondary-1 text-white"
                }`}
              >
                {isHomeVisit ? "Home Visit" : "Clinic Visit"}
              </span>
            </div>

            {apptType && (
              <span className="mt-1 inline-block rounded-full bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5">
                {apptType}
              </span>
            )}
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full text-xs font-medium px-2.5 py-1 ring-1 ring-inset ${statusPillClasses(status)}`}
        >
          {status}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 grid grid-cols-1 gap-1.5 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
          <span>{formatDate(item.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400 shrink-0" />
          <span>
            {formatTime(item.startTime)} – {formatTime(item.endTime)}
          </span>
        </div>

        {isHomeVisit &&
          (item.address ? (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="min-w-0">
                {item.address.line1}
                {item.address.line2 ? `, ${item.address.line2}` : ""},{" "}
                {item.address.pincode}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 italic">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span>Address not available</span>
            </div>
          ))}

        {!isGrooming && (
          <div className="text-sm text-gray-600">
            With <span className="font-medium">{item.doctorName}</span>
          </div>
        )}

        {reason && (
          <p className="text-sm text-gray-500 italic mt-0.5 whitespace-pre-line line-clamp-3">
            &ldquo;{reason}&rdquo;
          </p>
        )}
      </div>
    </>
  )

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm overflow-hidden ${
        isHomeVisit
          ? "border-primary-2/40 border-l-4 border-l-primary-2"
          : "border-gray-200 border-l-4 border-l-primary-1"
      }`}
    >
      {href ? (
        <Link href={href} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}

      {item.canModifyOrCancel && isCancellableStatus(status) && onCancel && (
        <div className="px-4 pb-3 flex justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setConfirming(true)
            }}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm px-3 py-1.5"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
      )}

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h4 className="font-roca text-lg text-primary-1 mb-1">
              Cancel this appointment?
            </h4>
            <p className="text-sm text-gray-600">
              {item.petName}&apos;s{" "}
              {isHomeVisit ? "home visit" : "clinic visit"} on{" "}
              {formatDate(item.date)} at {formatTime(item.startTime)} will be
              cancelled. This cannot be undone.
            </p>
            {refundOnCancel && (
              <p className="mt-2 text-sm text-emerald-700">
                You&apos;ll receive a full refund of ₹{refundOnCancel.amount}.
              </p>
            )}
            {refundDeclinedReason === "PAST_REFUND_WINDOW" && (
              <p className="mt-2 text-sm text-amber-700">
                <span className="font-medium">No refund will be issued</span> —
                this appointment is within 24 hours of the scheduled start time.
              </p>
            )}
            {isHomeVisit && (
              <p className="mt-3 text-xs text-gray-500">
                <span className="font-medium">Cancellation policy:</span> Full
                refund if cancelled at least 24 hours before the appointment. No
                refund for later cancellations.
              </p>
            )}
            {error && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirming(false)
                  setError(null)
                }}
                disabled={cancelling}
                className="rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm px-3 py-1.5 disabled:opacity-60"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1.5 disabled:opacity-60"
              >
                {cancelling && <ClipLoader color="#ffffff" size={14} />}
                {cancelling ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
