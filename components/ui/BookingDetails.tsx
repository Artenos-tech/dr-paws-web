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
import { FiPlus } from "react-icons/fi";
type bookingDetailsProps = {
  bookingId: string;
};

const BookingDetails: React.FC<bookingDetailsProps> = ({ bookingId }) => {
  const [bookingDetails, setBookingDetails] = useState<AppointmentType>({
    id: "",
    petName: "",
    vetName: "",
    petImage: "",
    vetImage: "",
    date: "",
    time: "",
    status: AppointmentStatus.Upcoming,
    service: "",
  });

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
  return (
    <div className="w-full h-full">
      <BackButton />

      <div className="flex flex-col justify-center gap-4 items-center">
        <h1 className="text-3xl">Your Booking</h1>

        <div className="bg-[#FFFCF3] p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center">
          <p className="text-lg font-semibold mt-4">
            {bookingDetails.petName} is scheduled with {bookingDetails.vetName}
          </p>
          <p> for {bookingDetails.service} consultation</p>

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
            <p className="flex items-center gap-2">
              <span className="text-secondary-1">
                <GrLocation />
              </span>{" "}
              {bookingDetails.clinicAddress || "Andheri West Clinic"}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-secondary-1">
                <HiOutlineCalendar />
              </span>
              {customDate(bookingDetails.date)}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-secondary-1">
                <MdOutlineAccessTime />
              </span>

              {bookingDetails.time}
            </p>
          </div>
          {bookingDetails.status === "Upcoming" && (
            <>
              <button className="border-b-2 border-primary-1 leading-none text-xs flex items-center ">
                <FiPlus /> Add to Calendar
              </button>

              <div className="flex justify-center mb-4 mt-2 items-center gap-4 w-full ">
                <button className="w-full md:w-1/4 text-xs md:text-sm border-2 border-secondary-1 bg-transparent py-2 text-secondary-1 font-semibold rounded-full">
                  Cancel
                </button>
                <button className=" w-full md:w-1/4 text-xs md:text-sm border-2 border-secondary-1 bg-transparent py-2 text-secondary-1 font-semibold rounded-full">
                  Reschedule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
