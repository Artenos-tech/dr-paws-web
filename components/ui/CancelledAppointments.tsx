import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import CancelledAppointmentCard from "./CancelledAppointmentCard";
import NoAppointments from "./NoAppointments";

type CancelledAppointmentsProps = {
  cancelledAppointments: AppointmentType[];
};

const CancelledAppointments: React.FC<CancelledAppointmentsProps> = ({
  cancelledAppointments,
}) => {
  return (
    <div className={`w-full  ${cancelledAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {cancelledAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        cancelledAppointments.map((appointment: AppointmentType) => (
          <CancelledAppointmentCard
            key={appointment.id}
            cancelledAppointment={appointment}
          />
        ))
      )}
    </div>
  );
};

export default CancelledAppointments;
