"use client";

import { AppointmentType } from "@/model/typeDefinitions";
import Image from "next/image";
import React from "react";
import OutlineButton from "./OutlineButton";
import { useRouter } from "next/navigation";
// import { customDate } from "@/lib/utils";
import catImg from '@/public/assets/images/catimg.png'

type UpcomingCardProps = {
  upcomingAppointment: AppointmentType;
};

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

  const day = dayNames[date.getDay()];
    const dateOfMonth = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

  return `${day}, ${dateOfMonth} ${month} ${year}`;

};

const formatTimeRange = (start: string, end: string) => {
  const formatTime = (time: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(time).toLocaleTimeString(undefined, options);
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
};

const UpcomingAppointmentCard: React.FC<UpcomingCardProps> = ({
  upcomingAppointment,
}) => {
  const navigate = useRouter();
  console.log(upcomingAppointment.user_vetport_id)
  return (
    <div className="p-4 border-l-4 border-l-secondary-1 flex flex-col gap-3 rounded-lg shadow-md w-full">
      <div className="text-xs flex justify-between">
        <p className="text-secondary-1">{upcomingAppointment.appt_status}</p>
        <p className="bg-primary-2 text-primary-1 px-2 py-1 rounded-md">
          {upcomingAppointment.appt_reason ?? "Grooming"}
        </p>
      </div>

      <div className="flex items-center">
        <Image
          src={catImg}
          alt="pet-image"
          width={50}
          height={50}
        />
        <Image
          src={catImg}
          alt="vet-image"
          width={50}
          height={50}
          className="ml-[-18px]"
        />
      </div>
      <div className="space-y-1 text-primary-1">
        <p className="font-semibold">
          {/* Have to add dynamic names here */}
          {"Tonny"} and {"Doctor"}
        </p>
        <p>{formatDate(upcomingAppointment.appt_start)}</p>
        <p>{formatTimeRange(upcomingAppointment.appt_start, upcomingAppointment.appt_end)}</p>      </div>
      <div className="self-end">
        <OutlineButton
          outlineBtnText="View Details"
          outlineBtnLink={() =>
            navigate.push(`/user/my-appointments/${upcomingAppointment.user_vetport_id}`)
          }
        />
      </div>
    </div>
  );
};

export default UpcomingAppointmentCard;
