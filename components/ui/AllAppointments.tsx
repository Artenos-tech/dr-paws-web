import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";
import CancelledAppointmentCard from "./CancelledAppointmentCard";
import PastAppointmentCard from "./PastAppointmentCard";
import NoAppointments from "./NoAppointments";

type AllAppointmentsProps = {
  allAppointments: AppointmentType[];
};

const AllAppointments: React.FC<AllAppointmentsProps> = ({
  allAppointments,
}) => {
  return (
    <div className={`w-full  ${allAppointments.length !==0 ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "h-full lg:h-screen"} `}>
      {allAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        allAppointments.map((appointment: AppointmentType) =>
          appointment.status === "Upcoming" ? (
            <UpcomingAppointmentCard
              key={appointment.id}
              upcomingAppointment={appointment}
            />
          ) : appointment.status === "Past" ? (
            <PastAppointmentCard
              key={appointment.id}
              pastAppointment={appointment}
            />
          ) : (
            <CancelledAppointmentCard
              key={appointment.id}
              cancelledAppointment={appointment}
            />
          )
        )
      )}
    </div>
  );
};

export default AllAppointments;
