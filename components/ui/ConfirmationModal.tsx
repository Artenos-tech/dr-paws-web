import React, { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { CalendarIcon, MapPinIcon, UserIcon } from "lucide-react"
import { ClipLoader } from "react-spinners"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
  bookingDetails: {
    petName: string
    service: string
    haircutAddOn?: boolean
    doctorName?: string
    isSenior?: boolean
    reasonForVisit?: string
    reasonDescription?: string
    location: string
    date: Date
    slot: string
    couponCode: string | null
  }
  paymentAmount?: number | null
  pricingSummary?: {
    base_amount: number
    discount_amount: number
    final_amount: number
    coupon_applied: boolean
    coupon_code: string | null
  } | null
  clinicPaymentBreakdown?: {
    fullAmount: number
    tokenAmount: number
    payAtClinicAmount: number
  }
}

const DESC_TRUNCATE_LENGTH = 90

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  bookingDetails,
  paymentAmount,
  pricingSummary,
  clinicPaymentBreakdown,
}) => {
  const {
    petName,
    service,
    haircutAddOn,
    doctorName,
    isSenior,
    location,
    date,
    slot,
    couponCode,
    reasonDescription,
    reasonForVisit,
  } = bookingDetails
  const showHaircutAddOn = Boolean(haircutAddOn)
  const [showFullDesc, setShowFullDesc] = React.useState(false)

  useEffect(() => {
    if (!isOpen) setShowFullDesc(false)
  }, [isOpen])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && isSubmitting) return
        onClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-secondary-1">
            Confirm Booking
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="bg-primary-3 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2 text-secondary-1">
              {petName}&apos;s Appointment
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">{service}</span>
            </p>
            {showHaircutAddOn && !clinicPaymentBreakdown && (
              <p className="text-xs sm:text-sm text-[#8b5a00] font-semibold mb-2">
                Haircut add-on: + ₹999
              </p>
            )}
            {doctorName && (
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <UserIcon className="w-4 h-4 mr-2" />
                <span>{doctorName}</span>
              </div>
            )}
            <div className="flex items-start text-sm text-gray-600 mb-1">
              <MapPinIcon className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
              <span className="break-words">
                {location || "No location specified"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>
                {format(date, "MMMM d, yyyy")} at {slot}
              </span>
            </div>
            {reasonForVisit && (
              <div className="flex items-center text-sm text-gray-600 my-1">
                <span className="font-medium">Reason For Visit:</span>
                <span className="ml-2">{reasonForVisit}</span>
              </div>
            )}
            {reasonDescription && (
              <div className="text-sm text-gray-600 my-1">
                <div className="flex items-start gap-2">
                  <span className="font-medium whitespace-nowrap">Notes:</span>

                  <p className="break-words whitespace-pre-line">
                    {showFullDesc
                      ? reasonDescription
                      : reasonDescription.slice(0, DESC_TRUNCATE_LENGTH) +
                        (reasonDescription.length > DESC_TRUNCATE_LENGTH
                          ? "..."
                          : "")}
                  </p>
                </div>

                {reasonDescription.length > DESC_TRUNCATE_LENGTH && (
                  <button
                    onClick={() => setShowFullDesc((prev) => !prev)}
                    className="text-secondary-1 text-xs mt-1"
                  >
                    {showFullDesc ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {clinicPaymentBreakdown && (
              <div className="text-sm text-gray-800 font-medium mt-3 max-w-80">
                <p className="font-semibold text-gray-700 mb-2">
                  Payment summary
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between gap-3">
                    <span>Total service price</span>
                    <span className="font-semibold">
                      ₹{clinicPaymentBreakdown.fullAmount}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Pay at clinic</span>
                    <span className="font-semibold">
                      ₹{clinicPaymentBreakdown.payAtClinicAmount}
                    </span>
                  </div>
                </div>
                <div className="my-2.5 border-t border-gray-300" />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-700">
                    Pay now to confirm booking
                  </span>
                  <span className="text-xl font-bold text-secondary-1">
                    ₹{clinicPaymentBreakdown.tokenAmount}
                  </span>
                </div>
                <p className="mt-2 text-xs text-green-600">
                  A token amount is charged now to confirm your booking. The
                  remaining amount will be paid at the clinic.
                </p>
              </div>
            )}

            {!clinicPaymentBreakdown && (pricingSummary || paymentAmount) && (
              <div className="text-sm text-gray-800 font-medium mt-2">
                {pricingSummary ? (
                  <div className="flex items-center gap-2">
                    <span>Payment Amount:</span>
                    {pricingSummary.discount_amount > 0 && (
                      <span className="text-gray-500 line-through">
                        ₹{pricingSummary.base_amount}
                      </span>
                    )}
                    <span className="text-md font-semibold">
                      ₹{pricingSummary.final_amount}
                    </span>
                  </div>
                ) : (
                  <>
                    Payment Amount:{" "}
                    <span className="text-md font-semibold">
                      ₹{paymentAmount}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          {couponCode && (
            <div>
              <DialogDescription className="text-md font-medium text-secondary-1">
                Coupon Code applied: <b>{couponCode}</b>
              </DialogDescription>
              <DialogDescription>
                Discount included in payment amount
              </DialogDescription>
            </div>
          )}
          {isSenior && (
            <DialogDescription className="text-sm font-medium text-amber-700">
              Senior vet has been selected and the charge will be higher at
              ₹900.
            </DialogDescription>
          )}
          <DialogDescription className="text-sm font-medium text-gray-900">
            Are you sure you want to proceed with booking this appointment?
          </DialogDescription>
        </div>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-[#5281a2] border border-[#5281a2] hover:bg-[#5281a2] hover:text-white transition-colors text-sm sm:text-base flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base flex-1 bg-[#5281a2] hover:bg-[#3a6d8e] transition-colors`}
          >
            {isSubmitting ? (
              <span className="flex justify-center items-center gap-2">
                <ClipLoader size={16} color="white" />
                Confirming...
              </span>
            ) : (
              "Confirm"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
