import { AddressFormValues } from "@/types/select-address"
import React, { useEffect, useState } from "react"
import { z } from "zod"

const addressSchema = z.object({
  addressLine1: z.string().trim().min(1, "This field is required"),
  addressLine2: z.string().trim().min(1, "This field is required"),
  tag: z.string().trim().min(1, "This field is required"),
  directions: z.string().trim().optional().nullable(),
})

type AddressFormProps = {
  addressDetails: AddressFormValues
  setAddressDetails: React.Dispatch<React.SetStateAction<AddressFormValues>>
  isSubmitting?: boolean
  onValidityChange: (isValid: boolean) => void
}

const inputBaseClasses =
  "w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed"

const labelClasses = "text-sm font-medium text-gray-700"

const AddressForm = ({
  addressDetails,
  setAddressDetails,
  isSubmitting = false,
  onValidityChange,
}: AddressFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const result = addressSchema.safeParse(addressDetails)

    if (result.success) {
      setErrors({})
      onValidityChange(true)
    } else {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message
        }
      })
      setErrors(fieldErrors)
      onValidityChange(false)
    }
  }, [addressDetails, onValidityChange])

  const handleChange =
    (field: keyof AddressFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value

      setAddressDetails((prev) => ({
        ...prev,
        [field]:
          field === "directions" ? (value.trim() === "" ? null : value) : value,
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
          value={addressDetails.addressLine1}
          onChange={handleChange("addressLine1")}
          className={inputBaseClasses}
          disabled={isSubmitting}
        />
        {errors.addressLine1 && (
          <p className="text-sm text-red-500 mt-1">{errors.addressLine1}</p>
        )}
      </div>

      <div>
        <label htmlFor="addressLine2" className={labelClasses}>
          Address line 2 <span className="text-red-500">*</span>
        </label>
        <input
          id="addressLine2"
          value={addressDetails.addressLine2}
          onChange={handleChange("addressLine2")}
          className={inputBaseClasses}
          disabled={isSubmitting}
        />
        {errors.addressLine2 && (
          <p className="text-sm text-red-500 mt-1">{errors.addressLine2}</p>
        )}
      </div>

      <div>
        <label htmlFor="tag" className={labelClasses}>
          Tag <span className="text-red-500">*</span>
        </label>
        <input
          id="tag"
          value={addressDetails.tag}
          onChange={handleChange("tag")}
          className={inputBaseClasses}
          disabled={isSubmitting}
        />
        {errors.tag && (
          <p className="text-sm text-red-500 mt-1">{errors.tag}</p>
        )}
      </div>

      <div>
        <label htmlFor="directions" className={labelClasses}>
          Directions (optional)
        </label>
        <textarea
          id="directions"
          rows={3}
          value={addressDetails.directions ?? ""}
          onChange={handleChange("directions")}
          className={`${inputBaseClasses} resize-none`}
          disabled={isSubmitting}
        />
      </div>
    </form>
  )
}

export default AddressForm
