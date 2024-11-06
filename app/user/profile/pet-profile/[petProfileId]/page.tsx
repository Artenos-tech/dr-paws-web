import React from "react";
import PetProfileInfo from "@/components/ui/PetProfileInfo";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import BackButton from "@/components/ui/BackButton";

interface PetProfileProps {
  params: {
    petProfileId: string;
  };
}

const PetProfile: React.FC<PetProfileProps> = ({ params }) => {
  const { petProfileId } = params;

  return (
    <div className="flex flex-col w-full h-screen items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-40">
        <BackButton />
        <PetProfileInfo petProfileId={petProfileId} />
      </main>
    </div>
  );
};

export async function generateStaticParams() {
  const pets = [
    { petId: "ca0e53c4-9293-4b83-9f48-615bb3b02017" },
    { petId: "30e126d5-abc9-4355-b30c-e07ac60d68d6" },
    { petId: "1ece2a1c-0502-4c38-890f-c9b657cddf8b" },
    { petId: "0c75aba4-c086-4ec5-a8c4-fdcd5d3f3abc" },
    { petId: "43744f21-8fbb-40c6-99e7-6be32700ff98" },
  ];

  return pets.map((pet) => ({
    petProfileId: pet.petId,
  }));
}

export default PetProfile;
