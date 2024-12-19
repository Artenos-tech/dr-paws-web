"use client";

import React, { useCallback, useEffect, useState } from "react";
import SelectDoctorCard from "./SelectDoctorCard";

import CustomButton from "./CustomButton";
import SelectCalendar from "./SelectCalendar";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import { Pet, useUserContext } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";

export function convertDateToEpoch(date: string) {
  return Date.parse(date);
}

interface selectVetProps {
  selectedData: Record<number, Pet>;
  selectedClinic: number;
  selectedLocation: string;
  isGrooming: boolean;
  setFinalAppointmentData: (finalAppData: {
    selectedData: Record<number, Pet | null>;
    isGrooming: boolean;
    selectedClinic: number;
    selectedLocation: string | null;
    selectedDoctor: Record<number, string> | null;
    selectedDate: Date | null;
    selectedSlot: string | null;
  }) => void;
  onNext?: () => void;
}

const SelectVet: React.FC<selectVetProps> = ({
  selectedClinic,
  selectedData,
  selectedLocation,
  setFinalAppointmentData,
  isGrooming,
  onNext,
}) => {

  const { user, userPets } = useUserContext();

  const [selectedDoctor, setSelectedDoctor] = useState<Record<number, string> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { call: getStaffSchedule, result: staffScheduleResult, } = useAPICall(
    api.getStaffSchedule
  );

  const { call: createAnAppointment } = useAPICall(api.createAppointment);

  const { call: getDoctorsForClinic, result: doctorsResult, loading: loadingDoctors } = useAPICall(api.getDoctorsForClinic);

  const fetchStaffSchedule = useCallback(async () => {
    if (
        (selectedDoctor || isGrooming) &&
        selectedClinic
    ) {
      await getStaffSchedule({
        clinicid: JSON.stringify(selectedClinic),
        staffid: selectedDoctor ? Object.keys(selectedDoctor)[0] : "0",
        appttypeid: JSON.stringify(Object.keys(selectedData)[0]),
      });
    }
  }, [
    selectedData,
    selectedDoctor,
    selectedClinic,
    getStaffSchedule,
    isGrooming
  ]);

  useEffect(() => {
    getDoctorsForClinic({ clinicid: selectedClinic});
  }, []);

  useEffect(() => {
    if (selectedDoctor || isGrooming) {
      fetchStaffSchedule();
    }
  }, [selectedDoctor, isGrooming]);

  const handleNextClick = async () => {
    setFinalAppointmentData({
      selectedData,
      selectedClinic,
      selectedLocation,
      selectedDoctor,
      selectedDate,
      selectedSlot,
      isGrooming
    });

    if (user && userPets && selectedSlot && selectedDate && selectedData) {
      const staffId = selectedDoctor ? Number(Object.keys(selectedDoctor)[0]) : 0;
      const clinicId = selectedClinic;
      const selectedPet = Object.values(selectedData)[0];
      const pet = userPets.find(
        (pet) => pet.id === selectedPet.id
      );

      if (!pet) return;
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
      const apptStart = selectedDate.toISOString();
      console.log(selectedDate);

      selectedDate.setMinutes(
        selectedDate.getMinutes() +
          (
            isGrooming ? 90 : 30
          )
      );
      const apptEnd = selectedDate.toISOString();
      try {
        const response = await createAnAppointment({
          vet_id: staffId,
          pet_id: pet?.id,
          clinic_id: clinicId,
          appt_reason: null,
          appt_start: apptStart,
          appt_end: apptEnd,
          appt_type_id: JSON.parse(Object.keys(selectedData)[0]),
        });

        if (response.ok) {
          toast.success("Appointment created successfully!", {
            duration: 3000,
            position: "bottom-right",
          });

          if (onNext) {
            onNext(); // Navigate to the next page only if the API succeeds
          }
        } else {
          toast.error("Failed to create appointment. Please try again.", {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast.error("An unexpected error occurred. Please try again.", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } else {
      toast.error("Please fill out all required fields before proceeding.", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(selectedSlot === time ? null : time);
  };

  const normalizeSelectedDate = (date: Date) => {
    console.log(date);
    const selectedDay = date.getDate();
    const selectedMonth = date.getMonth();
    const selectedYear = date.getFullYear();
    const normalizedDate = `${selectedYear}/${selectedMonth + 1}/${selectedDay}`;
    console.log(normalizedDate);
    return normalizedDate;
  };
  
  
  const allAvailableSlots = staffScheduleResult?.ok && staffScheduleResult.value.body.staffschedule.slots || {};
  

  const isNextButtonEnabled =
    (
      (selectedDoctor !== null || isGrooming) &&
      selectedDate !== null &&
      selectedSlot !== null
    ) ;

  const doctors = doctorsResult?.ok ? doctorsResult.value.body.staff : [];

  const filteredDoctors = selectedClinic ? doctors.filter((doctor) => doctor.clinicids.includes(selectedClinic)) : [];

  if (loadingDoctors) {
    return <Loader />;
  }

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      {!isGrooming && (
        <div>
          <h1 className="text-3xl mb-2">Select Vet</h1>
          <p className="text-gray-600 mb-12">Book Spot for your visit</p>

          {/* Carousel for Doctor Selection */}
          <Carousel className="pr-1 w-[90%] sm:w-full mx-auto">
            <CarouselContent className="-ml-1">
              {filteredDoctors.map((doctor) => (
                <CarouselItem
                  key={doctor.id}
                  className="basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
                >
                  <SelectDoctorCard
                    doctor={doctor}
                    isSelected={!!selectedDoctor && selectedDoctor.hasOwnProperty(doctor.id)}
                    onDoctorSelect={(id, name) => {
                      setSelectedDoctor({ [id]: name });
                      setSelectedDate(null); // Reset date and slot on doctor change
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Calendar and Timeslot Selection */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Select Date and Time</h1>
          <p className="text-gray-600 mb-4">
            Choose a date and time for your visit
          </p>
        </div>

        <div className="flex flex-col justify-center items-center xl:flex-row gap-8">
          {/* Calendar Section */}
          <div
            className={`w-full flex-shrink-0 lg:w-1/2 xl:w-1/3 ${
              !selectedDoctor &&
              selectedData &&
              !isGrooming
                ? "opacity-100 pointer-events-none"
                : ""
            }`}
          >
            {(
              <SelectCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            )}
          </div>

          {/* Timeslots Section */}
          {selectedDate && (
            <div className="w-full">
              <div className="font-semibold text-xs text-gray-800 lg:text-lg">
                Available timeslots for{" "}
                <span className="text-secondary-1">
                  {format(selectedDate, "EEEE, MMM d")}
                </span>
              </div>
              <div
                className=" w-full grid grid-cols-2 gap-2 lg:gap-4 mt-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))",
                }}
              >
                {
                  allAvailableSlots &&
                  Object.keys(allAvailableSlots).length > 0 &&
                  allAvailableSlots[normalizeSelectedDate(selectedDate)]
                ? (
                  allAvailableSlots[normalizeSelectedDate(selectedDate)].map((time, index) => (
                    <div
                      key={index}
                      className={` text-center bg-primary-3 py-2 px-6 sm:py-1 sm:px-6 lg:py-2 lg:px-8 w-full rounded-md cursor-pointer shadow-md ${
                        selectedSlot === time ? "border border-secondary-1" : ""
                      }`}
                      onClick={() => handleSlotSelect(time)}
                    >
                      {time}
                    </div>
                  ))
                ) 
                : (
                  <p className="text-gray-500 text-sm">
                    No slots available for the selected date.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="my-4 flex justify-center">
        <CustomButton
          buttonText={"Next"}
          buttonBackground="bg-secondary-1"
          disabled={!isNextButtonEnabled}
          buttonClickEvent={handleNextClick}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default SelectVet;