"use client"
import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAPICall } from "@/hooks/apicall"
import atHomeClient from "@/services/api.athome"
import { Loader2, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

const POLL_INTERVAL_MS = 3000

const HomeVisitPaymentStatus: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState("loading")
  const { call: getOrderStatus } = useAPICall(atHomeClient.getOrderStatus)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
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

    const verifyPaymentForOrder = async () => {
      if (hasRedirectedRef.current) return

      try {
        const result = await getOrderStatusRef.current({ orderid: orderId })
        console.log("Payment verification result", result)
        if (!result.ok) {
          console.log("Error message from API", result.error)
          stopPolling()
          setStatus("error")
          return
        }
        const paymentStatus = result.value.body.data.order_payment.status
        const appointmentDetails = result.value.body.data.appointment
        setStatus(paymentStatus)

        if (paymentStatus === "PAID" && appointmentDetails) {
          hasRedirectedRef.current = true
          stopPolling()
          setTimeout(() => {
            router.push(
              "/user/book-appointment/confirmation?appointment_id=" +
                appointmentDetails.id +
                "&sub_booking_id=" +
                appointmentDetails.sub_booking_id,
            )
          }, 1500)
        }
      } catch {
        toast.error("Failed to verify payment")
        stopPolling()
        setStatus("error")
      }
    }

    verifyPaymentForOrder()
    pollingRef.current = setInterval(verifyPaymentForOrder, POLL_INTERVAL_MS)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [orderId, router])

  const service = searchParams.get("service") || null

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
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-center text-primary-1">
              Payment successful! Redirecting...
            </p>
          </div>
        )

      case "EXPIRED":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              Payment session expired. Please try again.
            </p>
          </div>
        )

      case "ACTIVE":
        return (
          <div className="flex flex-col justify-center items-center space-y-4">
            <AlertCircle />
            <p className="text-center text-primary-1">
              Payment not completed. Please contact one of our clinics if you
              need assistance.
            </p>
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

export default function HomeVisitPaymentStatusPage() {
  return (
    <Suspense fallback={<Loader2 />}>
      <HomeVisitPaymentStatus />
    </Suspense>
  )
}
