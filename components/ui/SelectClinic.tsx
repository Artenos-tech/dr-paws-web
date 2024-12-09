"use client";


import { clinicItems } from "@/model/mockData";
import SelectClinicCard from "./SelectClinicCard";
import CustomButton from "./CustomButton";

interface SelectClinicProps {
  onNext: () => void; // Prop for navigation
  selectedClinic: string | null;
 handleClinicSelection: (clinicId: string) => void; 
}

const SelectClinic: React.FC<SelectClinicProps> = ({ onNext, selectedClinic, handleClinicSelection }) => {

  return (
    <div className=" flex flex-col">
      <h1 className="text-2xl mb-2">Select a Clinic</h1>
      <p className="text-gray-600 mb-12">Book an appointment at our clinic</p>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ">
        {clinicItems.map((item) => (
          <div key={item.id} className="h-full ">
            <SelectClinicCard
              key={item.id}
              clinic={item}
              isSelected={selectedClinic === item.clinicName}
              onSelect={() => handleClinicSelection(item.id)}
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
