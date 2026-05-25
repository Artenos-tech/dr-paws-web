import ClipLoader from "react-spinners/ClipLoader"
import { formatDate, formatTime } from "@/lib/appointmentFormatters"
import type { V3HomeVisitCancellation } from "@/services/api.v3"

interface Props {
  open: boolean
  isHomeVisit: boolean
  petName: string
  // "YYYY-MM-DD"
  date: string
  // "HH:mm"
  startTime: string
  // The home-visit cancellation policy snapshot for this appointment.
  // Pass null for clinic visits (no refund concept).
  cancellation: V3HomeVisitCancellation | null
  cancelling: boolean
  error: string | null
  onConfirm: () => void
  onClose: () => void
}

export default function CancelAppointmentDialog({
  open,
  isHomeVisit,
  petName,
  date,
  startTime,
  cancellation,
  cancelling,
  error,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null

  const refund = cancellation?.refund ?? null
  const refundDeclined = cancellation?.refundDeclinedReason ?? null

  return (
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
          {petName}&apos;s {isHomeVisit ? "home visit" : "clinic visit"} on{" "}
          {formatDate(date)} at {formatTime(startTime)} will be cancelled. This
          cannot be undone.
        </p>
        {refund && (
          <p className="mt-2 text-sm text-emerald-700">
            You&apos;ll receive a full refund of ₹{refund.amount}.
          </p>
        )}
        {refundDeclined === "PAST_REFUND_WINDOW" && (
          <p className="mt-2 text-sm text-amber-700">
            <span className="font-medium">No refund will be issued</span> — this
            appointment is within 24 hours of the scheduled start time.
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
            onClick={onClose}
            disabled={cancelling}
            className="rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm px-3 py-1.5 disabled:opacity-60"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={cancelling}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1.5 disabled:opacity-60"
          >
            {cancelling && <ClipLoader color="#ffffff" size={14} />}
            {cancelling ? "Cancelling…" : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  )
}
