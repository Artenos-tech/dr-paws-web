"use client"

import React, { useEffect, useState } from "react"

import Image from "next/image"
import { useForm } from "react-hook-form"
import ImageEdit from "@/public/assets/images/Profile/ImageEdit.png"
import OutlineButton from "./OutlineButton"
import { FaTrash } from "react-icons/fa6"
import { petImageByType } from "./PetCard"
import { Pet } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import Loader from "./Loader"
// import { Subscription } from "@/app/user/my-subscriptions/page"

import { ClipLoader } from "react-spinners"
// import MedicalHistory from "./MedicalHistory"

interface PetProfileInfoProps {
  petId: string
}

const PetProfileInfo: React.FC<PetProfileInfoProps> = ({ petId }) => {
  const [pet, setPet] = useState<Pet>()
  const [isEditing, setIsEditing] = useState(false)
  const [image, setImage] = useState<string>("")
  // const [subscription, setSubscription] = useState<Subscription | null>(null)
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
  } = useAPICall(api.getPets)
  const { call: getPetSpecies, result: getPetSpeciesResult } = useAPICall(
    api.getPetSpecies,
  )
  const {
    call: getPetBreeds,
    result: getPetBreedsResult,
    loading: loadingBreeds,
  } = useAPICall(api.getPetBreeds)
  const {
    call: getPetGender,
    result: getPetGenderResult,
    loading: loadingGender,
  } = useAPICall(api.getPetGender)
  const { call: updatePetDetails, loading: loadingUpdate } = useAPICall(
    api.updatePet,
  )

  // Setup API call for getPetSubscription
  // const { call: getPetSubscription } = useAPICall(api.getPetSubscription)

  const formMethods = useForm<Pet>({
    defaultValues: {
      name: "",
      type: null,
      breed: "",
      gender: "",
      dob: "",
      // weight: "",
      profileImage: "",
    },
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = formMethods

  useEffect(() => {
    getPets({})
  }, [])

  useEffect(() => {
    if (petId) {
      fetchPetSpecies()
      getPetGender({})
    }
  }, [petId])

  useEffect(() => {
    if (getPetsResult?.ok && petId) {
      const foundPet = getPetsResult.value.body.pets.find(
        (pet) => pet.id === petId,
      )
      if (foundPet) {
        setPet({
          name: foundPet.name,
          type: foundPet.type || null,
          breed: foundPet.breed?.trim() || null,
          // weight: foundPet.weight,
          gender: foundPet.gender?.trim() || null,
          id: foundPet.id,
          dob: foundPet.dob?.split("T")[0] || null,
          profileImage: foundPet.profile_image,
        })
        setImage(foundPet.profile_image || "")
        // setAge(foundPet.age || { years: 0, months: 0 });

        Object.entries(foundPet).forEach(([key, value]) => {
          if (key in foundPet) {
            if (key === "dob" && typeof value === "string") {
              const formattedDate = value.split("T")[0]
              setValue("dob", formattedDate)
            } else if (typeof value === "string") {
              setValue(key as keyof Pet, value?.trim())
            } else setValue(key as keyof Pet, value)
          }
        })
      }
    }
    // if (petId) {
    //   const fetchSubscription = async () => {
    //     const response = await getPetSubscription({ pet_id: petId })
    //     if (response?.ok) {
    //       setSubscription(response.value.body.subscription)
    //     }
    //   }
    //   fetchSubscription()
    // }
  }, [petId, getPetsResult, setValue])

  useEffect(() => {
    if (getPetSpeciesResult?.ok) {
      const selectedSpecies = getPetSpeciesResult.value.body.species.find(
        (species) => species === pet?.type,
      )
      if (selectedSpecies) {
        fetchPetBreedsBySpecies(selectedSpecies)
      }
    }
  }, [getPetSpeciesResult])

  const fetchPetSpecies = async () => {
    await getPetSpecies({})
  }

  const fetchPetBreedsBySpecies = async (species: "DOG" | "CAT") => {
    await getPetBreeds({ species })
  }

  const petSpecies = getPetSpeciesResult?.ok
    ? getPetSpeciesResult.value.body.species
    : []

  const petBreeds = getPetBreedsResult?.ok
    ? getPetBreedsResult.value.body.breeds
    : []

  const petGenders = getPetGenderResult?.ok
    ? getPetGenderResult.value.body.gender
    : []

  const handleEditCancelClick = () => {
    if (pet) {
      for (const key in pet) {
        if (Object.prototype.hasOwnProperty.call(pet, key)) {
          const typedKey = key as keyof Pet
          setValue(typedKey, pet[typedKey])
        }
      }

      const typeKey = pet?.type?.toLowerCase() || "other"
      const defaultImage = petImageByType[typeKey]?.src || ""
      if (image !== (pet?.profileImage || defaultImage)) {
        setImage(pet?.profileImage || defaultImage)
      }
    }

    setIsEditing(!isEditing)
  }

  const onSubmit = async (selectedPet: Pet) => {
    const realPetImage =
      typeof image === "string" && image.includes("/_next/static/media/")
        ? null
        : image

    const petType = petSpecies.find((species) => species === selectedPet.type)
    const petBreed = petBreeds.find(
      (breed) => breed.name === selectedPet.breed,
    )?.id
    const petGender = petGenders.find((gender) => gender === selectedPet.gender)

    if (petType && petGender) {
      await updatePetDetails({
        pet: {
          id: selectedPet.id,
          name: selectedPet.name,
          species: petType,
          breed: petBreed
            ? {
                id: petBreed,
                name: selectedPet.breed!,
              }
            : null,
          // weight: null,
          gender: petGender,
          dob: selectedPet.dob ? new Date(selectedPet.dob).toISOString() : null,
          profileImage: realPetImage,
        },
      })
    }
    setPet({ ...selectedPet, profileImage: realPetImage })
    setIsEditing(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert("File size exceeds the 10MB limit. Please upload a smaller file.")
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImage(result)
        setValue("profileImage", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value.toLowerCase()
    if (image && image.includes("/_next/static/media/")) {
      const newImage = petImageByType[selectedType]?.src || ""
      setImage(newImage)
    }
    const selectedSpecies = petSpecies.find((type) => type === e.target.value)
    if (selectedSpecies) {
      fetchPetBreedsBySpecies(selectedSpecies)
    }
    setValue("breed", "")
  }

  const defaultImageOrPetImage =
    image ||
    petImageByType[pet?.type?.toLowerCase() || "other"] ||
    petImageByType.other

  if (loadingPets)
    return (
      <div>
        <Loader />
      </div>
    )

  return (
    <>
      <div className="bg-primary-3 rounded-lg p-3 md:p-6 lg:p-8 w-full">
        {/* {subscription && subscription.plan && (
          <div className=" bg-secondary-1 text-white px-8 py-6 mb-4 rounded">
            <p className="text-xl"> {subscription.plan.name}</p>
            <p className="text-xs text-[#F7F1DE]">
              Expires On:{" "}
              {new Date(subscription.end_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )} */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row lg:justify-between md:items-start w-full"
        >
          <div className="flex flex-col items-center lg:flex-row lg:justify-between w-full lg:order-none order-1">
            <div className="p-4">
              <div className="relative w-[130px] h-[130px] flex flex-col overflow-visible bg-white rounded-full">
                <Image
                  src={defaultImageOrPetImage}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full md:self-center"
                />
                {isEditing && (
                  <>
                    {(image
                      ? !image.includes("/_next/static/media/")
                      : typeof defaultImageOrPetImage === "object" &&
                        !defaultImageOrPetImage.src.includes(
                          "/_next/static/media/",
                        )) && (
                      <button
                        type="button"
                        className="absolute -bottom-3 -left-2 p-3 bg-red-500 rounded-full z-20"
                        onClick={() => {
                          const defaultImage =
                            pet?.type && petImageByType[pet.type.toLowerCase()]
                              ? petImageByType[pet.type.toLowerCase()].src
                              : petImageByType.other.src
                          setImage(defaultImage)
                        }}
                      >
                        <FaTrash size={14} fill="white" />
                      </button>
                    )}
                    <Image
                      src={ImageEdit}
                      alt="Image Edit"
                      width={40}
                      height={40}
                      objectFit="cover"
                      className="cursor-pointer absolute -bottom-3 -right-2 rounded-full"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      {...register("profileImage")}
                      onChange={handleImageChange}
                      className="absolute -bottom-3 -right-2 opacity-0 w-[40px] h-[40px] cursor-pointer z-30"
                      aria-label="Upload pet profile image"
                    />
                  </>
                )}
              </div>
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
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
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
                <div className={`${!isEditing && "ml-4"} md:ml-0`}>
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
                          <option key={species} value={species}>
                            {species}
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
                      {loadingBreeds ? (
                        <div className="flex items-center justify-center w-full h-[50px]">
                          <ClipLoader size={16} />
                        </div>
                      ) : (
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
                        </select>
                      )}
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
                <div className={`${!isEditing && "ml-4"} md:ml-0`}>
                  <label
                    className="text-secondary-1 text-xs md:text-sm"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  {isEditing ? (
                    <>
                      {loadingGender ? (
                        <div className="flex items-center justify-center w-full h-[50px]">
                          <ClipLoader size={16} />
                        </div>
                      ) : (
                        <select
                          {...register("gender")}
                          className="outline-none border w-full px-2 p-1 text-xs md:text-sm rounded my-2 bg-transparent border-secondary-1"
                          defaultValue={pet?.gender || ""}
                        >
                          <option value="">Type of Gender</option>
                          {petGenders?.map((gender) => (
                            <option value={gender} key={gender}>
                              {gender}
                            </option>
                          ))}
                        </select>
                      )}

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

                <div className={`${!isEditing && "ml-4"} md:ml-0`}>
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
                    className="btn border bg-secondary-1 text-white px-4 text-xs font-semibold py-2 rounded-full ml-3 min-w-[80px]"
                  >
                    {loadingUpdate ? (
                      <ClipLoader color="#white" size={18} />
                    ) : (
                      "Submit"
                    )}
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
      {/* <div className="rounded-lg p-3 md:p-6 lg:p-8 w-full my-5">
        <h1 className="text-3xl">Medical History</h1>
        <div className="flex flex-col gap-6 w-full items-center my-4">
          <MedicalHistory petProfileId={petId.toString()} />
        </div>
      </div> */}
    </>
  )
}

export default PetProfileInfo
