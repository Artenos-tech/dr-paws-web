"use client";

import React, { useState } from "react";
import Image from "next/image";
import MembershipDesc from "@/public/assets/images/Membership/MembershipDesc.png";
import MemberCard from "@/components/ui/MemberCard";
import MemberModal from "@/components/ui/MemberModal";
import { membershipData } from "@/model/mockData";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import { MembershipPlan } from "@/components/ui/MemberCard";

type PetType = "Dog" | "Cat";

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petType, setPetType] = useState<PetType>("Dog");

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const filteredMembershipData = membershipData.filter(
    (plan) => plan.petType === petType
  );

  console.log(petType);

  const togglePetType = () => {
    setPetType((prevType) => (prevType === "Dog" ? "Cat" : "Dog"));
  };

  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col row-start-2 items-center w-full ">
        <div className="w-full flex flex-col px-8 md:px-32 lg:px-20 xl:px-40 md:gap-8 lg:flex-row items-center justify-center space-y-8 lg:space-y-0 mt-20">
          <div className="flex-shrink-0 w-full lg:w-auto xl:w-1/2 ">
            <Image
              src={MembershipDesc}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-center xl:w-full">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto xl:w-3/4">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight">
                Great value care, whatever your pet needs
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1 xl:text-xl">
                Our memberships are designed to provide the convenience,
                security, and value pet-parents of today expect. Explore our
                plans to discover the one that fits your pet&apos;s needs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-3 w-full text-center text-3xl my-16 pb-12 px-8 md:px-32 lg:px-20 xl:px-40">
          <h1 className="pt-12 pb-8 lg:pb-16">Become A Member</h1>

          <div className="flex justify-start mb-8">
            <div className="flex items-start bg-white rounded-full p-1 shadow-md">
              <button
                className={`px-4 py-2 rounded-full transition-colors text-base ${
                  petType === "Dog"
                    ? "bg-primary-1 text-white"
                    : "text-gray-700"
                }`}
                onClick={() => setPetType("Dog")}
              >
                Dog
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-colors text-base ${
                  petType === "Cat"
                    ? "bg-primary-1 text-white"
                    : "text-gray-700"
                }`}
                onClick={togglePetType}
              >
                Cat
              </button>
            </div>
          </div>

          <div className="mx-auto relative">
            <button className="custom-swiper-button-prev absolute -left-[42px] sm:-left-[48px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
              <ChevronLeft size={42} className="text-[#5281A2]" />
            </button>
            <button className="custom-swiper-button-next absolute -right-[42px] sm:-right-[48px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-colors">
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
                1026: { slidesPerView: 2 },
              }}
              className="w-full h-full"
            >
              {filteredMembershipData.map((plan, index) => (
                <SwiperSlide key={index} className="h-[100%] ">
                  <div className="flex justify-center mt-2 h-full">
                    <MemberCard plan={plan} onSelect={handlePlanSelect} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </main>

      {selectedPlan && (
        <MemberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Membership;
