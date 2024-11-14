import React from "react";
import PetProfileInfo from "@/components/ui/PetProfileInfo";
import BackButton from "@/components/ui/BackButton";

interface PetProfileProps {
  params: {
    petProfileId: string;
  };
}

const PetProfile: React.FC<PetProfileProps> = ({ params }) => {
  const { petProfileId } = params;

  return (
    <div className="flex flex-col w-full h-full lg:h-screen items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <BackButton />
        <PetProfileInfo petProfileId={petProfileId} />
      </main>
    </div>
  );
};

export async function generateStaticParams() {
  const pets = [
    { petId: "1" },
    { petId: "2" },
    { petId: "3" },
    { petId: "4" },
    { petId: "5" },
    { petId: "6" },
    { petId: "7" },
    { petId: "8" },
    { petId: "9" },
    { petId: "10" },
  ];
  return pets.map((pet) => ({
    petProfileId: pet.petId,
  }));
}

export default PetProfile;
