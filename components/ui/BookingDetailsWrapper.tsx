"use client";

import React, { useState } from "react";
import BookingDetails from "@/components/ui/BookingDetails";
import SelectVet from "@/components/ui/SelectVet";
import BackButton from "./BackButton";

interface WrapperProps {
  bookingId: string;
}

const BookingDetailsWrapper: React.FC<WrapperProps> = ({ bookingId }) => {
  const [currentView, setCurrentView] = useState<"BookingDetails" | "selectVet">("BookingDetails");

  const handleNavigation = (view: "BookingDetails" | "selectVet") => {
    setCurrentView(view);
  };
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow ">
      <main className="w-full h-full flex flex-col  my-5 row-start-2 items-center">
        {currentView === "BookingDetails" && (
          <BookingDetails bookingId={bookingId} onReschedule={() => handleNavigation("selectVet")} />
        )}
        {currentView === "selectVet" && (
          <div className="w-full">
            <BackButton />
            <SelectVet
            // bookingId={bookingId}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingDetailsWrapper;
