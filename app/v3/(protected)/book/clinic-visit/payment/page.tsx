"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"

import {
  v3GetClinicVisitPaymentOrderStatus,
  type V3ClinicVisitPaymentOrderStatus,
} from "@/services/api.v3"

const POLL_INTERVAL_MS = 3000
// Soft net for the rare case where payment is confirmed but appointment
// linking lags. Expiry itself is owned entirely by the server.
const MAX_PAID_WAIT_MS = 30000

function ClinicVisitPaymentStatus() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [status, setStatus] = useState<
    "loading" | V3ClinicVisitPaymentOrderStatus | "PAID_TIMEOUT" | "error"
  >("loading")
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const paidTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    if (!orderId) {
      setStatus("error")
      return
    }

    const stopPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
    const stopPaidTimeout = () => {
      if (paidTimeoutRef.current) {
        clearTimeout(paidTimeoutRef.current)
        paidTimeoutRef.current = null
      }
    }

    const verify = async () => {
      try {
        const result = await v3GetClinicVisitPaymentOrderStatus(orderId)
        const paymentStatus = result.order_payment.status

        if (paymentStatus === "BOOKED" && result.appointment) {
          if (hasRedirectedRef.current) return
          hasRedirectedRef.current = true
          stopPolling()
          stopPaidTimeout()
          const appointmentId = result.appointment.id
          setTimeout(() => {
            router.replace(
              `/v3/book/clinic-visit/success?appointmentId=${encodeURIComponent(
                appointmentId,
              )}`,
            )
          }, 1500)
        } else if (paymentStatus === "BOOKED") {
          setStatus("BOOKED")
          if (!paidTimeoutRef.current) {
            paidTimeoutRef.current = setTimeout(() => {
              stopPolling()
              setStatus("PAID_TIMEOUT")
            }, MAX_PAID_WAIT_MS)
          }
        } else if (paymentStatus === "AWAITING_PAYMENT") {
          // Keep polling; the server decides when this becomes terminal.
        } else {
          stopPolling()
          stopPaidTimeout()
          setStatus(paymentStatus)
        }
      } catch {
        stopPolling()
        stopPaidTimeout()
        setStatus("error")
      }
    }

    void verify()
    pollingRef.current = setInterval(verify, POLL_INTERVAL_MS)

    return () => {
      stopPolling()
      stopPaidTimeout()
    }
  }, [orderId])

  function goToBooking() {
    router.push("/v3/book")
  }

  function goToAppointments() {
    router.push("/v3/appointments")
  }

  const content = (() => {
    if (
      status === "loading" ||
      status === "AWAITING_PAYMENT" ||
      status === "BOOKED"
    ) {
      return (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-center text-primary-1">
            {status === "BOOKED"
              ? "Payment successful. Confirming your appointment..."
              : "Verifying your payment..."}
          </p>
        </div>
      )
    }

    if (status === "PAID_TIMEOUT") {
      return (
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-7 w-7 text-amber-600" />
          <p className="text-center text-primary-1">
            Payment was received, but appointment confirmation is taking longer
            than usual. Please check appointments or contact support.
          </p>
          <button
            onClick={goToAppointments}
            className="text-sm font-medium text-secondary-1 underline underline-offset-2"
          >
            View appointments
          </button>
        </div>
      )
    }

    const message =
      status === "EXPIRED"
        ? "Your payment session expired. If any amount was charged, it will be refunded automatically — no action needed."
        : "We could not verify your payment status."

    return (
      <div className="flex flex-col items-center gap-4">
        <AlertCircle className="h-7 w-7 text-red-600" />
        <p className="text-center text-primary-1">{message}</p>
        <button
          onClick={goToBooking}
          className="text-sm font-medium text-secondary-1 underline underline-offset-2"
        >
          Back to booking
        </button>
      </div>
    )
  })()

  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="mb-6 text-center font-roca text-2xl text-primary-1">
        Payment Status
      </h1>
      {content}
    </div>
  )
}

export default function ClinicVisitPaymentStatusPage() {
  return (
    <Suspense fallback={<Loader2 className="m-8 h-5 w-5 animate-spin" />}>
      <ClinicVisitPaymentStatus />
    </Suspense>
  )
}
