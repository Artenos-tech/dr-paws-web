"use client";
import Image from "next/image";
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png";
import ServicePageTab from "@/components/ui/ServicePageTab";
import { ServiceTabsData } from "@/model/mockData";
import Button from "@/components/ui/Button";
import { useState } from "react";
import ContactInfoModal from "@/components/ui/ContactInfoModal";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              <Button
                buttonText="Book a visit"
                buttonBackground="bg-secondary-1"
                buttonClickEvent={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <ServicePageTab tabs={ServiceTabsData} />
        </div>
        <div className="w-[75%] flex flex-col items-center gap-4 md:gap-6">
          <p className="text-center text-primary-1 text-sm font-sans italic font-semibold">
            We’ve listed our most commonly requested services, but cater to many
            other needs. If you don’t find what you need please get in touch and
            we’d be happy to help or refer you to someone that can
          </p>
          <Button
            buttonText="Get in Touch"
            buttonBackground="bg-secondary-2"
            buttonClickEvent={() => setIsModalOpen(true)}
          />
        </div>
      </main>
      <ContactInfoModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Services;
