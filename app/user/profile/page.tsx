"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ui/ProfileCard";
import AddPetModal from "@/components/ui/AddPetModal";
import PetCard from "@/components/ui/PetCard";
import "react-toastify/dist/ReactToastify.css";
import OutlineButton from "@/components/ui/OutlineButton";
import toast, { Toaster } from "react-hot-toast";
import EditProfileModal from "@/components/ui/EditProfileModal";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";

interface Pet {
  id: string;
  spicesId: number;
  name: string;
  type: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { updateUserPetsHandler, userPets, user, getAuthToken, refresh } = useUserContext();

  // Initialize petIdCounter as a string
  const [petIdCounter, setPetIdCounter] = useState<string>("1");

  const navigate = useRouter();

  const { call: getPetsAPI } = useAPICall(api.getPets);
  const { call: addNewPetAPI } = useAPICall(api.addNewPet);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user,]);

  const fetchPets = async () => {
    if (user) {
      const response = await getPetsAPI({ id: user?.id });
      if (response.ok) {
        const pets = response.value.body.pets?.map((pet) => ({
          ...pet,
          profileImage: pet.profile_image,
          vetPortId: pet.vetport_id,
          gender: pet.gender,
        })) as Partial<Pet>[];

        if (pets) {
          updateUserPetsHandler(pets);
        }
      }
    }
  };

  const addPet = async (pet: Omit<Pet, "profileImage" | "id">) => {
    if (user) {
      const response = await addNewPetAPI({
        id: user.id,
        pet: {
          name: pet.name,
          species: { id: pet.spicesId, name: pet.type },
        },
      });

      if (response.ok) {
        console.log("Add Pet API response:", response.value.body);
        const petId = response.value.body.id;
        const newPet: Partial<Pet> = {
          id: petId,
          spicesId: pet.spicesId,
          name: pet.name,
          type: pet.type,
          profileImage: "",
        };

        updateUserPetsHandler([newPet]);
        console.log("Updated userPets:", userPets);
        toast.success("Added pet successfully", {
          duration: 3000,
          position: "bottom-right",
          style: {
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontWeight: 700,
          },
        });
      }
      fetchPets();
    }
  };

  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      navigate.push("/");
    }
  }, [getAuthToken, navigate, refresh]);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full h-full 2xl:h-screen items-center font-roca pb-20 flex-grow ">
      <main className="flex flex-col w-full gap-8 md:gap-16 items-center px-8 md:px-32 lg:px-20 xl:px-40">
        {user && (
          <ProfileCard profile={user} onEdit={() => setIsEditModalOpen(true)} />
        )}
        <hr className="w-full" />

        <div className="flex flex-col w-full min-h-[350px] gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-secondary-1">Your Pets</h1>
            {userPets && userPets.length > 0 && (
              <OutlineButton
                outlineBtnText="Add Pet"
                outlineBtnLink={() => setIsAddPetModalOpen(true)}
              />
            )}
          </div>

          {userPets && userPets.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-2">
              <h3 className="text-secondary-1">
                You haven&apos;t added any <span>pets yet</span>
              </h3>
              <button
                onClick={() => setIsAddPetModalOpen(true)}
                className="text-sm text-secondary-1 border px-5 py-2 rounded-full border-secondary-1 hover:bg-blue-50"
              >
                + Add Pet
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center md:justify-start  flex-wrap gap-4 my-8 md:my-4">
              {userPets &&
                userPets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
            </div>
          )}
        </div>

        <AddPetModal
          isOpen={isAddPetModalOpen}
          onClose={() => setIsAddPetModalOpen(false)}
          onSubmit={(pet: Omit<Pet, "profileImage" | "id">) => {
            addPet(pet);
            setIsAddPetModalOpen(false);
          }}
        />
      </main>

      {user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profileData={user}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Profile;
