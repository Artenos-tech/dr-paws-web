import ClinicGallery from "@/components/ui/ClinicGallery";
import ClinicPhotos from "@/components/ui/ClinicPhotos";
import ClinicReviews from "@/components/ui/ClinicReviews";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import Overview from "@/components/ui/OverView";
import React from "react";

import { clinicItems } from "@/model/mockData";
import { Clinic } from "@/model/typeDefinitions";


export async function generateStaticParams() {
  // Return paths in the format expected by Next.js
  return clinicItems.map((clinic: Clinic) => ({
    clinicId: clinic.id.toString(),
  }));
}

interface ClinicDetailsProps {
  params: {
    clinicId: string;
  };
}

const tabs = [
  {
    title: "Overview",
    component: <Overview />,
  },
  {
    title: "Photos",
    component: <ClinicPhotos />,
  },
  {
    title: "Reviews",
    component: <ClinicReviews />,
  },
];

const ClinicDetails: React.FC<ClinicDetailsProps> = ({ params }) => {
  const { clinicId } = params;
  console.log(clinicId);
  const clinic = clinicItems.find((item) => item.id === clinicId);

  if (!clinic) {
    return <div>Clinic not found</div>;
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-[70%]">
        <ClinicGallery clinic={clinic} />

        <ClinicTabBar tabs={tabs} />
      </main>
    </div>
  );
};

// Add metadata export for static generation
export const generateMetadata = ({
  params,
}: {
  params: { clinicId: string };
}) => {
  const clinic = clinicItems.find((item) => item.id === params.clinicId);
  return {
    title: clinic ? `${clinic.clinicName} | Clinics` : "Clinic Not Found",
  };
};

export default ClinicDetails;
