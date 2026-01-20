"use client"

import AddressForm from "@/components/ui/AddressForm"
import UnserviceableModal from "@/components/ui/UnserviceableModal"
import MapSearchBar from "@/components/ui/MapSearchBar"
import AddressMap from "@/components/ui/AddressMap"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import { FaPen, FaEye } from "react-icons/fa6"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { AddressFormValues } from "@/model/typeDefinitions"
import { useJsApiLoader } from "@react-google-maps/api"

const DEFAULT_PIN = { lat: 12.97, lng: 77.59 }

type PageMode = "add" | "view" | "edit"

const AddressPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addressId = searchParams.get("addressId")

  const modeParam = searchParams.get("mode") as PageMode | null

  const initialMode: PageMode = addressId
    ? modeParam === "edit"
      ? "edit"
      : "view"
    : "add"

  const [mode, setMode] = useState<PageMode>(initialMode)

  const [addStep, setAddStep] = useState<1 | 2>(1)

  const isAddMode = mode === "add"
  const isViewMode = mode === "view"
  const isEditMode = mode === "edit"
  const isEditable = isAddMode || isEditMode

  const [pin, setPin] = useState(DEFAULT_PIN)
  const [isPinSelected, setIsPinSelected] = useState(false)
  const [locationDescription, setLocationDescription] = useState("")
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
      const postalComponent = result.address_components.find((c) =>
        c.types.includes("postal_code"),
      )
      setPincode(postalComponent?.long_name || null)
    })
  }

  useEffect(() => {
    if (!addressId) return
    const fetchAddress = async () => {
      const res = await getAddress({ addressid: addressId })
      if (!res.ok) {
        toast.error("Failed to load address")
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
      const newPin = {
        lat: address.location.lat,
        lng: address.location.long,
      }
      setPin(newPin)
      reverseGeocode(newPin)
    }
    fetchAddress()
  }, [addressId])

  useEffect(() => {
    if (isLoaded && !addressId) {
      reverseGeocode(pin)
    }
  }, [isLoaded])

  const setLocation = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !isEditable) return
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
    if (!tag || !address_line1 || !address_line2 || !pincode) {
      toast.error("Please fill all required fields")
      return
    }

    const payload = {
      tag,
      location: { lat: pin.lat, long: pin.lng },
      address_line1,
      address_line2,
      directions: addressDetails.directions,
    }
    const res = isAddMode
      ? await addAddress({ address: payload })
      : await updateAddress({ addressid: addressId!, address: payload })
    if (!res.ok) {
      toast.error("Failed to save address")
      return
    }
    toast.success(isAddMode ? "Address saved" : "Address updated")

    setMode("view")
  }

  const mapOptions = {
    draggable: isEditable,
    zoomControl: true,
    fullscreenControl: true,
    disableDefaultUI: showSearch && isMobileOrTablet,
  }

  const isPageLoading = !isLoaded || loadingGet
  const isSubmitting = loadingAdd || loadingUpdate

  return (
    <main className="flex flex-col items-center w-full my-4 px-8 md:px-32 lg:px-20 xl:px-40">
      <div className="flex w-full justify-between items-center mb-4">
        <button
          onClick={() => router.replace("/user/my-address-book")}
          className="flex gap-1 items-center"
        >
          <MdOutlineKeyboardArrowLeft /> Back
        </button>

        {isViewMode && (
          <FaPen
            onClick={() => setMode("edit")}
            className="cursor-pointer text-secondary-1"
          />
        )}

        {isEditMode && (
          <FaEye
            onClick={() => setMode("view")}
            className="cursor-pointer text-secondary-1"
          />
        )}
      </div>

      {isPageLoading ? (
        <div className="flex justify-center items-center my-20">
          <ClipLoader color="#33495f" />
        </div>
      ) : (
        <>
          {isEditable && (
            <MapSearchBar
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              searchText={searchText}
              setSearchText={setSearchText}
              setAutocomplete={setAutocomplete}
              onPlaceChanged={onPlaceChanged}
            />
          )}

          <AddressMap
            pin={pin}
            setLocation={setLocation}
            mapOptions={mapOptions}
          />
          {(isAddMode || isEditMode) && (
            <div className="w-full mt-3 bg-gray-200 p-2 rounded-lg">
              <p className="text-sm text-gray-600">Selected location</p>
              <p className="text-base font-medium text-gray-900">
                {locationDescription || "Move or search on map"}
              </p>
            </div>
          )}

          {isAddMode && addStep === 1 && (
            <button
              onClick={() => setAddStep(2)}
              className="my-10 rounded-full px-8 py-3 bg-secondary-1 text-white"
            >
              Confirm Location
            </button>
          )}

          {(isEditMode || (isAddMode && addStep === 2)) && (
            <>
              <div className="w-full my-5">
                <AddressForm
                  addressDetails={addressDetails}
                  setAddressDetails={setAddressDetails}
                  pincode={pincode}
                  onValidityChange={setIsFormValid}
                  readOnly={false}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                className="my-10 rounded-full px-8 py-3 bg-secondary-1 text-white disabled:opacity-50"
              >
                {isSubmitting
                  ? isAddMode
                    ? "Saving..."
                    : "Updating..."
                  : isAddMode
                    ? "Save"
                    : "Update"}
              </button>
            </>
          )}

          {isViewMode && (
            <div className="w-full my-5">
              <AddressForm
                addressDetails={addressDetails}
                setAddressDetails={setAddressDetails}
                pincode={pincode}
                onValidityChange={() => {}}
                readOnly
              />
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default AddressPage
