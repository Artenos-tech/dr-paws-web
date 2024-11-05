"use client";

import ProfileCard from "@/components/ui/ProfileCard";
import React, { useState } from "react";
import ProfileImage from "@/public/assets/images/Profile/Profile.png";
import AddPetModal from "@/components/ui/AddPetModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileData = {
  name: "John Doe",
  contact: "0937948568",
  image: ProfileImage,
  email: "jondoe@gmail.com",
  address: "Andheri West, Mumbai",
};

// Define the Pet type
interface Pet {
  name: string;
  type: string;
}

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pets, setPets] = useState<Pet[]>([]);

  const addPet = (pet: Pet): void => {
    setPets((prevPets) => [...prevPets, pet]);
  };

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-8 md:gap-20 items-center px-8 md:px-32 lg:px-40">
        <ProfileCard profile={ProfileData} />

        <div className="flex flex-col w-full min-h-[350px] gap-2">
          <div className="flex items-center justify-between px-4">
            <h1 className="text-2xl text-secondary-1">Your Pets</h1>
            {pets.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-secondary-1 border px-5 py-2 rounded-full border-secondary-1 hover:bg-blue-50"
              >
                + Add Pet
              </button>
            )}
          </div>

          {pets.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-2">
              <h3 className="text-secondary-1">
                You haven't added any <span>pets yet</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-secondary-1 border px-5 py-2 rounded-full border-secondary-1 hover:bg-blue-50"
              >
                + Add Pet
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 p-4">
              {pets.map((pet, index) => (
                <div
                  key={index}
                  className="w-[150px] p-4 border border-secondary-2 text-center rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-bold text-secondary-1">
                    {pet.name}
                  </h2>
                  <p className="text-sm text-secondary-1">{pet.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <AddPetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(pet: Pet) => {
            addPet(pet);
            setIsModalOpen(false);
          }}
        />
      </main>

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Profile;
