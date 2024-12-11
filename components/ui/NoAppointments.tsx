"use client";

import React from "react";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

const NoAppointments = () => {
  const navigate = useRouter();
  return (
    <div className="w-full flex flex-col justify-start gap-3 items-center">
      <h1 className="text-secondary-1 text-lg text-center">You haven&apos;t booked any visits yet</h1>
      <CustomButton
        buttonText="Book a Visit"
        buttonBackground="bg-secondary-1"
        buttonClickEvent={() => navigate.push("/user/book-appointment")}
      />
    </div>
  );
};

export default NoAppointments;
