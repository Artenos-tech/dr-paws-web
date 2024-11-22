import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";
import NoAppointments from "./NoAppointments";

type UpcomingAppointmentsProps = {
  upcomingAppointments: AppointmentType[];
};

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  upcomingAppointments,
}) => {
  return (
    <div className={`w-full  ${upcomingAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {upcomingAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        upcomingAppointments.map((appointment: AppointmentType) => (
          <UpcomingAppointmentCard
            key={appointment.id}
            upcomingAppointment={appointment}
          />
        ))
      )}
    </div>
  );
};

export default UpcomingAppointments;
