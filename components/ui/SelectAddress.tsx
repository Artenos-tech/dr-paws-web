"use client"

import { mockAtHomeClient } from "@/services/api.athome"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa6"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"
import toast, { Toaster } from "react-hot-toast"
import Modal from "react-modal"

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

  const { loading: serviceabilityLoading } = useAPICall(
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
      const next = new Set<string>()

      await Promise.all(
        addresses.map(async (address) => {
          const result = await mockAtHomeClient.checkLocationServiceability({
            location: address.location,
          })

          if (result?.ok && result.value.body.data.serviceable) {
            next.add(address.id)
          }
        }),
      )

      setServiceableIds(next)
    }

    runChecks()
  }, [addresses])

  const handleSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
  }

  const handleDeleteClick = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAddressToDelete(addressId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return

    const result = await deleteAddress({ addressid: addressToDelete })

    if (result?.ok) {
      await getAddressBook({})
      if (selectedAddressId === addressToDelete) {
        setSelectedAddressId(null)
      }
      toast.success("Address deleted successfully")
    } else {
      toast.error("Failed to delete address")
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
      <Toaster position="top-right" />

      <h1 className="text-xl font-semibold">
        {"Let's check if your address is within range"}
      </h1>
      <p className="text-gray-600">Add or select your address</p>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 overflow-x-auto">
        {addresses.map((address) => {
          const isServiceable = serviceableIds.has(address.id)
          const isSelected = selectedAddressId === address.id

          return (
            <div
              key={address.id}
              onClick={() => handleSelect(address.id)}
              className={`border-2 rounded-lg p-4 transition cursor-pointer ${
                isSelected ? "border-secondary-1" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold primary-text">{address.tag}</h2>

                <div className="flex items-center gap-2">
                  <FaPen
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(
                        `/user/book-appointment/edit-address?addressId=${address.id}`,
                      )
                    }}
                  />
                  <FaTrash
                    className="cursor-pointer"
                    onClick={(e) => handleDeleteClick(address.id, e)}
                  />

                  {serviceabilityLoading ? (
                    <ClipLoader size={12} color="#33495f" />
                  ) : (
                    <span
                      className={`text-xs px-3 py-1 rounded-full text-white ${
                        isServiceable ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      {isServiceable ? "Serviceable" : "Unserviceable"}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {address.address_line1}
              </p>
            </div>
          )
        })}

        <div className="rounded-lg p-4 flex flex-col items-center justify-center">
          <div
            onClick={() => router.push(`/user/book-appointment/edit-address`)}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-dashed cursor-pointer"
          >
            <span className="text-2xl font-semibold">+</span>
          </div>
          <span className="font-medium mt-1">Add</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          disabled={
            !selectedAddressId || !serviceableIds.has(selectedAddressId)
          }
          className="rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50"
        >
          Confirm Address
        </button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onRequestClose={handleCancelDelete}
        shouldCloseOnOverlayClick={!deletingAddress}
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 outline-none"
      >
        <h3 className="text-lg font-semibold mb-2">Delete address?</h3>
        <p className="text-sm text-gray-600 mb-6">
          This action cannot be undone. Are you sure?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancelDelete}
            disabled={deletingAddress}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={deletingAddress}
            className="px-4 py-2 rounded-lg bg-red-600 text-white"
          >
            {deletingAddress ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectAddress
