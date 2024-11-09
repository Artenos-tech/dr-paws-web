"use client";

import React from "react";
import Image from "next/image";
import MembershipDesc from "@/public/assets/images/Membership/MembershipDesc.png";
import MemberCard from "@/components/ui/MemberCard";
import { membershipData } from "@/model/mockData";

// Import Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const Membership = () => {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col row-start-2 items-center w-full ">
        {/* Header Section */}
        <div className="w-full flex flex-col px-8 md:px-32 lg:px-40 lg:flex-row items-center justify-center space-y-8 lg:space-y-0 my-16">
          <div className="flex-shrink-0 w-full lg:w-auto">
            <Image
              src={MembershipDesc}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-center">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight">
                Great value care, whatever your pet needs
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1">
                Our memberships are designed to provide the convenience,
                security, and value pet-parents of today expect. Explore our
                plans to discover the one that fits your pet's needs.
              </p>
            </div>
          </div>
        </div>

        {/* Membership Plans Section */}
        <div className="bg-primary-3 w-full text-center text-3xl my-16 pb-12">
          <h1 className="pt-12 pb-16">Become A Member</h1>

          {/* Swiper Slider for screens less than xl */}
          <div className="block xl:hidden w-[85%] mx-auto relative h-[600px]">
            <button className="custom-swiper-button-prev absolute -left-[18px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
              <ChevronLeft size={42} className="text-[#5281A2]" />
            </button>
            <button className="custom-swiper-button-next absolute -right-[18px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
              <ChevronRight size={42} className="text-[#5281A2]" />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".custom-swiper-button-prev",
                nextEl: ".custom-swiper-button-next",
              }}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full h-full"
            >
              {membershipData.map((plan, index) => (
                <SwiperSlide key={index}>
                  <div className="flex justify-center h-full">
                    <MemberCard plan={plan} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Grid layout for screens xl and above */}
          <div className="hidden xl:block w-[85%] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {membershipData.map((plan, index) => (
                <MemberCard key={index} plan={plan} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Membership;