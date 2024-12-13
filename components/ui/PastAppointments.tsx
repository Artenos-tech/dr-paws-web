import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";

import AppointmentCard from "./AppointmentCard";

type PastAppointmentsProps = {
  pastAppointments: AppointmentType[];
};

const PastAppointments: React.FC<PastAppointmentsProps> = ({
  pastAppointments,
}) => {
  const sortedPastAppointments = [...pastAppointments].sort(
    // (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
      {sortedPastAppointments.map((appointment: AppointmentType) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
        />
      ))}
    </div>
  );
};

export default PastAppointments;
