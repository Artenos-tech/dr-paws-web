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
  const sortedUpcomingAppointments = [...upcomingAppointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div
      className={`w-full  ${
        sortedUpcomingAppointments.length !== 0
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "h-full lg:h-screen"
      } `}
    >
      {sortedUpcomingAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        sortedUpcomingAppointments.map((appointment: AppointmentType) => (
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
