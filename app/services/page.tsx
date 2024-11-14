"use client";
import Image from "next/image";
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png";
import ServicePageTab from "@/components/ui/ServicePageTab";
import { ServiceTabsData } from "@/model/mockData";
import Button from "@/components/ui/Button";

const Services = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-full px-8 md:px-32 lg:px-40">
        <div className="w-full flex flex-col xl:flex-row items-center justify-between xl:space-x-14 xl:items-center space-y-8 xl:space-y-0 mt-[80px]">
          <div className="flex-shrink-0">
            <Image
              src={DescritionImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center xl:items-start xl:text-left w-full h-auto gap-4">
            <div className="pr-0 xl:pr-32">
              <h1 className="text-4xl xl:text-5xl text-center xl:text-left">
                Everything Under One Roof
              </h1>
              {/* <h1 className="text-4xl lg:text-5xl text-center lg:text-left">
                Whatever Your Friend Needs
              </h1> */}
            </div>

            <p className="text-lg text-gray-700 text-center lg:text-left w-[70%] xl:w-full">
              From consults through to emergency surgeries, we have you covered.
              We also offer grooming, diagnostic tests, imaging, and retail.
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
        <div className="w-[75%] flex flex-col items-center gap-4 md:gap-6 ">
          <p className="text-center text-primary-1 text-sm font-sans italic font-semibold">
            We&apos;ve listed our most commonly requested services, but cater to
            many other needs. If you don&apos;t find what you need please get in
            touch and we&apos;d be happy to help or refer you to someone that
            can
          </p>
          <Button buttonText="Get in Touch" buttonBackground="bg-secondary-2" />
        </div>
      </main>
    </div>
  );
};

export default Services;
