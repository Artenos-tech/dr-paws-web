"use client"

import { mockAtHomeClient } from "@/services/api.athome"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaPen } from "react-icons/fa6"
import { useAPICall } from "@/hooks/apicall"

type Address = {
  id: string
  tag: string
  location: { lat: number; lng: number }
  address_line1: string
  address_line2: string
  directions: string | null
}

const SelectAddress = () => {
  const router = useRouter()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )
  const [serviceableIds, setServiceableIds] = useState<Set<string>>(new Set())

  const {
    call: getAddressBook,
    loading: loadingAddresses,
    result: addressBookResult,
  } = useAPICall(mockAtHomeClient.getAddressBook)

  const { call: checkServiceability } = useAPICall(
    mockAtHomeClient.checkLocationServiceability,
  )

  useEffect(() => {
    getAddressBook({})
  }, [])

  const addresses: Address[] =
    (addressBookResult?.ok && addressBookResult.value.body.address_book) || []

  useEffect(() => {
    if (addresses.length === 0) return

    const runChecks = async () => {
      for (const address of addresses) {
        const result = await checkServiceability({ location: address.location })

        if (result?.ok && result.value.body.serviceable) {
          setServiceableIds((prev) => {
            if (prev.has(address.id)) return prev
            const next = new Set(prev)
            next.add(address.id)
            return next
          })
        }
      }
    }

    runChecks()
  }, [addresses])

  const handleSelect = (addressId: string) => {
    if (!serviceableIds.has(addressId)) return
    setSelectedAddressId(addressId)
  }

  if (loadingAddresses) {
    return <div className="py-10 text-center">Loading addresses…</div>
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
                ${isSelected ? "border-secondary-1" : "border-gray-300"}
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

                <div className="flex items-center">
                  <FaPen
                    className="mx-3 mt-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(
                        `/user/book-appointment/update-address?addressId=${address.id}`,
                      )
                    }}
                  />

                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white ${
                      isServiceable ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    {isServiceable ? "Serviceable" : "Unserviceable"}
                  </span>
                </div>
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
          className="rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Address
        </button>
      </div>
    </div>
  )
}

export default SelectAddress
