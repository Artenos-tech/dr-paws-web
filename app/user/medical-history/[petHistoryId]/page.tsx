"use client";
import BackButton from "@/components/ui/BackButton";
import FileDisplayCard from "@/components/ui/FileDisplayCard";
import FileRenameModal from "@/components/ui/FileRenameModal";
import { Pet } from "@/model/typeDefinitions";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

interface petHistoryIdProps {
  params: {
    petHistoryId: string;
  };
}

const PetHistoryPage: React.FC<petHistoryIdProps> = ({ params }) => {
  const { petHistoryId } = params;

  const [diagnosticReport, setDiagnosticReport] = useState<File[] | null>(null);
  const [scansAndXRaysFile, setScansAndXRaysFile] = useState<File[] | null>(
    null
  );
  const [vaccineFile, setVaccineFile] = useState<File[] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [petName, setPetName] = useState("");

  const navigate = useRouter();

  useEffect(() => {
    const pets = localStorage.getItem("pets");
    if (pets) {
      const parsePetName: Pet = JSON.parse(pets).find(
        (pet: Pet) => pet.petId === petHistoryId
      );
      setPetName(parsePetName.name);
    }
  });

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File[] | null>>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setter((prevFiles) =>
        prevFiles ? [...prevFiles, ...Array.from(files)] : Array.from(files)
      );
      setCurrentFile(files[0]);
      setNewFileName(files[0].name);
      setIsModalOpen(true);
    }
  };

  // File rename function of a file
  const handleRenameConfirm = (newFileName: string) => {
    if (currentFile) {
      const renamedFile = new File([currentFile], newFileName, {
        type: currentFile.type,
      });

      const updateFileList = (
        fileList: File[] | null,
        fileSetter: React.Dispatch<React.SetStateAction<File[] | null>>
      ) => {
        if (!fileList) return;

        const updatedFiles = fileList.map((file) => {
          if (file === currentFile) {
            const newName = renamedFile.name.includes("pdf")
              ? renamedFile.name
              : renamedFile.name + ".pdf";

            return new File([file], newName, { type: file.type });
          }
          return file;
        });

        fileSetter(updatedFiles);
      };

      if (diagnosticReport?.includes(currentFile)) {
        updateFileList(diagnosticReport, setDiagnosticReport);
      }
      if (scansAndXRaysFile?.includes(currentFile)) {
        updateFileList(scansAndXRaysFile, setScansAndXRaysFile);
      }
      if (vaccineFile?.includes(currentFile)) {
        updateFileList(vaccineFile, setVaccineFile);
      }

      setIsModalOpen(false);
      setCurrentFile(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFile(null);
    setNewFileName("");
  };

  // File remove function
  const handleFileRemove = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<File[] | null>>
  ) => {
    setter((prevState) => {
      if (!prevState) return null;
      return prevState.filter((_, i) => i !== index);
    });
  };

  // File save function
  const handleSaveFiles = async () => {
    // Convert File to base64
    const fileToBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

    // Convert files to a storable format
    const fileFormat = async (files: File[] | null) => {
      if (!files) return [];
      return Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          content: await fileToBase64(file),
        }))
      );
    };

    const diagnosticReports = await fileFormat(diagnosticReport);
    const scansAndXRays = await fileFormat(scansAndXRaysFile);
    const vaccines = await fileFormat(vaccineFile);

    const medicalReports = {
      petId: petHistoryId,
      petName: petName,
      diagnosticReports,
      scansAndXRays,
      vaccines,
    };

    const existingData = localStorage.getItem("pets-history");
    let updatedData = [];

    if (existingData) {
      updatedData = JSON.parse(existingData);

      const existingPetIndex = updatedData.findIndex(
        (record: { petId: string }) => record.petId === petHistoryId
      );

      if (existingPetIndex > -1) {
        updatedData[existingPetIndex].diagnosticReports = [
          ...updatedData[existingPetIndex].diagnosticReports,
          ...diagnosticReports,
        ];
        updatedData[existingPetIndex].scansAndXRays = [
          ...updatedData[existingPetIndex].scansAndXRays,
          ...scansAndXRays,
        ];
        updatedData[existingPetIndex].vaccines = [
          ...updatedData[existingPetIndex].vaccines,
          ...vaccines,
        ];
      } else {
        // Add a new pet history if not found
        updatedData.push(medicalReports);
      }
    } else {
      // If no existing data, add the first pet record
      updatedData.push(medicalReports);
    }

    localStorage.setItem("pets-history", JSON.stringify(updatedData));
    navigate.push("/user/medical-history");
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[20px] row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        <BackButton />

        <div className="w-full h-full">
          <h1 className="text-3xl text-center text-secondary-1">
            {petName}&apos;s Medical History
          </h1>

          <div className="w-full h-full flex flex-col gap-5 my-4">
            <div className="border-b-2 border-b-primary-3 py-4 w-full">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg flex-1">Past Diagnostic Reports</h3>
                <div className="relative self-end">
                  <button
                    type="button"
                    className="rounded-full absolute cursor-pointer right-0 bottom-0 font-semibold text-secondary-1 border-2 border-secondary-1 px-10 py-2"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, setDiagnosticReport)}
                    className="opacity-0 cursor-pointer absolute bottom-0 right-0"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-wrap gap-3 w-full">
                {diagnosticReport &&
                  diagnosticReport.map((file: File, index: number) => (
                    <FileDisplayCard
                      key={index}
                      fileName={file.name}
                      onRemove={() =>
                        handleFileRemove(index, setDiagnosticReport)
                      }
                    />
                  ))}
              </div>
            </div>

            <div className="border-b-2 border-b-primary-3 py-4">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg flex-1">Past Scans and X-rays</h3>
                <div className="relative self-end">
                  <button
                    type="button"
                    className="rounded-full absolute cursor-pointer right-0 bottom-0 font-semibold text-secondary-1 border-2 border-secondary-1 px-10 py-2"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, setScansAndXRaysFile)}
                    className="opacity-0 cursor-pointer absolute bottom-0 right-0"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-wrap w-full gap-3">
                {scansAndXRaysFile &&
                  scansAndXRaysFile.map((file: File, index: number) => (
                    <FileDisplayCard
                      key={index}
                      fileName={file.name}
                      onRemove={() =>
                        handleFileRemove(index, setScansAndXRaysFile)
                      }
                    />
                  ))}
              </div>
            </div>

            <div className="border-b-2 border-b-primary-3 py-4">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg flex-1">Vaccines</h3>
                <div className="relative self-end">
                  <button
                    type="button"
                    className="rounded-full absolute cursor-pointer right-0 bottom-0 font-semibold text-secondary-1 border-2 border-secondary-1 px-10 py-2"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, setVaccineFile)}
                    className="opacity-0 cursor-pointer absolute bottom-0 right-0"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-wrap w-full gap-3">
                {vaccineFile &&
                  vaccineFile.map((file: File, index: number) => (
                    <FileDisplayCard
                      key={index}
                      fileName={file.name}
                      onRemove={() => handleFileRemove(index, setVaccineFile)}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center my-10 gap-5">
            <button type="button" className="underline text-secondary-1 w-1/5">
              I&apos;ll do it later
            </button>
            <button
              type="button"
              className="rounded-full font-semibold text-white bg-secondary-1 px-10 py-2 w-1/5"
              onClick={handleSaveFiles}
            >
              Save
            </button>
          </div>
        </div>
      </main>
      <FileRenameModal
        isOpen={isModalOpen}
        onClose={() => closeModal()}
        onConfirm={handleRenameConfirm}
        currentFileName={newFileName}
      />
    </div>
  );
};

export default PetHistoryPage;
