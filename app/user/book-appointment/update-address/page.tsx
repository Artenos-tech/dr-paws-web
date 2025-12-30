"use client"

import AddressForm from "@/components/ui/AddressForm"
import UnserviceableModal from "@/components/ui/UnserviceableModal"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useRouter, useSearchParams } from "next/navigation"
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

  const reverseGeocode = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setLocationDescription(results[0].formatted_address)
      }
    })
  }

  const { call: checkServiceability, loading: loadingCheck } = useAPICall(
    mockAtHomeClient.checkLocationServiceability,
  )
  const { call: getAddress, loading: loadingGet } = useAPICall(
    mockAtHomeClient.getAddress,
  )
  const { call: updateAddress, loading: loadingUpdate } = useAPICall(
    mockAtHomeClient.updateAddress,
  )
  useEffect(() => {
    fetchAddress()
  }, [addressId, isLoaded])

  const fetchAddress = async () => {
    if (!addressId || !isLoaded) return
    const res = await getAddress({ addressid: addressId })
    if (res.ok) {
      const address = res.value.body.data.address_book
      setAddressDetails({
        tag: address.tag,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2,
        directions: address.directions || null,
      })
      setPin({
        lat: address.location.lat,
        lng: address.location.long,
      })

      reverseGeocode({
        lat: address.location.lat,
        lng: address.location.long,
      })
    }
  }

  const setLocation = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const latLng = e.latLng.toJSON()
    setPin(latLng)
    reverseGeocode(latLng)
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

    try {
      const serviceRes = await checkServiceability({
        location: { lat: pin.lat, long: pin.lng },
      })

      const payload = {
        addressid: addressId,
        address: {
          tag: addressDetails.tag,
          location: { lat: pin.lat, long: pin.lng },
          address_line1: addressDetails.addressLine1,
          address_line2: addressDetails.addressLine2,
          pincode: 560000,
          directions: addressDetails.directions || null,
        },
      }

      const res = await updateAddress(payload)

      if (!res.ok) {
        toast.error("Failed to update address")
        return
      }

      if (!serviceRes.ok || !serviceRes.value.body.data.serviceable) {
        setShowUnserviceableModal(true)
        return
      }

      router.replace("/user/book-appointment?home=true")
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const isPageLoading = loadingGet || !isLoaded || !addressId

  return (
    <main className="flex flex-col items-center w-full my-4 px-8 md:px-32 lg:px-20 xl:px-40">
      <button
        type="button"
        onClick={() => router.replace("/user/book-appointment?home=true")}
        className="flex gap-1 mb-4 items-center self-start"
      >
        <MdOutlineKeyboardArrowLeft /> Back
      </button>

      {isPageLoading ? (
        <div className="text-center py-10">Loading address details...</div>
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

          <div className="w-full my-5">
            <h1 className="text-xl font-semibold">Update Address Details</h1>
            <AddressForm
              addressDetails={addressDetails}
              setAddressDetails={setAddressDetails}
            />
          </div>

          <button
            onClick={handleUpdateAddress}
            disabled={loadingCheck || loadingUpdate}
            className="mt-8 rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50"
          >
            {loadingUpdate ? "Updating..." : "Update"}
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
