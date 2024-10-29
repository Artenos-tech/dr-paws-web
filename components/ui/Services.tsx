"use client";

import { useState } from "react";

import UpSyringe from "@/public/assets/images/services/UpSyringe.svg";
import Image from "next/image";
import Button from "./Button";
import { ServiceCategory } from "@/model/typeDefinitions";
import { serviceCategories, servicesData } from "@/model/mockData";



const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("Planned Check-Ups");

  return (
    <div className="flex max-w-4xl mx-auto px-4">

  <div className="sm:w-[100px] md:w-[150px] lg:w-[200px] min-h-[400px] flex-shrink-0 border bg-gray-100">
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


  <div className="flex-1 p-5 flex flex-col bg-primary-3 w-[220px] sm:w-[300px] md:w-[450px] lg:w-[600px]">
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
    <div className="flex justify-center items-center mt-auto">
      <Button buttonText="View Services" buttonBackground="secondary-2" />
    </div>
  </div>
</div>

  );
};

export default Services;
