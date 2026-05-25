import { useState } from "react"
import { CalendarDays, Clock, MapPin, Stethoscope, Home, X } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import type { V3AppointmentListItem } from "@/services/api.v3"

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

const STATUS_PILL_CLASSES: Record<string, string> = {
  Scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  "Awaiting Confirmation": "bg-amber-50 text-amber-700 ring-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  "Vet Delayed": "bg-amber-50 text-amber-700 ring-amber-200",
  "Vet Arrived": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "Checked In": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "In Progress": "bg-violet-50 text-violet-700 ring-violet-200",
  "In Consultation": "bg-violet-50 text-violet-700 ring-violet-200",
  "Checking Out": "bg-violet-50 text-violet-700 ring-violet-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  "No Show": "bg-gray-100 text-gray-600 ring-gray-200",
  Missed: "bg-gray-100 text-gray-600 ring-gray-200",
}

function statusPillClasses(status: string): string {
  return (
    STATUS_PILL_CLASSES[status] ?? "bg-gray-100 text-gray-700 ring-gray-200"
  )
}

interface Props {
  item: V3AppointmentListItem
  onCancel?: (id: string) => Promise<void>
}

export default function AppointmentCard({ item, onCancel }: Props) {
  const isHomeVisit = item.bookingType === "HOME_VISIT"
  const status = isHomeVisit ? item.visitStatus : item.clinicStatus

  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disabledMessage, setDisabledMessage] = useState<string | null>(null)

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

  // Whether to render a cancel button at all. We use Nidana's
  // canModifyOrCancel as the gate for "this is a live, cancellable
  // appointment". For home visits, an additional Dr Paws refund-window
  // policy may render the button disabled with an explanatory message.
  const showCancelButton = item.canModifyOrCancel && !!onCancel
  const hvCancellation = isHomeVisit ? item.cancellation : null
  const cancelDisabled = hvCancellation ? !hvCancellation.allowed : false
  const refundOnCancel = hvCancellation?.refund ?? null

  function disabledReasonMessage() {
    if (!hvCancellation) return null
    if (hvCancellation.disabledReason === "PAST_REFUND_WINDOW") {
      return "Cancellations are only allowed up to 24 hours before the appointment."
    }
    if (hvCancellation.disabledReason === "NIDANA_LOCKED") {
      return "This appointment can no longer be cancelled."
    }
    return null
  }

  function handleCancelClick() {
    if (cancelDisabled) {
      setDisabledMessage(disabledReasonMessage())
      return
    }
    setConfirming(true)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-primary-1 truncate">
              {item.petName}
            </h3>
            {isHomeVisit ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-1/10 text-primary-1 text-xs px-2 py-0.5">
                <Home className="h-3 w-3" /> Home Visit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
                <Stethoscope className="h-3 w-3" /> Clinic Visit
              </span>
            )}
          </div>
          {item.appointmentTypeName && (
            <p className="text-sm text-gray-500">{item.appointmentTypeName}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full text-xs font-medium px-2.5 py-1 ring-1 ring-inset ${statusPillClasses(status)}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-gray-700">
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
        {isHomeVisit ? (
          item.address ? (
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
          )
        ) : (
          <div className="flex items-start gap-2">
            {/* <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span className="min-w-0">{item.clinicName}</span> */}
          </div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          With <span className="font-medium">{item.doctorName}</span>
        </div>
        {item.reasonForVisit && (
          <p className="text-sm text-gray-500 italic mt-1 line-clamp-2">
            “{item.reasonForVisit}”
          </p>
        )}
      </div>

      {showCancelButton && (
        <div className="mt-3 flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleCancelClick}
            aria-disabled={cancelDisabled}
            className={
              cancelDisabled
                ? "inline-flex items-center gap-1 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed text-sm px-3 py-1.5"
                : "inline-flex items-center gap-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm px-3 py-1.5"
            }
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          {disabledMessage && (
            <p className="text-xs text-gray-500 max-w-xs text-right">
              {disabledMessage}
            </p>
          )}
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
