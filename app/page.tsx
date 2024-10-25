import FaqList from "@/components/ui/FaqList";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewData } from "@/model/mockData";
import BannerCard from "@/components/ui/BannerCard";
import ClinicItem from "@/components/ui/ClinicItem";
import ClinicItemCarousel from "@/components/ui/ClinicItemCarousel";
import DescriptionCardList from "@/components/ui/DescriptionCardList";
import { bannerItems, clinicItems } from "@/model/mockData";

export default function Home() {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="bg-banner bg-cover bg-center bg-no-repeat h-96 w-full md:h-[500px] lg:h-[600px] min-h-[300px]"></div>
        <div className="w-full">
          <div className="flex items-center justify-center gap-5 my-10">
            {bannerItems.map((banItem, banIndex) => (
              <BannerCard key={banIndex} banItem={banItem} />
            ))}
          </div>
          <h1 className="my-5 text-center">
            Veterinary care, redesigned to be better
          </h1>
          <DescriptionCardList />
          <h1 className="text-center">Check out the places we call home</h1>
          {/* This component is larger view */}
          <div className="p-5 flex items-center justify-center flex-wrap gap-3">
            {clinicItems.map((clinic, clinicIndex) => (
              <ClinicItem key={clinicIndex} clinic={clinic} />
            ))}
          </div>
          {/* this is component will show clinic card in carousel */}
          <ClinicItemCarousel />
          <ReviewCard name={reviewData.name} review={reviewData.review} />
          <FaqList />
        </div>
      </main>
    </div>
  );
}
