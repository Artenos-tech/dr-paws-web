"use client"

import AddressForm from "@/components/ui/AddressForm"
import UnserviceableModal from "@/components/ui/UnserviceableModal"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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

  const setLocation = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const latLng = e.latLng.toJSON()
    setPin(latLng)
    reverseGeocode(latLng)
  }

  const reverseGeocode = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setLocationDescription(results[0].formatted_address)
      }
    })
  }

  useEffect(() => {
    if (!isLoaded) return
    reverseGeocode(pin)
  }, [isLoaded])

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

      if (!res.ok) {
        toast.error("Failed to add address")
        return
      }

      const newAddressId = res.value?.body?.address?.id

      if (serviceRes.ok && !serviceRes.value.body.serviceable) {
        setShowUnserviceableModal(true)
        return
      }

      router.replace(
        `/user/book-appointment?home=true&addressId=${newAddressId}`,
      )
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

      {!isLoaded ? (
        <div>Loading map...</div>
      ) : (
        <>
          <GoogleMap
            center={pin}
            zoom={20}
            mapContainerStyle={{ width: "100%", height: "400px" }}
            onClick={setLocation}
          >
            <Marker
              draggable
              position={pin}
              onDragEnd={(e) => setLocation(e)}
            />
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
            className="mt-8 rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50"
          >
            {isLoading ? "Processing..." : openForm ? "Save" : "Confirm"}
          </button>
        </>
      )}

      <ToastContainer position="top-right" />

      {showUnserviceableModal && (
        <UnserviceableModal onClose={() => setShowUnserviceableModal(false)} />
      )}
    </main>
  )
}

export default Page
