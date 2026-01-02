import React, { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet: any) => {
            const isSelected = selectedPetId === pet.id
            const isServiceable = pet.serviceable

            return (
              <div
                key={pet.id}
                onClick={() => handleSelect(pet.id, isServiceable)}
                className={`border-2 rounded-lg p-4 transition
                  ${
                    isServiceable
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }
                  ${isSelected ? "border-secondary-1" : "border-gray-300"}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {pet.profile_image ? (
                      <img
                        src={pet.profile_image}
                        alt={pet.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        N/A
                      </div>
                    )}

                    <div>
                      <h2
                        className={`font-semibold ${
                          isServiceable ? "primary-text" : "text-gray-400"
                        }`}
                      >
                        {pet.name}
                      </h2>
                      <p className="text-sm text-gray-500">{pet.type}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white ${
                      isServiceable ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    {isServiceable ? "Serviceable" : "Unserviceable"}
                  </span>
                </div>
              </div>
            )
          })}
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
