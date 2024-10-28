import ClinicPhotos from "@/components/ui/ClinicPhotos";
import ClinicReviews from "@/components/ui/ClinicReviews";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import { LocationCard } from "@/components/ui/LocationCard";
import Overview from "@/components/ui/OverView";
import { notFound } from "next/navigation";
import React from "react";

interface ClinicDetailsProps {
  params: {
    clinicName: string;
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

const ClinicDetails: React.FC<ClinicDetailsProps> = async ({ params }) => {
  const { clinicName } = params;
  console.log(clinicName);
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-[70%]">
        <ClinicTabBar tabs={tabs} />
      </main>
    </div>
  );
};

export default ClinicDetails;
