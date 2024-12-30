import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: {
    petName: string;
    service: string;
    doctorName?: string;
    location: string;
    date: Date;
    slot: string;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
}) => {
  const { petName, service, doctorName, location, date, slot } = bookingDetails;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirm Booking
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{petName}</span> is scheduled for a{" "}
            <span className="font-medium">{service}</span> with{" "}
            <span className="font-medium">{doctorName}</span> at our{" "}
            <span className="font-medium">{location}</span>clinic on{" "}
            <span className="font-medium">
              {format(date, "MMMM d, yyyy")} at {slot}.
            </span>
          </p>
          <DialogDescription className="text-sm font-medium text-gray-900">
            Are you sure you want to proceed booking this appointment?
          </DialogDescription>
        </div>
        <DialogFooter className="mt-6 space-x-2">
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
            Next
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
