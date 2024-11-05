import React from "react";
import PetProfileInfo from "@/components/ui/PetProfileInfo";

interface PetProfileProps {
  params: {
    petProfileId: string;
  };
}

const PetProfile: React.FC<PetProfileProps> = ({ params }) => {
  const { petProfileId } = params;

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full gap-8 md:gap-16 items-center px-8 md:px-32 lg:px-40">
        <PetProfileInfo petProfileId={petProfileId} />
      </main>
    </div>
  );
};

export async function generateStaticParams() {
  // Return a list of default or common pet IDs.
  const pets = [
    { petId: "1" },
    { petId: "2" },
    { petId: "3" },
  ]; // You can expand this list with real data if accessible.

  return pets.map((pet) => ({
    petProfileId: pet.petId,
  }));
}

export default PetProfile;
