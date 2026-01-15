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

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  bookingDetails: {
    petName: string
    service: string
    doctorName?: string
    reasonForVisit?: string
    reasonDescription?: string
    location: string
    date: Date
    slot: string
    couponCode: string | null
  }
}

const DESC_TRUNCATE_LENGTH = 90

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
}) => {
  const {
    petName,
    service,
    doctorName,
    location,
    date,
    slot,
    couponCode,
    reasonDescription,
    reasonForVisit,
  } = bookingDetails
  const [showFullDesc, setShowFullDesc] = React.useState(false)

  useEffect(() => {
    if (!isOpen) setShowFullDesc(false)
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          </div>
          {couponCode && (
            <div>
              <DialogDescription className="text-md font-medium text-secondary-1">
                Coupon Code applied: <b>{couponCode}</b>
              </DialogDescription>
              <DialogDescription>
                Discount redeemable at checkout
              </DialogDescription>
            </div>
          )}
          <DialogDescription className="text-sm font-medium text-gray-900">
            Are you sure you want to proceed with booking this appointment?
          </DialogDescription>
        </div>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-secondary-1 border border-secondary-1 hover:bg-secondary-1 hover:text-white transition-colors text-sm sm:text-base flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base flex-1 bg-secondary-1 hover:bg-secondary-1 transition-colors"
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
