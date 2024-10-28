"use client";

import { useState } from "react";
import UpSyringe from "@/public/assets/images/services/UpSyringe.svg";
import Image from "next/image";

const serviceCategories = [
  "Planned Check-Ups",
  "Sickness & Emergency",
  "Diagnostics",
  "Planned Surgeries",
  "Dental",
  "Grooming",
  "Pet Services",
];

type ServiceCategory = (typeof serviceCategories)[number];

interface Service {
  name: string;
}

const servicesData: Record<ServiceCategory, Service[]> = {
  "Planned Check-Ups": [
    { name: "Vaccinations" },
    { name: "Deworming" },
    { name: "Nutritional Counselling" },
    { name: "Behavioural Counselling" },
  ],
  "Sickness & Emergency": [],
  Diagnostics: [],
  "Planned Surgeries": [],
  Dental: [],
  Grooming: [],
  "Pet Services": [],
};

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("Planned Check-Ups");

  return (
    <div className="flex flex-col md:flex-row max-w-4xl mx-auto gap-6 md:gap-0 px-4">
      {/* Left Side - Category List */}
      <div className="w-full md:w-1/4 border md:border-0 bg-gray-100">
        {serviceCategories.map((category) => (
          <div
            key={category}
            className={`cursor-pointer p-4 text-center md:text-left ${
              category === selectedCategory
                ? "text-white bg-secondary-1"
                : "font-normal"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Right Side - Services List */}
      <div className="w-full md:w-3/4 p-5 flex flex-col bg-primary-3 rounded-md">
        <div className="mx-4 flex-1">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">{selectedCategory}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {servicesData[selectedCategory].map((service) => (
              <div key={service.name} className="flex items-center space-x-2">
                <Image src={UpSyringe} alt="Syringe" width={20} height={20} />
                <span className="text-sm md:text-base">{service.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centered "View Services" Button */}
        <div className="flex justify-center items-center mt-auto">
          <button className="bg-olive-50 rounded-lg px-4 py-2 md:py-8 hover:bg-olive-600 transition-colors">
            View Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
