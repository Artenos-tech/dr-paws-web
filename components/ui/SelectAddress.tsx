"use client"

import { mockAtHomeClient } from "@/services/api.athome"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Address = {
  id: string
  tag: string
  location: { lat: number; lng: number }
  address_line1: string
  address_line2: string
  directions: string | null
}

const SelectAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [serviceableIds, setServiceableIds] = useState<Set<string>>(new Set())
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )
  const router = useRouter()
  const params = useSearchParams()

  const home = params.get("home")

  useEffect(() => {
    fetchAddress()
  }, [home])

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
    addresses.forEach((address) => {
      checkLocationServiceability(address.id, address.location)
    })
  }, [addresses])

  const handleSelect = (addressId: string) => {
    if (!serviceableIds.has(addressId)) return
    setSelectedAddressId(addressId)
  }

  return (
    <div className="space-y-8 py-10">
      <h1 className="text-xl font-semibold">
        {"Let's check if your address is within range"}
      </h1>
      <p className="text-gray-600">Add or select your address</p>

      <div className="flex flex-col md:flex-row md:gap-4 overflow-x-auto">
        {addresses.map((address) => {
          const isServiceable = serviceableIds.has(address.id)
          const isSelected = selectedAddressId === address.id

          return (
            <div
              key={address.id}
              onClick={() => handleSelect(address.id)}
              className={`w-full md:w-[260px] border-2 rounded-lg p-4 mb-4 transition
                ${isServiceable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                ${isSelected ? "border-secondary-1 " : "border-gray-300"}
              `}
            >
              <div className="flex justify-between items-start">
                <h2
                  className={`font-semibold ${
                    isServiceable ? "primary-text" : "text-gray-400"
                  }`}
                >
                  {address.tag}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full text-white ${
                    isServiceable ? "bg-green-600" : "bg-red-500"
                  }`}
                >
                  {isServiceable ? "Serviceable" : "Unserviceable"}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {address.address_line1}
              </p>
            </div>
          )
        })}

        <div className="w-full md:w-[260px] border rounded-lg p-4 mb-4 flex items-center justify-center">
          <button
            onClick={() => router.push("/user/book-appointment/add-address")}
            className="rounded-full px-6 py-3 bg-secondary-1 text-white"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          disabled={!selectedAddressId}
          className=" rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Address
        </button>
      </div>
    </div>
  )
}

export default SelectAddress
