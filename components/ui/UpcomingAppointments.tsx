import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";

import NoAppointments from "./NoAppointments";
import AppointmentCard from "./AppointmentCard";

type UpcomingAppointmentsProps = {
  upcomingAppointments: AppointmentType[];
  onClick: (app: AppointmentType) => void;
};

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  upcomingAppointments, onClick
}) => {
  const sortedUpcomingAppointments = [...upcomingAppointments].sort(
    (a, b) => new Date(b.appt_start).getTime() - new Date(a.appt_start).getTime()
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
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onClick={() => onClick(appointment)}
          />
        ))
      )}
    </div>
  );
};

export default UpcomingAppointments;
