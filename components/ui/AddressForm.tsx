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

const AddressForm = ({
  addressDetails,
  setAddressDetails,
}: AddressFormProps) => {
  return (
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
  )
}

export default AddressForm
