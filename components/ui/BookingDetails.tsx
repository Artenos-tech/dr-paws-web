"use client";

import { AppointmentType } from "@/model/typeDefinitions";
import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
// import Image from "next/image";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCalendar } from "react-icons/hi";

import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

import { useAppointmentsContext } from "@/context/AppointmentsContext";
import Loader from "@/components/ui/Loader";
import { formatDate, formatTimeRange } from "@/components/ui/AppointmentCard";
import { parse, format, addMinutes } from "date-fns";

import { BsCheckCircleFill } from "react-icons/bs";

export const cancelReasons = [
  "Another commitment has come up",
  "I'm sick / unwell",
  "I have to travel out of the city",
  "My pet doesn't need the treatment anymore",
  "I've visited / will visit another clinic",
];

export const rescheduleReasons = [
  "Another commitment has come up",
  "I'm sick / unwell",
  "I have to travel out of the city",
  "My pet needs the treatment later",
];

type BookingDetailsProps = {
  appointmentId?: string;
  onReschedule?: () => void;
};

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

  const { appointments, loading, selectedAppointment } =
    useAppointmentsContext();

  const navigate = useRouter();

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = () => {
    const foundAppointment = appointments?.find(
      (appointment: AppointmentType) => appointment.id === appointmentId
    );
    if (foundAppointment) {
      setBookingDetails(foundAppointment);
    }
  };

  const handleCancelBooking = () => {
    setCancelFlowEnd(true);
    if (!bookingDetails) return;
    setBookingDetails({
      ...bookingDetails,
      appt_status: "Cancel",
    });
    setCurrentView("default");
    setCurrentView("default");
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

  const isCancelled = bookingDetails?.appt_status === "Cancel";

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const addMinutesToTime = (time: string, minutes: number): string => {
    try {
      const parsedTime = parse(time, "HH:mm", new Date());
      const updatedTime = addMinutes(parsedTime, minutes);
      return format(updatedTime, "HH:mm");
    } catch (error) {
      console.error("Error parsing time:", error);
      return "";
    }
  };

  console.log(selectedAppointment.selectedSlot);

  return (
    <div className="w-full h-full">
      {appointmentId && <BackButton />}

      {currentView === "default" && (
        <div className="flex flex-col justify-center gap-4 items-center">
          {/* Dynamic heading */}
          <h1 className="text-3xl flex items-center gap-4">
            {isCancelled ? (
              "Booking Cancelled"
            ) : !appointmentId ? (
              <>
                Booking Confirmed <BsCheckCircleFill fill="#5281a2" />
              </>
            ) : (
              "Your Booking"
            )}
          </h1>

          <div
            className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center 
            ${isCancelled ? "bg-gray-200 opacity" : "bg-[#FFFCF3]"} ${
              bookingDetails?.appt_status === "Scheduled" ||
              bookingDetails?.appt_status === "Confirm" ||
              bookingDetails?.appt_status === "Check In" ||
              !appointmentId
                ? "bg-primary-3"
                : "bg-[#FFFCF3]"
            }`}
          >
            <p className="text-lg font-semibold mt-4">
              {/* {bookingDetails?.petName} is scheduled with
              {bookingDetails?.vetName} */}
              Pet name is scheduled with Vet name
            </p>
            <p>
              for
              {/* {bookingDetails?.service}  */}
              Grooming consultation
            </p>

            <div className="flex items-center my-4">
              {bookingDetails && (
                <>
                  {/* <Image
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
                  /> */}
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
                {/* {bookingDetails?.clinicAddress */}
                Andheri West Clinic
              </p>
              <p
                className={`flex items-center gap-2 ${
                  isCancelled ? "line-through" : ""
                }`}
              >
                <span className="text-secondary-1">
                  <HiOutlineCalendar />
                </span>
                {bookingDetails
                  ? formatDate(bookingDetails.appt_start?.toString())
                  : !appointmentId &&
                    selectedAppointment.selectedDate &&
                    formatDate(selectedAppointment.selectedDate.toString())}
              </p>
              <p
                className={`flex items-center gap-2 ${
                  isCancelled ? "line-through" : ""
                }`}
              >
                <span className="text-secondary-1">
                  <MdOutlineAccessTime />
                </span>

                {bookingDetails ? (
                  formatTimeRange(
                    bookingDetails.appt_start?.toString(),
                    bookingDetails.appt_end?.toString()
                  )
                ) : (
                  <>
                    {selectedAppointment.selectedSlot} -{" "}
                    {selectedAppointment.selectedSlot
                      ? addMinutesToTime(selectedAppointment.selectedSlot, 30)
                      : ""}
                  </>
                )}
              </p>
            </div>
            {(!isCancelled && bookingDetails?.appt_status === "Complete") ||
              (bookingDetails?.appt_status === "Check In" && (
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
              ))}
            {cancelFlowEnd ||
              (!appointmentId && (
                <div className="flex items-center">
                  <CustomButton
                    buttonText="Done"
                    buttonBackground="bg-secondary-1"
                    buttonClickEvent={() =>
                      navigate.push("/user/my-appointments")
                    }
                  />
                </div>
              ))}
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
                  if (onReschedule) {
                    handleYesClick(rescheduleReason, onReschedule);
                  }
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
