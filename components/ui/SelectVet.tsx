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

import UserAuthenticationModal from "@/components/ui/UserAuthenticationModal";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { Pet } from "@/context/UserContext";
import { useAppointmentsContext } from "@/context/AppointmentsContext";

interface selectVetProps {
  selectedData?: Record<string, Pet | null>;
  selectedClinic?: string | null;
}

const SelectVet: React.FC<selectVetProps> = ({ selectedClinic, selectedData}) => {
  const { setSelectedAppointment } = useAppointmentsContext();

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);

  const { call: sendOTP } = useAPICall(api.loginOTP);

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
        // OTP sent successfully
        setAuthModalOpen(true);
        toast.success("OTP sent to your mobile number", {
          duration: 3000,
          position: "bottom-right",
        });
      } else {
        // Handle error
        const errorMessage = response?.error.message || "Failed to send OTP.";
        toast.error(errorMessage, {
          duration: 3000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      setOtpLoading(false);
      toast.error("An unexpected error occurred.", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  const onSuccess = (toastMessage: string) => {
    setAuthModalOpen(false);
    
    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
      position: "bottom-right",
    });
  };


  const handleSelect = (time: string) => {
    setSelectedSlot(selectedSlot === time ? null : time);
  };

  const handleDoctorSelection = (doctorName: string) => {
    if (selectedDoctor !== doctorName) {
      setSelectedDate(null);
      setSelectedSlot(null);
    }
    setSelectedDoctor(doctorName);
  };

  const isNextButtonEnabled =
    selectedDoctor !== null && selectedDate !== null && selectedSlot !== null;

  const handleDateSelect = (date: Date) => {
    setSelectedSlot(null);
    setSelectedDate(date);
  };

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      {/* Doctor Selection */}
      <div>
        <h1 className="text-3xl  mb-2">Select Vet</h1>
        <p className="text-gray-600 mb-12">Book Spot for your visit</p>

        <Carousel className="pr-1 w-[90%] sm:w-full  mx-auto">
          <CarouselContent className="-ml-1">
            {doctors.map((doctor) => (
              <CarouselItem
                key={doctor.name}
                className=" basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
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
              onDateSelect={(date) => handleDateSelect(date)}
            />
          </div>

          {/* Timeslots Section */}
          {selectedDate && (
            <div className="w-full">
              <div className="font-semibold text-xs  text-gray-800  lg:text-lg">
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
                {timeSlots.map((time, index) => (
                  <div
                    key={index}
                    className={`text-center bg-primary-3 py-2 px-6  sm:py-1 sm:px-6 lg:py-2 lg:px-8  w-fit rounded-md cursor-pointer shadow-md ${
                      selectedSlot === time ? "border border-secondary-1  " : ""
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
        initialMobileNumber={"5133158593"}
        onSuccess={onSuccess}
        buttonText="Verify OTP"
        bookingFlow={true}
      />
      <Toaster />
    </div>
  );
};

export default SelectVet;
