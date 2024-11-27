"use client";
import BackButton from "@/components/ui/BackButton";
import { MedicalHistoryType } from "@/components/ui/PetMedicalHistory";
import { Pet } from "@/model/typeDefinitions";
import React, { useEffect, useState } from "react";

interface petHistoryIdProps {
  params: {
    petHistoryId: string;
  };
}

const page: React.FC<petHistoryIdProps> = ({ params }) => {
  const { petHistoryId } = params;

  const [medicalHistory, setMedicalHistory] =
    useState<MedicalHistoryType | null>(null);

  const [petName, setPetName] = useState("");

  useEffect(() => {
    const pets = localStorage.getItem("pets");
    if (pets) {
      const parsePetName: Pet = JSON.parse(pets).find(
        (pet: Pet) => pet.petId === petHistoryId
      );
      setPetName(parsePetName.name);
    }
  });
  return (
    <div className="flex flex-col w-full h-screen items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[20px] row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        <BackButton />

        <div className="w-full h-full">
          <h1 className="text-3xl text-center text-secondary-1">
            {petName}&apos;s Medical History
          </h1>

          <div className="w-full h-full my-4">
            <div className="border-b-2 border-b-primary-3 py-4">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-lg flex-1">Past Diagnostic Reports</h3>
                <div className="relative">
                  <button
                    type="button"
                    className="rounded-full absolute cursor-pointer right-0 bottom-0 font-semibold text-secondary-1 border-2 border-secondary-1 px-10 py-2"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    accept="pdf"
                    className="opacity-0 cursor-pointer absolute bottom-0 right-0"
                  />
                </div>
              </div>
              <div className=""></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
