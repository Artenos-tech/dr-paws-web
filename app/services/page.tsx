"use client";
import Image from "next/image";
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png";
import ServicePageTab from "@/components/ui/ServicePageTab";
import { ServiceTabsData } from "@/model/mockData";

const Services = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-full px-8 md:px-32 lg:px-40">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between lg:space-x-14 space-y-8 lg:space-y-0 mt-[80px]">
          <div className="flex-shrink-0">
            <Image
              src={DescritionImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center lg:items-start lg:text-left w-full h-auto gap-4">
            <div className="pr-0 lg:pr-32">
              <h1 className="text-4xl lg:text-5xl text-center lg:text-left">
                We&apos;re Here,
              </h1>
              <h1 className="text-4xl lg:text-5xl text-center lg:text-left">
                Whatever Your Friend Needs
              </h1>
            </div>

            <p className="text-lg text-gray-700 text-center lg:text-left">
              Our modern friendly clinics offer all the services you&apos;ll
              need to keep your animal happy and healthy.
            </p>
            <div className="w-fit">
              <button
                className={`font-open-sans btn rounded-full px-10 py-2 text-white tracking-wider bg-secondary-1`}
              >
                Book a visit
              </button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <ServicePageTab tabs={ServiceTabsData} />
        </div>
      </main>
    </div>
  );
};

export default Services;
