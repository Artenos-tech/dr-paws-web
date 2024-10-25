import ServicePageTab from "@/components/ui/ServicePageTab";
import { doctorMockData, reviewImageCardData } from "@/model/mockData";
import PetCardList from "@/components/ui/UserProfilePagePetCardList";
import DoctorCard from "@/components/ui/DoctorCard";

import ReviewImageCardList from "@/components/ui/ReviewImageCardList";

export default function Home() {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="bg-banner bg-cover bg-center bg-no-repeat h-96 w-full md:h-[500px] lg:h-[600px] min-h-[300px]"></div>
        <PetCardList />
        <ServicePageTab />
        <DoctorCard doctor={doctorMockData} />
        <ReviewImageCardList reviews={reviewImageCardData} />
      </main>
    </div>
  );
}
