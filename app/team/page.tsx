import React from "react";
import teamImg from "@/public/assets/images/team/teamImg.png";
import Image from "next/image";
import { doctors } from "@/model/mockData";
import DoctorCard from "@/components/ui/DoctorCard";
import { Doctor } from "@/model/typeDefinitions";

const TeamPage = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[50px] row-start-2 items-center w-full px-8 md:px-32 lg:px-40">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 mt-16 md:space-x-5">
          <div className="flex-shrink-0 w-full lg:w-auto">
            <Image
              src={teamImg}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-center">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight">
                Meet our very own Superheroes
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1">
                Our clinical team is comprised of experienced vets, with a broad
                range of specialisations, with additional special training to
                create a new kind of veterinary experience. We love animals and
                find joy everyday helping our four legged friends stay happy &
                healthy.
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-normal">Our Team</h1>

        <div className="flex items-center justify-center flex-wrap gap-5">
          {doctors.map((doctor: Doctor, index: number) => (
            <div key={index}>
              <DoctorCard doctor={doctor} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeamPage;
