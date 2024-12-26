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
import { ClipLoader } from "react-spinners";

import { BookingCategory } from "./SelectService";

export function convertDateToEpoch(date: string) {
  return Date.parse(date);
}

export interface SelectedVet {
  id: number
  name: string 
  image: string
}

interface selectVetProps {
  selectedSvcId: number;
  selectedPet: Pet
  selectedClinic: number;
  selectedLocation: string;
  selectedService: string;
  selectedSubtype: BookingCategory | null;
  isGrooming: boolean;
  setFinalAppointmentData: (finalAppData: {
    selectedDoctor: SelectedVet | null
    selectedDate: Date | null;
    selectedSlot: string | null;
  }) => void;
  onNext?: () => void;
}

const SelectVet: React.FC<selectVetProps> = ({
  selectedClinic,
  selectedSvcId,
  selectedPet,
  selectedSubtype,
  setFinalAppointmentData,
  isGrooming,
  onNext,
}) => {

  const { user } = useUserContext();

  const [selectedDoctor, setSelectedDoctor] = useState<SelectedVet | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { 
    call: getStaffSchedule,
    result: staffScheduleResult,
    loading: loadingStaffSchedule
  } = useAPICall(
    api.getStaffSchedule
  );

  const {
    call: createAnAppointment,
    loading: loadingAppointmentCreation
  } = useAPICall(api.createAppointment);

  const {
    call: getDoctorsForClinic,
    result: doctorsResult,
    loading: loadingDoctors
  } = useAPICall(api.getDoctorsForClinic);

  const fetchStaffSchedule = useCallback(async () => {
    if (!selectedDoctor) {
      throw new Error("Doctor must be selected")
    }
    await getStaffSchedule({
      clinicid: selectedClinic.toString(),
      staffid: selectedDoctor.id.toString(),
      appttypeid: selectedSvcId.toString(),
      subtype: selectedSubtype?.id,
    });
  }, [
    selectedSvcId,
    selectedDoctor,
    selectedClinic,
    getStaffSchedule,
    isGrooming
  ]);

  const fetchDoctors = useCallback(async () => {
    await getDoctorsForClinic({
      clinicid: selectedClinic,
      grooming: isGrooming ? "y" : "n",
    });
  }, [selectedClinic, getDoctorsForClinic]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const GROOMING_STAFF_NAME = "Grooming Staff";

  useEffect(() => {
    if (isGrooming && doctorsResult?.ok) {
      const groomingStaff = doctorsResult.value.body.staff.find(
        (doctor) => doctor.name === GROOMING_STAFF_NAME
      );
      if (groomingStaff) {
        setSelectedDoctor(groomingStaff);
      } else {
        console.error(
          "Grooming staff not found in the list of doctors", 
          doctorsResult.value.body.staff,
        )
      }
    }
  },[doctorsResult, isGrooming]);
  
  useEffect(() => {
    if (selectedDoctor) {
      fetchStaffSchedule();
    }
  }, [selectedDoctor]);

  const handleNextClick = async () => {
    if (!(selectedDoctor || isGrooming)) {
      throw new Error("Doctor must be selected or grooming must be selected");
    }
    setFinalAppointmentData({
      selectedDoctor,
      selectedDate,
      selectedSlot,
    });
    if (user && selectedSlot && selectedDate && selectedDoctor) {
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
      const apptStart = selectedDate.toISOString();
      selectedDate.setMinutes(
        selectedDate.getMinutes() +
          (
            !isGrooming 
              ? 30
              : selectedSubtype?.id === "spa-bath"
                ? 60
                : 90
          )
      );
      const apptEnd = selectedDate.toISOString();
      try {
        const response = await createAnAppointment({
          vet_id: selectedDoctor.id,
          pet_id: selectedPet.id,
          clinic_id: selectedClinic,
          appt_reason: selectedSubtype?.title || null,
          appt_start: apptStart,
          appt_end: apptEnd,
          appt_type_id: selectedSvcId,
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
  
  const doctors = doctorsResult?.ok ? doctorsResult.value.body.staff : [];

  const filteredDoctors = selectedClinic ? doctors.filter((doctor) => doctor.clinicids.includes(selectedClinic)) : [];

  const isNextButtonEnabled =
    (
      (selectedDoctor !== null || isGrooming) &&
      selectedDate !== null &&
      selectedSlot !== null
    ) ;

  if (loadingDoctors) {
    return <Loader />;
  }

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      {!isGrooming && (
        <div>
          <h1 className="text-3xl mb-2">Select Vet</h1>
          <p className="text-gray-600 mb-12">Book Spot for your visit</p>
          <DoctorSelectionCarousel
            options={filteredDoctors}
            selectedDoctor={selectedDoctor}
            onDoctorSelected={(doctor) => {
              setSelectedDoctor(doctor);
              setSelectedDate(null); // Reset date and slot on doctor change
            }}
          />
        </div>
      )}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Select Date and Time</h1>
          <p className="text-gray-600 mb-4">
            Choose a date and time for your visit
          </p>
        </div>

        {(selectedDoctor || isGrooming) && (
          loadingStaffSchedule ? (
            <div className="m-auto my-1">
              <ClipLoader color="#33495f" />
            </div>
          ) : staffScheduleResult ? (
            staffScheduleResult.ok ? (
              <AppointmentDateAndTimeSelector
                show={!selectedDoctor && selectedPet && !isGrooming}
                selectedDate={selectedDate}
                onDateSelected={handleDateSelect}
                availableSlots={staffScheduleResult.value.body.staffschedule.slots}
                selectedSlot={selectedSlot}
                onSlotSelected={handleSlotSelect}
              />
            ) : (
              <p className="text-gray-500 text-sm">
                Cannot load the available slots. Please try again later.
              </p>
            )
          ) : null // result starts out as undefined before API call is made
        )}
      </div>
      <div className="my-4 flex justify-center">
        <CustomButton
          buttonText={"Next"}
          buttonBackground="bg-secondary-1"
          disabled={!isNextButtonEnabled || loadingAppointmentCreation}
          loading={isNextButtonEnabled && loadingAppointmentCreation}
          buttonClickEvent={handleNextClick}
        />
      </div>
      <Toaster />
    </div>
  );
};

const DoctorSelectionCarousel = ({
  options,
  selectedDoctor,
  onDoctorSelected,
}: {
  options: SelectedVet[],
  selectedDoctor: SelectedVet | null
  onDoctorSelected: (doctor: SelectedVet) => void
}) => {
  return (
    <Carousel className="pr-1 w-[90%] sm:w-full mx-auto">
      <CarouselContent className="-ml-1">
        {options.map((doctor) => (
          <CarouselItem
            key={doctor.id}
            className="basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
          >
            <SelectDoctorCard
              doctor={doctor}
              isSelected={selectedDoctor?.id === doctor.id}
              onDoctorSelect={(id, name, image) => {
                onDoctorSelected({ id, name, image });
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}


const normalizeSelectedDate = (date: Date) => {
  const selectedDay = date.getDate().toString().padStart(2, "0");
  const selectedMonth = (date.getMonth() + 1).toString().padStart(2, "0");
  const selectedYear = date.getFullYear().toString();
  const normalizedDate = `${selectedYear}/${selectedMonth}/${selectedDay}`;
  return normalizedDate;
};

const AppointmentDateAndTimeSelector = ({
  show,
  selectedDate,
  onDateSelected,
  availableSlots,
  selectedSlot,
  onSlotSelected,
}: {
  show: boolean
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
  availableSlots: Record<string, string[]>
  selectedSlot: string | null
  onSlotSelected: (slot: string) => void
}) => {
  return (
    <div className="flex flex-col justify-center items-center xl:flex-row gap-8">
      <div
        className={`w-full flex-shrink-0 lg:w-1/2 xl:w-1/3 ${
          show
            ? "opacity-100 pointer-events-none"
            : ""
        }`}
        // className="w-full flex-shrink-0 lg:w-1/2 xl:w-1/3"
      >
        <SelectCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelected}
        />
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
            {availableSlots &&
            Object.keys(availableSlots).length > 0 &&
            availableSlots[normalizeSelectedDate(selectedDate)].length > 0 &&
            availableSlots[normalizeSelectedDate(selectedDate)] ? (
              availableSlots[normalizeSelectedDate(selectedDate)].map(
                (time, index) => (
                  <div
                    key={index}
                    className={` text-center bg-primary-3 py-2 px-6 sm:py-1 sm:px-6 lg:py-2 lg:px-8 w-full rounded-md cursor-pointer shadow-md ${
                      selectedSlot === time ? "border border-secondary-1" : ""
                    }`}
                    onClick={() => onSlotSelected(time)}
                  >
                    {time}
                  </div>
                )
              )
            ) : (
              <p className="text-gray-500 text-sm">
                No slots available for the selected date.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectVet;