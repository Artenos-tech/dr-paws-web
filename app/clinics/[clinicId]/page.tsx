import ClinicGallery from "@/components/ui/ClinicGallery";
import ClinicPhotos from "@/components/ui/ClinicPhotos";
import ClinicReviews from "@/components/ui/ClinicReviews";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import Overview from "@/components/ui/OverView";
import React from "react";
// import { GetStaticPaths, GetStaticProps } from 'next';
// import { clinicItems } from "@/model/mockData";
// import { StaticImageData } from "next/image";

// export async function generateStaticParams() {
//   // Return paths in the format expected by Next.js
//   return clinicItems.map(
//     (clinic: {
//       clinicName: string;
//       image: StaticImageData;
//       branch: string;
//       description: string;
//     }) => ({
//       clinicName: clinic.clinicName,
//     })
//   );
// }

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
        <ClinicGallery />
        <ClinicTabBar tabs={tabs} />
      </main>
    </div>
  );
};

export default ClinicDetails;
