import React, { useState } from "react";
import SelectDoctorCard from "./SelectDoctorCard";
import { doctors } from "@/model/mockData";

import Button from "./Button";
import { Calendar } from "./calendar";
import SelectCalendar from "./SelectCalendar";

const SelectVet = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const handleDoctorSelection = (doctorName: string) => {
    setSelectedDoctor(doctorName);
  };

  return (
    <div className="h-full flex flex-col gap-12">
      <div>
        <div>
          <h1 className="text-3xl font-bold mb-4">Select Vet</h1>
          <p className="text-gray-600 mb-6">Book Spot for your visit</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {doctors.map((doctor) => (
            <SelectDoctorCard
              key={doctor.name}
              doctor={doctor}
              isSelected={selectedDoctor === doctor.name} //
              onDoctorSelect={handleDoctorSelection}
            />
          ))}
        </div>
      </div>
      <div>
        <div>
          <h1 className="text-3xl font-bold mb-4">Select Date And Time</h1>
          <p className="text-gray-600 mb-6">Book Spot for your visit</p>
        </div>
        <div className="w-full flex items-start justify-start">
          <SelectCalendar />
        </div>
      </div>

      <div className="my-4 flex justify-center">
        <Button buttonText="Next" buttonBackground="bg-secondary-1" />
      </div>
    </div>
  );
};

export default SelectVet;
