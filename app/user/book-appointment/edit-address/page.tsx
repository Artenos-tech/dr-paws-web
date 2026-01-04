"use client"

import AddressForm from "@/components/ui/AddressForm"
import UnserviceableModal from "@/components/ui/UnserviceableModal"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { ClipLoader } from "react-spinners"
import { toast, ToastContainer } from "react-toastify"

const DEFAULT_PIN = { lat: 12.97, lng: 77.59 }

const AddressPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addressId = searchParams.get("addressId")

  const isEditMode = Boolean(addressId)

  const [pin, setPin] = useState(DEFAULT_PIN)
  const [isPinSelected, setIsPinSelected] = useState(false)
  const [locationDescription, setLocationDescription] = useState("")
  const [showUnserviceableModal, setShowUnserviceableModal] = useState(false)

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
  const { call: updateAddress, loading: loadingUpdate } = useAPICall(
    mockAtHomeClient.updateAddress,
  )
  const { call: getAddress, loading: loadingGet } = useAPICall(
    mockAtHomeClient.getAddress,
  )

  const reverseGeocode = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setLocationDescription(results[0].formatted_address)
      }
    })
  }

  useEffect(() => {
    if (!isEditMode || !isLoaded) return

    const fetchAddress = async () => {
      const res = await getAddress({ addressid: addressId! })
      if (!res.ok) return

      const address = res.value.body.data.address_book

      setAddressDetails({
        tag: address.tag,
        addressLine1: address.address_line1,
        addressLine2: address.address_line2,
        directions: address.directions || null,
      })

      const newPin = {
        lat: address.location.lat,
        lng: address.location.long,
      }

      setPin(newPin)
      reverseGeocode(newPin)
    }

    fetchAddress()
  }, [isEditMode, isLoaded])

  useEffect(() => {
    if (isLoaded && !isEditMode) {
      reverseGeocode(pin)
    }
  }, [isLoaded])

  const setLocation = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const latLng = e.latLng.toJSON()
    setPin(latLng)
    reverseGeocode(latLng)
  }

  const handleSubmit = async () => {
    if (isPinSelected === false) {
      setIsPinSelected(true)
      return
    }

    const { tag, addressLine1, addressLine2 } = addressDetails

    if (!tag || !addressLine1 || !addressLine2) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      const serviceRes = await checkServiceability({
        location: { lat: pin.lat, long: pin.lng },
      })

      const payload = {
        tag,
        location: { lat: pin.lat, long: pin.lng },
        address_line1: addressLine1,
        address_line2: addressLine2,
        pincode: 123456,
        directions: addressDetails.directions,
      }

      const res = isEditMode
        ? await updateAddress({ addressid: addressId!, address: payload })
        : await addAddress({ address: payload })

      if (!res.ok) {
        toast.error("Failed to save address")
        return
      }

      if (!serviceRes.ok || !serviceRes.value.body.data.serviceable) {
        setShowUnserviceableModal(true)
        return
      }

      const newAddressId = res.value.body.data.address?.id || addressId

      router.replace(
        `/user/book-appointment?home=true&addressId=${newAddressId}`,
      )
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const isPageLoading = !isLoaded || (isEditMode && loadingGet)
  const isSubmitting = loadingAdd || loadingUpdate || loadingCheck

  const isFormValid =
    Boolean(addressDetails.tag) &&
    Boolean(addressDetails.addressLine1) &&
    Boolean(addressDetails.addressLine2)

  const shouldDisableButton = isSubmitting || (isPinSelected && !isFormValid)

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
        <div className="flex justify-center items-center my-20">
          <ClipLoader color="#33495f" />
        </div>
      ) : (
        <>
          <GoogleMap
            center={pin}
            zoom={19}
            mapContainerStyle={{ width: "100%", height: "400px" }}
            onClick={setLocation}
          >
            <Marker draggable position={pin} onDragEnd={setLocation} />
          </GoogleMap>

          <div className="w-full mt-3 bg-gray-200 p-2 rounded-lg">
            <p className="text-sm text-gray-600">Selected location</p>
            <p className="text-base font-medium text-gray-900">
              {locationDescription || "Move the marker to update location"}
            </p>
          </div>

          {isPinSelected && (
            <div className="w-full my-5">
              <h1 className="text-xl font-semibold">
                {isEditMode ? "Update Address Details" : "Fill Address Details"}
              </h1>
              <AddressForm
                addressDetails={addressDetails}
                setAddressDetails={setAddressDetails}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={shouldDisableButton}
            className="my-10 rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50"
          >
            {isPinSelected
              ? isSubmitting
                ? "Processing..."
                : isEditMode
                  ? "Update"
                  : "Save"
              : "Confirm"}
          </button>
        </>
      )}

      <ToastContainer position="top-right" />

      {showUnserviceableModal && (
        <UnserviceableModal
          isOpen={showUnserviceableModal}
          onClose={() => setShowUnserviceableModal(false)}
        />
      )}
    </main>
  )
}

export default AddressPage
