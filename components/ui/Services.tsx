"use client";

import { useState } from "react";

import UpSyringe from "@/public/assets/images/services/UpSyringe.svg";
import Image from "next/image";
import Button from "./Button";
import { ServiceCategory } from "@/model/typeDefinitions";
import { serviceCategories, servicesData } from "@/model/mockData";

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>("Planned Check-Ups");

  return (
    <div className="flex max-w-4xl mx-auto px-4">
  {/* Sidebar */}
  <div className="w-[30%] min-h-[400px] flex-shrink-0 border bg-gray-100">
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

  {/* Main Content */}
  <div className="flex-1 p-5 flex flex-col bg-primary-3 w-full max-w-full">
    <div className="mx-4 flex-1">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
        {selectedCategory}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicesData[selectedCategory].map((service) => (
          <div key={service.name} className="flex items-center space-x-2">
            <Image src={UpSyringe} alt="Syringe" width={20} height={20} />
            <span className="text-sm md:text-base">{service.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Centered "View Services" Button */}
    <div className="flex justify-center items-center mt-auto mb-4">
      <button className="font-open-sans btn rounded-full px-10 py-2 text-white tracking-wider bg-secondary-2">
        View Services
      </button>
    </div>
  </div>
</div>
  );
};

export default Services;
