"use client"

import React, { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import PetSelectItem from "./PetSelectionItem"
import AddPetModal from "./AddPetModal"
import toast from "react-hot-toast"
import { BookingPet } from "@/model/typeDefinitions"

interface SelectPetProps {
  handleConfirm: (petId: string) => void
  fetchPets?: () => void
  pets?: BookingPet[]
}

const SelectPet: React.FC<SelectPetProps> = ({ handleConfirm }) => {
  const { call, loading } = useAPICall(mockAtHomeClient.getBookingPets)

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [pets, setPets] = useState<BookingPet[]>([])
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const res = await call({})
      if (res?.ok) setPets(res.value.body.data.pets)
    }
    fetch()
  }, [])

  const handleSelect = (petId: string, serviceable: boolean) => {
    if (!serviceable) return
    setSelectedPetId(petId)
  }

  const handleAddPetModalClose = () => {
    setIsAddPetModalOpen(false)
  }

  const handleAddPetSuccess = () => {
    setIsAddPetModalOpen(false)
    call({}).then((res) => {
      if (res?.ok) setPets(res.value.body.data.pets)
    })
    toast.success("Added pet successfully", {
      duration: 3000,
      position: "bottom-right",
      style: { backgroundColor: "#4CAF50", color: "#fff", fontWeight: 700 },
    })
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 justify-items-center">
          {pets.map((pet) => (
            <PetSelectItem
              key={pet.id}
              pet={pet}
              isSelected={selectedPetId === pet.id}
              isServiceable={pet.serviceable}
              onSelect={() => handleSelect(pet.id, pet.serviceable)}
            />
          ))}

          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className="flex flex-col items-center rounded-full justify-center cursor-pointer border border-dashed border-gray-400 w-[100px] h-[100px] text-gray-500"
              onClick={() => setIsAddPetModalOpen(true)}
            >
              <span className="text-2xl font-bold">+</span>
            </div>
            <div className="text-sm">Add Pet</div>
          </div>
        </div>
      )}

      <div className="flex justify-center my-10">
        <button
          disabled={!selectedPetId}
          onClick={() => selectedPetId && handleConfirm(selectedPetId)}
          className="rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>

      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={handleAddPetModalClose}
        onSuccess={handleAddPetSuccess}
      />
    </div>
  )
}

export default SelectPet
