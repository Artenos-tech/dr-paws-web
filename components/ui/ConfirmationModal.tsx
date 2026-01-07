import React from "react"
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

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
}) => {
  const { petName, service, doctorName, location, date, slot, couponCode } =
    bookingDetails

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
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <MapPinIcon className="w-4 h-4 mr-2" />
              <span>{location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>
                {format(date, "MMMM d, yyyy")} at {slot}
              </span>
            </div>
            {bookingDetails.reasonForVisit && (
              <div className="flex items-center text-sm text-gray-600 my-1">
                <span className="font-medium">Reason:</span>
                <span className="ml-2">{bookingDetails.reasonForVisit}</span>
              </div>
            )}
            {bookingDetails.reasonDescription && (
              <div className="flex items-center text-sm text-gray-600 my-1">
                <span className="font-medium">Description:</span>
                <span className="ml-2">{bookingDetails.reasonDescription}</span>
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
            className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-[#5281a2] border border-[#5281a2] hover:bg-[#5281a2] hover:text-white transition-colors text-sm sm:text-base flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base flex-1 bg-[#5281a2] hover:bg-[#3a6d8e] transition-colors`}
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
