"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  UserRound,
} from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import toast, { Toaster } from "react-hot-toast"

import {
  v3GetAppointment,
  v3RescheduleAppointment,
  type V3AppointmentListItem,
  type V3GroomingSlot,
} from "@/services/api.v3"
import StepVetDateTime from "@/components/v3/booking/StepVetDateTime"
import { StepGroomingDateTime } from "@/components/v3/booking/ClinicGroomingFlow"
import {
  formatAppointmentType,
  formatDate,
  formatTime,
  isCancellableStatus,
} from "@/lib/appointmentFormatters"

type Selection = {
  doctorId: string
  doctorName: string
  date: string
  startTime: string
  endTime: string
}

function displayError(e: unknown): string {
  const err = e as Error & { errorCode?: string }
  if (err?.errorCode === "SLOT_UNAVAILABLE") {
    return "That slot is no longer available. Please choose another time."
  }
  return e instanceof Error ? e.message : "Something went wrong"
}

export default function RescheduleAppointmentPage() {
  const { id } = useParams<{ id: string }>()

  const [appt, setAppt] = useState<V3AppointmentListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [editingSelection, setEditingSelection] = useState(false)
  const [confirmedSelection, setConfirmedSelection] =
    useState<Selection | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    v3GetAppointment(id)
      .then(setAppt)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load appointment"),
      )
      .finally(() => setLoading(false))
  }, [id])

  const canReschedule =
    !!appt &&
    appt.bookingType === "CLINIC_VISIT" &&
    appt.canModifyOrCancel &&
    isCancellableStatus(appt.clinicStatus)

  const handleSubmit = useCallback(async () => {
    if (!selection) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await v3RescheduleAppointment(id, {
        doctorId: selection.doctorId,
        date: selection.date,
        startTime: selection.startTime,
      })
      setConfirmedSelection(selection)
    } catch (e) {
      setSubmitError(displayError(e))
      setSubmitting(false)
    }
  }, [id, selection])

  const handleSelectionChange = useCallback((nextSelection: Selection | null) => {
    setSelection(nextSelection)
    setSubmitError(null)
    if (nextSelection) setEditingSelection(false)
  }, [])

  const handleEditSelection = useCallback(() => {
    setEditingSelection(true)
    setSubmitError(null)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (error || !appt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-sm text-gray-500">
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

  if (!canReschedule) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <Link
          href={`/v3/appointments/${id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Appointment details
        </Link>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          This appointment cannot be rescheduled.
        </div>
      </div>
    )
  }

  const isGrooming = appt.category === "grooming"

  if (confirmedSelection) {
    return (
      <RescheduleConfirmed
        petName={appt.petName}
        clinicName={appt.clinicName}
        isGrooming={isGrooming}
        previous={{
          date: appt.date,
          startTime: appt.startTime,
          doctorName: appt.doctorName,
        }}
        selection={confirmedSelection}
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Toaster position="top-center" />
      <Link
        href={`/v3/appointments/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Appointment details
      </Link>

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h1 className="font-roca text-xl text-primary-1">
          Reschedule appointment
        </h1>
        <div className="mt-3 grid gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-gray-400" />
            <span>{appt.petName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <span>{appt.clinicName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>
              Current: {formatDate(appt.date)} at {formatTime(appt.startTime)}
            </span>
          </div>
          {appt.appointmentTypeName && (
            <p className="text-xs text-gray-500">
              {formatAppointmentType(appt.appointmentTypeName)}
            </p>
          )}
        </div>
      </div>

      {(!selection || editingSelection) &&
        (isGrooming ? (
          <GroomingReschedulePicker
            appointment={appt}
            onSelect={handleSelectionChange}
          />
        ) : (
          <StepVetDateTime
            clinicId={appt.clinicId}
            priceInRupees={0}
            seniorPriceInRupees={0}
            mode="reschedule"
            onSelect={(doctor, date, slot) =>
              handleSelectionChange({
                doctorId: doctor.id,
                doctorName: doctor.name,
                date,
                startTime: slot.startTime,
                endTime: slot.endTime,
              })
            }
            onSeniorVetPicked={(doctor, date, slot) =>
              handleSelectionChange({
                doctorId: doctor.id,
                doctorName: doctor.name,
                date,
                startTime: slot.startTime,
                endTime: slot.endTime,
              })
            }
            onSelectionInvalidated={() => handleSelectionChange(null)}
          />
        ))}

      {selection && !editingSelection && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {isGrooming ? "Date & time" : "Vet & schedule"}
              </p>
              {!isGrooming && (
                <p className="mt-1 font-semibold text-primary-1">
                  {selection.doctorName}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-600">
                {formatDate(selection.date)} at{" "}
                {formatTime(selection.startTime)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleEditSelection}
              className="text-sm font-medium text-secondary-1 hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {selection && !editingSelection && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="font-roca text-lg text-primary-1">Review</h2>
          <div className="mt-3 grid gap-3 text-sm">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Current
              </p>
              <p className="mt-1 text-gray-400 line-through decoration-gray-400">
                {formatDate(appt.date)} at {formatTime(appt.startTime)}
              </p>
              {!isGrooming && (
                <p className="text-gray-400 line-through decoration-gray-400">
                  {appt.doctorName}
                </p>
              )}
            </div>
            <div className="rounded-xl border border-secondary-1/30 bg-secondary-1/5 px-3 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-secondary-1">
                New
              </p>
              <p className="mt-1 font-semibold text-primary-1">
                {formatDate(selection.date)} at{" "}
                {formatTime(selection.startTime)}
              </p>
              {!isGrooming && (
                <p className="text-gray-600">{selection.doctorName}</p>
              )}
            </div>
          </div>
          {submitError && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-1 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting && <ClipLoader color="#ffffff" size={14} />}
            {submitting ? "Rescheduling..." : "Confirm reschedule"}
          </button>
        </div>
      )}
    </div>
  )
}

function GroomingReschedulePicker({
  appointment,
  onSelect,
}: {
  appointment: V3AppointmentListItem
  onSelect: (selection: Selection | null) => void
}) {
  if (!appointment.groomingTypeKey) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
        Unable to reschedule this grooming appointment because service details
        are unavailable.
      </div>
    )
  }

  return (
    <StepGroomingDateTime
      clinicId={appointment.clinicId}
      groomingTypeKey={appointment.groomingTypeKey}
      petId={appointment.petId}
      onSelectionInvalidated={() => onSelect(null)}
      onSelect={(date: string, slot: V3GroomingSlot) => {
        const groomerId = slot.groomerIds[0]
        if (!groomerId) return
        onSelect({
          doctorId: groomerId,
          doctorName: slot.groomerNames[groomerId] ?? "Groomer",
          date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })
      }}
    />
  )
}

function RescheduleConfirmed({
  petName,
  clinicName,
  isGrooming,
  previous,
  selection,
}: {
  petName: string
  clinicName: string
  isGrooming: boolean
  previous: {
    date: string
    startTime: string
    doctorName: string
  }
  selection: Selection
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="font-roca text-2xl text-primary-1">
          Appointment rescheduled
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {petName}&apos;s appointment at {clinicName} has been updated.
        </p>

        <div className="mt-5 grid gap-3 text-left">
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Previous appointment
            </p>
            <p className="mt-1 text-gray-400 line-through decoration-gray-400">
              {formatDate(previous.date)} at {formatTime(previous.startTime)}
            </p>
            {!isGrooming && (
              <p className="text-sm text-gray-400 line-through decoration-gray-400">
                {previous.doctorName}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-secondary-1/30 bg-secondary-1/5 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-1">
              New appointment
            </p>
            <p className="mt-1 font-semibold text-primary-1">
              {formatDate(selection.date)} at {formatTime(selection.startTime)}
            </p>
            {!isGrooming && (
              <p className="text-sm text-gray-600">{selection.doctorName}</p>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          <Link
            href="/v3/appointments"
            className="rounded-xl bg-secondary-1 py-3 text-sm font-medium text-white"
          >
            View appointments
          </Link>
        </div>
      </div>
    </div>
  )
}
