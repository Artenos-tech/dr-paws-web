"use client";

import { useState } from "react";

import UpSyringe from "@/public/assets/images/services/UpSyringe.svg";
import Image from "next/image";
import { ServiceCategory } from "@/model/typeDefinitions";
import { serviceCategories, servicesData } from "@/model/mockData";
import Button from "./Button";

const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory>("Planned Check-Ups");

  return (
    <div className="flex px-8 md:px-32 lg:px-40">
      {/* Sidebar */}
      <div className="w-[50%] lg:w-[30%] min-h-[400px] flex-shrink-0 border bg-gray-100">
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
      <div className="w-[50%] md:w-[70%] p-5 flex flex-col bg-primary-3">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center md:text-left">
            {selectedCategory}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {servicesData[selectedCategory].map((service) => (
              <div key={service.name} className="flex items-center space-x-2">
                <Image src={UpSyringe} alt="Syringe" width={20} height={20} />
                <span className="text-sm md:text-base">{service.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center mt-auto mb-4">
          <Button
            buttonText="View Services"
            buttonBackground="bg-secondary-2"
            buttonLink="/services"
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
