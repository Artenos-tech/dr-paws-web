"use client"

import atHomeApiClient from "@/services/api.athome"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { FaPen, FaTrash } from "react-icons/fa6"
import { useAPICall } from "@/hooks/apicall"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { AddressWithPincode } from "@/model/typeDefinitions"
import { Tooltip } from "antd"
import DeleteModal from "./DeleteModal"

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
  } = useAPICall(atHomeApiClient.getAddressBook)

  const { call: deleteAddress, loading: deletingAddress } = useAPICall(
    atHomeApiClient.deleteAddress,
  )
  const router = useRouter()

  const searchParams = useSearchParams()
  const initialAddressId = searchParams.get("addressId")

  const addresses: AddressWithPincode[] =
    (addressBookResult?.ok && addressBookResult.value.body.data.address_book) ||
    []

  const uncheckedAddresses = useMemo(() => {
    return addresses.filter((addr) => !checkedAddressIds.has(addr.id))
  }, [addresses, checkedAddressIds])

  console.log("SELECTED ADDRESS ID", selectedAddressId)
  console.log("SERVICEABLE IDS", serviceableIds)
  console.log("CHECKED ADDRESS IDS", checkedAddressIds)
  console.log("checkingServiceability", checkingServiceability)

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
              const result = await atHomeApiClient.checkLocationServiceability(
                { location: address.location },
                { abortSignal: abortController.signal },
              )
              console.log("SERVICEABILITY CHECK: ", result)
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

  const unserviceableToolTipMessage =
    "This location is currently outside our serviceable area"

  return (
    <div className="space-y-4 pb-12">
      <h1 className="text-2xl">
        Let&apos;s check if your address is within range
      </h1>
      <p className="text-gray-600 mb-12">Add or select an address</p>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No addresses yet. Add one to get started.
          </p>
          <div className="rounded-lg p-2 flex flex-col items-center justify-center">
            <div
              onClick={() => router.push(`/user/book-appointment/edit-address`)}
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-dashed cursor-pointer"
            >
              <span className="text-2xl font-semibold">+</span>
            </div>
            <span className="font-medium mt-1">Add</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 py-4 gap-4 overflow-x-auto lg:w-4/5 lg:mx-auto">
          {addresses.map((address) => {
            const isServiceable = serviceableIds.has(address.id)
            const isSelected = selectedAddressId === address.id
            const isChecking =
              checkingServiceability && !checkedAddressIds.has(address.id)
            const fullAddress = `${address.address_line1},${address.address_line2}`

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
                      <>
                        {isServiceable ? (
                          <span className="text-xs px-3 py-1 rounded-full text-white bg-green-600">
                            Serviceable
                          </span>
                        ) : (
                          <Tooltip
                            title={unserviceableToolTipMessage}
                            color="#f7f1de"
                            styles={{ body: { color: "#33495f" } }}
                          >
                            <span className="text-xs px-3 py-1 rounded-full text-white bg-red-500 cursor-not-allowed">
                              Unserviceable
                            </span>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-500">{fullAddress}</p>
              </div>
            )
          })}

          <div className="rounded-lg p-2 flex flex-col items-center justify-center">
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
        <Tooltip
          title={
            !selectedAddressId
              ? "Select an address to proceed with booking a Home Visit"
              : selectedAddressId && !serviceableIds.has(selectedAddressId)
                ? unserviceableToolTipMessage
                : undefined
          }
          color="#f7f1de"
          styles={{ body: { color: "#33495f" } }}
        >
          <button
            disabled={isConfirmDisabled}
            className="rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleConfirmClick}
          >
            {isConfirming && <ClipLoader size={16} color="#ffffff" />}
            {isConfirming ? "Confirming..." : "Confirm Address"}
          </button>
        </Tooltip>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        loading={deletingAddress}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default SelectAddress
