"use client"

import React, { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import PetSelectItem from "./PetSelectionItem"
import AddPetModal from "./AddPetModal"
import toast from "react-hot-toast"
import { BookingPet } from "@/model/typeDefinitions"
import { Tooltip } from "antd"

interface SelectPetProps {
  handleConfirm: (petId: string, petName: string) => void
  petId?: string
}

const SelectPet: React.FC<SelectPetProps> = ({ handleConfirm, petId }) => {
  const {
    call: getPetsForBooking,
    loading: loadingPets,
    result: allPetsResult,
  } = useAPICall(atHomeApiClient.getBookingPets)

  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    petId || null,
  )
  const [pets, setPets] = useState<BookingPet[]>([])
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    getPetsForBooking({})
  }, [])

  useEffect(() => {
    if (allPetsResult?.ok) {
      setPets(allPetsResult.value.body.data.pets)
    } else if (allPetsResult && !allPetsResult.ok) {
      setPets([])
      toast.error("Failed to fetch pets. Please try again.", {
        duration: 3000,
        position: "bottom-right",
        style: { backgroundColor: "#FF5252", color: "#fff", fontWeight: 700 },
      })
    }
  }, [allPetsResult])

  const handleSelect = (petId: string, serviceable: boolean) => {
    if (!serviceable) return
    setSelectedPetId(petId)
  }

  const handleAddPetModalClose = () => {
    setIsAddPetModalOpen(false)
  }

  const handleAddPetSuccess = async () => {
    setIsAddPetModalOpen(false)
    await getPetsForBooking({})
    toast.success("Added pet successfully", {
      duration: 3000,
      position: "bottom-right",
    })
  }

  const handleConfirmClick = () => {
    if (!selectedPetId) return
    setIsConfirming(true)
    const selectedPet = pets.find((pet) => pet.id === selectedPetId)
    if (!selectedPet) return
    handleConfirm(selectedPetId, selectedPet.name)
  }

  return (
    <div className="w-full h-full mt-4">
      <h1 className="text-2xl mb-2">Select your pet</h1>
      <p className="text-gray-600 mb-12">Choose a pet for this booking</p>

      {loadingPets ? (
        <div className="flex justify-center">
          <ClipLoader color="#33495f" size={24} />
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No pets yet. Add one to get started.
          </p>
          <button
            type="button"
            onClick={() => setIsAddPetModalOpen(true)}
            className="rounded-full px-8 py-3 bg-secondary-1 text-white hover:bg-secondary-2 transition"
          >
            Add Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 justify-items-center">
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
            <button
              type="button"
              className="flex flex-col items-center rounded-full justify-center cursor-pointer border border-dashed border-gray-400 w-[100px] h-[100px] text-gray-500 hover:border-secondary-1 hover:text-secondary-1 transition"
              onClick={() => setIsAddPetModalOpen(true)}
            >
              <span className="text-2xl font-bold">+</span>
            </button>
            <div className="text-sm">Add Pet</div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-10 mt-6">
        <Tooltip
          color="#f7f1de"
          styles={{ body: { color: "#33495f" } }}
          title={!selectedPetId ? "Select pet to proceed" : ""}
        >
          <button
            disabled={!selectedPetId || isConfirming}
            onClick={handleConfirmClick}
            className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-secondary-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isConfirming && <ClipLoader size={16} color="#ffffff" />}
            {isConfirming ? "Confirming..." : "Confirm"}
          </button>
        </Tooltip>
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
