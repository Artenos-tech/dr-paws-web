"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { LocationCard } from "./LocationCard";
import DoctorCard from "./DoctorCard";
import { Doctor } from "@/model/typeDefinitions";

interface OverviewProps {
  clinicContact: string;
  clinicLocation: string;
  clinicDoctors: Doctor[];
}

const Overview: React.FC<OverviewProps> = ({
  clinicContact,
  clinicLocation,
  clinicDoctors,
}) => {
  return (
    <div className="w-full flex flex-col gap-[80px]">
      <div className="w-full flex flex-col lg:flex-row justify-between space-y-6 md:space-y-8">
        {/* Contact & Timings Section */}
        <div className="flex flex-col items-start pt-[50px]">
          <div className="flex flex-col w-full gap-2 md:gap-4 mb-6">
            <h2 className="text-2xl font-roca mb-3">Contact Number</h2>
            <div className="flex gap-4">
              <span role="img" aria-label="phone">
                <Phone />
              </span>
              <p className="text-sm md:text-xl">{clinicContact}</p>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 md:gap-4">
            <h2 className="text-2xl font-roca mb-3">Timings</h2>
            <div className="text-sm md:text-lg">
              <p className="flex justify-between">
                Monday to Friday{" "}
                <span className="text-base md:text-xl font-roca ml-4">
                  09:00 - 20:00
                </span>
              </p>
              <p className="flex justify-between">
                Saturday{" "}
                <span className="text-base md:text-xl font-roca ml-4">
                  09:00 - 20:00
                </span>
              </p>
              <p className="flex justify-between">
                Sunday{" "}
                <span className="text-base md:text-xl font-roca ml-4">
                  09:00 - 20:00
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="">
          <LocationCard locationString={clinicLocation} />
        </div>
      </div>

      <div className="flex flex-col items-center overflow-hidden">
        <h1 className="text-2xl font-roca text-primary-1 font-[400] mb-6">
          Meet the Superheroes
        </h1>

        <div className="relative px-8 max-w-screen-xl w-full mx-auto">
          <button className="custom-swiper-button-prev absolute -left-[18px] top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors">
            <ChevronLeft size={42} className="text-[#5281A2]" />
          </button>
          <button className="custom-swiper-button-next absolute -right-[18px] top-1/2 -translate-y-1/2 rounded-full p-2  transition-colors">
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
              972: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="w-full"
            style={{ zIndex: 0 }}
          >
            {clinicDoctors.map((doctor, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center">
                  <DoctorCard doctor={doctor} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Overview;
