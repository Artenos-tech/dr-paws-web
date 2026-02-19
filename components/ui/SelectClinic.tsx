"use client"

import SelectClinicCard from "./SelectClinicCard"
import CustomButton from "./CustomButton"
import { useEffect, useState } from "react"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"
import { Pet } from "@/context/UserContext"
import { Input, Select } from "antd"

interface SelectClinicProps {
  onNext: () => void // Prop for navigation
  selectedClinic: string | null
  selectedClinicLocation: string | null
  selectedClinicContact: string | null
  handleClinicSelection: (
    clinicId: string,
    location: string,
    contact: string,
    options?: { skipToggle?: boolean },
  ) => void
  selectedPet: Pet
  isGrooming: boolean
}

const SelectClinic: React.FC<SelectClinicProps> = ({
  onNext,
  selectedClinic,
  selectedClinicLocation,
  selectedClinicContact,
  handleClinicSelection,
  selectedPet,
  isGrooming,
}) => {
  const [missingAttributes, setMissingAttributes] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, Array<{ id: string; name: string }>>
  >({})
  const [formData, setFormData] = useState<
    Record<string, { id: string; name: string }>
  >({})
  const [isFormComplete, setIsFormComplete] = useState(false)
  const [clinicSearch, setClinicSearch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    undefined,
  )

  const {
    call: getClinicsForBooking,
    result: getClinicsResult,
    loading: loadingClinics,
  } = useAPICall(api.getClinicsForBooking)
  const { call: getMissingAttributes } = useAPICall(api.getMissingAttributes)
  const { call: getBreeds } = useAPICall(api.getPetBreeds)
  const { call: getSizes } = useAPICall(api.getPetSizes)
  const { call: getCoats } = useAPICall(api.getPetCoats)
  const { call: updatePet } = useAPICall(api.updatePet)

  useEffect(() => {
    getClinicsForBooking({})
  }, [])

  const ATTRIBUTE_OPTIONS_CONFIG = {
    Gender: [
      { id: "MALE", name: "Male" },
      { id: "FEMALE", name: "Female" },
    ],
    Species: [
      { id: "DOG", name: "Dog" },
      { id: "CAT", name: "Cat" },
      { id: "OTHER", name: "Other" },
    ],
  }

  const fetchBreedOptions = async (type: "DOG" | "CAT" | "OTHER") => {
    const res = await getBreeds({ species: type })
    return res.ok
      ? res.value.body.breeds.map(({ id, name }) => ({ id, name }))
      : []
  }

  const getLargestOption = (options: { id: string; name: string }[]) =>
    options.length > 0 ? options[options.length - 1] : null

  const onClinicSelect = async function (clinic: string) {
    setIsFormComplete(false)
    const response = await getMissingAttributes({
      clinicid: clinic,
      petid: selectedPet.id,
      grooming: isGrooming ? "y" : "n",
    })
    if (!response.ok) return
    if (response.value.body.attributes.length === 0) {
      setIsFormComplete(true)
      setMissingAttributes([])
      setShowModal(false)
    } else {
      const missing = response.value.body.attributes as (
        | "Name"
        | "Type"
        | "Breed"
        | "Gender"
        | "Birthday"
        | "Breed size"
        | "Coat size"
        | "Species"
      )[]
      if (!selectedPet.gender) missing.push("Gender")
      if (!selectedPet.type) missing.push("Species")
      const onlyBreedAndCoatMissing = missing.every(
        (attr) => attr === "Breed size" || attr === "Coat size",
      )
      const updatedFormData: typeof formData = { ...formData }
      const updatedOptions: typeof dropdownOptions = {}
      const filteredMissing = []
      for (const attr of missing) {
        if (attr !== "Breed size" && attr !== "Coat size") {
          filteredMissing.push(attr)
          if (
            ATTRIBUTE_OPTIONS_CONFIG[
              attr as keyof typeof ATTRIBUTE_OPTIONS_CONFIG
            ]
          ) {
            updatedOptions[attr] =
              ATTRIBUTE_OPTIONS_CONFIG[
                attr as keyof typeof ATTRIBUTE_OPTIONS_CONFIG
              ]
          }
          if (attr === "Breed" && selectedPet.type) {
            updatedOptions[attr] = await fetchBreedOptions(selectedPet.type)
          }
        } else {
          if (attr === "Breed size") {
            const breedSizeRes = await getSizes({})
            if (breedSizeRes.ok) {
              const largest =
                selectedPet.type === "CAT"
                  ? breedSizeRes.value.body.sizes.find(
                      (size) => size.name.toLowerCase() === "medium",
                    )
                  : getLargestOption(breedSizeRes.value.body.sizes)
              if (largest) {
                updatedFormData["Breed size"] = {
                  id: largest.id,
                  name: largest.name,
                }
              }
            }
          }
          if (attr === "Coat size") {
            const coatSizeRes = await getCoats({})
            if (coatSizeRes.ok) {
              const largest = getLargestOption(coatSizeRes.value.body.coats)
              if (largest) {
                updatedFormData["Coat size"] = {
                  id: largest.id,
                  name: largest.name,
                }
              }
            }
          }
        }
      }
      setFormData(updatedFormData)
      setDropdownOptions(updatedOptions)
      if (onlyBreedAndCoatMissing) {
        await onUpdatePet({
          breedSize: updatedFormData["Breed size"],
          coat: updatedFormData["Coat size"],
        })
      } else if (filteredMissing.length > 0) {
        setMissingAttributes(filteredMissing)
        setShowModal(true)
      } else {
        setIsFormComplete(true)
      }
    }
  }

  const onUpdatePet = async function (formDataFields?: {
    breedSize: { id: string; name: string }
    coat: { id: string; name: string }
  }) {
    let breedObj: { id: string; name: string }

    if (selectedPet.breedId && selectedPet.breed) {
      breedObj = {
        id: selectedPet.breedId,
        name: selectedPet.breed,
      }
    } else {
      breedObj = formData["Breed"] ?? null
    }

    const updateResponse = await updatePet({
      pet: {
        id: selectedPet.id,
        name: selectedPet.name,
        species:
          selectedPet.type ??
          (formData["Species"]?.id as "DOG" | "CAT" | "OTHER"),
        gender:
          selectedPet.gender ?? (formData["Gender"]?.id as "MALE" | "FEMALE"),
        breed: breedObj,
        breedSize: formDataFields
          ? formDataFields.breedSize
          : (formData["Breed size"] ?? null),
        coat: formDataFields
          ? formDataFields.coat
          : (formData["Coat size"] ?? null),
        dob: selectedPet.dob ?? null,
        profileImage: selectedPet.profileImage ?? null,
      },
    })
    if (updateResponse.ok) {
      setIsFormComplete(true)
      setShowModal(false)
    }
  }

  const clinics = getClinicsResult?.ok
    ? getClinicsResult.value.body.clinics
    : []
  const locationOptions = Array.from(
    new Set(
      clinics.map((clinic) => clinic.location).filter((loc) => Boolean(loc)),
    ),
  )

  const filteredClinics = clinics.filter((clinic) => {
    const matchesName = clinicSearch.trim()
      ? clinic.name.toLowerCase().includes(clinicSearch.trim().toLowerCase())
      : true
    const matchesLocation = selectedLocation
      ? clinic.location === selectedLocation
      : true
    return matchesName && matchesLocation
  })

  useEffect(() => {
    if (!selectedClinic || clinics.length === 0) return
    const selected =
      clinics.find((item) => item.id === selectedClinic) ||
      clinics.find((item) => item.dbClinicId === selectedClinic)
    if (!selected) return
    if (
      selectedClinic === selected.id &&
      selectedClinicLocation &&
      selectedClinicContact
    ) {
      return
    }
    handleClinicSelection(selected.id, selected.location, selected.contact, {
      skipToggle: true,
    })
    onClinicSelect(selected.id)
  }, [
    clinics,
    handleClinicSelection,
    selectedClinic,
    selectedClinicContact,
    selectedClinicLocation,
  ])

  if (loadingClinics) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className=" flex flex-col">
      <h1 className="text-2xl mb-2">Select a Clinic</h1>
      <p className="text-gray-600 mb-2">
        Book an appointment at one of our state-of-the-art clinics
      </p>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input.Search
          allowClear
          placeholder="Search clinic by name"
          value={clinicSearch}
          onChange={(event) => setClinicSearch(event.target.value)}
          className="sm:max-w-md"
        />
        <Select
          allowClear
          placeholder="Filter by location"
          className="sm:w-64"
          value={selectedLocation}
          onChange={(value) => setSelectedLocation(value)}
          options={locationOptions.map((location) => ({
            label: location,
            value: location,
          }))}
        />
      </div>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ">
        {filteredClinics.map((item) => (
          <div key={item.id} className="h-full ">
            <SelectClinicCard
              key={item.id}
              clinic={item}
              isSelected={selectedClinic === item.id}
              onSelect={() => {
                handleClinicSelection(item.id, item.location, item.contact)
                onClinicSelect(item.id)
              }}
            />
          </div>
        ))}
        {!filteredClinics.length && (
          <div className="text-gray-500">No clinics match your search.</div>
        )}
      </div>
      <div className="my-16 flex justify-center">
        <CustomButton
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          disabled={
            !selectedClinic ||
            !selectedClinicLocation ||
            !selectedClinicContact ||
            !isFormComplete
          }
          buttonClickEvent={onNext}
        />
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Complete Pet Details</h2>
            {missingAttributes.map((attr) => (
              <div key={attr} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {attr}
                </label>
                <Select
                  showSearch
                  placeholder={`Select ${attr}`}
                  optionFilterProp="label"
                  className="w-full"
                  value={formData[attr]?.id || undefined}
                  onChange={(value) => {
                    const selectedOption = dropdownOptions[attr]?.find(
                      (option) => option.id === value,
                    )
                    if (selectedOption) {
                      setFormData((prev) => ({
                        ...prev,
                        [attr]: {
                          id: selectedOption.id,
                          name: selectedOption.name,
                        },
                      }))
                    }
                  }}
                  options={
                    dropdownOptions[attr]?.map((option) => ({
                      label: option.name,
                      value: option.id,
                    })) || []
                  }
                />
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={() => {
                  setShowModal(false)
                  setIsFormComplete(false)
                }}
              >
                Cancel
              </button>
              <button
                className="bg-secondary-1 text-white px-4 py-2 rounded-md"
                disabled={
                  !missingAttributes.every((attr) => Boolean(formData[attr]))
                }
                onClick={() => onUpdatePet()}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectClinic
