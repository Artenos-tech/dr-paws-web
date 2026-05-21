"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  CalendarDays,
  Clock,
  MapPin,
  Stethoscope,
  Home,
  Scissors,
  Building2,
  ChevronLeft,
  X,
  Navigation,
  AlertCircle,
} from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import toast, { Toaster } from "react-hot-toast"
import {
  v3GetAppointment,
  v3CancelAppointment,
  type V3AppointmentListItem,
} from "@/services/api.v3"
import {
  formatDate,
  formatTime,
  formatAppointmentType,
  displayReason,
  statusPillClasses,
  isCancellableStatus,
} from "@/lib/appointmentFormatters"

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [appt, setAppt] = useState<V3AppointmentListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    v3GetAppointment(id)
      .then(setAppt)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load appointment"),
      )
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = useCallback(async () => {
    setCancelling(true)
    setCancelError(null)
    try {
      await v3CancelAppointment(id)
      toast.success("Appointment cancelled")
      router.push("/v3/appointments")
    } catch (e) {
      setCancelError(
        e instanceof Error ? e.message : "Failed to cancel appointment",
      )
      setCancelling(false)
    }
  }, [id, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (error || !appt) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">
          {error ?? "Appointment not found"}
        </p>
        <Link
          href="/v3/appointments"
          className="mt-4 inline-block text-sm text-secondary-1 underline"
        >
          Back to appointments
        </Link>
      </div>
    )
  }

  const isHomeVisit = appt.bookingType === "HOME_VISIT"
  const isGrooming = appt.category === "grooming"
  const status = isHomeVisit ? appt.visitStatus : appt.clinicStatus
  const reason = displayReason(appt.reasonForVisit, isHomeVisit)
  const apptType = !isHomeVisit
    ? formatAppointmentType(appt.appointmentTypeName)
    : null
  const address = isHomeVisit ? appt.address : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Toaster position="top-center" />

      {/* Back navigation */}
      <Link
        href="/v3/appointments"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1 mb-4"
      >
        <ChevronLeft className="h-4 w-4" />
        My Appointments
      </Link>

      {/* Header card */}
      <div
        className={`rounded-xl border bg-white shadow-sm overflow-hidden mb-4 ${
          isHomeVisit
            ? "border-primary-2/40 border-l-4 border-l-primary-2"
            : "border-gray-200 border-l-4 border-l-primary-1"
        }`}
      >
        <div
          className={`px-4 pt-4 pb-3 ${
            isHomeVisit ? "bg-primary-2/25" : "bg-secondary-1/20"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex items-start gap-3">
              <div
                className={`mt-0.5 shrink-0 rounded-full p-2 ${
                  isHomeVisit
                    ? "bg-primary-2 text-primary-1"
                    : "bg-secondary-1 text-white"
                }`}
              >
                {isHomeVisit ? (
                  <Home className="h-4 w-4" />
                ) : isGrooming ? (
                  <Scissors className="h-4 w-4" />
                ) : (
                  <Stethoscope className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-primary-1 truncate">
                  {appt.petName}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2.5 py-0.5 ${
                      isHomeVisit
                        ? "bg-primary-2 text-primary-1"
                        : "bg-secondary-1 text-white"
                    }`}
                  >
                    {isHomeVisit ? "Home Visit" : "Clinic Visit"}
                  </span>
                  {apptType && (
                    <span className="inline-block rounded-full bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5">
                      {apptType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full text-xs font-medium px-2.5 py-1 ring-1 ring-inset ${statusPillClasses(status)}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-100">
        {/* Date & time */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <CalendarDays className="h-4 w-4 text-gray-400 shrink-0" />
            <span>{formatDate(appt.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Clock className="h-4 w-4 text-gray-400 shrink-0" />
            <span>
              {formatTime(appt.startTime)} – {formatTime(appt.endTime)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Building2 className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{appt.clinicName}</span>
          </div>
          {isHomeVisit && address && (
            <>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}, {address.pincode}
                </span>
              </div>
              {address.directions && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Navigation className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{address.directions}</span>
                </div>
              )}
            </>
          )}
          {isHomeVisit && !address && (
            <div className="flex items-center gap-3 text-sm text-gray-500 italic">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span>Address not available</span>
            </div>
          )}
        </div>

        {/* Care team */}
        {!isGrooming && (
          <div className="px-4 py-3 text-sm text-gray-700">
            With <span className="font-medium">{appt.doctorName}</span>
          </div>
        )}

        {/* Reason for visit */}
        {reason && (
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Reason for visit
            </p>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {reason}
            </p>
          </div>
        )}

        {/* Modification deadline */}
        {appt.modificationDeadline && (
          <div className="px-4 py-3 text-sm text-gray-500">
            Can be cancelled until{" "}
            <span className="font-medium text-gray-700">
              {new Date(appt.modificationDeadline).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Cancel */}
      {appt.canModifyOrCancel && isCancellableStatus(status) && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-3"
          >
            Cancel appointment
          </button>
        </div>
      )}

      {/* Confirm cancel modal */}
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
              {appt.petName}&apos;s{" "}
              {isHomeVisit ? "home visit" : "clinic visit"} on{" "}
              {formatDate(appt.date)} at {formatTime(appt.startTime)} will be
              cancelled. This cannot be undone.
            </p>
            {cancelError && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                {cancelError}
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirming(false)
                  setCancelError(null)
                }}
                disabled={cancelling}
                className="rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm px-3 py-1.5 disabled:opacity-60"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={handleCancel}
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
