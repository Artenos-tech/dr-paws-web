"use client";

import React, { useState, useEffect } from "react";
import ProfileCard, { ProfileData } from "@/components/ui/ProfileCard";
import defaultProfileImage from "@/public/assets/images/Profile/Profile.png";
import AddPetModal from "@/components/ui/AddPetModal";
import PetCard from "@/components/ui/PetCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import EditProfileModal from "@/components/ui/EditProfileModal";


// Define the Pet type
interface Pet {
  petId: string;
  name: string;
  type: string;
}

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const savedPets = localStorage.getItem("pets");
    setPets(savedPets ? JSON.parse(savedPets) : []);
  }, []);

  const addPet = (pet: Omit<Pet, "petId">): void => {
    const newPet = { ...pet, petId: uuidv4() };
    setPets((prevPets) => {
      const updatedPets = [...prevPets, newPet];
      localStorage.setItem("pets", JSON.stringify(updatedPets));
      return updatedPets;
    });
  };

  const fetchProfileData = () => {
    let storedProfileData = localStorage.getItem("userProfile");

    if (!storedProfileData) {
      const defaultProfileData: ProfileData = {
        name: "John Doe",
        contact: "0937948568",
        image: defaultProfileImage.src,
        email: "jondoe@gmail.com",
        address: "Andheri West, Mumbai",
      };
      localStorage.setItem("userProfile", JSON.stringify(defaultProfileData));
      storedProfileData = JSON.stringify(defaultProfileData);
    }

    if (storedProfileData) {
      const parsedData = JSON.parse(storedProfileData);
      setProfileData({
        ...parsedData,
        image: parsedData.image || defaultProfileImage.src,
      });
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileUpdate = (updatedProfile: ProfileData) => {
    setProfileData(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };
  

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full gap-8 md:gap-16 items-center px-8 md:px-32 lg:px-40">
      {profileData && (
          <ProfileCard
            profile={profileData}
            onEdit={() => setIsEditModalOpen(true)}
          />
        )}

        <hr className="w-full" />

        <div className="flex flex-col w-full min-h-[350px] gap-2">
          <div className="flex items-center justify-between">
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
            <div className="flex flex-wrap gap-4 p-4">
              {pets.map((pet) => (
                <PetCard key={pet.petId} pet={pet} />
              ))}
            </div>
          )}
        </div>

        <AddPetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(pet: Omit<Pet, "petId">) => {
            addPet(pet);
            setIsModalOpen(false);
          }}
        />
      </main>

      {profileData && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleProfileUpdate}
          profileData={profileData}
        />
      )}

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
