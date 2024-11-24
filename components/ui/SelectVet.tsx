import React, { useState } from "react";
import SelectDoctorCard from "./SelectDoctorCard";
import { doctors } from "@/model/mockData";

import CustomButton from "./CustomButton";
import SelectCalendar from "./SelectCalendar";
import { format } from "date-fns";
import { timeSlots } from "@/model/mockData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

const SelectVet = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSelect = (time: string) => {
    setSelectedSlot(time);
  };

  const handleDoctorSelection = (doctorName: string) => {
    setSelectedDoctor(doctorName);
  };

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-16">
      {/* Doctor Selection */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Select Vet</h1>
        <p className="text-gray-600 mb-6">Book Spot for your visit</p>

        <Carousel className="w-full  mx-auto">
          <CarouselContent className="-ml-1">
            {doctors.map((doctor) => (
              <CarouselItem
                key={doctor.name}
                className="pl-1 basis-full sm:basis-3 lg:basis-1/5"
              >
                <div className="w-full h-full">
                  <SelectDoctorCard
                    doctor={doctor}
                    isSelected={selectedDoctor === doctor.name}
                    onDoctorSelect={handleDoctorSelection}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Calendar and Date Selection */}
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Select Date and Time</h1>
        <p className="text-gray-600 mb-4">
          Choose a date and time for your visit
        </p>

        {/* Responsive Two-Column Layout */}
        <div className="flex flex-col justify-center items-center md:flex-row gap-8">
          {/* Calendar Section */}
          <div className="flex-shrink-0 lg:w-1/2 xl:w-1/3">
            <SelectCalendar onDateSelect={(date) => setSelectedDate(date)} />
          </div>

          {/* Timeslots Section */}
          {selectedDate && (
            <div className="flex-grow">
              <div className="font-semibold text-sm  text-gray-800 sm:text-lg">
                Available timeslots for{" "}
                <span className="text-secondary-1">
                  {format(selectedDate, "EEEE, MMM d")}
                </span>
              </div>
              <div
                className="grid gap-4 mt-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                }}
                // className="flex flex-wrap gap-4"
              >
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className={`text-center bg-primary-3 py-2 px-8 w-fit rounded-md cursor-pointer shadow-md ${
                      selectedSlot === time ? "border-secondary-1  " : ""
                    }`}
                    onClick={() => handleSelect(time)}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="my-4 flex justify-center">
        <CustomButton buttonText="Next" buttonBackground="bg-secondary-1" />
      </div>
    </div>
  );
};

export default SelectVet;
