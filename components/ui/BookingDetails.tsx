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
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

type BookingDetailsProps = {
  appointmentId: string;
  onReschedule: () => void;
};

const cancelReasons = [
  "Another commitment has come up",
  "I'm sick / unwell",
  "I have to travel out of the city",
  "My pet doesn't need the treatment anymore",
  "I've visited / will visit another clinic",
];

const rescheduleReasons = [
  "Another commitment has come up",
  "I'm sick / unwell",
  "I have to travel out of the city",
  "My pet needs the treatment later",
];

const BookingDetails: React.FC<BookingDetailsProps> = ({
  appointmentId,
  onReschedule,
}) => {
  const [bookingDetails, setBookingDetails] = useState<AppointmentType | null>(
    null
  );

  const [currentView, setCurrentView] = useState<
    "default" | "cancel" | "reschedule"
  >("default");

  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState<string | null>(null);

  const [cancelFlowEnd, setCancelFlowEnd] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false);

  const navigate = useRouter();

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = () => {
    const foundAppointment = mockAppointments.find(
      (appointment: AppointmentType) => appointment.id === appointmentId
    );
    if (foundAppointment) {
      setBookingDetails(foundAppointment);
    }
  };

  const handleCancelBooking = () => {
    setCancelFlowEnd(true);
    if (bookingDetails) {
      // Update status to Cancelled
      setBookingDetails({
        ...bookingDetails,
        status: AppointmentStatus.Cancelled,
      });
      setCurrentView("default"); // Switch back to the default view
    }
  };

  const handleCancelNo = () => {
    setCurrentView("default");
    setCancelReason(null);
    setShowValidationMessage(false);
  };

  const handleRescheduleNo = () => {
    setRescheduleReason(null);
    setCurrentView("default");
    setShowValidationMessage(false);
  };

  const handleYesClick = (reason: string | null, onConfirm: () => void) => {
    if (reason) {
      onConfirm();
    } else {
      setShowValidationMessage(true);
    }
  };

  const isCancelled = bookingDetails?.status === AppointmentStatus.Cancelled;

  return (
    <div className="w-full h-full">
      <BackButton />

      {currentView === "default" && (
        <div className="flex flex-col justify-center gap-4 items-center">
          {/* Dynamic heading */}
          <h1 className="text-3xl">
            {isCancelled ? "Booking Cancelled" : "Your Booking"}
          </h1>

          <div
            className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center 
            ${isCancelled ? "bg-gray-200 opacity" : "bg-[#FFFCF3]"} ${
              bookingDetails?.status === "Past"
                ? "bg-primary-3"
                : "bg-[#FFFCF3]"
            }`}
          >
            <p className="text-lg font-semibold mt-4">
              {bookingDetails?.petName} is scheduled with{" "}
              {bookingDetails?.vetName}
            </p>
            <p>for {bookingDetails?.service} consultation</p>

            <div className="flex items-center my-4">
              {bookingDetails && (
                <>
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
                </>
              )}
            </div>
            <div className="my-4 space-y-3">
              <p
                className={`flex items-center gap-2 ${
                  isCancelled ? "line-through" : ""
                }`}
              >
                <span className="text-secondary-1">
                  <GrLocation />
                </span>{" "}
                {bookingDetails?.clinicAddress || "Andheri West Clinic"}
              </p>
              <p
                className={`flex items-center gap-2 ${
                  isCancelled ? "line-through" : ""
                }`}
              >
                <span className="text-secondary-1">
                  <HiOutlineCalendar />
                </span>
                {bookingDetails && customDate(bookingDetails.date)}
              </p>
              <p
                className={`flex items-center gap-2 ${
                  isCancelled ? "line-through" : ""
                }`}
              >
                <span className="text-secondary-1">
                  <MdOutlineAccessTime />
                </span>

                {bookingDetails?.time}
              </p>
            </div>
            {!isCancelled && bookingDetails?.status === "Upcoming" && (
              <div className="flex justify-center mb-4 mt-2 items-center gap-2 w-full md:w-[75%]">
                <button
                  onClick={() => setCurrentView("cancel")}
                  className="w-full md:w-1/2 text-xs md:text-sm border-2 border-secondary-1 bg-transparent py-2 text-secondary-1 font-semibold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setCurrentView("reschedule")}
                  className=" w-full md:w-1/2 text-xs md:text-sm border-2 border-secondary-1 bg-transparent py-2 text-secondary-1 font-semibold rounded-full"
                >
                  Reschedule
                </button>
              </div>
            )}
            {cancelFlowEnd && (
              <div className="flex items-center">
                <CustomButton
                  buttonText="Done"
                  buttonBackground="bg-secondary-1"
                  buttonClickEvent={() => navigate.push("/user/my-appointments")}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === "cancel" && (
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-3xl">Cancel Booking</h1>
          <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-6 items-center bg-[#FFFCF3] rounded-lg">
            <h1 className="text-center text-2xl font-semibold font-sans">
              Are you sure you want to cancel this booking?
            </h1>
            <p>You will receive a cancellation email for the booking.</p>
            <div className="space-y-3">
              {cancelReasons.map((reason, index) => (
                <div className="flex items-start gap-2" key={index}>
                  <input
                    type="radio"
                    id={`reason${index}`}
                    name="cancelReason"
                    value={reason}
                    onChange={() => setCancelReason(reason)}
                    className="mt-1.5"
                  />
                  <label htmlFor={`reason${index}`} className="">
                    {reason}
                  </label>
                </div>
              ))}
            </div>
            {/* Validation Message */}
            {showValidationMessage && !cancelReason && (
              <p className="text-red-500 text-sm">
                Please select a reason to proceed.
              </p>
            )}
            <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
              <button
                onClick={handleCancelNo}
                className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleYesClick(cancelReason, handleCancelBooking);
                }}
                className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
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
          <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-8 items-center bg-[#FFFCF3] rounded-lg">
            <h1 className="text-center text-2xl font-semibold font-sans">
              Are you sure you want to reschedule this booking?
            </h1>
            <p>You will receive an email for the rescheduled booking</p>
            <div className="space-y-3">
              {rescheduleReasons.map((reason, index) => (
                <div className="flex items-start gap-2" key={index}>
                  <input
                    type="radio"
                    id={`rescheduleReason${index}`}
                    name="rescheduleReason"
                    value={reason}
                    onChange={() => setRescheduleReason(reason)}
                    className="mt-1.5"
                  />
                  <label htmlFor={`rescheduleReason${index}`} className="">
                    {reason}
                  </label>
                </div>
              ))}
            </div>
            {showValidationMessage && !rescheduleReason && (
              <p className="text-red-500 text-sm">
                Please select a reason to proceed.
              </p>
            )}
            <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
              <button
                onClick={handleRescheduleNo}
                className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
              >
                No
              </button>
              <button
                onClick={() => {
                  handleYesClick(rescheduleReason, onReschedule);
                }}
                className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
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
