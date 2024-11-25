"use client";

import { mockAppointments } from "@/model/mockData";
import { AppointmentStatus, AppointmentType } from "@/model/typeDefinitions";
import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import Image from "next/image";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCalendar } from "react-icons/hi";
import { customDate } from "./UpcomingAppointmentCard";

type BookingDetailsProps = {
  bookingId: string;
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ bookingId }) => {
  const [bookingDetails, setBookingDetails] = useState<AppointmentType | null>(
    null
  );
  const [currentView, setCurrentView] = useState<"default" | "cancel" | "reschedule">("default");

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = () => {
    const foundAppointment = mockAppointments.find(
      (appointment: AppointmentType) => appointment.id === bookingId
    );
    if (foundAppointment) {
      setBookingDetails(foundAppointment);
    }
  };

  const isCancelled = bookingDetails?.status === AppointmentStatus.Cancelled;

  if (!bookingDetails) return <p>Loading...</p>;

  return (
    <div className="w-full h-full">
      <BackButton />

      {currentView === "default" && (
        <div className="flex flex-col justify-center gap-4 items-center">
          <h1 className="text-3xl">Your Booking</h1>

          <div
            className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center ${
              isCancelled ? "bg-gray-200 opacity" : "bg-[#FFFCF3]"
            }`}
          >
            <p className="text-lg font-semibold mt-4">
              {bookingDetails.petName} is scheduled with {bookingDetails.vetName}
            </p>
            <p>for {bookingDetails.service} consultation</p>

            <div className="flex items-center my-4">
              <Image
                src={bookingDetails.petImage}
                alt="pet-image"
                width={130}
                height={130}
              />
              <Image
                src={bookingDetails.vetImage}
                alt="vet-image"
                width={130}
                height={130}
                className="ml-[-30px]"
              />
            </div>
            <div className="my-4 space-y-3">
              <p className={`flex items-center gap-2 ${isCancelled ? "line-through" : ""}`}>
                <span className="text-secondary-1">
                  <GrLocation />
                </span>{" "}
                {bookingDetails.clinicAddress || "Andheri West Clinic"}
              </p>
              <p className={`flex items-center gap-2 ${isCancelled ? "line-through" : ""}`}>
                <span className="text-secondary-1">
                  <HiOutlineCalendar />
                </span>
                {customDate(bookingDetails.date)}
              </p>
              <p className={`flex items-center gap-2 ${isCancelled ? "line-through" : ""}`}>
                <span className="text-secondary-1">
                  <MdOutlineAccessTime />
                </span>

                {bookingDetails.time}
              </p>
            </div>
            {bookingDetails.status === "Upcoming" && (
              <div className="flex justify-center mb-4 mt-2 items-center gap-4 w-full ">
                <button
                  onClick={() => setCurrentView("cancel")}
                  className="w-full md:w-1/4 text-xs md:text-sm border-2 border-secondary-1 bg-transparent py-2 text-secondary-1 font-semibold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentView("reschedule")}
                  className=" w-full md:w-1/4 text-xs md:text-sm border-2 border-secondary-1 bg-transparent py-2 text-secondary-1 font-semibold rounded-full"
                >
                  Reschedule
                </button>
              </div>
            )}
          </div>
        </div>
      )}

{currentView === "cancel" && (
  <div className="flex flex-col justify-center items-center gap-4">
    <h1 className="text-3xl">Cancel Booking</h1>
    <div
      className="p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-4 items-center bg-[#FFFCF3] rounded-lg"
    >
      <p className="text-center">
        Are you sure you want to cancel this booking? You will receive a cancellation email for the booking.
      </p>
      <div className="space-y-3">
        <div className="flex items-center">
          <input type="radio" id="reason1" name="cancelReason" />
          <label htmlFor="reason1" className="ml-2">Another commitment has come up</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="reason2" name="cancelReason" />
          <label htmlFor="reason2" className="ml-2">I'm sick/unwell</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="reason3" name="cancelReason" />
          <label htmlFor="reason3" className="ml-2">I have to travel out of the city</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="reason4" name="cancelReason" />
          <label htmlFor="reason4" className="ml-2">My pet doesn't need the treatment anymore</label>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentView("default")}
          className="w-24 py-2 bg-gray-300 rounded-full text-sm"
        >
          No
        </button>
        <button
          className="w-24 py-2 bg-red-500 text-white rounded-full text-sm"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

{currentView === "reschedule" && (
  <div className="flex flex-col justify-center items-center gap-4">
    <h1 className="text-3xl">Reschedule Booking</h1>
    <div
      className="p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-4 items-center bg-[#FFFCF3] rounded-lg"
    >
      <p className="text-center">
        Are you sure you want to reschedule this booking? You will receive an email for the rescheduled booking.
      </p>
      <div className="space-y-3">
        <div className="flex items-center">
          <input type="radio" id="rescheduleReason1" name="rescheduleReason" />
          <label htmlFor="rescheduleReason1" className="ml-2">Another commitment has come up</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="rescheduleReason2" name="rescheduleReason" />
          <label htmlFor="rescheduleReason2" className="ml-2">I have to travel out of the city</label>
        </div>
        <div className="flex items-center">
          <input type="radio" id="rescheduleReason3" name="rescheduleReason" />
          <label htmlFor="rescheduleReason3" className="ml-2">My pet needs the treatment later</label>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentView("default")}
          className="w-24 py-2 bg-gray-300 rounded-full text-sm"
        >
          No
        </button>
        <button
          className="w-24 py-2 bg-green-500 text-white rounded-full text-sm"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default BookingDetails;
