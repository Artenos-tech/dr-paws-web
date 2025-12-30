"use client"

import { mockAtHomeClient } from "@/services/api.athome"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa6"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"

type Address = {
  id: string
  tag: string
  location: { lat: number; long: number }
  address_line1: string
  address_line2: string
  directions?: string | null
}

const SelectAddress = () => {
  const router = useRouter()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )
  const [serviceableIds, setServiceableIds] = useState<Set<string>>(new Set())
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)

  const {
    call: getAddressBook,
    loading: loadingAddresses,
    result: addressBookResult,
  } = useAPICall(mockAtHomeClient.getAddressBook)

  const { call: checkServiceability } = useAPICall(
    mockAtHomeClient.checkLocationServiceability,
  )

  const { call: deleteAddress, loading: deletingAddress } = useAPICall(
    mockAtHomeClient.deleteAddress,
  )

  const searchParams = useSearchParams()
  const initialAddressId = searchParams.get("addressId")

  useEffect(() => {
    if (initialAddressId) {
      setSelectedAddressId(initialAddressId)
    }
  }, [initialAddressId])
  useEffect(() => {
    getAddressBook({})
  }, [])

  const addresses: Address[] =
    (addressBookResult?.ok && addressBookResult.value.body.data.address_book) ||
    []

  useEffect(() => {
    if (addresses.length === 0) return

    const runChecks = async () => {
      for (const address of addresses) {
        const result = await checkServiceability({ location: address.location })

        if (result?.ok && result.value.body.data.serviceable) {
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

  const handleDeleteClick = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!serviceableIds.has(addressId)) return
    setAddressToDelete(addressId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return

    const result = await deleteAddress({ addressid: addressToDelete })

    if (result?.ok) {
      getAddressBook({})
      if (selectedAddressId === addressToDelete) {
        setSelectedAddressId(null)
      }
    }

    setShowDeleteModal(false)
    setAddressToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setAddressToDelete(null)
  }

  if (loadingAddresses) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="space-y-8 py-10">
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this address?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={deletingAddress}
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={deletingAddress}
              >
                {deletingAddress ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <div className="relative group">
                    <FaPen
                      className={`mx-1 mt-1 ${isServiceable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isServiceable) return
                        router.push(
                          `/user/book-appointment/update-address?addressId=${address.id}`,
                        )
                      }}
                    />
                    {isServiceable && (
                      <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                        Edit
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <FaTrash
                      className={`mx-1 mt-1 ${isServiceable ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                      onClick={(e) => handleDeleteClick(address.id, e)}
                    />
                    {isServiceable && (
                      <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                        Delete
                      </span>
                    )}
                  </div>

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
