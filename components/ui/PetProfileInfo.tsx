"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import ImageEdit from "@/public/assets/images/Profile/ImageEdit.png";
import OutlineButton from "./OutlineButton";
import { FaTrash } from "react-icons/fa6";
import { petImageByType } from "./PetCard";
import { Pet } from "@/context/UserContext";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import Loader from "./Loader";

interface PetProfileInfoProps {
  petProfileId: string;
}

const PetProfileInfo: React.FC<PetProfileInfoProps> = ({ petProfileId }) => {
  const [pet, setPet] = useState<Pet>();
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("");
  // const [age, setAge] = useState<{
  //   years: number | null;
  //   months: number | null;
  // }>({
  //   years: 0,
  //   months: 0,
  // });
  const {
    call: getPets,
    result: getPetsResult,
    loading: loadingPets,
  } = useAPICall(api.getPets);
  const { call: getPetSpecies, result: getPetSpeciesResult } = useAPICall(
    api.getPetSpecies
  );
  const { call: getPetBreeds, result: getPetBreedsResult } = useAPICall(
    api.getPetBreeds
  );
  const { call: getPetGender, result: getPetGenderResult } = useAPICall(
    api.getPetGender
  );
  const { call: updatePetDetails } = useAPICall(api.updatePet);

  const formMethods = useForm<Pet>({
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      gender: "",
      dob: "",
      weight: "",
      profileImage: "",
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    getPets({});
  }, []);

  useEffect(() => {
    if (petProfileId) fetchPetSpecies();
  }, [petProfileId]);

  useEffect(() => {
    if (getPetsResult?.ok && petProfileId) {
      const foundPet = getPetsResult.value.body.pets.find(
        (pet) => pet.id === petProfileId
      );
      if (foundPet) {
        setPet({
          id: foundPet.id,
          name: foundPet.name,
          type: foundPet.type?.trim() || null,
          breed: foundPet.breed?.trim() || null,
          weight: foundPet.weight,
          gender: foundPet.gender?.trim() || null,
          vetPortId: foundPet.vetport_id,
          dob: foundPet.dob?.split("T")[0] || null,
          profileImage: foundPet.profile_image,
        });
        setImage(foundPet.profile_image || "");
        // setAge(foundPet.age || { years: 0, months: 0 });

        Object.entries(foundPet).forEach(([key, value]) => {
          if (key in foundPet) {
            if (key === "dob" && typeof value === "string") {
              const formattedDate = value.split("T")[0];
              setValue("dob", formattedDate);
            } else if (typeof value === "string") {
              setValue(key as keyof Pet, value?.trim());
            } else setValue(key as keyof Pet, value);
          }
        });
      }
    }
  }, [petProfileId, getPetsResult, setValue]);

  useEffect(() => {
    if (getPetSpeciesResult?.ok) {
      const speciesId = getPetSpeciesResult.value.body.species.find(
        (species) => species.name === pet?.type
      )?.id;
      if (speciesId) {
        fetchPetBreedsBySpecies(speciesId);
        fetchPetGenderBySpecies(speciesId);
      }
    }
  }, [getPetSpeciesResult]);

  const fetchPetSpecies = async () => {
    await getPetSpecies({});
  };

  const fetchPetBreedsBySpecies = async (speciesId: number) => {
    await getPetBreeds({ speciesid: JSON.stringify(speciesId) });
  };

  const fetchPetGenderBySpecies = async (speciesId: number) => {
    await getPetGender({ speciesid: JSON.stringify(speciesId) });
  };

  const petSpecies = getPetSpeciesResult?.ok
    ? getPetSpeciesResult.value.body.species
    : [];

  const petBreeds = getPetBreedsResult?.ok
    ? getPetBreedsResult.value.body.breeds
    : [];

  const petGenders = getPetGenderResult?.ok
    ? getPetGenderResult.value.body.gender
    : [];

  const handleEditCancelClick = () => {
    if (pet) {
      for (const key in pet) {
        if (Object.prototype.hasOwnProperty.call(pet, key)) {
          const typedKey = key as keyof Pet;
          setValue(typedKey, pet[typedKey]);
        }
      }

      const typeKey = pet?.type?.toLowerCase() || "other";
      const defaultImage = petImageByType[typeKey]?.src || "";
      if (image !== (pet?.profileImage || defaultImage)) {
        setImage(pet?.profileImage || defaultImage);
      }
    }

    setIsEditing(!isEditing);
  };

  const onSubmit = (data: Pet) => {
    const realPetImage =
      typeof image === "string" && image.includes("/_next/static/media/")
        ? ""
        : image;

    const petType = petSpecies.find(
      (species) => species.name === data.type
    )?.id;
    const petBreed = petBreeds.find((breed) => breed.name === data.breed)?.id;
    const petGender = petGenders.find(
      (gender) => gender.name === data.gender
    )?.id;

    if (petType) {
      updatePetDetails({
        pet: {
          id: petProfileId,
          name: data.name,
          species: {
            id: petType,
            name: data.type!,
          },
          breed: petBreed
            ? {
                id: petBreed,
                name: data.breed!,
              }
            : null,
          weight: null,
          gender: petGender
            ? {
                id: petGender,
                name: data.gender!,
              }
            : null,
          dob: data.dob ? new Date(data.dob).toISOString() : null,
        },
      });
    }
    setPet({ ...data, profileImage: realPetImage });
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value.toLowerCase();
    const newImage = petImageByType[selectedType]?.src || "";
    setImage(newImage);
  };

  const defaultImageOrPetImage =
    image || petImageByType[pet?.type || "other"] || petImageByType.other;

  if (loadingPets)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="bg-primary-3 rounded-lg p-3 md:p-6 lg:p-8 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col lg:flex-row lg:justify-between md:items-start w-full"
      >
        <div className="flex flex-col items-center lg:flex-row lg:justify-between w-full lg:order-none order-1">
          <div className="relative flex flex-col lg:w-1/3 xl:w-1/6">
            <Image
              src={defaultImageOrPetImage}
              alt="Profile"
              width={130}
              height={130}
              className="rounded-full bg-white w-[130px] h-[130px] md:self-center"
            />
            {isEditing && (
              <>
                {(image
                  ? !image.includes("/_next/static/media/")
                  : typeof defaultImageOrPetImage === "object" &&
                    !defaultImageOrPetImage.src.includes(
                      "/_next/static/media/"
                    )) && (
                  <button
                    type="button"
                    className="absolute bottom-0 left-0 p-3 bg-red-500 rounded-full z-20"
                    onClick={() => {
                      const defaultImage =
                        pet?.type && petImageByType[pet.type.toLowerCase()]
                          ? petImageByType[pet.type.toLowerCase()].src
                          : petImageByType.other.src;
                      setImage(defaultImage);
                    }}
                  >
                    <FaTrash size={10} fill="white" />
                  </button>
                )}

                <Image
                  src={ImageEdit}
                  alt="Image Edit"
                  className="absolute bottom-0 right-0"
                />
                <div className="px-5">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("profileImage")}
                    onChange={handleImageChange}
                    className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer px-5"
                    aria-label="Upload pet profile image"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col flex-grow mx-3 md:mx-10 md:gap-3 w-full lg:w-11/12">
            {isEditing ? (
              <>
                <input
                  type="text"
                  {...register("name", { required: "Pet name is required" })}
                  className="outline-none border w-full p-1 px-2 text-xs  md:text-sm rounded my-5 mb:my-2 bg-transparent border-secondary-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </>
            ) : (
              <h1 className="text-secondary-1 text-lg text-center lg:text-left my-5 md:my-3 lg:my-0">
                {pet?.name}
              </h1>
            )}

            <div
              className={`grid grid-cols-2 grid-rows-3 md:grid-cols-2 md:grid-rows-2  w-full gap-4 md:gap-12 lg:gap-3`}
            >
              <div className="">
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="type"
                >
                  Type of Pet
                </label>
                {isEditing ? (
                  <>
                    <select
                      {...register("type", { required: "Type is required" })}
                      className="outline-none border w-full p-1 px-2 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                      defaultValue={pet?.type || "Unknown"}
                      onChange={handlePetTypeChange}
                    >
                      <option value="">Type of Pet</option>
                      {petSpecies?.map((species) => (
                        <option key={species.id} value={species.name}>
                          {species.name}
                        </option>
                      ))}
                    </select>{" "}
                    {errors.type && (
                      <p className="text-red-500 text-xs">
                        {errors.type.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.type}
                  </p>
                )}
              </div>
              <div className={`${!isEditing && "ml-4"} md:ml-0`}>
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="breed"
                >
                  Breed
                </label>
                {isEditing ? (
                  <>
                    <select
                      {...register("breed")}
                      className="outline-none border w-full p-1 px-2 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                      defaultValue={pet?.breed || ""}
                    >
                      <option value="">Type of breed</option>
                      {petBreeds?.map((breed) => (
                        <option key={breed.id} value={breed.name}>
                          {breed.name}
                        </option>
                      ))}
                    </select>{" "}
                    {errors.breed && (
                      <p className="text-red-500 text-xs">
                        {errors.breed.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.breed || ""}
                  </p>
                )}
              </div>
              <div className="">
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="gender"
                >
                  Gender
                </label>
                {isEditing ? (
                  <>
                    <select
                      {...register("gender")}
                      className="outline-none border w-full px-2 p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                      defaultValue={pet?.gender || ""}
                    >
                      {petGenders?.map((gender) => (
                        <option value={gender.name} key={gender.id}>
                          {gender.name}
                        </option>
                      ))}
                    </select>

                    {errors.gender && (
                      <p className="text-red-500 text-xs">
                        {errors.gender.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.gender || ""}
                  </p>
                )}
              </div>

              {/* <div className={`${!isEditing && "ml-4"} md:ml-0`}>
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="age"
                >
                  Age
                </label>
                {isEditing ? (
                  <div className="flex gap-1">
                    <div className="w-full flex flex-col">
                      <input
                        type="number"
                        // value={age.years ?? ""}
                        placeholder="0 years"
                        min="0"
                        max="40"
                        // onChange={handleAgeChange}
                        name="years"
                        className="outline-none border w-full p-[5px] px-2 text-xs md:text-sm  mt-2 rounded bg-transparent border-secondary-1"
                      />
                      <label className="text-secondary-1 w-full text-left text-[10px]">
                        Years
                      </label>
                    </div>
                    <div className="w-full flex flex-col">
                      <input
                        type="number"
                        // value={age.months ?? ""}
                        min="0"
                        max="12"
                        // onChange={handleAgeChange}
                        name="months"
                        className="outline-none border w-full p-[5px] px-2 text-xs md:text-sm mt-2 rounded bg-transparent border-secondary-1"
                      />
                      <label className="text-secondary-1 w-full text-left text-[10px]">
                        Months
                      </label>
                    </div>
                  </div>
                ) : // <p className="text-primary-1 font-medium text-xs md:text-base">
                //   {pet?.age?.years ? `${pet.age.years} yrs ` : ""}
                //   {pet?.age?.months ? `${pet.age.months} mths ` : ""}
                // </p>
                null}
              </div> */}

              <div className="">
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="birthday"
                >
                  Birthday
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="date"
                      {...register("dob")}
                      className="outline-none border px-2 w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs">
                        {errors.dob.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.dob
                      ? new Date(pet?.dob).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                )}
              </div>
              {/* <div className={`${!isEditing && "ml-4"} md:ml-0`}>
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="weight"
                >
                  Weight (kg)
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("weight", {
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: "Invalid weight format",
                        },
                      })}
                      className="outline-none border px-2 w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-xs">
                        {errors.weight.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.weight ? `${pet.weight} kg` : ""}
                  </p>
                )}
              </div> */}
            </div>
          </div>
          {isEditing && (
            <div className="self-end md:self-end lg:self-start my-5 md:mt-3 md:my-0 order-2">
              <div className="flex items-center">
                <OutlineButton
                  outlineBtnText="Cancel"
                  outlineBtnLink={() => handleEditCancelClick()}
                />
                <button
                  type="submit"
                  className="btn border bg-secondary-1 text-white px-4 text-xs font-semibold py-2 rounded-full ml-3"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="self-end lg:self-start mb-3">
          {!isEditing && (
            <OutlineButton
              outlineBtnText="Edit"
              outlineBtnLink={() => handleEditCancelClick()}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default PetProfileInfo;
