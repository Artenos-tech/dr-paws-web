import React from "react";
import CustomButton from "./CustomButton";

const NoAppointments = () => {
  return (
    <div className="w-full flex flex-col justify-start gap-3 items-center">
      <h1 className="text-secondary-1 text-lg text-center">You haven&apos;t booked any visits yet</h1>
      <CustomButton
        buttonText="Book a Visit"
        buttonBackground="bg-secondary-1"
      />
    </div>
  );
};

export default NoAppointments;
