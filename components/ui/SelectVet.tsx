"use client";

import React, { useEffect, useState } from "react";
import SelectDoctorCard from "./SelectDoctorCard";
import { doctors, staffSchedule } from "@/model/mockData";

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

import UserAuthenticationModal from "@/components/ui/UserAuthenticationModal";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { Pet } from "@/context/UserContext";
import { useAppointmentsContext } from "@/context/AppointmentsContext";

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
  const { setSelectedAppointment } = useAppointmentsContext();

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const { call: sendOTP } = useAPICall(api.loginOTP);
  const { call: getStaffSchedule, result: staffScheduleResult } = useAPICall(
    api.getStaffSchedule
  );

  useEffect(() => {
    if (selectedDoctor) {
      fetchStaffSchedule();
    }
  }, [selectedDoctor]);

  const fetchStaffSchedule = async () => {
    if (selectedDoctor && selectedClinic) {
      await getStaffSchedule({
        clinicid: selectedClinic,
        staffid: "950",
      });
    }
  };

  const handleNextClick = async () => {
    setSelectedAppointment({
      selectedData,
      selectedClinic,
      selectedDoctor,
      selectedDate,
      selectedSlot,
    });

    try {
      setOtpLoading(true);
      const response = await sendOTP({ mobile: "5133158593", role: "USER" });
      setOtpLoading(false);

      if (response.ok) {
        setAuthModalOpen(true);
        toast.success("OTP sent to your mobile number", {
          duration: 3000,
          position: "bottom-right",
        });
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch {
      setOtpLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const onSuccess = (toastMessage: string) => {
    setAuthModalOpen(false);
    if (onNext) {
      onNext();
    }
    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(selectedSlot === time ? null : time);
  };

  const generateHourlySlots = (timeRange: string) => {
    if (!timeRange) return [];

    try {
      const [startTimeStr, endTimeStr] = timeRange.split(" to ");
      if (!startTimeStr || !endTimeStr) {
        throw new Error("Invalid time range format");
      }

      let startTime = parse(startTimeStr, "HH:mm", new Date());
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
        current = addMinutes(current, 30); // Increment by 30 minutes
      }

      return slots.length > 0 ? slots : [];
    } catch (error) {
      console.error("Error parsing time range:", error);
      return [];
    }
  };

  const selectedDay = selectedDate && format(selectedDate, "EEEE");
  const timeRange =
    selectedDay &&
    staffScheduleResult?.ok &&
    staffScheduleResult.value.body.staffschedule.weeks[selectedDay];
  console.log(timeRange);

  // const timeRange =
  //   selectedDay &&
  //   staffSchedule.weeks[selectedDay as keyof typeof staffSchedule.weeks];

  const availableSlots =
    typeof timeRange === "string" ? generateHourlySlots(timeRange) : [];
  console.log(availableSlots);

  const isNextButtonEnabled =
    selectedDoctor !== null && selectedDate !== null && selectedSlot !== null;

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      <div>
        <h1 className="text-3xl mb-2">Select Vet</h1>
        <p className="text-gray-600 mb-12">Book Spot for your visit</p>

        {/* Carousel for Doctor Selection */}
        <Carousel className="pr-1 w-[90%] sm:w-full mx-auto">
          <CarouselContent className="-ml-1">
            {doctors.map((doctor) => (
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

      {/* Calendar and Timeslot Selection */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Select Date and Time</h1>
          <p className="text-gray-600 mb-4">
            Choose a date and time for your visit
          </p>
        </div>

        <div className="flex flex-col justify-center items-center sm:flex-row gap-8">
          {/* Calendar Section */}
          <div
            className={`flex-shrink-0 lg:w-1/2 xl:w-1/3 ${
              !selectedDoctor && "opacity-100 pointer-events-none"
            }`}
          >
            <SelectCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              // years={
              //   staffScheduleResult?.ok
              //     ? (staffScheduleResult.value.body.staffschedule
              //         .year as Record<string, string>)
              //     : {}
              // }
              years={staffSchedule.year}
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
                className="grid grid-cols-2 gap-2 lg:gap-4 mt-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))",
                }}
              >
                {availableSlots.length > 0 ? (
                  availableSlots.map((time, index) => (
                    <div
                      key={index}
                      className={`text-center bg-primary-3 py-2 px-6 sm:py-1 sm:px-6 lg:py-2 lg:px-8 w-fit rounded-md cursor-pointer shadow-md ${
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
          buttonText={otpLoading ? "Sending OTP..." : "Next"}
          buttonBackground="bg-secondary-1"
          disabled={!isNextButtonEnabled}
          buttonClickEvent={handleNextClick}
        />
      </div>
      <UserAuthenticationModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMobileNumber="5133158593"
        onSuccess={onSuccess}
        buttonText="Verify OTP"
        bookingFlow={true}
      />
      <Toaster />
    </div>
  );
};

export default SelectVet;
