"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingCategory } from "@/model/typeDefinitions";
import ModalImage from "@/public/assets/images/Booking/girlWithDogModalImage.png";

import Image from "next/image";
import CustomButton from "./CustomButton";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;

  onNext?: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="  sm:w-full  md:w-1/3 h-[380px] md:h-[400px] relative">
            <Image
              src={ModalImage}
              alt="Vet with dog"
              fill
              className="object-cover object-top"
            />
          </div>

          <div className="w-full md:w-2/3 p-6 flex flex-col items-center justify-center gap-12">
            <p>
              Our doctors must examine your animal before a surgery. This
              booking will be for a vet consultation, post which a{" "}
              <span className="font-semibold">surgery</span> may be booked in
              the clinic
            </p>

            <div className="flex justify-end ">
              <CustomButton
                buttonBackground="bg-secondary-1"
                buttonText="Next"
                buttonClickEvent={onClose}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
