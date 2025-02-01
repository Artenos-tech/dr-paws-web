"use client";

import { AppointmentType } from "@/model/typeDefinitions";
import React, { useState } from "react";
import BackButton from "./BackButton";
import { MdOutlineAccessTime } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCalendar } from "react-icons/hi";
import Image from "next/image";
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp";
import { doctorImagesMap } from "@/model/mockData";
import { petImageByType } from "./PetCard";
import { CircleX } from "lucide-react";
import CustomButton from "./CustomButton";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";

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
  selectedAppointment: AppointmentType;
  goBack: () => void;
  // onReschedule?: () => void;
};

const BookingDetails: React.FC<BookingDetailsProps> = ({
  selectedAppointment,
  goBack,
}) => {
  const [currentView, setCurrentView] = useState<
    "default" | "cancelConfirm" | "rescheduled" | "cancelled" | "rescheduleConfirm"
  >("default");
  const [cancelReason, setCancelReason] = useState<string>("");
  // const [rescheduleReason, setRescheduleReason] = useState<string>("");
  const [showCancelValidationMessage, setShowCancelValidationMessage] = useState<boolean>(false);
  // const [showRescheduleValidationMessage, setShowRescheduleValidationMessage] = useState<boolean>(false);
  const defaultPetImageByType =
    petImageByType[selectedAppointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other;
  const { call: cancelAppointment } = useAPICall(api.cancelAppointment);

  const handleCancelClick = () => {
    setCurrentView("cancelConfirm");
  };

  // const handleRescheduleClick = () => {
  //   setCurrentView("rescheduleConfirm");
  // };

  const resetView = () => {
    setCancelReason("");
    setShowCancelValidationMessage(false);
    // setRescheduleReason("");
    // setShowRescheduleValidationMessage(false);
    setCurrentView("default");
  };

  const cancelBooking = async () => {
    if (!cancelReason) {
      setShowCancelValidationMessage(true);
      return;
    }
    console.log("Cancelling booking");
    console.log("cancelReason", cancelReason);
    await cancelAppointment({
      appointmentid: selectedAppointment.id,
      clinic_id: selectedAppointment.clinic_id,
      vet_id: selectedAppointment.vet_vetport_id,
      pet_id: selectedAppointment.pet_vetport_id,
      pet_name: selectedAppointment.pet_name,
      appt_start: selectedAppointment.appt_start,
      appt_end: selectedAppointment.appt_end,
      reason: cancelReason,
    });
    setCurrentView("cancelled");
  }

  // const rescheduleBooking = async () => {
  //   if (!rescheduleReason) {
  //     setShowRescheduleValidationMessage(true);
  //     return;
  //   }
  //   console.log("Rescheduling booking");
  //   console.log("rescheduleReason", rescheduleReason);
  //   // await api.rescheduleBooking(selectedAppointment.id, rescheduleReason);
  //   setCurrentView("rescheduled");
  //   // navigate.push("/user/book-appointment")
  // }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <BackButton navigateBack={goBack} />

      {currentView === "default" && (
      <div className="flex flex-col justify-center gap-4 items-center">
        <h1 className="text-2xl sm:text-3xl flex items-center gap-4">Your Booking</h1>

        <div
          className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center ${
            selectedAppointment.category === "PAST"
              ? "bg-primary-3"
              : "bg-[#FFFCF3]"
          }`}
        >
          <p className="text-lg font-semibold mt-4 text-center">
            {selectedAppointment.category === "PAST"
              ? selectedAppointment.appt_type === "Grooming"
                ? `${selectedAppointment.pet_name} had a ${selectedAppointment.appt_type} session`
                : `${selectedAppointment.pet_name} visited ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`
              : selectedAppointment.appt_type !== "Grooming"
              ? `${selectedAppointment.pet_name} is scheduled for a ${selectedAppointment.appt_type} with ${selectedAppointment.vet_name}`
              : `${selectedAppointment.pet_name} is scheduled for a ${selectedAppointment.appt_type} session`}
          </p>
          <div className="flex items-center my-4 relative">
            {
              <>
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
                  <Image
                    src={selectedAppointment.pet_profile_image || defaultPetImageByType}
                    alt={`${selectedAppointment.pet_name}'s profile`}
                    layout="fill"
                    objectFit="cover"
                    sizes="128px"
                    priority
                  />
                </div>
                {selectedAppointment.appt_type !== "Grooming" && (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                    <Image
                      src={
                        doctorImagesMap[selectedAppointment.vet_image] ||
                        defaultVetImage
                      }
                      alt={`Dr. ${selectedAppointment.vet_name}'s profile`}
                      layout="fill"
                      objectFit="cover"
                      sizes="128px"
                    />
                  </div>
                )}
              </>
            }
          </div>
          <div className="my-4 space-y-3">
            <p className={"flex items-center gap-2"}>
              <span className="text-secondary-1">
                <GrLocation />
              </span>{" "}
              {selectedAppointment.clinic_location}
            </p>

            <p className={"flex items-center gap-2"}>
              <span className="text-secondary-1">
                <HiOutlineCalendar />
              </span>
              {new Date(selectedAppointment.appt_start).toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
            <p className={`flex items-center gap-2`}>
              <span className="text-secondary-1">
                <MdOutlineAccessTime />
              </span>

              {new Date(selectedAppointment.appt_start).toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
              {" - "}
              {new Date(selectedAppointment.appt_end).toLocaleTimeString(
                `en-IN`,
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
          {selectedAppointment.category === "UPCOMING" && (
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              {/* <p className="italic text-gray-400 text-sm text-center w-full max-w-md">
                To cancel or reschedule your appointment, please contact our{" "}
                {selectedAppointment.clinic_location} clinic on{" "}
                {selectedAppointment.clinic_contact}
              </p> */}
              <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6">
                <button
                  onClick={handleCancelClick}
                  className="w-full sm:w-auto sm:min-w-[150px] py-3 px-4 sm:px-6 border-2 border-secondary-1 rounded-full text-sm sm:text-base font-bold text-secondary-1"
                >
                  Cancel
                </button>
                {/* <button
                  onClick={handleRescheduleClick}
                  className="w-full sm:w-auto sm:min-w-[150px] py-3 px-4 sm:px-6 border-2 border-secondary-1 rounded-full text-sm sm:text-base font-bold text-secondary-1"
                >
                  Reschedule
                </button> */}
              </div>

            </div>
          )}
        </div>
      </div>
      )} 
      {currentView === "cancelConfirm" && (
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
            {showCancelValidationMessage && !cancelReason && (
              <p className="text-red-500 text-sm">
                Please select a reason to proceed.
              </p>
            )}
            <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
              <button
                onClick={resetView}
                className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
              >
                No
              </button>
              <button
                onClick={() => cancelBooking()}
                className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {currentView === "cancelled" && (
        <div className="flex flex-col justify-center gap-4 items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl flex items-center gap-4">Booking Cancelled</h1>
            <CircleX size={40}
              fill="#5281a2"
              stroke="white"
              strokeWidth={2}
            />
          </div>
          <div
            className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center bg-primary-3`}
          >
            <p className="text-lg font-semibold mt-4 text-center">
              {
                selectedAppointment.appt_type === "Grooming"
                  ? `${selectedAppointment.pet_name} was scheduled for a ${selectedAppointment.appt_type} session`
                  : `${selectedAppointment.pet_name} was scheduled with ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`
              }
            </p>
            <div className="flex items-center my-4 relative">
              {
                <>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
                    <Image
                      src={selectedAppointment.pet_profile_image || defaultPetImageByType}
                      alt={`${selectedAppointment.pet_name}'s profile`}
                      layout="fill"
                      objectFit="cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                  {selectedAppointment.appt_type !== "Grooming" && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                      <Image
                        src={
                          doctorImagesMap[selectedAppointment.vet_image] ||
                          defaultVetImage
                        }
                        alt={`Dr. ${selectedAppointment.vet_name}'s profile`}
                        layout="fill"
                        objectFit="cover"
                        sizes="128px"
                      />
                    </div>
                  )}
                </>
              }
            </div>
            <div className="my-4 space-y-3">
              <p className="flex items-center gap-2 line-through">
                <span className="text-secondary-1">
                  <GrLocation />
                </span>{" "}
                {selectedAppointment.clinic_location}
              </p>
              <p className="flex items-center gap-2 line-through">
                <span className="text-secondary-1">
                  <HiOutlineCalendar />
                </span>
                {new Date(selectedAppointment.appt_start).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="flex items-center gap-2 line-through">
                <span className="text-secondary-1">
                  <MdOutlineAccessTime />
                </span>
                {new Date(selectedAppointment.appt_start).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(selectedAppointment.appt_end).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center">
              <CustomButton
                buttonText="Done"
                buttonBackground="bg-secondary-1"
                buttonClickEvent={goBack}
              />
          </div>
          </div>
        </div>
      )}
      {/* {currentView === "rescheduleConfirm" && (
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
            {showRescheduleValidationMessage && !rescheduleReason && (
              <p className="text-red-500 text-sm">
                Please select a reason to proceed.
              </p>
            )}
            <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
              <button
                onClick={resetView}
                className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
              >
                No
              </button>
              <button
                onClick={rescheduleBooking}
                className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )} */}
      {/* {currentView === "rescheduled" && (
        <SelectVet />
      )} */}
    </div>
  );
};

export default BookingDetails;
