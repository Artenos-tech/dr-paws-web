"use client"

import { useEffect, useState } from "react";

import ClinicGallery from "@/components/ui/ClinicGallery";
import ClinicPhotos from "@/components/ui/ClinicPhotos";
import ClinicReviews from "@/components/ui/ClinicReviews";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import Overview from "@/components/ui/OverView";

import { clinicItems, doctors, reviews } from "@/model/mockData";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";

interface ClinicDetailsProps {
  params: {
    clinicId: string;
  };
}

const ClinicDetails: React.FC<ClinicDetailsProps> = ({ params }) => {
  const { clinicId } = params;
  const { call: getClinic, result: clinicResult } = useAPICall(api.getClinicForDisplay);
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  useEffect(() => {
    getClinic({ clinicid: clinicId });
  }, [clinicId]);

  const clinic = clinicResult?.ok && clinicResult.value.body.clinic;
  
  if (!clinic) {
    return <div>Clinic not found</div>;
  }

  const tabs = {
    "OVERVIEW": {
      label: "Overview",
      component: (
        <Overview
          clinicContact={clinic.contact}
          clinicLocation={clinic.displayName}
          clinicParking={clinic.parkingInfo}
          clinicDoctors={doctors.filter((doctor) =>
            doctor.clinicIds.includes(clinicId)
          )}
          clinicTimings={clinic.timings}
        />
      ),
    },
    "PHOTOS": {
      label: "Photos",
      component: <ClinicPhotos clinicId={clinicId}/>,
    },
    "REVIEWS": {
      label: "Reviews",
      component: (
        <ClinicReviews
          reviews={reviews.filter((review) => review.clinicId === clinicId)}
        />
      ),
    },
   } as const;

  const mockClinic = clinicItems.find((item) => item.id === clinicId);
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full flex flex-col gap-[80px] row-start-2 items-center">
        {mockClinic && <ClinicGallery clinic={mockClinic} />}
        <ClinicTabBar tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />
        {activeTab === "OVERVIEW" && tabs["OVERVIEW"].component}
        {activeTab === "PHOTOS" && tabs["PHOTOS"].component}
        {activeTab === "REVIEWS" && tabs["REVIEWS"].component}
      </main>
    </div>
  );
};

export default ClinicDetails;
