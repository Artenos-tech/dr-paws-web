"use client"

import React, { useState } from "react"
import { Building2, Home, LucideIcon } from "lucide-react"
import CustomButton from "./CustomButton"

export type BookingType = {
  id: string
  title: string
  description: string
  displayOrder: number
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

  // Sort by displayOrder
  const sortedBookingTypes = [...bookingTypes].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  )

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-2">Your place or ours?</h1>
      <p className="text-gray-600 mb-12">
        Choose how you'd like to schedule your appointment:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {sortedBookingTypes.map((bookingType) => {
          const Icon = getIconForBookingType(bookingType.title)
          const isSelected = selectedTypeId === bookingType.id

          return (
            <div
              key={bookingType.id}
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
                  className={isSelected ? "text-secondary-1" : "text-primary-1"}
                />
              </div>
              <h2 className="text-xl font-semibold text-primary-1 mb-2">
                {bookingType.title}
              </h2>
              <p className="text-center text-gray-600 text-sm">
                {bookingType.description}
              </p>
            </div>
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
