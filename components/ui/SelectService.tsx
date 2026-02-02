"use client"

import React, { useEffect, useState } from "react"
import { Tooltip } from "antd"
import BookingCard from "@/components/ui/BookingCard"
import GroomingSubtypeModal from "@/components/ui/GroomingSubtypeModal"
import CustomButton from "./CustomButton"
import { Pet } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import ClipLoader from "react-spinners/ClipLoader"
import toast, { Toaster } from "react-hot-toast"

export interface BookingCategory {
  id: string
  title: string
  description: string
}

interface SelectServiceProps {
  selectedPet: Pet | null
  setSelectedPet: (pet: Pet | null) => void
  selectedServiceId: string | null
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
  setSelectedPet,
  selectedServiceId,
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

  const fetchAppointmentServices = async () => {
    try {
      await getAppointmentServices({})
    } catch (error) {
      console.error("Error fetching appointment services:", error)
      toast.error(
        "Failed to load appointment services. Please try again later.",
      )
    }
  }

  const fetchPets = async () => {
    try {
      await getPetsAPI({})
    } catch (error) {
      console.error("Error fetching pets:", error)
      toast.error("Failed to load pets. Please try again later.")
    }
  }

  useEffect(() => {
    fetchAppointmentServices()
    fetchPets()
  }, [])

  const pets = getPetsAPIResult?.ok
    ? getPetsAPIResult.value.body.pets.map((pet) => ({
        ...pet,
        profileImage: pet.profile_image,
        id: pet.id,
      }))
    : []

  useEffect(() => {
    if (!selectedPet && pets.length === 1) {
      setSelectedPet(pets[0])
    }
  }, [pets, selectedPet, setSelectedPet])

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
      if (selectedCard && prevOpenCard !== cardId) {
        setServiceOptions(
          selectedCard.id,
          selectedCard.title,
          selectedPet,
          isGrooming,
          selectedSubtype,
        )
      }
      if (
        selectedCard &&
        // selectedCard.isGrooming &&
        selectedCard.subtypes &&
        selectedCard.subtypes.length > 0 &&
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
    <div className="w-full h-full mt-4">
      <h1 className="text-2xl mb-2">Select Services</h1>
      <p className="text-gray-600 mb-12">Choose from our services:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
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
        <Tooltip
          title={
            !selectedServiceId
              ? "Select a service to proceed"
              : !selectedPet
                ? "Select a pet to proceed to the next step."
                : null
          }
          color="var(--primary-3)"
          styles={{ body: { color: "var(--primary-1)" } }}
        >
          <span>
            <CustomButton
              buttonText="Next"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={handleNext}
              disabled={!selectedPet || !selectedServiceId}
            />
          </span>
        </Tooltip>
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
      <Toaster />
    </div>
  )
}

export default SelectService
