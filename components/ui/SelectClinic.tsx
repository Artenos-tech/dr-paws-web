"use client"

import SelectClinicCard from "./SelectClinicCard"
import CustomButton from "./CustomButton"
import { useEffect, useState } from "react"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"
import { Pet } from "@/context/UserContext"

interface SelectClinicProps {
  onNext: () => void // Prop for navigation
  selectedClinic: string | null
  handleClinicSelection: (
    clinicId: string,
    location: string,
    contact: string,
  ) => void
  selectedPet: Pet
  isGrooming: boolean
}

const SelectClinic: React.FC<SelectClinicProps> = ({
  onNext,
  selectedClinic,
  handleClinicSelection,
  selectedPet,
  isGrooming,
}) => {
  const [missingAttributes, setMissingAttributes] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, Array<{ id: string; name: string; description?: string }>>
  >({})
  const [formData, setFormData] = useState<
    Record<string, { id: string; name: string }>
  >({})
  const [isFormComplete, setIsFormComplete] = useState(
    selectedClinic ? true : false,
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

  const onClinicSelect = async function (clinic: string) {
    setIsFormComplete(false)
    if (clinic !== selectedClinic) {
      const response = await getMissingAttributes({
        clinicid: clinic,
        petid: selectedPet.id,
        grooming: isGrooming ? "y" : "n",
      })
      if (response.ok && response.value.body.attributes.length > 0) {
        const missing = response.value.body.attributes as [
          | "Name"
          | "Type"
          | "Breed"
          | "Gender"
          | "Birthday"
          | "Breed size"
          | "Coat size"
          | "Species",
        ]
        if (!selectedPet.gender) {
          missing.push("Gender")
        }
        if (!selectedPet.type) {
          missing.push("Species")
        }
        setMissingAttributes(missing)
        setShowModal(true)
        setFormData({})
        const options: Record<
          string,
          Array<{ id: string; name: string; description?: string }>
        > = {}
        for (const attr of missing) {
          if (attr === "Breed" && selectedPet.type) {
            const breedsRes = await getBreeds({ species: selectedPet.type })
            if (breedsRes.ok) {
              options[attr] = breedsRes.value.body.breeds.map((breed) => ({
                id: breed.id,
                name: breed.name,
              }))
            }
          } else if (attr === "Breed size") {
            const breedSizeRes = await getSizes({})
            if (breedSizeRes.ok) {
              options[attr] = breedSizeRes.value.body.sizes.map((size) => ({
                id: size.id,
                name: size.name,
                description: size.description,
              }))
            }
          } else if (attr === "Coat size") {
            const coatSizeRes = await getCoats({})
            if (coatSizeRes.ok) {
              options[attr] = coatSizeRes.value.body.coats.map((coat) => ({
                id: coat.id,
                name: coat.name,
                description: coat.description,
              }))
            }
          } else if (attr === "Gender") {
            options[attr] = [
              { id: "MALE", name: "Male" },
              { id: "FEMALE", name: "Female" },
            ]
          } else if (attr === "Species") {
            options[attr] = [
              { id: "DOG", name: "Dog" },
              { id: "CAT", name: "Cat" },
              { id: "OTHER", name: "Other" },
            ]
          } else {
            options[attr] = []
          }
        }
        setDropdownOptions(options)
      } else {
        setIsFormComplete(true)
      }
    }
  }

  const clinics = getClinicsResult?.ok
    ? getClinicsResult.value.body.clinics
    : []

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
      <p className="text-gray-600 mb-12">
        Book an appointment at one of our state-of-the-art clinics
      </p>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ">
        {clinics.map((item) => (
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
      </div>
      <div className="my-16 flex justify-center">
        <CustomButton
          buttonText="Next"
          buttonBackground="bg-secondary-1"
          disabled={!selectedClinic || !isFormComplete}
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
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
                  value={formData[attr]?.id || ""}
                  onChange={(e) => {
                    const selectedOption = dropdownOptions[attr]?.find(
                      (option) => option.id === e.target.value,
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
                >
                  <option value="">Select {attr}</option>
                  {dropdownOptions[attr]?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}{" "}
                      {option.description ? `(${option.description})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <button
                className="text-sm text-gray-500 hover:underline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-secondary-1 text-white px-4 py-2 rounded-md"
                disabled={Object.values(formData).some((val) => !val)}
                onClick={async () => {
                  const updateResponse = await updatePet({
                    pet: {
                      id: selectedPet.id,
                      name: selectedPet.name,
                      species:
                        selectedPet.type ??
                        (formData["Species"]?.id as "DOG" | "CAT" | "OTHER"),
                      gender:
                        selectedPet.gender ??
                        (formData["Gender"]?.id as "MALE" | "FEMALE"),
                      breed: formData["Breed"],
                      breedSize: formData["Breed size"],
                      coat: formData["Coat size"],
                      dob: selectedPet.dob ?? null,
                      profileImage: selectedPet.profileImage ?? null,
                    },
                  })
                  if (updateResponse.ok) {
                    setIsFormComplete(true)
                    setShowModal(false)
                  } else {
                    // Handle error UI if needed
                  }
                }}
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
