"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"

import {
  v3GetHomeVisitAppointment,
  type V3HomeVisitAppointment,
} from "@/services/api.v3"
import { HomeVisitSuccess } from "@/components/v3/booking/HomeVisitFlow"

function HomeVisitSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("appointmentId")
  const [appointment, setAppointment] = useState<V3HomeVisitAppointment | null>(
    null,
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!appointmentId) {
      setError(true)
      return
    }
    let cancelled = false
    v3GetHomeVisitAppointment(appointmentId)
      .then((appt) => {
        if (!cancelled) setAppointment(appt)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [appointmentId])

  if (appointment) {
    return <HomeVisitSuccess appointment={appointment} />
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <AlertCircle className="h-7 w-7 text-amber-600" />
        <p className="text-primary-1">
          Your home visit is confirmed, but we couldn&apos;t load the details
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

export default function HomeVisitSuccessPage() {
  return (
    <Suspense fallback={<Loader2 className="m-8 h-5 w-5 animate-spin" />}>
      <HomeVisitSuccessContent />
    </Suspense>
  )
}
