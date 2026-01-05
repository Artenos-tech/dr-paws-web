import React, { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import PetSelectItem from "./PetSelectionItem"

const SelectPet = ({
  handleConfirm,
}: {
  handleConfirm: (petId: string) => void
}) => {
  const { call, loading, result } = useAPICall(mockAtHomeClient.getBookingPets)

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  useEffect(() => {
    call({})
  }, [])
  const pets = result?.ok === true ? result.value.body.data.pets : []

  console.log("Pets:", pets)

  const handleSelect = (petId: string, serviceable: boolean) => {
    if (!serviceable) return
    setSelectedPetId(petId)
  }

  return (
    <div className="space-y-8 py-10">
      <h1 className="text-xl font-semibold">Select your pet</h1>
      <p className="text-gray-600">Choose a pet for this booking</p>

      {loading ? (
        <div className="flex justify-center">
          <ClipLoader color="#33495f" size={24} />
        </div>
      ) : (
        <div
          className="
    grid
    grid-cols-2      
    md:grid-cols-4   
    lg:grid-cols-8    
    gap-2
    justify-items-center
  "
        >
          {pets.map((pet) => (
            <PetSelectItem
              key={pet.id}
              pet={pet}
              isSelected={selectedPetId === pet.id}
              isServiceable={pet.serviceable}
              onSelect={() => setSelectedPetId(pet.id)}
            />
          ))}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col items-center rounded-full justify-center cursor-pointer border border-dashed border-gray-400 w-[100px] h-[100px] text-gray-500">
              <span className="text-2xl font-bold">+</span>
            </div>
            <div className="text-sm">Add Pet</div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          disabled={!selectedPetId}
          onClick={() => selectedPetId && handleConfirm(selectedPetId)}
          className="rounded-full px-8 py-3 bg-secondary-1 text-white
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default SelectPet
