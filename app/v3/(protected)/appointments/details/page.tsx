"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  statusPillClasses,
  isCancellableStatus,
} from "@/lib/appointmentFormatters"
import { useAppointmentStatusPoll } from "@/hooks/useAppointmentStatusPoll"
import HomeVisitStatusBanner from "@/components/v3/HomeVisitStatusBanner"
import CancelAppointmentDialog from "@/components/v3/CancelAppointmentDialog"
import RefundStatusLine from "@/components/v3/RefundStatusLine"

function AppointmentDetailInner() {
  const id = useSearchParams().get("id") ?? ""
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
      const result = await v3CancelAppointment(id)
      if (result.refund) {
        toast.success(
          `Appointment cancelled. ₹${result.refund.amount} refund initiated.`,
        )
      } else if (result.refundDeclinedReason === "PAST_REFUND_WINDOW") {
        toast.success(
          "Appointment cancelled. No refund — past the refund window.",
        )
      } else {
        toast.success("Appointment cancelled")
      }
      router.push("/v3/appointments")
    } catch (e) {
      setCancelError(
        e instanceof Error ? e.message : "Failed to cancel appointment",
      )
      setCancelling(false)
    }
  }, [id, router])

  const isHomeVisit = appt?.bookingType === "HOME_VISIT"
  const baseStatus = appt
    ? isHomeVisit
      ? appt.visitStatus
      : appt.clinicStatus
    : ""

  const polled = useAppointmentStatusPoll(id, !!appt && isHomeVisit, baseStatus)

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

  const isGrooming = appt.category === "grooming"
  const status = polled?.visitStatus ?? baseStatus
  const canModifyOrCancelLive =
    polled?.canModifyOrCancel ?? appt.canModifyOrCancel
  const startOtp = polled?.startOtp ?? null

  const apptType = !isHomeVisit
    ? formatAppointmentType(appt.appointmentTypeName)
    : null
  const address = isHomeVisit ? appt.address : null
  const canReschedule =
    !isHomeVisit && canModifyOrCancelLive && isCancellableStatus(status)

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

      {isHomeVisit && (
        <HomeVisitStatusBanner
          visitStatus={status}
          doctorName={appt.doctorName}
          startOtp={startOtp}
        />
      )}

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

        {/* Amount paid */}
        {appt.payment && (
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Amount paid
            </p>
            <p className="text-sm text-gray-700">₹{appt.payment.amount}</p>
          </div>
        )}

        {/* Refund status */}
        {appt.refund && (
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Refund
            </p>
            <RefundStatusLine refund={appt.refund} verbose />
          </div>
        )}

        {/* Cancellation policy — shown for both booking types while the
            appointment is still cancellable (i.e. not terminal). */}
        {appt.cancellation.allowed && (
          <>
            {(() => {
              // Refund cutoff comes from the server (cancellation.refundCutoffAt),
              // so changing the server-side window updates this copy automatically.
              // Fall back to apptStart − refundCutoffHours (default 24h, in IST)
              // for older servers that don't send the resolved instant. appt.date
              // is YYYY-MM-DD and appt.startTime is HH:mm in IST.
              const hours = appt.cancellation.refundCutoffHours ?? 24
              const apptStartIST = new Date(
                `${appt.date}T${appt.startTime}:00+05:30`,
              )
              const refundCutoff = appt.cancellation.refundCutoffAt
                ? new Date(appt.cancellation.refundCutoffAt)
                : new Date(apptStartIST.getTime() - hours * 60 * 60 * 1000)
              const fmt = (d: Date) =>
                d.toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: "Asia/Kolkata",
                })
              return (
                <div className="px-4 py-3 text-sm text-gray-500">
                  <p>
                    <span className="font-medium text-gray-700">
                      Cancellation policy:
                    </span>{" "}
                    Full refund if cancelled by{" "}
                    <span className="font-medium text-gray-700">
                      {fmt(refundCutoff)}
                    </span>
                    . You can still cancel after that, but no refund will be
                    issued.
                  </p>
                </div>
              )
            })()}
          </>
        )}

        {/* Clinic visit modification deadline */}
        {!isHomeVisit && appt.modificationDeadline ? (
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
        ) : null}
      </div>

      {/* Actions */}
      {(canReschedule ||
        (canModifyOrCancelLive && isCancellableStatus(status))) && (
        <div className="mt-4 space-y-2">
          {canReschedule && (
            <Link
              href={`/v3/appointments/details/reschedule?id=${id}`}
              className="block w-full rounded-xl border border-secondary-1 text-secondary-1 hover:bg-secondary-1/5 text-center text-sm font-medium py-3"
            >
              Reschedule appointment
            </Link>
          )}
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-3"
          >
            Cancel appointment
          </button>
        </div>
      )}

      <CancelAppointmentDialog
        open={confirming}
        isHomeVisit={isHomeVisit}
        petName={appt.petName}
        date={appt.date}
        startTime={appt.startTime}
        cancellation={appt.cancellation}
        cancelling={cancelling}
        error={cancelError}
        onConfirm={handleCancel}
        onClose={() => {
          setConfirming(false)
          setCancelError(null)
        }}
      />
    </div>
  )
}

export default function AppointmentDetailPage() {
  return (
    <Suspense fallback={null}>
      <AppointmentDetailInner />
    </Suspense>
  )
}
