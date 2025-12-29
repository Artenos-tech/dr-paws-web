"use client"

import AddressForm from "@/components/ui/AddressForm"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { toast, ToastContainer } from "react-toastify"

const DEFAULT_PIN = { lat: 12.97, lng: 77.59 }

const Page = () => {
  const router = useRouter()
  const [pin, setPin] = useState(DEFAULT_PIN)
  const [openForm, setOpenForm] = useState(false)
  const [showUnserviceableModal, setShowUnserviceableModal] = useState(false)
  const [locationDescription, setLocationDescription] = useState("")

  const [addressDetails, setAddressDetails] = useState({
    tag: "",
    addressLine1: "",
    addressLine2: "",
    directions: null as string | null,
  })

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  })

  const { call: checkServiceability, loading: loadingCheck } = useAPICall(
    mockAtHomeClient.checkLocationServiceability,
  )
  const { call: addAddress, loading: loadingAdd } = useAPICall(
    mockAtHomeClient.addAddress,
  )

  if (!isLoaded) return <div>Loading map...</div>

  const setLocation = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const latLng = e.latLng.toJSON()
    setPin(latLng)

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setLocationDescription(results[0].formatted_address)
      }
    })
  }
  const handleAddAddress = async () => {
    if (
      !addressDetails.tag ||
      !addressDetails.addressLine1 ||
      !addressDetails.addressLine2
    ) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      const serviceRes = await checkServiceability({ location: pin })

      if (!serviceRes.ok) {
        toast.error("Unable to check serviceability. Please try again.")
        return
      }

      if (!serviceRes.value.body.serviceable) {
        setShowUnserviceableModal(true)
        return
      }

      const payload = {
        address: {
          tag: addressDetails.tag,
          location: pin,
          address_line1: addressDetails.addressLine1,
          address_line2: addressDetails.addressLine2,
          directions: addressDetails.directions,
        },
      }

      const res = await addAddress(payload)

      if (res.ok) {
        router.replace("/user/book-appointment?home=true")
      } else {
        toast.error("Failed to add address")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const isLoading = loadingCheck || loadingAdd

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
        mapContainerStyle={{ width: "100%", height: "400px" }}
        onClick={setLocation}
      >
        <Marker draggable position={pin} />
      </GoogleMap>
      <div className="w-full mt-3 bg-gray-200 p-2 rounded-lg">
        <p className="text-sm text-gray-600">Selected location</p>
        <p className="text-base font-medium text-gray-900">
          {locationDescription || "Move the marker to update location"}
        </p>
      </div>

      {openForm && (
        <div className="w-full my-5">
          <h1 className="text-xl font-semibold">Fill Address Details</h1>
          <AddressForm
            addressDetails={addressDetails}
            setAddressDetails={setAddressDetails}
          />
        </div>
      )}

      <button
        onClick={() => (openForm ? handleAddAddress() : setOpenForm(true))}
        disabled={isLoading}
        className="mt-8 rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : openForm ? "Save" : "Confirm"}
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
