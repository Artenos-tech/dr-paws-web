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
  CalendarClock,
} from "lucide-react"
import type { V3AppointmentListItem } from "@/services/api.v3"
import {
  formatDate,
  formatTime,
  formatAppointmentType,
  displayReason,
  statusPillClasses,
  isCancellableStatus,
} from "@/lib/appointmentFormatters"
import CancelAppointmentDialog from "@/components/v3/CancelAppointmentDialog"
import RefundStatusLine from "@/components/v3/RefundStatusLine"

interface Props {
  item: V3AppointmentListItem
  href?: string
  rescheduleHref?: string
  onCancel?: (id: string) => Promise<void>
}

export default function AppointmentCard({
  item,
  href,
  rescheduleHref,
  onCancel,
}: Props) {
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
  const canModify = item.canModifyOrCancel && isCancellableStatus(status)
  const canReschedule = !isHomeVisit && canModify && !!rescheduleHref
  const canCancel = canModify && !!onCancel

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

        {isHomeVisit && item.refund && (
          <div className="mt-1">
            <RefundStatusLine refund={item.refund} />
          </div>
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

      {(canReschedule || canCancel) && (
        <div className="px-4 pb-3 flex flex-wrap justify-end gap-2">
          {canReschedule && (
            <Link
              href={rescheduleHref}
              className="inline-flex items-center gap-1 rounded-md border border-secondary-1 text-secondary-1 hover:bg-secondary-1/5 text-sm px-3 py-1.5"
            >
              <CalendarClock className="h-4 w-4" /> Reschedule
            </Link>
          )}
          {canCancel && (
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
          )}
        </div>
      )}

      <CancelAppointmentDialog
        open={confirming}
        isHomeVisit={isHomeVisit}
        petName={item.petName}
        date={item.date}
        startTime={item.startTime}
        cancellation={hvCancellation}
        cancelling={cancelling}
        error={error}
        onConfirm={handleConfirmCancel}
        onClose={() => {
          setConfirming(false)
          setError(null)
        }}
      />
    </div>
  )
}
