"use client"

import { mockAtHomeClient } from "@/services/api.athome"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { FaPen, FaTrash } from "react-icons/fa6"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import Modal from "react-modal"
import { Address } from "@/model/typeDefinitions"

interface SelectAddressProps {
  handleConfirm: (addressId: string) => void
  addressId?: string
}

const SelectAddress = ({ handleConfirm, addressId }: SelectAddressProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addressId || null,
  )
  const [serviceableIds, setServiceableIds] = useState<Set<string>>(new Set())
  const [checkedAddressIds, setCheckedAddressIds] = useState<Set<string>>(
    new Set(),
  )
  const [checkingServiceability, setCheckingServiceability] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const {
    call: getAddressBook,
    loading: loadingAddresses,
    result: addressBookResult,
  } = useAPICall(mockAtHomeClient.getAddressBook)

  const { call: deleteAddress, loading: deletingAddress } = useAPICall(
    mockAtHomeClient.deleteAddress,
  )
  const router = useRouter()

  const searchParams = useSearchParams()
  const initialAddressId = searchParams.get("addressId")

  const addresses: Address[] =
    (addressBookResult?.ok && addressBookResult.value.body.data.address_book) ||
    []

  const uncheckedAddresses = useMemo(() => {
    return addresses.filter((addr) => !checkedAddressIds.has(addr.id))
  }, [addresses, checkedAddressIds])

  useEffect(() => {
    getAddressBook({})
  }, [])

  useEffect(() => {
    if (initialAddressId) {
      setSelectedAddressId(initialAddressId)
    }
  }, [initialAddressId])

  useEffect(() => {
    if (uncheckedAddresses.length === 0) return

    const abortController = new AbortController()
    let isActive = true

    const runChecks = async () => {
      setCheckingServiceability(true)

      try {
        await Promise.all(
          uncheckedAddresses.map(async (address) => {
            if (!isActive || abortController.signal.aborted) return

            try {
              const result = await mockAtHomeClient.checkLocationServiceability(
                { location: address.location },
                { abortSignal: abortController.signal },
              )

              if (!isActive || abortController.signal.aborted) return

              if (result?.ok) {
                setCheckedAddressIds((prev) => new Set(prev).add(address.id))

                if (result.value.body.data.serviceable) {
                  setServiceableIds((prev) => new Set(prev).add(address.id))
                }
              }
            } catch (error) {
              if (
                typeof error === "object" &&
                error !== null &&
                "name" in error &&
                (error as { name: string }).name !== "AbortError"
              ) {
                console.error(
                  `Failed to check serviceability for address ${address.id}:`,
                  error,
                )
              }
            }
          }),
        )
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name: string }).name !== "AbortError"
        ) {
          console.error("Serviceability check error:", error)
        }
      }

      if (isActive && !abortController.signal.aborted) {
        setCheckingServiceability(false)
      }
    }

    runChecks()

    return () => {
      isActive = false
      abortController.abort()
    }
  }, [uncheckedAddresses])

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
      setServiceableIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(addressToDelete)
        return newSet
      })
      setCheckedAddressIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(addressToDelete)
        return newSet
      })
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
  const isConfirmDisabled =
    !selectedAddressId || !serviceableIds.has(selectedAddressId) || isConfirming

  const handleConfirmClick = () => {
    if (!selectedAddressId) return
    setIsConfirming(true)
    handleConfirm(selectedAddressId)
  }

  return (
    <div className="space-y-8 py-10">
      <h1 className="text-xl font-semibold">
        Let&apos;s check if your address is within range
      </h1>
      <p className="text-gray-600 mb-12">Add or select your address</p>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No addresses yet. Add one to get started.
          </p>
          <button
            onClick={() => router.push(`/user/book-appointment/edit-address`)}
            className="rounded-full px-8 py-3 bg-secondary-1 text-white hover:bg-secondary-2 transition"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-x-auto">
          {addresses.map((address) => {
            const isServiceable = serviceableIds.has(address.id)
            const isSelected = selectedAddressId === address.id
            const isChecking =
              checkingServiceability && !checkedAddressIds.has(address.id)

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
                      className="cursor-pointer hover:text-secondary-1 transition"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(
                          `/user/book-appointment/edit-address?addressId=${address.id}`,
                        )
                      }}
                    />
                    <FaTrash
                      className="cursor-pointer hover:text-red-600 transition"
                      onClick={(e) => handleDeleteClick(address.id, e)}
                    />

                    {isChecking ? (
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
      )}

      <div className="flex justify-center mb-10 mt-6">
        <button
          disabled={isConfirmDisabled}
          className="rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleConfirmClick}
        >
          {isConfirming && <ClipLoader size={16} color="#ffffff" />}
          {isConfirming ? "Confirming..." : "Confirm Address"}
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
            className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={deletingAddress}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deletingAddress && <ClipLoader size={14} color="#ffffff" />}
            {deletingAddress ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SelectAddress
