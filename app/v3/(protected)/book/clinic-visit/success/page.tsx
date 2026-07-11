"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CalendarDays, CheckCircle2, Loader2 } from "lucide-react"

import { v3GetAppointment, type V3AppointmentListItem } from "@/services/api.v3"

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

function ClinicVisitSuccess({
  appointment,
}: {
  appointment: V3AppointmentListItem
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const rows = [
    { label: "Pet", value: appointment.petName },
    { label: "Clinic", value: appointment.clinicName },
    { label: "Vet", value: appointment.doctorName },
    { label: "Date", value: formatDate(appointment.date) },
    {
      label: "Time",
      value: `${formatTime(appointment.startTime)} – ${formatTime(
        appointment.endTime,
      )}`,
    },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="flex justify-center mb-5">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <h2 className="font-roca text-2xl text-primary-1 mb-2">
        Booking confirmed!
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Your appointment has been successfully scheduled.
      </p>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-left mb-8">
        {rows.map(({ label, value }) => (
          <div key={label} className="px-4 py-3 flex justify-between gap-4">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-primary-1 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>

      <a
        href="/v3/appointments"
        className="inline-flex items-center gap-2 rounded-xl bg-secondary-1 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full justify-center"
      >
        <CalendarDays className="h-4 w-4" />
        View appointments
      </a>
    </div>
  )
}

function ClinicVisitSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")
  const [appointment, setAppointment] = useState<V3AppointmentListItem | null>(
    null,
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!appointmentId) {
      setError(true)
      return
    }
    let cancelled = false
    v3GetAppointment(appointmentId)
      .then((appt) => {
        if (!cancelled) {
          setAppointment(appt)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [appointmentId])

  if (appointment) {
    return <ClinicVisitSuccess appointment={appointment} />
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <AlertCircle className="h-7 w-7 text-amber-600" />
        <p className="text-primary-1">
          Your appointment is confirmed, but we couldn&apos;t load the details
          here. You can view it from your appointments.
        </p>
        <button
          onClick={() => router.push("/v3/appointments")}
          className="rounded-xl bg-secondary-1 px-5 py-2.5 text-sm font-semibold text-white"
        >
          View appointments
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-10">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )
}

export default function ClinicVisitSuccessPage() {
  return (
    <Suspense fallback={<Loader2 className="m-8 h-5 w-5 animate-spin" />}>
      <ClinicVisitSuccessContent />
    </Suspense>
  )
}
