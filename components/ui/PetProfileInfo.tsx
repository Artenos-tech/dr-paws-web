"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useForm } from "react-hook-form";
import { FiEdit2 } from "react-icons/fi";
import { Pet } from "@/model/typeDefinitions";
import petImg from "@/public/assets/images/pets/petImg.png";
import ImageEdit from "@/public/assets/images/Profile/ImageEdit.png";

interface PetProfileInfoProps {
  petProfileId: string;
  petImg: StaticImageData;
}

const PetProfileInfo: React.FC<PetProfileInfoProps> = ({ petProfileId }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>(petImg.src);

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
      petImg: petImg.src,
    },
  });

  useEffect(() => {
    const storedPets = localStorage.getItem("pets");
    if (storedPets) {
      const pets: Pet[] = JSON.parse(storedPets);
      const foundPet = pets.find((pet) => pet.petId === petProfileId);
      setPet(foundPet || null);

      if (foundPet) {
        for (const key in foundPet) {
          setValue(key as keyof Pet, foundPet[key as keyof Pet]);
        }
      }
    }
  }, [petProfileId, setValue]);

  const handleEditClick = () => {
    if (!isEditing && pet) {
      for (const key in pet) {
        setValue(key as keyof Pet, pet[key as keyof Pet]);
      }
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: Pet) => {
    const storedPets = localStorage.getItem("pets");
    const pets: Pet[] = storedPets ? JSON.parse(storedPets) : [];

    const updatedPets = pets.map((pet) =>
      pet.petId === petProfileId ? { ...data, petImg: image } : pet
    );

    localStorage.setItem("pets", JSON.stringify(updatedPets));
    setPet({ ...data, petImg: image });
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        setValue("petImg", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (birthday: string): string => {
    if (!birthday) return "";
    if (birthday === "N/A") return "N/A";

    const birthDate = new Date(birthday);
    const now = new Date();

    let years = now.getUTCFullYear() - birthDate.getUTCFullYear();
    let months = now.getUTCMonth() - birthDate.getUTCMonth();
    let days = now.getUTCDate() - birthDate.getUTCDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getUTCFullYear(), now.getUTCMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const yearStr = years > 0 ? `${years} yrs` : "";
    const monthStr = months > 0 ? `${months} mths` : "";
    // const dayStr = days > 0 ? `${days} d` : "";

    return [yearStr, monthStr].filter(Boolean).join(", ");
  };

  return (
    <div className="bg-primary-3 rounded-lg p-4 md:p-8 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row md:justify-between md:items-start w-full"
      >
        <div className="flex flex-col items-center md:flex-row md:justify-between w-full md:order-none order-1">
          {/* <Image
            src={pet1.src}
            alt="pet-profile"
            width={160}
            height={160}
            className="object-cover w-[130px] h-[130px] rounded-full md:self-start"
          />
          <Image src={petImg} alt="pet logo" className="w-24 h-24 mx-auto" /> */}
          <div className="relative flex flex-col">
            <Image
              src={pet?.petImg || image}
              alt="Profile"
              width={130}
              height={130}
              className="rounded-full md:self-start"
            />
            {isEditing && (
              <>
                <Image
                  src={ImageEdit}
                  alt="Image Edit"
                  className="absolute bottom-0 right-0"
                />
                <input
                  type="file"
                  accept="image/*"
                  {...register("petImg")}
                  onChange={handleImageChange}
                  className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer"
                  aria-label="Upload pet profile image"
                />
              </>
            )}
          </div>
          <div className="flex flex-col flex-grow mx-3 md:mx-10 md:gap-3">
            {isEditing ? (
              <>
                <input
                  type="text"
                  {...register("name", { required: "Pet name is required" })}
                  className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </>
            ) : (
              <h1 className="text-secondary-1 text-lg text-center md:text-left my-5 md:my-0">
                {pet?.name}
              </h1>
            )}

            <div className="grid grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 w-full gap-4 md:gap-3 lg:gap-2">
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
                      className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                      defaultValue={pet?.type}
                    >
                      <option value="" disabled>
                        Type of Pet
                      </option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Other">Other</option>
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
              <div className="">
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="breed"
                >
                  Breed
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register("breed", { required: "Breed is required" })}
                      className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
                    {errors.breed && (
                      <p className="text-red-500 text-xs">
                        {errors.breed.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.breed || "N/A"}
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
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                      defaultValue={pet?.gender}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-xs">
                        {errors.gender.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.gender || "N/A"}
                  </p>
                )}
              </div>

              <div className="">
                <label
                  className="text-secondary-1 text-xs md:text-sm"
                  htmlFor="age"
                >
                  Age
                </label>
                {/* {isEditing ? (
                <></>
                  <input
                    type="text"
                    disabled
                    value={calculateAge(pet?.birthday || "")}
                    className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                  />
                ) : ( */}
                <p className="text-primary-1 font-medium text-xs md:text-base">
                  {calculateAge(pet?.birthday || "N/A")}
                </p>
                {/* )} */}
              </div>
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
                      {...register("birthday", {
                        required: "Birthday is required",
                      })}
                      className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
                    {errors.birthday && (
                      <p className="text-red-500 text-xs">
                        {errors.birthday.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {new Date(pet?.birthday || "").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <div className="">
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
                        required: "Weight is required",
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: "Invalid weight format",
                        },
                      })}
                      className="outline-none border w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-xs">
                        {errors.weight.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.weight ? `${pet.weight} kg` : "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="btn border self-end md:self-start border-secondary-1 text-secondary-1 px-4 font-semibold py-2 rounded-full text-xs"
          >
            <p className="flex items-center gap-1">
              <FiEdit2 /> Edit
            </p>
          </button>
        )}

        {isEditing && (
          <div className="self-end md:self-start my-5 md:my-0 order-2">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleEditClick}
                className="btn border  border-secondary-1 text-secondary-1 px-4 font-semibold py-2 rounded-full text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn border bg-secondary-1 text-white px-4 text-xs font-semibold py-2 rounded-full ml-3"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PetProfileInfo;
