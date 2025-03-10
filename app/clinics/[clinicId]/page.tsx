"use client";

import { useEffect, useState } from "react";

import ClinicGallery from "@/components/ui/ClinicGallery";
import ClinicPhotos from "@/components/ui/ClinicPhotos";
import ClinicReviews from "@/components/ui/ClinicReviews";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import Overview from "@/components/ui/OverView";

import { clinicItems, doctors, photos, reviews } from "@/model/mockData";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import Loader from "@/components/ui/Loader";
import { Clinic } from "@/model/typeDefinitions";

interface ClinicDetailsProps {
  params: {
    clinicId: string;
  };
}

const ClinicDetails: React.FC<ClinicDetailsProps> = ({ params }) => {
  const { clinicId } = params;
  const {
    call: getClinic,
    loading: loadingClinic,
  } = useAPICall(api.getClinicForDisplay);
  const {
    call: getDoctorsForClinic,
    result: doctorsResult,
    loading: loadingDoctors,
  } = useAPICall(api.getDoctorsForClinicForDisplay);
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [clinic, setClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    const fetchClinic = async () => {
      const clinic = await getClinic({ clinicid: clinicId });
      if (clinic.ok && clinic.value.body.clinic) {
        setClinic(clinic.value.body.clinic);
      } else {
        setClinic(clinicItems.find((clinic) => clinic.id === parseInt(clinicId)) || null);
      }
    };
    fetchClinic();
    getDoctorsForClinic({ clinicid: clinicId });
  }, [clinicId]);

  const doctorsList = doctorsResult?.ok && doctorsResult.value.body.doctors || doctors;

  if (loadingClinic || loadingDoctors || !clinic) {
    return <Loader />;
  }

  // if (!clinic) {
  //   return <div>Clinic not found</div>;
  // }

  const tabs = {
    OVERVIEW: {
      label: "Overview",
      component: (
        <Overview
          clinicContact={clinic.contact}
          clinicLocation={clinic.name}
          clinicParking={clinic.parkingInfo}
          clinicDoctors={doctorsList}
          clinicTimings={clinic.timings}
        />
      ),
    },
    PHOTOS: {
      label: "Photos",
      component: <ClinicPhotos clinicId={clinicId} gallery={clinic.gallery ? clinic.gallery : null} />,
    },
    REVIEWS: {
      label: "Reviews",
      component: (
        <ClinicReviews
          reviews={reviews.filter((review) => review.clinicId === clinicId)}
        />
      ),
    },
  } as const;

  const getTabs = () => {
    const availableTabs: {
      [key: string]: { label: string; component: JSX.Element };
    } = {};
    Object.keys(tabs).forEach((tab) => {
      const typedTab = tab as keyof typeof tabs;
      if (
        typedTab === "PHOTOS" &&
        (!clinic.gallery && !photos.find((photoGroup) => photoGroup.id === clinicId))
      ) {
        return;
      }
      if (
        typedTab === "REVIEWS" &&
        reviews.filter((review) => review.clinicId === clinicId).length === 0
      ) {
        return;
      }
      availableTabs[typedTab] = tabs[typedTab];
    });
    return availableTabs;
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full flex flex-col gap-[80px] row-start-2 items-center">
        <ClinicGallery
          name={clinic.name}
          services={clinic.services}
          clinic={clinic}
          gallery={clinic.gallery ? clinic.gallery : null}
        />
        <ClinicTabBar
          tabs={getTabs()}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        {activeTab === "OVERVIEW" && tabs["OVERVIEW"].component}
        {activeTab === "PHOTOS" && tabs["PHOTOS"].component}
        {activeTab === "REVIEWS" && tabs["REVIEWS"].component}
      </main>
    </div>
  );
};

export default ClinicDetails;
