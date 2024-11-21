"use client";

import React, { useState } from "react";
import { clinicItems } from "@/model/mockData";
import SelectClinicCard from "./SelectClinicCard";
import CustomButton from "./CustomButton";

interface SelectClinicProps {
  onNext: () => void; // Prop for navigation
}

const SelectClinic: React.FC<SelectClinicProps> = ({ onNext }) => {
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);

  const handleClinicSelection = (clinicName: string) => {
    // Toggle selection: if the clicked clinic is already selected, deselect it.
    setSelectedClinic((prevSelected) =>
      prevSelected === clinicName ? null : clinicName
    );
  };

  return (
    <div className=" flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Select a Clinic</h1>
      <p className="text-gray-600 mb-6">Book an appointment at our clinic</p>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ">
        {clinicItems.map((item) => (
          <div key={item.id} className="h-full ">
            <SelectClinicCard
              key={item.id}
              clinic={item}
              isSelected={selectedClinic === item.clinicName}
              onSelect={() => handleClinicSelection(item.clinicName)}
            />
          </div>
        ))}
      </div>
      <div className="my-16 flex justify-center">
        <CustomButton
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          disabled={!selectedClinic}
          buttonClickEvent={onNext}
        />
      </div>
    </div>
  );
};

export default SelectClinic;
