"use client";

import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import OutlineButton from "./OutlineButton";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};


// Component Props
type AppointmentCardProps = {
  appointment: AppointmentType;
  onClick: () => void;
};

// Main Component
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick }) => {

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
  const getStatusCategory = (appt: AppointmentType) => {
    if (appt.category === "UPCOMING") return "upcoming";
    if (appt.category === "PAST") return "past";
    if (appt.category === "CANCELLED") return "cancelled";
    throw new Error(`No status category defined for ${appt.category}`);
  };

  function getAppointmentCategoryLabel(category: string) {
    if (category === "UPCOMING") return "Upcoming";
    if (category === "PAST") return "Visited";
    if (category === "CANCELLED") return "Cancelled";
    throw new Error(`No category label defined for ${category}`);
  }

  const statusCategory = getStatusCategory(appointment);
  const { border, bg, text } = cardStyles[statusCategory];

  return (
    <div
      className={`p-4 ${border} ${bg} flex flex-col gap-3 rounded-lg shadow-md w-full`}
    >
      {/* Status and Reason */}
      <div className="text-xs flex justify-between">
        <p className={`${text}`}>{getAppointmentCategoryLabel(appointment.category)}</p>
        <p
          className={`px-2 py-1 rounded-md ${
            statusCategory === "cancelled" ? "bg-[#E0E0E0]" : "bg-primary-2"
          } ${
            statusCategory === "cancelled" ? "text-[#909090]" : "text-primary-1"
          }`}
        >
          {appointment.appt_type}
        </p>
      </div>
      <div className={`space-y-1 ${text}`}>
        <p className="font-semibold">
          {capitalizeFirstLetter(appointment.pet_name)}
          {appointment.vet_vetport_id !== 0 &&
            ` and ${capitalizeFirstLetter(appointment.vet_name)}`}
        </p>
        <p>{new Date(appointment.appt_start).toLocaleDateString("en-IN")}</p>
        <p>
          {new Date(appointment.appt_start).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" - "}
          {new Date(appointment.appt_end).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <div className="self-end">
        <OutlineButton
          outlineBtnText="View Details"
          outlineBtnLink={onClick}
        />
      </div>
    </div>
  );
};

export default AppointmentCard;
