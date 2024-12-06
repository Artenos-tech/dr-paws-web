"use client";

import { AppointmentType } from "@/model/typeDefinitions";
import Image from "next/image";
import React from "react";
import OutlineButton from "./OutlineButton";
import { useRouter } from "next/navigation";
import catImg from "@/public/assets/images/catimg.png";

// Helper Functions
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${dayNames[date.getDay()]}, ${date.getDate()} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};

export const formatTimeRange = (start: string, end: string) => {
  const formatTime = (time: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(time).toLocaleTimeString("en-US", options);
  };
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// Component Props
type AppointmentCardProps = {
  appointment: AppointmentType;
};

// Main Component
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const router = useRouter();

  // Styles and labels based on appt_status
  const cardStyles = {
    upcoming: {
      border: "border-l-secondary-1 border-l-4",
      bg: "bg-white",
      text: "text-primary-1",
    },
    past: {
      border: "border-l-primary-2 border-l-4",
      bg: "bg-primary-3",
      text: "text-primary-1",
    },
    cancelled: {
      border: "border-l-[#C6C4C4] border-l-4",
      bg: "bg-[#F1F1F1]",
      text: "text-[#909090]",
    },
  };

  // Mapping appt_status to style categories
  const getStatusCategory = (status: AppointmentType["appt_status"]) => {
    const upcomingStatuses = ["Confirm", "Scheduled", "Check In"];
    const pastStatuses = ["Complete", "Check out"];
    const cancelledStatuses = ["Cancel"];

    if (upcomingStatuses.includes(status)) return "upcoming";
    if (pastStatuses.includes(status)) return "past";
    if (cancelledStatuses.includes(status)) return "cancelled";
    return "upcoming";
  };

  const statusCategory = getStatusCategory(appointment.appt_status);
  const { border, bg, text } = cardStyles[statusCategory];

  return (
    <div
      className={`p-4 ${border} ${bg} flex flex-col gap-3 rounded-lg shadow-md w-full`}
    >
      {/* Status and Reason */}
      <div className="text-xs flex justify-between">
        <p className={`${text}`}>{appointment.appt_status}</p>

        <p
          className={`px-2 py-1 rounded-md ${
            statusCategory === "cancelled" ? "bg-[#E0E0E0]" : "bg-primary-2"
          } ${
            statusCategory === "cancelled" ? "text-[#909090]" : "text-primary-1"
          }`}
        >
        {/* appointmentType will come here */}
          {appointment.appt_reason ?? "Grooming"}
        </p>
      </div>

      {/* Images */}
      {/* <div className="flex items-center">
        <Image src={catImg} alt="pet-image" width={50} height={50} />
        <Image
          src={catImg}
          alt="vet-image"
          width={50}
          height={50}
          className="ml-[-18px]"
        />
      </div> */}

      {/* Details */}
      <div className={`space-y-1 ${text}`}>
        <p className="font-semibold">
          {"Pet"} and {"Vet"}
        </p>
        <p>{formatDate(appointment.appt_start.toString())}</p>
        <p>
          {formatTimeRange(
            appointment.appt_start.toString(),
            appointment.appt_end.toString()
          )}
        </p>
      </div>

      {/* View Details Button */}
      <div className="self-end">
        <OutlineButton
          outlineBtnText="View Details"
          outlineBtnLink={() =>
            router.push(`/user/my-appointments/${appointment.id}`)
          }
        />
      </div>
    </div>
  );
};

export default AppointmentCard;
