import { AddressFormValues } from "@/model/typeDefinitions"
import React, { useEffect, useRef, useState } from "react"
import { z } from "zod"

const addressSchema = z.object({
  address_line1: z.string().trim().min(1, "This field is required"),
  address_line2: z.string().trim().min(1, "This field is required"),
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
  "w-full border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-secondary-1 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 transition-all"

const labelClasses = "text-sm font-medium text-gray-700"

const AddressForm = ({
  addressDetails,
  setAddressDetails,
  isSubmitting = false,
  onValidityChange,
}: AddressFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const onValidityChangeRef = useRef(onValidityChange)

  useEffect(() => {
    onValidityChangeRef.current = onValidityChange
  }, [onValidityChange])

  useEffect(() => {
    const result = addressSchema.safeParse(addressDetails)

    if (result.success) {
      setErrors({})
      onValidityChangeRef.current(true)
    } else {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message
        }
      })
      setErrors(fieldErrors)
      onValidityChangeRef.current(false)
    }
  }, [addressDetails])

  const handleChange =
    (field: keyof AddressFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value

      setAddressDetails((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleBlur = (field: keyof AddressFormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    setAddressDetails((prev) => ({
      ...prev,
      [field]:
        typeof prev[field] === "string" ? prev[field].trim() : prev[field],
    }))
  }

  const getInputClasses = (field: keyof AddressFormValues) => {
    const hasError = touched[field] && errors[field]
    return `${inputBaseClasses} ${
      hasError
        ? "border-red-500"
        : isSubmitting
          ? "border-gray-300"
          : "border-gray-300"
    }`
  }

  return (
    <div className="mt-6 w-full flex flex-col gap-4">
      <div>
        <label htmlFor="addressLine1" className={labelClasses}>
          Address line 1 <span className="text-red-500">*</span>
        </label>
        <input
          id="addressLine1"
          type="text"
          value={addressDetails.address_line1}
          onChange={handleChange("address_line1")}
          onBlur={handleBlur("address_line1")}
          className={getInputClasses("address_line1")}
          disabled={isSubmitting}
          maxLength={200}
          placeholder="123 Main Street"
          autoComplete="address-line1"
        />
        {touched.address_line1 && errors.address_line1 && (
          <p className="text-sm text-red-600 mt-1 font-medium">
            {errors.address_line1}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="addressLine2" className={labelClasses}>
          Address line 2 <span className="text-red-500">*</span>
        </label>
        <input
          id="addressLine2"
          type="text"
          value={addressDetails.address_line2}
          onChange={handleChange("address_line2")}
          onBlur={handleBlur("address_line2")}
          className={getInputClasses("address_line2")}
          disabled={isSubmitting}
          maxLength={200}
          placeholder="Apartment, suite, floor, etc."
          autoComplete="address-line2"
        />
        {touched.address_line2 && errors.address_line2 && (
          <p className="text-sm text-red-600 mt-1 font-medium">
            {errors.address_line2}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="tag" className={labelClasses}>
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="tag"
          type="text"
          value={addressDetails.tag}
          onChange={handleChange("tag")}
          onBlur={handleBlur("tag")}
          className={getInputClasses("tag")}
          disabled={isSubmitting}
          maxLength={50}
          placeholder="e.g., Home, Office, Apartment"
          autoComplete="off"
        />
        {touched.tag && errors.tag && (
          <p className="text-sm text-red-600 mt-1 font-medium">{errors.tag}</p>
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
          onBlur={handleBlur("directions")}
          className={`${getInputClasses("directions")} resize-y`}
          disabled={isSubmitting}
          maxLength={500}
          placeholder="Additional directions to help us find you"
        />
      </div>
    </div>
  )
}

export default AddressForm
