import React, { useEffect, useState } from "react";
import OutlineButton from "./OutlineButton";
import { useRouter } from "next/navigation";

interface petMedicalHistoryProps {
  petId: string;
  petName?: string;
}

// TO-DO: Temporary type for medical history untill API is ready
export interface MedicalHistoryType {
  petId: string;
  petName: string;
  diagnosticReports: {
    id: string;
    file: File;
  }[];
  scansAndXRays: {
    id: string;
    file: File;
  }[];
  vaccines: {
    id: string;
    file: File;
  }[];
}

const PetMedicalHistory: React.FC<petMedicalHistoryProps> = ({
  petId,
  petName,
}) => {
  const [medicalHistory, setMedicalHistory] =
    useState<MedicalHistoryType | null>(null);

  const navigate = useRouter();

  // TO-DO: For Testing Purpose
  useEffect(() => {
    const petsMedicalHistory = localStorage.getItem("pets-history");
    if (petsMedicalHistory) {
      const parsedMedicalHistory: MedicalHistoryType[] =
        JSON.parse(petsMedicalHistory);
      setMedicalHistory(
        parsedMedicalHistory.find(
          (history: MedicalHistoryType) => history.petId === petId
        ) ?? null
      );
    }
  }, [petId]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-between items-center w-full">
        <h1 className="flex-1 text-center text-secondary-1 text-2xl">
          {petName}&apos;s Medical History
        </h1>

        <div>
          {medicalHistory ? (
            <OutlineButton
              outlineBtnText="Edit"
              outlineBtnLink={() =>
                navigate.push(`/user/medical-history/${petId}`)
              }
            />
          ) : (
            <OutlineButton
              outlineBtnText="Upload"
              outlineBtnLink={() =>
                navigate.push(`/user/medical-history/${petId}`)
              }
            />
          )}
        </div>
      </div>

      <div className="flex flex-col justify-start items-center mt-10 w-full h-full">
        {!medicalHistory ? (
          <h1 className="text-center text-lg text-secondary-1 opacity-40">
            You haven't added medical history
          </h1>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PetMedicalHistory;
