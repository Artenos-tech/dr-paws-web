"use client"

import { useEffect, useState } from "react"
import PetCard from "@/components/ui/PetCard"
import { Pet } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"

import MedicalHistory from "@/components/ui/MedicalHistory"

const Reports = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  const {
    call: getPets,
    result: petsResult,
    loading: petsLoading,
  } = useAPICall(api.getPets)

  useEffect(() => {
    getPets({})
  }, [])

  const handleFetchMedicalHistory = (pet: Pet) => {
    setSelectedPet(pet)
  }

  const pets =
    petsResult?.ok &&
    petsResult.value.body.pets.map((pet) => ({
      ...pet,
      profileImage: pet.profile_image,
      gender: pet.gender,
    }))

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="flex flex-col m-4 lg:m-8 gap-6 lg:w-full items-center">
          <div
            className={`flex justify-center items-center ${!petsLoading && "md:justify-start"} flex-wrap gap-4 my-8 md:my-4`}
          >
            {petsLoading ? (
              <ClipLoader color="#33495f" />
            ) : (
              pets &&
              pets?.map((pet) => (
                <div key={pet.id} className="flex-shrink-0">
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    fetchMedicalHistory={handleFetchMedicalHistory}
                    isSelected={selectedPet?.id === pet.id}
                  />
                </div>
              ))
            )}
          </div>

          {selectedPet && (
            <div className="w-full p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedPet.name}&apos;s Medical History
              </h2>
              <MedicalHistory petId={selectedPet.id} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Reports
