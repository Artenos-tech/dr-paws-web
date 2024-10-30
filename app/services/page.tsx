"use client";
import Image from "next/image";
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png";
import Button from "@/components/ui/Button";
import ServicePageTab from "@/components/ui/ServicePageTab";
import { ServiceTabsData } from "@/model/mockData";

const Services = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-[73%]">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center p-4 lg:space-x-8 space-y-8 lg:space-y-0 mt-[80px]">
          <div className="flex-shrink-0">
            <Image
              src={DescritionImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center lg:items-start lg:text-left w-full lg:w-[450px] h-auto gap-4">
            <h2 className="text-4xl lg:text-5xl font-extralight text-center lg:text-left">
              We're here, whatever your friend needs
            </h2>
            <p className="text-lg text-gray-700 text-center lg:text-left">
              Our modern friendly clinics offer all the services you'll need to
              keep your animal happy and healthy.
            </p>
            <div className="w-fit">
              <button className={`font-open-sans btn rounded-full px-10 py-2 text-white tracking-wider bg-secondary-1`}>Book a visit</button>

            </div>
          </div>
        </div>
        <div>
          <ServicePageTab tabs={ServiceTabsData} />
        </div>
      </main>
    </div>
  );
};

export default Services;
