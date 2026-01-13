"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Building2, Home, LucideIcon } from "lucide-react"
import CustomButton from "./CustomButton"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { Tooltip } from "antd"
import { ClipLoader } from "react-spinners"

export type BookingType = {
  id: string
  title: string
  description: string
  displayOrder: number
  type: "HOME_VISIT" | "CLINIC_VISIT"
}

interface BookingTypeSelectionProps {
  bookingTypes: BookingType[]
  onSelect: (bookingType: BookingType) => void
}

const BookingTypeSelection: React.FC<BookingTypeSelectionProps> = ({
  bookingTypes,
  onSelect,
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
  const [availablePincodes, setAvailablePincodes] = useState<string[]>([])
  const {
    call: getServiceablePincodes,
    result: getServiceablePincodesResult,
    loading: getServiceablePincodesLoading,
  } = useAPICall(mockAtHomeClient.getServiceablePincodes)
  useEffect(() => {
    if (getServiceablePincodesResult?.ok) {
      setAvailablePincodes(
        getServiceablePincodesResult.value.body.data.pincodes,
      )
    }
  }, [getServiceablePincodesResult])

  useEffect(() => {
    getServiceablePincodes({})
  }, [])

  const handleCardClick = (bookingTypeId: string) => {
    setSelectedTypeId(bookingTypeId)
  }

  const handleNext = () => {
    const selectedType = bookingTypes.find((bt) => bt.id === selectedTypeId)
    if (selectedType) {
      onSelect(selectedType)
    }
  }

  const getIconForBookingType = (title: string): LucideIcon => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("home") || lowerTitle.includes("visit")) {
      return Home
    }
    return Building2
  }

  const sortedBookingTypes = [...bookingTypes].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  )

  const availablePincodesTooltip = useMemo(() => {
    if (!availablePincodes.length) {
      return (
        <div className="flex justify-center items-center p-3">
          <ClipLoader size={16} color="#33495f" />
        </div>
      )
    }

    return (
      <div className="max-w-xs text-sm p-2">
        <p className="font-semibold mb-2">
          Home Visit is currently available in the following pincodes:
        </p>

        <ul className="list-disc pl-5 space-y-1">
          {availablePincodes.map((pincode) => (
            <li key={pincode}>{pincode}</li>
          ))}
        </ul>

        <p className="mt-2 text-xs text-gray-600">
          We are actively adding more serviceable areas.
        </p>
      </div>
    )
  }, [availablePincodes, getServiceablePincodesLoading])

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-2">Your place or ours?</h1>
      <p className="text-gray-600 mb-12">
        {"Choose how you'd like to schedule your appointment:"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {sortedBookingTypes.map((bookingType) => {
          const Icon = getIconForBookingType(bookingType.title)
          const isSelected = selectedTypeId === bookingType.id

          return (
            <Tooltip
              key={bookingType.id}
              title={
                bookingType.type === "HOME_VISIT" && availablePincodesTooltip
              }
              color="#f7f1de"
              styles={{ body: { color: "#33495f" } }}
            >
              <div
                onClick={() => handleCardClick(bookingType.id)}
                className={`flex flex-col items-center p-8 rounded-md cursor-pointer transition-all ${
                  isSelected
                    ? "outline outline-2 outline-secondary-1"
                    : "shadow-md"
                } bg-primary-3`}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-4 rounded-full bg-white">
                  <Icon
                    size={48}
                    className={
                      isSelected ? "text-secondary-1" : "text-primary-1"
                    }
                  />
                </div>
                <h2 className="text-xl font-semibold text-primary-1 mb-2">
                  {bookingType.title}
                </h2>
                <p className="text-center text-gray-600 text-sm">
                  {bookingType.description}
                </p>
              </div>
            </Tooltip>
          )
        })}
      </div>

      <div className="my-16 w-full flex items-center justify-center">
        <CustomButton
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          buttonClickEvent={handleNext}
          disabled={!selectedTypeId}
        />
      </div>
    </div>
  )
}

export default BookingTypeSelection
