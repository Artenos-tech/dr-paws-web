"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAPICall } from "@/hooks/apicall"
import atHomeClient from "@/services/api.athome"
import { Loader2, AlertCircle } from "lucide-react"

const HomeVisitPaymentStatus: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState("loading")
  const { call: getOrderStatus } = useAPICall(atHomeClient.getOrderStatus)

  useEffect(() => {
    const verifyPaymentForOrder = async (orderid: string) => {
      try {
        const result = await getOrderStatus({ orderid })
        console.log("Payment verification result", result)
        if (!result.ok) {
          console.log("Error message from API", result.error)
          setStatus("error")
          return
        }
        const paymentStatus = result.value.body.data.order_payment.status
        const appointmentDetails = result.value.body.data.appointment
        setStatus(paymentStatus)
        if (paymentStatus === "PAID" && appointmentDetails) {
          // Add a small delay before redirect for better UX
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
        console.error("Failed to verify payment")
        setStatus("error")
      }
    }
    const orderId = searchParams.get("order_id")
    console.log("Payment status page", orderId)
    if (orderId) {
      verifyPaymentForOrder(orderId)
    } else {
      setStatus("error")
    }
  }, [])
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
              Payment successful! Redirecting to your appointments...
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
      <h1 className="text-2xl font-bold mb-6 text-center">Payment Status</h1>
      {renderContent()}
    </div>
  )
}

export default function HomeVisitPaymentStatusPage() {
  return (
    <Suspense>
      <HomeVisitPaymentStatus />
    </Suspense>
  )
}
