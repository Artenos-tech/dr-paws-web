import BannerCard from "@/components/ui/BannerCard";
import ClinicItem from "@/components/ui/ClinicItem";
import ClinicItemCarousel from "@/components/ui/ClinicItemCarousel";
import DescriptionCardList from "@/components/ui/DescriptionCardList";
import { bannerItems, clinicItems } from "@/model/mockData";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center gap-5 my-10">
      {bannerItems.map((banItem, banIndex) => (
        <BannerCard key={banIndex} banItem={banItem} />
      ))}
      </div>
      <main className="w-full overflow-x-hidden max-w-[1000px] mx-auto my-10">
        {/* Description Card */}
        <h1 className="my-5 text-center">
          Veterinary care, redesigned to be better
        </h1>
        <DescriptionCardList />

        {/* Clinic items */}
        <h1 className="text-center">Check card the places we call home</h1>
        {/* This component is larger view */}
        <div className="p-5 flex items-center justify-center flex-wrap gap-3">
          {clinicItems.map((clinic, clinicIndex) => (
            <ClinicItem
              key={clinicIndex}
              clinic={clinic}
              background="bg-tint"
            />
          ))}
        </div>
        {/* this is component will show clinic card in carousel */}
        <ClinicItemCarousel />
      </main>
    </div>
  );
}
