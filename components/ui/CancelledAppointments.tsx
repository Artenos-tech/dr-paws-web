import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";


import AppointmentCard from "./AppointmentCard";

type CancelledAppointmentsProps = {
  cancelledAppointments: AppointmentType[];
};

const CancelledAppointments: React.FC<CancelledAppointmentsProps> = ({
  cancelledAppointments,
}) => {
  const sortedCancelledAppointments = [...cancelledAppointments].sort(
    (a, b) => new Date(b.appt_start).getTime() - new Date(a.appt_start).getTime()  );
  

  return (
    <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 `}>
        {sortedCancelledAppointments.map((appointment: AppointmentType) => (
          <AppointmentCard
            key={appointment.user_vetport_id}
            appointment={appointment}
          />
        ))}
    </div>
  );
};

export default CancelledAppointments;
