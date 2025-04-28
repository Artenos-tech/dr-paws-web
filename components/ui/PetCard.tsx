"use client"

import Image, { StaticImageData } from "next/image"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import defaultPetImg from "@/public/assets/images/pets/petImg.png"
import defaultdogImg from "@/public/assets/images/pets/dog.png"
import defaultCatImg from "@/public/assets/images/pets/cat.png"
import defaultHamsterImg from "@/public/assets/images/pets/hamster.png"
import defaultBirdImg from "@/public/assets/images/pets/bird.png"
import defaultRabbitImg from "@/public/assets/images/pets/rabbit.png"
import defaultOtherPetImage from "@/public/assets/images/pets/petImg.png"
import { Pet } from "@/context/UserContext"
// import { useAPICall } from "@/hooks/apicall"
// import api from "@/services/api"
import { Subscription } from "@/app/user/my-subscriptions/page"

interface PetCardProps {
  pet: Pet
  fetchMedicalHistory?: (pet: Pet) => void
}

export const petImageByType: Record<string, StaticImageData> = {
  dog: defaultdogImg,
  cat: defaultCatImg,
  bird: defaultBirdImg,
  rabbit: defaultRabbitImg,
  hamster: defaultHamsterImg,
  other: defaultOtherPetImage,
}

const PetCard: React.FC<PetCardProps> = ({ pet, fetchMedicalHistory }) => {
  const { name, vetPortId, profileImage, type } = pet
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  // Setup API call for getPetSubscription
  // const { call: getPetSubscription } = useAPICall(api.getPetSubscription)

  useEffect(() => {
    //   // If pet has a vetPortId, fetch subscription
    //   if (vetPortId) {
    //     const fetchSubscription = async () => {
    //       const response = await getPetSubscription({ pet_id: vetPortId })
    //       if (response?.ok) {
    //         setSubscription(response.value.body.subscription)
    //       }
    //     }
    //     fetchSubscription()
    setSubscription(null)
    //   }
  }, [])

  const handlePetProfileView = () => {
    if (!fetchMedicalHistory)
      router.push(`/user/profile/pet-profile/${vetPortId}`)
    else fetchMedicalHistory(pet)
  }

  const defaultImageOrPetImage =
    profileImage ||
    petImageByType[type?.toLowerCase() || "other"] ||
    defaultPetImg

  const borderStyle = subscription
    ? "border-2 border-secondary-1 bg-secondary-1"
    : "border-2 border-[#E2DBC4] bg-[#E2DBC4]"

  return (
    <div
      className={`w-full max-w-[150px] ${borderStyle}   text-center rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-105`}
      onClick={handlePetProfileView}
    >
      <div className="bg-primary-3 rounded-2xl p-4 space-y-3">
        <div className="relative w-24 h-24 mx-auto">
          <Image
            src={defaultImageOrPetImage}
            alt={`${name}'s profile picture`}
            fill
            sizes="(max-width: 96px) 100vw, 96px"
            className="rounded-full bg-white object-cover"
            priority
          />
        </div>
        <h2 className="text-xl font-bold text-secondary-1">{name}</h2>
      </div>
      {subscription && subscription.plan ? (
        <div className={`bg-secondary-1 rounded-b-xl`}>
          <p className="text-xs text-white p-2">{subscription.plan.name}</p>
        </div>
      ) : (
        <div className="rounded-b-xl pb-6"></div>
      )}
    </div>
  )
}

export default PetCard
