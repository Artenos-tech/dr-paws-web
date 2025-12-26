"use client"

import { mockAtHomeClient } from "@/services/api.athome"
import { useEffect, useState } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

type Address = {
  id: string
  tag: string
  location: { lat: number; lng: number }
  address_line1: string
  address_line2: string
  directions: string | null
}

const SERVICEABLE_BOUNDS = {
  north: 13.1,
  south: 12.8,
  east: 77.8,
  west: 77.5,
}

const DEFAULT_PIN = {
  lat: 12.95,
  lng: 77.65,
}

const SelectAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [serviceableIds, setServiceableIds] = useState<Set<string>>(new Set())
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )

  const [showMap, setShowMap] = useState(false)
  const [pinLocation, setPinLocation] = useState(DEFAULT_PIN)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  })

  const fetchAddress = async () => {
    const result = await mockAtHomeClient.getAddressBook({}, {})
    if (result.ok) {
      setAddresses(result.value.body.address_book)
    }
  }

  const checkLocationServiceability = async (
    addressId: string,
    location: { lat: number; lng: number },
  ) => {
    const result = await mockAtHomeClient.checkLocationServiceability(
      { location },
      {},
    )
    if (result.ok && result.value.body.serviceable) {
      setServiceableIds((prev) => new Set(prev).add(addressId))
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])

  useEffect(() => {
    addresses.forEach((address) =>
      checkLocationServiceability(address.id, address.location),
    )
  }, [addresses])

  const handleSelect = (addressId: string) => {
    if (!serviceableIds.has(addressId)) return
    setSelectedAddressId(addressId)
  }

  if (showMap) {
    return (
      <div className="space-y-6 py-10">
        <button className="text-sm underline" onClick={() => setShowMap(false)}>
          ← Back
        </button>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={pinLocation}
            zoom={14}
            options={{
              restriction: {
                latLngBounds: SERVICEABLE_BOUNDS,
                strictBounds: false,
              },
            }}
          >
            <Marker
              position={pinLocation}
              draggable
              onDragEnd={(e) => {
                const lat = e.latLng?.lat()
                const lng = e.latLng?.lng()
                if (!lat || !lng) return
                setPinLocation({ lat, lng })
                console.log({ lat, lng })
              }}
            />
          </GoogleMap>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 py-10">
      <h1 className="text-xl font-semibold">
        {"Let's check if your address is within range"}
      </h1>
      <p className="text-gray-600">Add or select your address</p>

      <div className="flex flex-col items-center md:items-stretch md:flex-row md:gap-4 overflow-x-auto md:overflow-x-hidden scrollbar-none">
        {addresses.map((address) => {
          const isServiceable = serviceableIds.has(address.id)
          const isSelected = selectedAddressId === address.id

          return (
            <div
              key={address.id}
              onClick={() => handleSelect(address.id)}
              className={`w-full md:w-[260px] flex-shrink-0 border rounded-lg p-4 mb-4 transition
                ${isServiceable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                ${isSelected ? "border-black bg-gray-100" : "border-gray-300"}
              `}
            >
              <div className="flex justify-between items-start gap-2">
                <h1
                  className={`font-semibold leading-tight ${
                    isServiceable ? "primary-text" : "text-gray-400"
                  }`}
                >
                  {address.tag}
                </h1>

                {isServiceable ? (
                  <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                    Serviceable
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    Unserviceable
                  </span>
                )}
              </div>

              <div className="mt-2 break-words">
                <p className="text-sm text-gray-500">
                  {address.address_line1}
                </p>
              </div>
            </div>
          )
        })}

        <div className="w-full md:w-[260px] flex-shrink-0 border rounded-lg p-4 mb-4 flex items-center justify-center">
          <button
            onClick={() => setShowMap(true)}
            className="rounded-full px-6 py-3 bg-secondary-1 text-white flex items-center gap-2 hover:opacity-90"
          >
            <span className="text-lg leading-none">+</span>
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedAddressId}
        >
          Confirm Address
        </button>
      </div>
    </div>
  )
}

export default SelectAddress
