import SelectClinicCard from "./SelectClinicCard";
import CustomButton from "./CustomButton";
import { useEffect } from "react";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";

interface SelectClinicProps {
  onNext: () => void; // Prop for navigation
  selectedClinic: number | null;
 handleClinicSelection: (clinicId: number, location: string) => void; 
}

const SelectClinic: React.FC<SelectClinicProps> = ({ onNext, selectedClinic, handleClinicSelection }) => {

  const { call: getClinics, result: getClinicsResult } = useAPICall(api.getClinics)
  useEffect(() => {
    getClinics({})
  }, [])

  const clinics = getClinicsResult?.ok ? getClinicsResult.value.body.clinics : []

  return (
    <div className=" flex flex-col">
      <h1 className="text-2xl mb-2">Select a Clinic</h1>
      <p className="text-gray-600 mb-12">Book an appointment at our clinic</p>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="h-full ">
            <SelectClinicCard
              key={clinic.id}
              clinic={clinic}
              isSelected={selectedClinic === clinic.id}
              onSelect={() => handleClinicSelection(clinic.id, clinic.location)}
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
