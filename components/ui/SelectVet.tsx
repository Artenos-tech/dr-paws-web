"use client";

import React, { useCallback, useEffect, useState } from "react";
import SelectDoctorCard from "./SelectDoctorCard";
import { doctors } from "@/model/mockData";

import CustomButton from "./CustomButton";
import SelectCalendar from "./SelectCalendar";
import { addMinutes, format, parse } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

// import UserAuthenticationModal from "@/components/ui/UserAuthenticationModal";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import { Pet, useUserContext } from "@/context/UserContext";
import { useAppointmentsContext } from "@/context/AppointmentsContext";
import toast, { Toaster } from "react-hot-toast";
import { epochToDate } from "./AppointmentCard";

export function convertDateToEpoch(date: string) {
  return Date.parse(date);
}

interface selectVetProps {
  selectedData?: Record<string, Pet | null>;
  selectedClinic?: string | null;
  onNext?: () => void;
}

const SelectVet: React.FC<selectVetProps> = ({
  selectedClinic,
  selectedData,
  onNext,
}) => {
  const { setSelectedAppointment, fetchAppointments } =
    useAppointmentsContext();

  const { user, userPets } = useUserContext();

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // const [authModalOpen, setAuthModalOpen] = useState(false);
  // const [otpLoading, setOtpLoading] = useState<boolean>(false);

  // const { call: sendOTP } = useAPICall(api.loginOTP);
  const { call: getStaffSchedule, result: staffScheduleResult } = useAPICall(
    api.getStaffSchedule
  );

  const { call: createAnAppointment } = useAPICall(api.createAppointment);

  const staffIdBasedServices =
    selectedData && Object.keys(selectedData).includes("Grooming")
      ? "0"
      : selectedDoctor;

  const fetchStaffSchedule = useCallback(async () => {
    if (
      (selectedDoctor ||
        (selectedData && Object.keys(selectedData).includes("Grooming"))) &&
      selectedClinic &&
      staffIdBasedServices
    ) {
      await getStaffSchedule({
        clinicid: selectedClinic,
        staffid: staffIdBasedServices,
      });
    }
  }, [
    selectedDoctor,
    selectedData,
    selectedClinic,
    getStaffSchedule,
    staffIdBasedServices,
  ]);

  useEffect(() => {
    if (
      selectedDoctor ||
      (selectedData && Object.keys(selectedData).includes("Grooming"))
    ) {
      fetchStaffSchedule();
    }
  }, [selectedDoctor]);

  const handleNextClick = async () => {
    setSelectedAppointment({
      selectedData,
      selectedClinic,
      selectedDoctor,
      selectedDate,
      selectedSlot,
    });

    if (user && userPets && selectedSlot && selectedDate) {
      const staffId = Number(staffIdBasedServices);
      const clinicId = Number(selectedClinic);
      const pet = userPets.find(
        (pet) => pet.id === selectedData?.[Object.keys(selectedData)[0]]?.id
      );

      if (!pet) return;
      const [hours, minutes] = selectedSlot.split(":").map(Number);
      selectedDate.setHours(hours, minutes, 0, 0);
      const apptStart = selectedDate.toISOString();
      console.log(selectedDate);

      selectedDate.setMinutes(
        selectedDate.getMinutes() +
          (selectedData && Object.keys(selectedData).includes("Grooming")
            ? 90
            : 30)
      );
      const apptEnd = selectedDate.toISOString();
      const epoch = convertDateToEpoch(apptStart);
      console.log("epoch:", convertDateToEpoch(apptStart));
      console.log("epoch date:", epochToDate(epoch));

      try {
        const response = await createAnAppointment({
          id: user?.id,
          vet_id: staffId,
          pet_id: pet?.id,
          clinic_id: clinicId,
          appt_reason: null,
          appt_start: convertDateToEpoch(apptStart),
          appt_end: convertDateToEpoch(apptEnd),
        });

        if (response.ok) {
          toast.success("Appointment created successfully!", {
            duration: 3000,
            position: "bottom-right",
          });

          fetchAppointments();

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

  // const onSuccess = (toastMessage: string) => {
  //   // setAuthModalOpen(false);
  //   if (onNext) {
  //     onNext();
  //   }
  //   toast.success(`Successfully ${toastMessage}`, {
  //     duration: 3000,
  //     position: "bottom-right",
  //   });
  // };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(selectedSlot === time ? null : time);
  };

  const generateHourlySlots = (timeRange: string) => {
    if (!timeRange) return [];

    const [startTimeStr, endTimeStr] = timeRange.split(" to ");
    if (!startTimeStr || !endTimeStr) {
      throw new Error("Invalid time range format");
    }

    const startTime = parse(startTimeStr, "HH:mm", new Date());
    let endTime = parse(endTimeStr, "HH:mm", new Date());

    // Normalize 24:00 or beyond to next day
    if (endTimeStr.startsWith("24") || endTimeStr.startsWith("25")) {
      endTime = parse("00:02", "HH:mm", addMinutes(new Date(), 1440)); // Add 1 day
    }

    // Check if parsed dates are valid
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error("Invalid time range values");
    }

    const slots = [];
    let current = startTime;

    while (current <= endTime) {
      slots.push(format(current, "HH:mm"));
      current = addMinutes(
        current,
        selectedData && Object.keys(selectedData).includes("Grooming") ? 90 : 30
      );
    }

    return slots.length > 0 ? slots : [];
  };

  const selectedDay = selectedDate && format(selectedDate, "EEEE");

  const timeRange =
    selectedDay &&
    staffScheduleResult?.ok &&
    staffScheduleResult.value.body.staffschedule.weeks[selectedDay];

  // const timeRange =
  //   selectedDay &&
  //   staffSchedule.weeks[selectedDay as keyof typeof staffSchedule.weeks];

  const availableSlots =
    typeof timeRange === "string" ? generateHourlySlots(timeRange) : [];

  const isNextButtonEnabled =
    (selectedDoctor !== null &&
      selectedDate !== null &&
      selectedSlot !== null) ||
    (selectedData && Object.keys(selectedData).includes("Grooming"));

  const filteredDoctors =
    selectedClinic === "221"
      ? doctors.filter((doctor) => doctor.clinicIds.includes("221"))
      : doctors.filter((doctor) => doctor.clinicIds.includes("220"));

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      {selectedData && !Object.keys(selectedData).includes("Grooming") && (
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
                    isSelected={selectedDoctor === doctor.id}
                    onDoctorSelect={(id) => {
                      setSelectedDoctor(id);
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
              !Object.keys(selectedData).includes("Grooming")
                ? "opacity-100 pointer-events-none"
                : ""
            }`}
          >
            <SelectCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              years={
                staffScheduleResult?.ok
                  ? (staffScheduleResult.value.body.staffschedule
                      .year as Record<string, string>)
                  : {}
              }
              // years={staffSchedule.year}
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
                {availableSlots.length > 0 ? (
                  availableSlots.map((time, index) => (
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
                ) : (
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
      {/* <UserAuthenticationModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMobileNumber="5133158593"
        onSuccess={onSuccess}
        buttonText="Verify OTP"
        bookingFlow={true}
      /> */}
      <Toaster />
    </div>
  );
};

export default SelectVet;
