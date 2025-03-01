"use client";

import SelectClinicCard from "./SelectClinicCard";
import CustomButton from "./CustomButton";
import { useEffect } from "react";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import { ClipLoader } from "react-spinners";

interface SelectClinicProps {
  onNext: () => void; // Prop for navigation
  selectedClinic: number | null;
 handleClinicSelection: (clinicId: number, location: string, contact: string) => void; 
}

const SelectClinic: React.FC<SelectClinicProps> = ({ onNext, selectedClinic, handleClinicSelection }) => {

  const { call: getClinicsForBooking, result: getClinicsResult, loading: loadingClinics } = useAPICall(api.getClinicsForBooking)
  useEffect(() => {
    getClinicsForBooking({})
  }, [])

  const clinics = getClinicsResult?.ok ? getClinicsResult.value.body.clinics : []

  if (loadingClinics) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className=" flex flex-col">
      <h1 className="text-2xl mb-2">Select a Clinic</h1>
      <p className="text-gray-600 mb-12">Book an appointment at one of our state-of-the-art clinics</p>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ">
        {clinics.map((item) => (
          <div key={item.id} className="h-full ">
            <SelectClinicCard
              key={item.id}
              clinic={item}
              isSelected={selectedClinic === item.id}
              onSelect={() => handleClinicSelection(item.id, item.location, item.contact)}
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
