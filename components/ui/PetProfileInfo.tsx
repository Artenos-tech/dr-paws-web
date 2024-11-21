"use client";

import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useForm } from "react-hook-form";
import { PetInfo } from "@/model/typeDefinitions";
import ImageEdit from "@/public/assets/images/Profile/ImageEdit.png";
import OutlineButton from "./OutlineButton";
import { FaTrash } from "react-icons/fa6";
import { petImageByType } from "./PetCard";
import { useUserContext } from "@/context/UserContext";

interface PetProfileInfoProps {
  petProfileId: string;
}

const PetProfileInfo: React.FC<PetProfileInfoProps> = ({ petProfileId }) => {
  const [pet, setPet] = useState<PetInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string | StaticImageData>("");
  const [age, setAge] = useState({ years: 0, months: 0 });

  const {userPets} = useUserContext()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PetInfo>({
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      gender: "",
      age: { years: 0, months: 0 },
      birthday: "",
      weight: "",
      petImage: pet?.type && petImageByType[pet.type.toLowerCase()].src,
    },
  });

  useEffect(() => {
    fetchPetDetails();
  }, [petProfileId, setValue]);

  const fetchPetDetails = () => {
    const storedPets = localStorage.getItem("pets");
    if (userPets) {
      // const pets: PetInfo[] = JSON.parse(storedPets);
      const foundPet = userPets.find(
        (pet) => Number(pet.id) === Number(petProfileId)
      );

      // setPet(foundPet);
      // setImage(foundPet?.petImage || "");
      // setAge(foundPet?.age || { years: 0, months: 0 });

      // if (foundPet) {
      //   for (const key in foundPet) {
      //     setValue(key as keyof PetInfo, foundPet[key as keyof PetInfo]);
      //   }
      // }
    }
  };

  const handleEditCancelClick = () => {
    if (pet) {
      for (const key in pet) {
        // Reseting to previous image or default image when user clicks on cancel button
        setImage(
          pet.petImage ||
            (pet?.type && petImageByType[pet.type.toLowerCase()].src)
        );
        setValue(key as keyof PetInfo, pet[key as keyof PetInfo]);
      }
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = (data: PetInfo) => {
    const realPetImage =
      typeof image === "string" && image.includes("/_next/static/media/")
        ? ""
        : image;

    const storedPets = localStorage.getItem("pets");
    const pets: PetInfo[] = storedPets ? JSON.parse(storedPets) : [];

    const updatedPets = pets.map((pet) =>
      Number(pet.petId) === Number(petProfileId)
        ? { ...data, petImage: realPetImage }
        : pet
    );

    localStorage.setItem("pets", JSON.stringify(updatedPets));
    setPet({ ...data, petImage: realPetImage });
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        setValue("petImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = Math.max(
      0,
      Math.min(parseInt(value) || 0, name === "months" ? 12 : 40)
    );

    const updatedAge = { ...age, [name]: newValue };
    setAge(updatedAge);
    setValue("age", updatedAge);
  };

  const handlePetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value.toLowerCase();
    const newImage = petImageByType[selectedType]?.src || "";
    setImage(newImage);
  };

  // Here According to the type of pet, the image is selected
  const defaultImageOrPetImage =
    image || (pet?.type ? petImageByType[pet.type.toLowerCase()].src : "");

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
              className="rounded-full bg-white w-[130px] h-[130px] md:self-start"
            />
            {isEditing && (
              <>
                {typeof image === "string" &&
                  !image.includes("/_next/static/media/") && (
                    <button
                      type="button"
                      className="absolute bottom-0 left-0 p-3 bg-red-500 rounded-full z-10"
                      onClick={() =>
                        setImage(
                          (pet?.type &&
                            petImageByType[pet.type.toLowerCase()].src) ||
                            ""
                        )
                      }
                    >
                      <FaTrash size={10} fill="white" />
                    </button>
                  )}

                <Image
                  src={ImageEdit}
                  alt="Image Edit"
                  className="absolute bottom-0 right-0 "
                />
                <div className="px-5">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("petImage")}
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
              className={`grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2  w-full gap-4 md:gap-12 lg:gap-3`}
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
                      defaultValue={pet?.type}
                      onChange={handlePetTypeChange}
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
              <div className={`${!isEditing && "ml-4"} md:ml-0`}>
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
                      {...register("breed")}
                      className="outline-none border w-full px-2 p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
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
                    {pet?.gender || ""}
                  </p>
                )}
              </div>

              <div className={`${!isEditing && "ml-4"} md:ml-0`}>
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
                        value={age.years}
                        placeholder="0 years"
                        min="0"
                        max="40"
                        onChange={handleAgeChange}
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
                        value={age.months}
                        min="0"
                        max="12"
                        onChange={handleAgeChange}
                        name="months"
                        className="outline-none border w-full p-[5px] px-2 text-xs md:text-sm mt-2 rounded bg-transparent border-secondary-1"
                      />
                      <label className="text-secondary-1 w-full text-left text-[10px]">
                        Months
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.age?.years ? `${pet.age.years} yrs ` : ""}
                    {pet?.age?.months ? `${pet.age.months} mths ` : ""}
                  </p>
                )}
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
                      {...register("birthday")}
                      className="outline-none border px-2 w-full p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                    />
                    {errors.birthday && (
                      <p className="text-red-500 text-xs">
                        {errors.birthday.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-primary-1 font-medium text-xs md:text-base">
                    {pet?.birthday
                      ? new Date(pet?.birthday || "").toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </p>
                )}
              </div>
              <div className={`${!isEditing && "ml-4"} md:ml-0`}>
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
              </div>
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
