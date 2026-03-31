"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Home, Hospital, LucideIcon } from "lucide-react"
import CustomButton from "./CustomButton"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { Popover } from "antd"
import { ClipLoader } from "react-spinners"
import { MdOutlineInfo } from "react-icons/md"
import { useAPIErrorToastFromResult } from "@/hooks/useAPIErrorToast"

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
  const [pincodeSearch, setPincodeSearch] = useState("")
  const { call: getServiceablePincodes, result: getServiceablePincodesResult } =
    useAPICall(atHomeApiClient.getServiceablePincodes)

  useEffect(() => {
    if (getServiceablePincodesResult?.ok) {
      setAvailablePincodes(
        getServiceablePincodesResult.value.body.data.pincodes,
      )
    }
  }, [getServiceablePincodesResult])
  useAPIErrorToastFromResult(getServiceablePincodesResult, {
    fallbackMessage: "Failed to fetch serviceable pincodes",
  })

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
    if (lowerTitle.includes("home")) {
      return Home
    }
    return Hospital
  }

  const sortedBookingTypes = [...bookingTypes].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  )

  const uniqueSortedPincodes = useMemo(() => {
    const deduped = Array.from(
      new Set(
        availablePincodes.map((pincode) => pincode.trim()).filter(Boolean),
      ),
    )
    return deduped.sort((a, b) => {
      const numA = Number(a)
      const numB = Number(b)
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return numA - numB
      }
      return a.localeCompare(b)
    })
  }, [availablePincodes])

  const filteredPincodes = useMemo(() => {
    const query = pincodeSearch.trim()
    if (!query) {
      return uniqueSortedPincodes
    }
    return uniqueSortedPincodes.filter((pincode) => pincode.includes(query))
  }, [uniqueSortedPincodes, pincodeSearch])

  const availablePincodesPopover = useMemo(() => {
    if (!availablePincodes.length) {
      return (
        <div className="flex justify-center items-center h-32">
          <ClipLoader size={16} color="#33495f" />
        </div>
      )
    }

    return (
      <div
        className="
        w-96
        text-sm
        p-3
      "
      >
        <p className="font-semibold mb-2">
          Home Visit is currently available in the following pincodes:
        </p>

        <input
          type="text"
          value={pincodeSearch}
          onChange={(e) => setPincodeSearch(e.target.value)}
          placeholder="Search pincode"
          className="w-full mb-3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-1"
        />
        <p className="text-xs text-gray-600 mb-3">
          You can check if your location is serviceable by searching your
          pincode.
        </p>

        <div className="max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          {filteredPincodes.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {filteredPincodes.map((pincode) => (
                <span
                  key={pincode}
                  className="rounded-full border border-gray-300 bg-white px-2 py-1 text-center text-xs font-semibold text-primary-1"
                >
                  {pincode}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600">No pincodes found</p>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-600">
          We are actively adding more serviceable areas.
        </p>
      </div>
    )
  }, [availablePincodes.length, filteredPincodes, pincodeSearch])

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
            <div
              key={bookingType.id}
              onClick={() => handleCardClick(bookingType.id)}
              className={`relative flex flex-col items-center p-8 rounded-md cursor-pointer transition-all ${
                isSelected
                  ? "outline outline-2 outline-secondary-1"
                  : "shadow-md"
              } bg-primary-3`}
            >
              {bookingType.type === "HOME_VISIT" && (
                <Popover
                  content={availablePincodesPopover}
                  color="#f7f1de"
                  styles={{ body: { color: "#33495f" } }}
                  trigger={["click"]}
                >
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 text-gray-600 "
                  >
                    <MdOutlineInfo className="hover:text-primary-1" size={18} />
                  </button>
                </Popover>
              )}

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
              {bookingType.type === "HOME_VISIT" && (
                <p className="text-center  text-gray-600 text-[10px]">
                  Home Visits are currently available in{" "}
                  <Popover
                    key={bookingType.id}
                    content={availablePincodesPopover}
                    color="#f7f1de"
                    styles={{ body: { color: "#33495f" } }}
                    trigger={["click"]}
                  >
                    <span
                      className="text-secondary-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      selected locations
                    </span>
                  </Popover>
                </p>
              )}
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
