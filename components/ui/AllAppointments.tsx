import { AppointmentType } from "@/model/typeDefinitions";
import NoAppointments from "./NoAppointments";
import AppointmentCard from "./AppointmentCard";



type AllAppointmentsProps = {
  allAppointments: AppointmentType[];
};



const AllAppointments: React.FC<AllAppointmentsProps> = ({
  allAppointments,
}) => {


  const sortedAppointments = [...allAppointments].sort(
    (a, b) => new Date(b.appt_start).getTime() - new Date(a.appt_start).getTime()
  );
  

  const validStatuses = [
    "Check In",
    "Complete",
    "Scheduled",
    "Check out",
    "Attending",
    "Confirm",
    "Cancel",
    "Active",
  ];

  return (
    <div
      className={`w-full  ${
        allAppointments.length !== 0
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "h-full lg:h-screen"
      } `}
    >
      {sortedAppointments.length === 0 ? (
        <NoAppointments />
      ) : (
        sortedAppointments.map((appointment: AppointmentType) =>
          validStatuses.includes(appointment.appt_status) ? (
            <AppointmentCard
              key={appointment.user_vetport_id}
              appointment={appointment}
            />
          // ) : appointment.appt_status === "Complete" ? (
          //   <PastAppointmentCard
          //     key={appointment.user_vetport_id}
          //     pastAppointment={appointment}
          //   />
          // ) : (
          //   <CancelledAppointmentCard
          //     key={appointment.user_vetport_id}
          //     cancelledAppointment={appointment}
          //   />
          // )
        ):null
      ))}
    </div>
  );
};

export default AllAppointments;
