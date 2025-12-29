import React from "react"

type AddressDetails = {
  tag: string
  addressLine1: string
  addressLine2: string
  directions: string | null
}

type AddressFormProps = {
  addressDetails: AddressDetails
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>
}

const inputBaseClasses =
  "w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-secondary-1"

const AddressForm = ({
  addressDetails,
  setAddressDetails,
}: AddressFormProps) => {
  return (
    <div className="mt-6 w-full flex flex-col gap-4">
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
        className={inputBaseClasses}
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
        className={inputBaseClasses}
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
        className={inputBaseClasses}
      />
      <textarea
        value={addressDetails.directions ?? ""}
        onChange={(e) =>
          setAddressDetails((prev) => ({
            ...prev,
            directions: e.target.value,
          }))
        }
        placeholder="Directions (optional)"
        rows={3}
        className={`${inputBaseClasses} resize-none`}
      />
    </div>
  )
}

export default AddressForm
