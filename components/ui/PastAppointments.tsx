import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import PastAppointmentCard from "./PastAppointmentCard";
import NoAppointments from "./NoAppointments";

type PastAppointmentsProps = {
  pastAppointments: AppointmentType[];
};

const PastAppointments: React.FC<PastAppointmentsProps> = ({
  pastAppointments,
}) => {
  return (
    <div className={`w-full  ${pastAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {pastAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        pastAppointments.map((appointment: AppointmentType) => (
          <PastAppointmentCard
            key={appointment.id}
            pastAppointment={appointment}
          />
        ))
      )}
    </div>
  );
};

export default PastAppointments;
