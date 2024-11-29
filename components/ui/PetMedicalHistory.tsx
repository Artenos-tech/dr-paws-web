import React, { useEffect, useState } from "react";
import OutlineButton from "./OutlineButton";
import { useRouter } from "next/navigation";
import FileDisplayCard from "./FileDisplayCard";
import PetFilePreview from "./PetFilePreview";

interface petMedicalHistoryProps {
  petId: string;
  petName?: string;
}

// TO-DO: Temporary type for medical history untill API is ready
export interface MedicalHistoryType {
  petId: string;
  petName: string;
  diagnosticReports: {
    name: string;
    type: string;
    size: number;
    content: string;
  }[];
  scansAndXRays: {
    name: string;
    type: string;
    size: number;
    content: string;
  }[];
  vaccines: {
    name: string;
    type: string;
    size: number;
    content: string;
  }[];
}

const PetMedicalHistory: React.FC<petMedicalHistoryProps> = ({
  petId,
  petName,
}) => {
  const [medicalHistory, setMedicalHistory] =
    useState<MedicalHistoryType | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentFileIndexCategory, setCurrentFileIndexCategory] = useState<{
    index: number;
    category: "diagnosticReports" | "scansAndXRays" | "vaccines";
  }>({ index: 0, category: "diagnosticReports" });

  const navigate = useRouter();

  // TO-DO: For Testing Purpose
  useEffect(() => {
    const petsMedicalHistory = localStorage.getItem("pets-history");
    if (petsMedicalHistory) {
      const parsedMedicalHistory: MedicalHistoryType[] =
        JSON.parse(petsMedicalHistory);
      const history = parsedMedicalHistory.find(
        (history: MedicalHistoryType) => history.petId === petId
      );
      setMedicalHistory(history ?? null);
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
            You haven&apos;t added medical history
          </h1>
        ) : (
          <>
            <div className="border-b-2 border-b-primary-3 py-4 w-full">
              <h3 className="text-lg">Past Diagnostic Reports</h3>
              <div className="py-2 flex flex-wrap gap-3 w-full">
                {medicalHistory.diagnosticReports.map((report, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setModalOpen(true);
                      setCurrentFileIndexCategory({
                        index,
                        category: "diagnosticReports",
                      });
                    }}
                  >
                    <FileDisplayCard fileName={report.name} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b-2 border-b-primary-3 py-4 w-full">
              <h3 className="text-lg">Past Scans and X-rays</h3>
              <div className="py-2 flex flex-wrap w-full gap-3">
                {medicalHistory.scansAndXRays.map((scan, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setModalOpen(true);
                      setCurrentFileIndexCategory({
                        index,
                        category: "scansAndXRays",
                      });
                    }}
                  >
                    <FileDisplayCard fileName={scan.name} />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b-2 border-b-primary-3 py-4 w-full">
              <h3 className="text-lg">Vaccines</h3>
              <div className="py-2 flex flex-wrap w-full gap-3">
                {medicalHistory.vaccines.map((vaccine, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setModalOpen(true);
                      setCurrentFileIndexCategory({
                        index,
                        category: "vaccines",
                      });
                    }}
                  >
                    <FileDisplayCard fileName={vaccine.name} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <PetFilePreview
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentIndex={currentFileIndexCategory.index}
        currentCategory={currentFileIndexCategory.category}
      />
    </div>
  );
};

export default PetMedicalHistory;
