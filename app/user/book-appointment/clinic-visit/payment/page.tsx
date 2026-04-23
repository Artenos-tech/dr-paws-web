"use client"
import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { Loader2, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

const POLL_INTERVAL_MS = 3000
// Max time to wait for the webhook to create the appointment after PAID status
const MAX_PAID_WAIT_MS = 30000

const ClinicVisitPaymentStatus: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState("loading")
  const { call: getOrderStatus } = useAPICall(api.getClinicPaymentOrderStatus)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const paidTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasRedirectedRef = useRef(false)
  const getOrderStatusRef = useRef(getOrderStatus)
  getOrderStatusRef.current = getOrderStatus

  const orderId = searchParams.get("order_id")

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

    const verifyPaymentForOrder = async () => {
      if (hasRedirectedRef.current) return

      try {
        const result = await getOrderStatusRef.current({ orderid: orderId })
        if (!result.ok) {
          console.log("Error message from API", result.error)
          stopPolling()
          stopPaidTimeout()
          setStatus("error")
          return
        }

        const paymentStatus = result.value.body.data.order_payment.status
        const appointmentDetails = result.value.body.data.appointment
        setStatus(paymentStatus)

        if (paymentStatus === "PAID" && appointmentDetails) {
          // Payment confirmed and appointment created — redirect to thank-you
          hasRedirectedRef.current = true
          stopPolling()
          stopPaidTimeout()
          setTimeout(() => {
            const params = new URLSearchParams({
              appointmentId: appointmentDetails.id,
              subBookingId: appointmentDetails.sub_booking_id,
            })
            router.push(`/user/thank-you?${params.toString()}`)
          }, 1500)
        } else if (paymentStatus === "PAID" && !appointmentDetails) {
          // Payment confirmed but webhook hasn't created the appointment yet —
          // keep polling, but start a max-wait timeout if not already running
          if (!paidTimeoutRef.current) {
            paidTimeoutRef.current = setTimeout(() => {
              stopPolling()
              setStatus("PAID_TIMEOUT")
            }, MAX_PAID_WAIT_MS)
          }
        } else if (
          paymentStatus === "ACTIVE" ||
          paymentStatus === "EXPIRED" ||
          paymentStatus === "TERMINATED" ||
          paymentStatus === "TERMINATION_REQUESTED"
        ) {
          // Terminal non-success states — stop polling immediately
          stopPolling()
          stopPaidTimeout()
        }
      } catch {
        toast.error("Failed to verify payment")
        stopPolling()
        stopPaidTimeout()
        setStatus("error")
      }
    }

    verifyPaymentForOrder()
    pollingRef.current = setInterval(verifyPaymentForOrder, POLL_INTERVAL_MS)

    return () => {
      stopPolling()
      stopPaidTimeout()
    }
  }, [orderId, router])

  const service = searchParams.get("service") || null

  const BackToBookingButton = () => (
    <button
      onClick={() => router.push("/user/book-appointment")}
      className="mt-2 text-sm text-secondary-1 underline underline-offset-2"
    >
      Back to booking
    </button>
  )

  const ViewAppointmentsButton = () => (
    <button
      onClick={() => router.push("/user/my-appointments")}
      className="text-sm text-secondary-1 underline underline-offset-2"
    >
      Check My Appointments
    </button>
  )

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-center text-primary-1">Verifying your payment</p>
          </div>
        )

      case "PAID":
        // PAID but appointment not yet created — waiting for webhook
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-center text-primary-1">
              Payment successful! Confirming your appointment...
            </p>
          </div>
        )

      case "PAID_TIMEOUT":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              Your payment was received but we&apos;re taking longer than usual
              to confirm your appointment. Please contact support and we&apos;ll
              sort it out right away.
            </p>
            <ViewAppointmentsButton />
          </div>
        )

      case "ACTIVE":
        // User backed out of Cashfree checkout without completing payment
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              Payment was not completed. You can start a new booking whenever
              you&apos;re ready.
            </p>
            <BackToBookingButton />
          </div>
        )

      case "EXPIRED":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              Your payment session expired. Please start a new booking.
            </p>
            <BackToBookingButton />
          </div>
        )

      case "TERMINATED":
      case "TERMINATION_REQUESTED":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              This payment was cancelled. Please start a new booking.
            </p>
            <BackToBookingButton />
          </div>
        )

      case "error":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              We couldn&apos;t verify your payment status. Please contact
              support for assistance.
            </p>
            <ViewAppointmentsButton />
          </div>
        )

      default:
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p>Payment status: {status}</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Payment Status{" "}
        {service ? `for ${service.replace("_", " ")} booking` : ``}{" "}
      </h1>
      {renderContent()}
    </div>
  )
}

export default function ClinicVisitPaymentStatusPage() {
  return (
    <Suspense fallback={<Loader2 />}>
      <ClinicVisitPaymentStatus />
    </Suspense>
  )
}
