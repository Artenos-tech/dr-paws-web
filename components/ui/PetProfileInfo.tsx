"use client";

import React, { useEffect, useState } from "react";
import pet1 from "@/public/assets/images/pets/pet1.png";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FiEdit2 } from "react-icons/fi";

interface Pet {
  petId: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: string;
  birthday: string;
  weight: string;
}

interface PetProfileInfoProps {
  petProfileId: string;
}

const PetProfileInfo: React.FC<PetProfileInfoProps> = ({ petProfileId }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pet>({
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      gender: "",
      age: "",
      birthday: "",
      weight: "",
    },
  });

  useEffect(() => {
    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      const pets: Pet[] = JSON.parse(storedPets);
      const foundPet = pets.find((pet) => pet.petId === petProfileId);
      setPet(foundPet || null);

      if (foundPet) {
        // Set form fields with pet data
        for (const key in foundPet) {
          setValue(key as keyof Pet, foundPet[key as keyof Pet]);
        }
      }
    }
  }, [petProfileId, setValue]);

  const handleEditClick = () => {
    if (!isEditing && pet) {
      // Populate form with current pet values
      for (const key in pet) {
        setValue(key as keyof Pet, pet[key as keyof Pet]);
      }
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: Pet) => {
    setPet(data);
    setIsEditing(false);

    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      const pets: Pet[] = JSON.parse(storedPets);
      const updatedPets = pets.map((pet) =>
        pet.petId === petProfileId ? { ...pet, ...data } : pet
      );
      localStorage.setItem("pets", JSON.stringify(updatedPets));
    }
  };

  const calculateAge = (birthday: string): string => {
    if (!birthday) return "";
    const birthDate = new Date(birthday);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} years`;
  };

  return (
    <div className="bg-primary-3 my-5 rounded-lg p-8 w-full max-w-[1000px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row md:justify-between md:items-start w-full"
      >
        <div className="flex flex-col items-center md:flex-row md:justify-between  w-full md:order-none order-1 ">
          <Image
            src={pet1.src}
            alt="pet-profile"
            width={160}
            height={160}
            className="object-cover w-[130px] h-[130px] rounded-full"
          />
          <div className="flex flex-col flex-grow mx-10 gap-3">
            {isEditing ? (
              <>
                <input
                  type="text"
                  {...register("name", { required: "Pet name is required" })}
                  className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                />
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type.message}</p>
                )}
              </>
            ) : (
              <h1 className="text-secondary-1 text-lg text-center md:text-left my-5 md:my-0">{pet?.name}</h1>
            )}

            <div className="flex justify-between md:flex gap-2">
              <div className="w-1/3">
                <label className="text-secondary-1 text-xs md:text-sm" htmlFor="type">
                  Type of Pet
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    {...register("type", { required: "Type is required" })}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                  />
                ) : (
                  <p className="text-primary-1 font-medium text-sm md:text-md">
                    {pet?.type}
                  </p>
                )}
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type.message}</p>
                )}
              </div>
              <div className="w-1/3">
                <label className="text-secondary-1 text-xs md:text-sm" htmlFor="breed">
                  Breed
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    {...register("breed", { required: "Breed is required" })}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                  />
                ) : (
                  <p className="text-primary-1 font-medium text-sm md:text-md">
                    {pet?.breed || ""}
                  </p>
                )}
                {errors.breed && (
                  <p className="text-red-500 text-xs">{errors.breed.message}</p>
                )}
              </div>
              <div className="w-1/3">
                <label className="text-secondary-1 text-xs md:text-sm" htmlFor="gender">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    defaultValue={pet?.gender}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-primary-1 font-medium text-sm md:text-md">
                    {pet?.gender || "Not specified"}
                  </p>
                )}
                {errors.gender && (
                  <p className="text-red-500 text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between md:flex gap-2">
              <div className="w-1/3">
                <label className="text-secondary-1 text-xs md:text-sm" htmlFor="age">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    disabled
                    value={calculateAge(pet?.birthday || "")}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                  />
                ) : (
                  <p className="text-primary-1 font-medium text-sm md:text-md">
                    {calculateAge(pet?.birthday || "")}
                  </p>
                )}
              </div>
              <div className="w-1/3">
                <label className="text-secondary-1 text-xs md:text-sm" htmlFor="birthday">
                  Birthday
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    {...register("birthday", {
                      required: "Birthday is required",
                    })}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                  />
                ) : (
                  <p className="text-primary-1 font-medium text-sm md:text-md">
                    {new Date(pet?.birthday || "").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                {errors.birthday && (
                  <p className="text-red-500 text-xs">
                    {errors.birthday.message}
                  </p>
                )}
              </div>
              <div className="w-1/3">
                <label className="text-secondary-1 text-xs md:text-sm" htmlFor="weight">
                  Weight (kg)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    {...register("weight", {
                      required: "Weight is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Invalid weight format",
                      },
                    })}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                  />
                ) : (
                  <p className="text-primary-1 font-medium text-sm md:text-md">
                    {pet?.weight ? `${pet.weight} kg` : ""}
                  </p>
                )}
                {errors.weight && (
                  <p className="text-red-500 text-xs">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="self-end md:self-start mb-5 md:mb-0 flex items-center">
          <button
            type="button"
            onClick={handleEditClick}
            className="btn border border-secondary-1 text-secondary-1 px-4 font-semibold py-2 rounded-full text-xs"
          >
            {isEditing ? (
              "Cancel"
            ) : (
              <p className="flex items-center gap-1">
                <FiEdit2 /> Edit
              </p>
            )}
          </button>
          {isEditing && (
            <button
              type="submit"
              className="btn border bg-secondary-1 text-white px-4 text-xs font-semibold py-2 rounded-full ml-3"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PetProfileInfo;
