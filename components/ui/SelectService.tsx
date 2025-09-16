"use client"

import React, { useEffect, useState } from "react"
import BookingCard from "@/components/ui/BookingCard"
import GroomingSubtypeModal from "@/components/ui/GroomingSubtypeModal"
import CustomButton from "./CustomButton"
import { Pet } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import ClipLoader from "react-spinners/ClipLoader"

export interface BookingCategory {
  id: string
  title: string
  description: string
}

interface SelectServiceProps {
  selectedPet: Pet | null
  setServiceOptions: (
    selectedSvcId: string | null,
    serviceTitle: string | null,
    selectedPet: Pet | null,
    isGrooming: boolean,
    selectedSubtype: BookingCategory | null,
  ) => void
  openCard: string | null
  setOpenCard: React.Dispatch<React.SetStateAction<string | null>>
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  onNext: () => void
}

const SelectService: React.FC<SelectServiceProps> = ({
  selectedPet,
  setServiceOptions,
  openCard,
  setOpenCard,
  isModalOpen,
  setIsModalOpen,
  onNext,
}) => {
  const [subtypes, setSubtypes] = useState<BookingCategory[]>([])
  const [selectedSubtype, setSelectedSubtype] =
    useState<BookingCategory | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string>()
  const [selectedServiceType, setSelectedServiceType] = useState<
    "Consultation" | "Grooming" | null
  >(null)
  const { call: getPetsAPI, result: getPetsAPIResult } = useAPICall(api.getPets)

  const {
    call: getAppointmentServices,
    result: getAppointmentServicesResult,
    loading: loadingServices,
  } = useAPICall(api.getAppointmentServices)

  useEffect(() => {
    getAppointmentServices({})
    fetchPets()
  }, [])

  const fetchPets = async () => {
    await getPetsAPI({})
  }

  const pets =
    getPetsAPIResult?.ok &&
    getPetsAPIResult.value.body.pets.map((pet) => ({
      ...pet,
      profileImage: pet.profile_image,
      id: pet.id,
    }))

  const appointmentTypes = getAppointmentServicesResult?.ok
    ? getAppointmentServicesResult.value.body.appointmentTypes
    : []

  const handleCardSelection = (
    cardId: string,
    cardTitle: string,
    selectedPet: Pet | null,
    isGrooming: boolean,
  ) => {
    setServiceOptions(
      cardId,
      cardTitle,
      selectedPet,
      isGrooming,
      selectedSubtype,
    )
  }

  const toggleCard = (cardId: string, isGrooming: boolean) => {
    setSelectedCardId(cardId)
    setSelectedSubtype(null)
    setOpenCard((prevOpenCard) => {
      if (prevOpenCard !== null) {
        setServiceOptions(null, null, null, isGrooming, selectedSubtype)
      }
      const selectedCard = appointmentTypes.find(
        (category) => category.id === cardId,
      )
      if (
        selectedCard &&
        // selectedCard.isGrooming &&
        selectedCard.subtypes &&
        prevOpenCard !== cardId
      ) {
        setSubtypes(selectedCard.subtypes)
        setIsModalOpen(true)
      }
      return prevOpenCard === cardId ? null : cardId
    })
    setSelectedServiceType(isGrooming ? "Grooming" : "Consultation")
  }

  const handleNext = () => {
    onNext()
  }

  if (loadingServices) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl mb-2">Select Services</h1>
      <p className="text-gray-600 mb-12">Choose from our services:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {appointmentTypes
          .toSorted((a, b) => a.displayOrder - b.displayOrder)
          .map((category) => (
            <BookingCard
              key={category.id}
              cardId={category.id}
              title={category.title}
              description={category.description}
              onCardSelection={handleCardSelection}
              isOpen={openCard === category.id}
              isGrooming={category.isGrooming}
              toggleCard={toggleCard}
              selectedPet={selectedPet}
              pets={
                pets
                  ? category.isGrooming
                    ? pets.filter((pet) => pet.type !== "OTHER")
                    : pets
                  : []
              }
              fetchPets={fetchPets}
            />
          ))}
      </div>
      <div className="my-16 w-full flex item-center justify-center">
        <CustomButton
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          buttonClickEvent={handleNext}
          disabled={!selectedPet}
        />
      </div>

      <GroomingSubtypeModal
        isOpen={isModalOpen}
        subtypes={subtypes}
        setSelectedSubtype={setSelectedSubtype}
        selectedServiceType={selectedServiceType}
        onClose={(subtypeSelected: boolean) => {
          if (!subtypeSelected) {
            setSelectedSubtype(null)
            toggleCard(selectedCardId as string, false)
            setSelectedServiceType(null)
          }
          setIsModalOpen(false)
        }}
        selectedSubtype={selectedSubtype}
      />
    </div>
  )
}

export default SelectService
