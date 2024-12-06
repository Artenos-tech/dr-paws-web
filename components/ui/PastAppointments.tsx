import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import PastAppointmentCard from "./PastAppointmentCard";
import NoAppointments from "./NoAppointments";
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
    <div className={`w-full  ${sortedPastAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {sortedPastAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        sortedPastAppointments.map((appointment: AppointmentType) => (
          <AppointmentCard
            key={appointment.vet_vetport_id}
            appointment={appointment}
          />
        ))
      )}
    </div>
  );
};

export default PastAppointments;
