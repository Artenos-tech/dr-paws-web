"use client"
import { useAPICall } from "@/hooks/apicall"
import { AddressWithPincode } from "@/model/typeDefinitions"
import atHomeApiClient from "@/services/api.athome"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaPen, FaTrash } from "react-icons/fa6"
import { ClipLoader } from "react-spinners"
import DeleteModal from "@/components/ui/DeleteModal"
import { useAPIErrorToastFromResult } from "@/hooks/useAPIErrorToast"

const MyAddressBookPage = () => {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)

  const {
    call: getAddressBook,
    result: getAddressBookResult,
    loading: getAddressBookLoading,
  } = useAPICall(atHomeApiClient.getAddressBook)

  const { call: deleteAddress, loading: deleteAddressLoading } = useAPICall(
    atHomeApiClient.deleteAddress,
  )

  useEffect(() => {
    getAddressBook({})
  }, [])

  const addresses: AddressWithPincode[] =
    (getAddressBookResult?.ok &&
      getAddressBookResult.value.body.data.address_book) ||
    []
    useAPIErrorToastFromResult(getAddressBookResult,{fallbackMessage:'Failed to fetch address book'})

  if (getAddressBookLoading) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  const handleDeleteClick = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAddressToDelete(addressId)
    setShowDeleteModal(true)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setAddressToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return

    const result = await deleteAddress({ addressid: addressToDelete })

    if (result?.ok) {
      await getAddressBook({})
      toast.success("Address deleted successfully")
    } else {
      toast.error("Failed to delete address")
    }

    setShowDeleteModal(false)
    setAddressToDelete(null)
  }

  return (
    <div className="font-roca h-full w-full">
      <main className="flex flex-col items-center w-full mt-4 px-8 md:px-32 lg:px-20 xl:px-40">
        <h1 className="text-2xl self-start">My Address Book</h1>

        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No addresses yet. Add one to get started.
            </p>
            <div className="rounded-lg p-2 flex flex-col items-center justify-center">
              <div
                onClick={() => router.push("/user/my-address-book/address")}
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-dashed cursor-pointer hover:border-secondary-1 transition"
              >
                <span className="text-2xl font-semibold">+</span>
              </div>
              <span className="font-medium mt-1">Add</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 py-4 gap-4 overflow-x-auto lg:w-4/5 lg:mx-auto">
            {addresses.map((address) => {
              const fullAddress = `${address.address_line1}, ${address.address_line2}`

              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(
                      `/user/my-address-book/address?addressId=${address.id}`,
                    )
                  }}
                  key={address.id}
                  className="border-2 rounded-lg p-4 transition cursor-pointer hover:border-secondary-1"
                >
                  <div className="flex justify-between items-start">
                    <h2 className="font-semibold primary-text">
                      {address.tag}
                    </h2>

                    <div className="flex items-center gap-2">
                      <FaPen
                        className="cursor-pointer hover:text-secondary-1 transition"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(
                            `/user/my-address-book/address?addressId=${address.id}&mode=edit`,
                          )
                        }}
                      />
                      <FaTrash
                        className="cursor-pointer hover:text-red-600 transition"
                        onClick={(e) => handleDeleteClick(address.id, e)}
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">{fullAddress}</p>
                </div>
              )
            })}

            <div className="rounded-lg p-2 flex flex-col items-center justify-center">
              <div
                onClick={() => router.push("/user/my-address-book/address")}
                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-dashed cursor-pointer hover:border-secondary-1 transition"
              >
                <span className="text-2xl font-semibold">+</span>
              </div>
              <span className="font-medium mt-1">Add</span>
            </div>
          </div>
        )}

        <DeleteModal
          isOpen={showDeleteModal}
          loading={deleteAddressLoading}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </div>
  )
}

export default MyAddressBookPage
