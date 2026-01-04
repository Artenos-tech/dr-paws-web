import React from "react"

import { z } from "zod"

export const addressSchema = z.object({
  addressLine1: z.string().trim().min(1, "Address line 1 is required"),

  addressLine2: z.string().trim().optional(),

  tag: z.string().trim().min(1, "Tag is required"),

  directions: z.string().trim().optional().nullable(),
})

type AddressDetails = {
  tag: string
  addressLine1: string
  addressLine2: string
  directions: string | null
}

type AddressFormProps = {
  addressDetails: AddressDetails
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressDetails>>
  isSubmitting?: boolean
}

const inputBaseClasses =
  "w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"

const labelClasses = "text-sm font-medium text-gray-700"

const AddressForm = ({
  addressDetails,
  setAddressDetails,
  isSubmitting = false,
}: AddressFormProps) => {
  const handleChange =
    (field: keyof AddressDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value.trim()

      setAddressDetails((prev) => ({
        ...prev,
        [field]: field === "directions" ? (value === "" ? null : value) : value,
      }))
    }

  return (
    <form className="mt-6 w-full flex flex-col gap-4">
      <div>
        <label htmlFor="addressLine1" className={labelClasses}>
          Address line 1 <span className="text-red-500">*</span>
        </label>
        <input
          id="addressLine1"
          type="text"
          value={addressDetails.addressLine1}
          onChange={handleChange("addressLine1")}
          className={inputBaseClasses}
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label htmlFor="addressLine2" className={labelClasses}>
          Address line 2 (optional)
        </label>
        <input
          id="addressLine2"
          type="text"
          value={addressDetails.addressLine2}
          onChange={handleChange("addressLine2")}
          className={inputBaseClasses}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="tag" className={labelClasses}>
          Tag <span className="text-red-500">*</span>
        </label>
        <input
          id="tag"
          type="text"
          value={addressDetails.tag}
          onChange={handleChange("tag")}
          className={inputBaseClasses}
          disabled={isSubmitting}
          required
        />
      </div>

      <div>
        <label htmlFor="directions" className={labelClasses}>
          Directions (optional)
        </label>
        <textarea
          id="directions"
          value={addressDetails.directions ?? ""}
          onChange={handleChange("directions")}
          rows={3}
          className={`${inputBaseClasses} resize-none`}
          disabled={isSubmitting}
        />
      </div>
    </form>
  )
}

export default AddressForm
