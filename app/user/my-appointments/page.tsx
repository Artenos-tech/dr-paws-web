"use client";

import { useEffect } from "react";

import AllAppointments from "@/components/ui/AllAppointments";
import CancelledAppointments from "@/components/ui/CancelledAppointments";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import PastAppointments from "@/components/ui/PastAppointments";
import UpcomingAppointments from "@/components/ui/UpcomingAppointments";
import { AppointmentType } from "@/model/typeDefinitions";
import Loader from "@/components/ui/Loader";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";

const MyAppointmentsPage = () => {
  const { call: getAppointments, loading, result } = useAPICall(api.getAppointments);

  useEffect(() => {
    getAppointments({});
  }, [])

  if (loading) {
    return <div><Loader /></div>;
  }

  const appointments = result?.ok ? result.value.body.appointments : null;

  const tabs = [
    {
      title: "All",
      component: <AllAppointments allAppointments={appointments || []} />,
    },
    {
      title: "Upcoming",
      component: (
        <UpcomingAppointments
          upcomingAppointments={(appointments || []).filter(
            (appointment: AppointmentType) =>
              appointment.appt_status === "Scheduled" ||
              appointment.appt_status === "Confirm" ||
              appointment.appt_status === "Check In"
          )}
        />
      ),
    },
    {
      title: "Past",
      component: (
        <PastAppointments
          pastAppointments={(appointments || []).filter(
            (appointment: AppointmentType) =>
              appointment.appt_status === "Complete" ||
              appointment.appt_status === "Check out"
          )}
        />
      ),
    },
    {
      title: "Cancelled",
      component: (
        <CancelledAppointments
          cancelledAppointments={(appointments || []).filter(
            (appointment: AppointmentType) =>
              appointment.appt_status === "Cancel"
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

export default MyAppointmentsPage;
