"use client"

import AddressForm from "@/components/ui/AddressForm"
import UnserviceableModal from "@/components/ui/UnserviceableModal"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { useJsApiLoader } from "@react-google-maps/api"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { AddressFormValues } from "@/model/typeDefinitions"
import MapSearchBar from "@/components/ui/MapSearchBar"
import AddressMap from "@/components/ui/AddressMap"

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
  const [pincode, setPincode] = useState<string | null>(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)
  const [searchText, setSearchText] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  const [addressDetails, setAddressDetails] = useState<AddressFormValues>({
    tag: "",
    address_line1: "",
    address_line2: "",
    directions: undefined,
  })

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const { call: checkServiceability, loading: loadingCheck } = useAPICall(
    atHomeApiClient.checkLocationServiceability,
  )
  const { call: addAddress, loading: loadingAdd } = useAPICall(
    atHomeApiClient.addAddress,
  )
  const { call: updateAddress, loading: loadingUpdate } = useAPICall(
    atHomeApiClient.updateAddress,
  )
  const { call: getAddress, loading: loadingGet } = useAPICall(
    atHomeApiClient.getAddress,
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const onPlaceChanged = () => {
    if (!autocomplete) return

    const place = autocomplete.getPlace()

    if (!place.geometry?.location) {
      toast.error("Please select a valid location")
      return
    }

    const latLng = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }

    setPin(latLng)
    reverseGeocode(latLng)
    setSearchText("")
    setShowSearch(false)
  }

  const reverseGeocode = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status !== "OK" || !results?.[0]) return

      const result = results[0]

      setLocationDescription(result.formatted_address)

      const postalComponent = result.address_components.find((component) =>
        component.types.includes("postal_code"),
      )

      if (postalComponent?.long_name) {
        setPincode(postalComponent.long_name)
      } else {
        setPincode((prev) => {
          if (prev !== null) {
            toast.error("Unable to detect pincode for this location")
          }
          return null
        })
      }
    })
  }

  useEffect(() => {
    if (!isEditMode || !addressId) return

    const fetchAddress = async () => {
      try {
        const res = await getAddress({ addressid: addressId })

        if (!res.ok) {
          toast.error(res.error.message)
          return
        }

        const address = res.value.body.data.address

        setAddressDetails({
          tag: address.tag,
          address_line1: address.address_line1,
          address_line2: address.address_line2,
          directions: address.directions,
        })

        setPincode(address.pincode)

        if (address.location) {
          const newPin = {
            lat: address.location.lat,
            lng: address.location.long,
          }
          setPin(newPin)
          reverseGeocode(newPin)
        }
      } catch (err) {
        console.error(err)
        toast.error("Something went wrong while fetching address")
      }
    }

    fetchAddress()
  }, [isEditMode, addressId])

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
    if (!isPinSelected) {
      setIsPinSelected(true)
      return
    }

    const { tag, address_line1, address_line2 } = addressDetails

    if (!tag || !address_line1 || !address_line2) {
      toast.error("Please fill all required fields")
      return
    }

    if (!pincode) {
      toast.error("Unable to determine pincode. Please retry.")
      return
    }

    try {
      const serviceRes = await checkServiceability({
        location: { lat: pin.lat, long: pin.lng },
      })

      const payload = {
        tag,
        location: { lat: pin.lat, long: pin.lng },
        address_line1: address_line1,
        address_line2: address_line2,
        directions: addressDetails.directions,
      }

      const res = isEditMode
        ? await updateAddress({ addressid: addressId!, address: payload })
        : await addAddress({ address: payload })

      if (!res.ok) {
        if (res.error.status) toast.error(res.error.message)
        return
      }

      toast.success(
        isEditMode
          ? "Address updated successfully"
          : "Address saved successfully",
      )
      if (serviceRes.ok && !serviceRes.value.body.data.serviceable) {
        setShowUnserviceableModal(true)
        return
      }

      const newAddressId = res.value.body.data.address?.id || addressId

      // setTimeout(() => {
      router.replace(
        `/user/book-appointment?home=true&addressId=${newAddressId}`,
      )
      // }, 800)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const isPageLoading = !isLoaded || (isEditMode && loadingGet)
  const isSubmitting = loadingAdd || loadingUpdate || loadingCheck

  const shouldDisableButton = isSubmitting || (isPinSelected && !isFormValid)

  const mapOptions = {
    disableDefaultUI: showSearch && isMobileOrTablet,
    zoomControl: true,
    fullscreenControl: true,
  }

  if (isLoaded && !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    toast.error("Google Maps API key not configured")
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

      {isPageLoading ? (
        <div className="flex justify-center items-center my-20">
          <ClipLoader color="#33495f" />
        </div>
      ) : (
        <>
          <MapSearchBar
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchText={searchText}
            setSearchText={setSearchText}
            setAutocomplete={setAutocomplete}
            onPlaceChanged={onPlaceChanged}
          />

          <AddressMap
            pin={pin}
            setLocation={setLocation}
            mapOptions={mapOptions}
          />

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
                pincode={pincode}
                onValidityChange={setIsFormValid}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={shouldDisableButton}
            className="my-10 rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
