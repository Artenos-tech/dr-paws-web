import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";


import AppointmentCard from "./AppointmentCard";

type CancelledAppointmentsProps = {
  cancelledAppointments: AppointmentType[];
  onClick: (app: AppointmentType) => void;
};

const CancelledAppointments: React.FC<CancelledAppointmentsProps> = ({
  cancelledAppointments, onClick
}) => {
  const sortedCancelledAppointments = [...cancelledAppointments].sort(
    (a, b) => new Date(b.appt_start).getTime() - new Date(a.appt_start).getTime()  );
  

  return (
    <div className={`w-full  ${sortedCancelledAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {sortedCancelledAppointments.length === 0 ? (
        <h1 className="text-secondary-1 text-lg text-center">No Cancelled Appointments</h1>
      ) : (
        sortedCancelledAppointments.map((appointment: AppointmentType) => (
          <AppointmentCard
            key={appointment.user_vetport_id}
            appointment={appointment}
            onClick={() => onClick(appointment)}
          />
        ))
      )}
    </div>
  );
};

export default CancelledAppointments;