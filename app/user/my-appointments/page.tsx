import AllAppointments from "@/components/ui/AllAppointments";
import CancelledAppointments from "@/components/ui/CancelledAppointments";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import PastAppointments from "@/components/ui/PastAppointments";
import UpcomingAppointments from "@/components/ui/UpcomingAppointments";
import { mockAppointments } from "@/model/mockData";
import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";

const page = () => {
  const tabs = [
    {
      title: "All",
      component: <AllAppointments allAppointments={mockAppointments} />,
    },
    {
      title: "Upcoming",
      component: (
        <UpcomingAppointments
          upcomingAppointments={mockAppointments.filter(
            (appointment: AppointmentType) => appointment.status === "Upcoming"
          )}
        />
      ),
    },
    {
      title: "Past",
      component: (
        <PastAppointments
          pastAppointments={mockAppointments.filter(
            (appointment: AppointmentType) => appointment.status === "Past"
          )}
        />
      ),
    },
    {
      title: "Cancelled",
      component: (
        <CancelledAppointments
          cancelledAppointments={mockAppointments.filter(
            (appointment: AppointmentType) => appointment.status === "Cancelled"
          )}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full h-full  flex flex-col gap-[80px] my-12 row-start-2 items-center">
        <ClinicTabBar tabs={tabs} />
      </main>
    </div>
  );
};

export default page;
