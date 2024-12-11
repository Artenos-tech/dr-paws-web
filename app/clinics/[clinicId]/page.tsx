import ClinicGallery from "@/components/ui/ClinicGallery";
import ClinicPhotos from "@/components/ui/ClinicPhotos";
import ClinicReviews from "@/components/ui/ClinicReviews";
import ClinicTabBar from "@/components/ui/ClinicTabBar";
import Overview from "@/components/ui/OverView";

import { clinicItems, doctors, reviews } from "@/model/mockData";
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

const ClinicDetails: React.FC<ClinicDetailsProps> = ({ params }) => {
  const { clinicId } = params;
  const clinic = clinicItems.find((item) => item.id === clinicId);

  if (!clinic) {
    return <div>Clinic not found</div>;
  }

  const tabs = [
    {
      title: "Overview",
      component: (
        <Overview
          clinicContact={clinic.contact}
          clinicLocation={clinic.clinicName}
          clinicParking={clinic.parkingInformation}
          clinicDoctors={doctors.filter((doctor) =>
            doctor.clinicIds.includes(clinicId)
          )}
        />
      ),
    },
    {
      title: "Photos",
      component: <ClinicPhotos clinicId={clinicId}/>,
    },
    {
      title: "Reviews",
      component: (
        <ClinicReviews
          reviews={reviews.filter((review) => review.clinicId === clinicId)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full flex flex-col gap-[80px] row-start-2 items-center">
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
