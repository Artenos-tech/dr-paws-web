"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ui/ProfileCard";
import ProfileImage from "@/public/assets/images/Profile/Profile.png";
import AddPetModal from "@/components/ui/AddPetModal";
import PetCard from "@/components/ui/PetCard";
import "react-toastify/dist/ReactToastify.css";
import { StaticImageData } from "next/image";
import OutlineButton from "@/components/ui/OutlineButton";
import toast, { Toaster } from "react-hot-toast";

const ProfileData = {
  name: "John Doe",
  contact: "0937948568",
  image: ProfileImage,
  email: "jondoe@gmail.com",
  address: "Andheri West, Mumbai",
};

// Define the Pet type
interface Pet {
  petId: string;
  name: string;
  type: string;
  petImage: StaticImageData | string;
}

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pets, setPets] = useState<Pet[]>([]);

  // Initialize petIdCounter as a string
  const [petIdCounter, setPetIdCounter] = useState<string>("1");

  useEffect(() => {
    const savedPets = localStorage.getItem("pets");
    const parsedPets = savedPets ? JSON.parse(savedPets) : [];
    setPets(parsedPets);

    // Set petIdCounter based on the last petId in the list, converting to a string
    if (parsedPets.length > 0) {
      const maxId = Math.max(
        ...parsedPets.map((pet: Pet) => parseInt(pet.petId))
      );
      setPetIdCounter((maxId + 1).toString());
    }
  }, []);

  const addPet = (pet: Omit<Pet, "petId" | "petImage">): void => {
    const newPet: Pet = { ...pet, petId: petIdCounter, petImage: "" };
    setPets((prevPets) => {
      const updatedPets = [...prevPets, newPet];
      localStorage.setItem("pets", JSON.stringify(updatedPets));
      return updatedPets;
    });
    toast.success("Pet added successfully!", {
      duration: 3000,
      style: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontWeight: 700,
      },
    });
    setPetIdCounter((parseInt(petIdCounter) + 1).toString());
  };

  return (
    <div className="flex flex-col w-full h-screen items-center font-roca pb-20 flex-grow ">
      <main className="flex flex-col w-full gap-8 md:gap-16 items-center px-8 md:px-32 lg:px-40">
        <ProfileCard profile={ProfileData} />

        <hr className="w-full" />

        <div className="flex flex-col w-full min-h-[350px] gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-secondary-1">Your Pets</h1>
            {pets.length > 0 && (
              <OutlineButton
                outlineBtnText="Add Pet"
                outlineBtnLink={() => setIsModalOpen(true)}
              />
            )}
          </div>

          {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-2">
              <h3 className="text-secondary-1">
                You haven&apos;t added any <span>pets yet</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-secondary-1 border px-5 py-2 rounded-full border-secondary-1 hover:bg-blue-50"
              >
                + Add Pet
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center md:justify-start  flex-wrap gap-4 my-8 md:my-4">
              {pets.map((pet) => (
                <PetCard key={pet.petId} pet={pet} />
              ))}
            </div>
          )}
        </div>

        <AddPetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(pet: Omit<Pet, "petId" | "petImage">) => {
            addPet(pet);
            setIsModalOpen(false);
          }}
        />
      </main>
      <Toaster position="bottom-right" />
      {/* <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          position: "fixed",
          bottom: "0px",
          right: "0px",
          top: "auto",
          left: "auto",
        }}
      /> */}
    </div>
  );
};

export default Profile;
