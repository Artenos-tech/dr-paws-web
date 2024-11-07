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
        {/* <div className="w-full flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 mt-16 md:space-x-5">
          <Image
            src={teamImg}
            alt="Clinic image with a dog"
            width={510}
            height={340}
            className="rounded-lg h-auto object-cover"
          />
          <div className="flex items-center justify-center lg:items-start lg:justify-center">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight"></h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1">
                Our clinical team is comprised of experienced vets, with a broad
                range of specialisations, with additional special training to
                create a new kind of veterinary experience. We love animals and
                find joy everyday helping our four legged friends stay happy &
                healthy.
              </p>
            </div>
          </div>
        </div> */}
        <div className="my-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-2 md:gap-5">
            <div className="w-full">
              <img
                src={teamImg.src}
                alt="Clinic image with a dog"
                className=" rounded-md"
              />
            </div>
            <div className="w-full text-center lg:text-left text-primary-1 md:my-4 lg:my-0 my-4">
              <h1 className={`text-xl md:text-2xl lg:text-3xl`}>
                Meet our very own Superheroes
              </h1>
              <p className="text-xs md:text-sm my-3 md:my-5">
                Our clinical team is comprised of experienced vets, with a broad
                range of specialisations, with additional special training to
                create a new kind of veterinary experience. We love animals and
                find joy everyday helping our four legged friends stay happy &
                healthy.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-normal text-center">Our Team</h1>

          <div className="flex justify-center items-center lg:justify-start flex-wrap gap-8 my-7">
            {doctors.map((doctor: Doctor, index: number) => (
              <div key={index}>
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamPage;
