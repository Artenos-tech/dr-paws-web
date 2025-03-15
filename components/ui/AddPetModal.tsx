"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-dropdown/style.css";
import { useEffect, useState } from "react";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import { PetSpecies, useUserContext } from "@/context/UserContext";
import { ClipLoader } from "react-spinners";

const petSchema = z.object({
  speciesId: z.number(),
  name: z.string().min(1, "Pet name is required"),
  type: z.string().min(1, "Pet type is required"),
});

type PetFormData = z.infer<typeof petSchema>;

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPetModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPetModalProps) {
  const { call: getPetSpecies } = useAPICall(api.getPetSpecies);

  const { call: addNewPetAPI, loading } = useAPICall(api.addNewPet);

  const { user, updatePetSpeciesHandler, petSpecies } = useUserContext();
  const [selectedType, setSelectedType] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    if (isOpen) fetchPetSpecies();
  }, [isOpen]);

  const fetchPetSpecies = async () => {
    const response = await getPetSpecies({});
    if (response?.ok) {
      updatePetSpeciesHandler(
        response.value.body.species.map((specie: PetSpecies) => ({
          id: specie.id,
          name: specie.name,
          displayName: specie.displayName,
        })),
      );
    }
  };

  const handleFormSubmit = async (data: PetFormData) => {
    if (user) {
      const response = await addNewPetAPI({
        pet: {
          name: data.name,
          species: { id: data.speciesId, name: data.type },
        },
      });

      if (response.ok) {
        // console.log("Add Pet API response:", response.value.body);
        onSuccess();
        reset({ name: "", type: "" });
        setSelectedType("");
        onClose();
      }
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    setSelectedType(selectedName);

    // Find the speciesId for the selected type
    const selectedSpecies = petSpecies?.find(
      (species) => species.displayName === selectedName,
    );
    if (selectedSpecies) {
      setValue("speciesId", selectedSpecies.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-sm transform overflow-hidden rounded-lg bg-primary-3 p-6 shadow-xl transition-all">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl text-primary-1 mb-6">Add a pet</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name")}
                placeholder="Pet's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("type")}
                value={selectedType}
                onChange={handleTypeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled className="!w-3/4">
                  Type of Pet
                </option>
                {petSpecies?.map((species) => (
                  <option
                    key={species.id}
                    value={species.displayName}
                    className="!w-3/4"
                  >
                    {species.displayName}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-secondary-1 text-white rounded-full"
              >
                {loading ? <ClipLoader color="white" size={18} /> : `Yes`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
