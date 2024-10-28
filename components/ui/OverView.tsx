"use client";

import ClinicItemCarousel from "@/components/ui/ClinicItemCarousel";
import { LocationCard } from "./LocationCard";

const Overview = () => {
  return (
    <div className="w-full flex flex-col gap-[80px]">
      <div className="w-full flex flex-col md:flex-row justify-between space-y-6 md:space-y-0">
        {/* Contact & Timings Section */}
        <div className="flex flex-col items-start pt-[50px]">
          <div className="mb-6">
            <h2 className="text-2xl font-roca font-semibold mb-3">
              Contact Number
            </h2>
            <p className="text-xl">
              <span role="img" aria-label="phone" className="mr-2">
                📞
              </span>
              +91 987654321 / +91 987654321
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-roca font-semibold mb-3">Timings</h2>
            <div className="text-lg">
              <p>
                Monday to Friday:{" "}
                <span className="text-xl font-roca ml-4">09:00 - 19:00</span>
              </p>
              <p>
                Saturday:{" "}
                <span className="text-xl font-roca ml-4">10:00 - 17:00</span>
              </p>
              <p>
                Sunday:{" "}
                <span className="text-xl font-roca ml-4">10:00 - 15:00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="">
          <LocationCard />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-roca text-primary-1 font-[400]">
          Meet the Superheroes
        </h1>
      </div>
    </div>
  );
};

export default Overview;
