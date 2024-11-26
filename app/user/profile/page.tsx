"use client";

import React, { useState, useEffect } from "react";
import ProfileCard, { ProfileData } from "@/components/ui/ProfileCard";
import defaultProfileImage from "@/public/assets/images/Profile/profileLogo.jpg";
import AddPetModal from "@/components/ui/AddPetModal";
import PetCard from "@/components/ui/PetCard";
import "react-toastify/dist/ReactToastify.css";
import OutlineButton from "@/components/ui/OutlineButton";
import toast, { Toaster } from "react-hot-toast";
import EditProfileModal from "@/components/ui/EditProfileModal";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

interface Pet {
  id: string;
  name: string;
  type: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "", // Default empty string
    profileImage: defaultProfileImage.src,
    name: "",
    mobile: "",
    email: "",
    currentAddress: "",
    // Add other properties with sensible defaults
  });

  const { updateUserPetsHandler, userPets, user, authToken } = useUserContext();

  // Initialize petIdCounter as a string
  const [petIdCounter, setPetIdCounter] = useState<string>("1");

  const navigate = useRouter();

  useEffect(() => {
    fetchUserPets();
  }, [userPets, navigate]);

  const fetchUserPets = () => {
    if (userPets) {
      const partialPetsDetails: Pet[] = userPets.map((pet) => ({
        id: pet.id || "",
        name: pet.name || "",
        type: pet.type || "",
        profileImage: pet.profileImage || "",
      }));
      setPets(partialPetsDetails);

      // Set petIdCounter based on the last petId in the list, converting to a string
      if (partialPetsDetails.length > 0) {
        const maxId = Math.max(
          ...partialPetsDetails.map((pet: Pet) => parseInt(pet.id))
        );
        setPetIdCounter((maxId + 1).toString());
      }
    }
  };

  const addPet = (pet: Omit<Pet, "id" | "profileImage">): void => {
    const newPet: Pet = { ...pet, id: petIdCounter, profileImage: "" };
    setPets((prevPets) => {
      const updatedPets = [...prevPets, newPet];

      updateUserPetsHandler([...prevPets, newPet]);
      return updatedPets;
    });
    toast.success("Added pet successfully", {
      duration: 3000,
      style: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontWeight: 700,
      },
    });
    setPetIdCounter((parseInt(petIdCounter) + 1).toString());
  };

  const fetchProfileData = () => {
    if (user) {
      setProfileData({
        id: user.id,
        name: user.name,
        email: user.email || "",
        mobile: user.mobile,
        currentAddress: user.currentAddress || "",
        profileImage: user.profileImage || defaultProfileImage.src,
      });
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate.push("/");
    }
    fetchProfileData();
  }, [authToken, navigate]);
  if (!profileData.id) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full h-full 2xl:h-screen items-center font-roca pb-20 flex-grow ">
      <main className="flex flex-col w-full gap-8 md:gap-16 items-center px-8 md:px-32 lg:px-20 xl:px-40">
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
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>

        <AddPetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(pet: Omit<Pet, "id" | "profileImage">) => {
            addPet(pet);
            setIsModalOpen(false);
          }}
        />
      </main>

      {profileData && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={profileData}
        />
      )}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Profile;
