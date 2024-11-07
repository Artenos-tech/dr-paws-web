import React from "react";
import PetProfileInfo from "@/components/ui/PetProfileInfo";
import BackButton from "@/components/ui/BackButton";
import petImg from "@/public/assets/images/pets/petImg.png";

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
        <PetProfileInfo petProfileId={petProfileId} petImg={petImg} />
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
  ];
  return pets.map((pet) => ({
    petProfileId: pet.petId,
  }));
}

export default PetProfile;
