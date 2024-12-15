import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";

import AppointmentCard from "./AppointmentCard";
type PastAppointmentsProps = {
  pastAppointments: AppointmentType[];
  onClick: (app: AppointmentType) => void;
};
const PastAppointments: React.FC<PastAppointmentsProps> = ({
  pastAppointments, onClick
}) => {
  const sortedPastAppointments = [...pastAppointments].sort(
    // (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return (
    <div className={`w-full  ${sortedPastAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {sortedPastAppointments.length === 0 ? (
       <h1 className="text-secondary-1 text-lg text-center">No Past Appointments</h1>
      ) : (
        sortedPastAppointments.map((appointment: AppointmentType) => (
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
export default PastAppointments;