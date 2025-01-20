import { X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Modal from "react-modal";
import { MembershipPlan } from "./MemberCard";
import tickMark from "@/public/assets/images/Booking/tick-svgrepo-com.svg";
import { petImageByType } from "./PetCard";
import { Pet } from "@/context/UserContext";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import CustomButton from "./CustomButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
}

const MemberModal: React.FC<ModalProps> = ({ isOpen, onClose, plan }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const { call: getPetsAPI, result: getPetsAPIResult } = useAPICall(
    api.getPets
  );

  useEffect(() => {
    if (isOpen) {
      fetchPets();
    }
  }, [isOpen]);

  const fetchPets = async () => {
    const response = await getPetsAPI({});
    if (response.ok) {
      const fetchedPets = response.value.body.pets.map((pet) => ({
        ...pet,
        profileImage: pet.profile_image,
        vetPortId: pet.vetport_id,
      }));
      setPets(fetchedPets);
    }
  };

  const handlePetClick = (pet: Pet, isEligible: boolean) => {
    if (!isEligible) return;
    const isAlreadySelected = selectedPet?.vetPortId === pet.vetPortId;
    const newSelectedPet = isAlreadySelected ? null : pet;
    setSelectedPet(newSelectedPet);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex relative z-[999] items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[899]"
    >
      <div className="relative bg-white rounded-2xl w-11/12 md:w-3/5 max-h-[92vh] overflow-y-auto lg:overflow-y-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="h-full w-full">
          <div className="p-5 bg-white rounded-2xl">
            <div className="w-20 h-20 relative mb-2">
              <Image
                src={plan.icon}
                alt={`${plan.title} icon`}
                fill
                className="object-contain"
              />
            </div>
            <div className="border-b-2 border-primary-3">
              <h2 className="text-2xl font-semibold text-primary-1 mb-2">
                {plan.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            </div>

            {/* Pet selection section */}
            <h3 className="text-xl font-semibold mt-4 mb-2">
              Select your Pet:
            </h3>

            {pets.length === 0 ? (
              <p className="text-center text-gray-500">
                You haven't added any pets. Please add a pet to purchase a
                subscription.
              </p>
            ) : (
              <div className="flex gap-3 flex-wrap justify-center items-center ">
                {pets.map((pet) => {
                  const petImage =
                    pet.profileImage ||
                    petImageByType[pet.type?.toLowerCase() || "other"]?.src ||
                    petImageByType["other"].src;

                  const isEligible =
                    pet.type?.toLowerCase() === plan.petType.toLowerCase();

                  const isSelected = selectedPet?.vetPortId === pet.vetPortId;

                  return (
                    <div
                      key={pet.vetPortId}
                      className={`relative cursor-pointer m-2 ${
                        !isEligible ? "opacity-40 pointer-events-none" : ""
                      }`}
                      onClick={() => handlePetClick(pet, isEligible)}
                    >
                      <div className="relative w-[70px] h-[70px]">
                        <Image
                          src={petImage}
                          alt={`${pet.name}'s profile picture`}
                          fill
                          sizes="70px"
                          className={`rounded-full border-2 object-cover ${
                            isSelected ? "opacity-50" : "opacity-100"
                          }`}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                            <Image
                              src={tickMark.src}
                              alt="Selected"
                              width={50}
                              height={50}
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-center mt-2">{pet.name}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-row items-center justify-between mt-3 gap-2">
              <h3 className="font-semibold text-xl text-primary-1">
                {plan.price}
              </h3>
              <CustomButton
                buttonText="Continue"
                buttonBackground="bg-accent"
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </Modal>
  );
};

export default MemberModal;
