"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookingCategory } from "@/model/typeDefinitions";
import ModalImage from "@/public/assets/images/Booking/girlWithDogModalImage.png";

import Image from "next/image";
import Button from "./Button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: BookingCategory[];
  onNext?: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedItems,
  onNext,
}: BookingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-[200px] md:h-[400px] relative">
            <Image
              src={ModalImage}
              alt="Vet with dog"
              fill
              className="object-cover"
            />
          </div>


          <div className="w-full md:w-2/3 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                Our doctors must examine your animal before a surgery
              </h2>
              <p className="text-gray-600">
                This booking will be for a vet consultation, post which a{" "}
                <span className="font-bold">surgery</span>. may be booked in the
                clinic
              </p>
            </div>


            <div className="mb-8">
              <h3 className="font-semibold mb-2">Selected Services:</h3>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <div key={item.id} className="text-sm text-gray-600">
                    • {item.title}
                  </div>
                ))}
              </div>
            </div>


            <div className="flex justify-end">
              <Button buttonBackground="bg-secondary-1" buttonText="Next" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
