"use client"

import apiAthome, { mockAtHomeClient } from "@/services/api.athome"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useState } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { toast, ToastContainer } from "react-toastify"

const DEFAULT_PIN = { lat: 12.97, lng: 77.59 }
const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addressId = searchParams.get("addressId")
  const [pin, setPin] = useState(DEFAULT_PIN)
  const [showUnserviceableModal, setShowUnserviceableModal] = useState(false)

  const [addressDetails, setAddressDetails] = useState({
    tag: "",
    addressLine1: "",
    addressLine2: "",
    directions: null as string | null,
  })

  useEffect(() => {
    fetchAddress()
  }, [addressId])
  const fetchAddress = async () => {
    if (!addressId) return
    const res = await mockAtHomeClient.getAddress({ addressid: addressId })
    if (res.ok) {
      const address = res.value.body.address_book
      setAddressDetails({
        tag: address.tag,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2,
        directions: address.directions,
      })
      setPin(address.location)
    }
  }
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ["places"],
  })

  if (!isLoaded) {
    return <div>Loading map...</div>
  }
  const setLocation = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) setPin(e.latLng?.toJSON())
  }

  const handleUpdateAddress = async () => {
    if (
      !addressDetails.addressLine1 ||
      !addressDetails.addressLine2 ||
      !addressDetails.tag ||
      !addressId
    ) {
      toast.error("Please fill all required fields")
      return
    }

    const serviceRes = await mockAtHomeClient.checkLocationServiceability({
      location: pin,
    })

    if (!serviceRes.ok) {
      toast.error("Sorry, your location is too far for home visit", {
        autoClose: 5000,
      })
      return
    }

    if (!serviceRes.value.body.serviceable) {
      setShowUnserviceableModal(true)
      return
    }

    const payload = {
      addressid: addressId,
      address: {
        tag: addressDetails.tag,
        location: pin,
        address_line1: addressDetails.addressLine1,
        address_line2: addressDetails.addressLine2,
        directions: addressDetails.directions,
      },
    }

    const res = await mockAtHomeClient.updateAddress(payload)

    if (res.ok) {
      router.replace("/user/book-appointment?home=true")
    } else {
      toast.error("Failed to add address")
    }
  }

  return (
    <main className="flex flex-col items-center w-full my-4 px-8 md:px-32 lg:px-20 xl:px-40">
      <button
        type="button"
        onClick={() => router.replace("/user/book-appointment?home=true")}
        className="flex gap-1 mb-4 items-center self-start"
      >
        <MdOutlineKeyboardArrowLeft /> Back
      </button>

      <GoogleMap
        center={pin}
        zoom={20}
        mapContainerStyle={{
          width: "100%",
          height: "400px",
        }}
        onClick={(e) => setLocation(e)}
      >
        <Marker draggable={true} position={pin} />
      </GoogleMap>

      <div className="w-full my-5">
        <h1 className="text-xl font-semibold">Update Address Details</h1>
        <div className="mt-6 w-full flex flex-wrap gap-4">
          <input
            type="text"
            value={addressDetails.addressLine1}
            onChange={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                addressLine1: e.target.value,
              }))
            }
            placeholder="Address line 1"
            className="flex-1 min-w-[200px] border border-secondary-1  rounded-lg px-4 py-2"
          />

          <input
            type="text"
            value={addressDetails.addressLine2}
            onChange={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                addressLine2: e.target.value,
              }))
            }
            placeholder="Address line 2"
            className="flex-1 min-w-[200px] border border-secondary-1  rounded-lg px-4 py-2"
          />

          <input
            type="text"
            value={addressDetails.directions ?? ""}
            onChange={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                directions: e.target.value,
              }))
            }
            placeholder="Directions (optional)"
            className="flex-1 min-w-[200px] border border-secondary-1  rounded-lg px-4 py-2"
          />

          <input
            type="text"
            value={addressDetails.tag}
            onChange={(e) =>
              setAddressDetails((prev) => ({
                ...prev,
                tag: e.target.value,
              }))
            }
            placeholder="Tag (Home, Office etc)"
            className="flex-1 min-w-[160px] border border-secondary-1  rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <button
        onClick={() => {
          handleUpdateAddress()
        }}
        className="mt-8 rounded-full px-8 py-3 bg-secondary-1 text-white"
      >
        Update
      </button>

      <ToastContainer position="top-right" />
      {showUnserviceableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              Location not serviceable
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Sorry, your location is too far for a home visit.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 rounded-full px-4 py-2 bg-secondary-1 text-white"
                onClick={() => {
                  setShowUnserviceableModal(false)
                  router.replace("/user/book-appointment?clinic=true")
                }}
              >
                Book clinic visit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Page
