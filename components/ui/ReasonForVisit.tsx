"use client"

import { PhoneCall } from "lucide-react"
import React, { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { z } from "zod"
import { ClipLoader } from "react-spinners"

interface ReasonForVisitProps {
  handleConfirm: (
    reasonForVisit: string,
    description: string,
    isEmergency: "yes" | "no" | null,
  ) => void
  reason?: string
  description?: string
  isEmergency?: "yes" | "no" | null
}

export const VISIT_REASONS = [
  { key: "GENERAL_CHECKUP", label: "General check-up" },
  { key: "VACCINATION", label: "Vaccination" },
  { key: "SICK_PET", label: "My pet is sick" },
  { key: "DIAGNOSTICS", label: "Diagnostics" },
  { key: "FOLLOW_UP", label: "Follow-up" },
  { key: "OTHER", label: "Something else" },
] as const


const reasonForVisitSchema = z.object({
  isEmergency: z.literal("no"),
  selectedReason: z.enum(
    VISIT_REASONS.map((r) => r.key) as [string, ...string[]],
  ),
  filledDescription: z.string().trim().min(1, "Description is required"),
})
const PHONE_NUMBER =
  process.env.NEXT_PUBLIC_EMERGENCY_HELPLINE_PHONE_NUMBER || ""

const ReasonForVisit = ({
  handleConfirm,
  reason,
  description,
  isEmergency: initialIsEmergency,
}: ReasonForVisitProps) => {
  const [isEmergency, setIsEmergency] = useState<"yes" | "no" | null>(
    initialIsEmergency ?? "no",
  )
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const getReasonFromLabel = (label: string | null) => {
    const reasonObj = VISIT_REASONS.find((r) => r.label === label)
    return reasonObj ? reasonObj.key : null
  }
  const [selectedReason, setSelectedReason] = useState<string | null>(
    getReasonFromLabel(reason || null),
  )
  const [filledDescription, setFilledDescription] = useState(description || "")
  const [isValid, setIsValid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const result = reasonForVisitSchema.safeParse({
      isEmergency,
      selectedReason,
      filledDescription,
    })

    setIsValid(result.success)

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
    } else {
      setErrors({})
    }
  }, [isEmergency, selectedReason, filledDescription])

  useEffect(() => {
    if (showEmergencyModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showEmergencyModal])

  const handleEmergencyChange = (value: "yes" | "no") => {
    setIsEmergency(value)
    if (value === "yes") {
      setShowEmergencyModal(true)
      setSelectedReason(null)
      setFilledDescription("")
      setTouched({})
    }
  }

  const handleReasonChange = (value: string) => {
    setSelectedReason(value)
  }

  const handleDescriptionChange = (value: string) => {
    setFilledDescription(value)
  }

  const handleDescriptionBlur = () => {
    setTouched((prev) => ({ ...prev, filledDescription: true }))
  }

  const handleModalClose = () => {
    setShowEmergencyModal(false)
    setIsEmergency(null)
    setSelectedReason(null)
    setFilledDescription("")
    setIsEmergency("no")
    setTouched({})
  }

  const handleProceedClick = () => {
    if (!selectedReason) return

    const reasonLabel =
      VISIT_REASONS.find((r) => r.key === selectedReason)?.label || ""

    setIsProcessing(true)
    handleConfirm(reasonLabel, filledDescription, isEmergency)
  }

  return (
    <div className="w-full h-full mt-4">
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h1 className="text-2xl mb-2">
              Please visit our clinics for emergencies
            </h1>
            <p className="text-gray-600 mb-4">
              If your pet needs immediate attention, please visit one of our
              clinics where we can provide immediate care.
            </p>

            <div className="flex justify-around space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-primary-1 text-white rounded-lg flex items-center space-x-2"
                onClick={() => {
                  navigator.clipboard.writeText(PHONE_NUMBER)

                  toast.success(
                    `Phone number ${PHONE_NUMBER} copied to clipboard`,
                    {
                      duration: 3000,
                    },
                  )

                  handleModalClose()
                }}
              >
                <PhoneCall />
                <span>Call Us</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" />
      <div>
        <h1 className="text-2xl mb-2">
          Tell us a bit about what your pet needs
        </h1>
        <p className="text-gray-600 mb-12">
          This helps us prepare better for your visit
        </p>
      </div>

      <div className="space-y-2 mb-6">
        <p className="font-bold text-gray-600">Is it an emergency?</p>
        <div className="flex space-x-6">
          {["yes", "no"].map((val) => (
            <label key={val} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={isEmergency === val}
                onChange={() => handleEmergencyChange(val as "yes" | "no")}
              />
              <span>{val === "yes" ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <p className="font-bold text-gray-600">What seems to be wrong?</p>

        {VISIT_REASONS.map((item) => (
          <label key={item.key} className="flex items-center space-x-2">
            <input
              type="radio"
              checked={selectedReason === item.key}
              onChange={() => handleReasonChange(item.key)}
            />
            <span>{item.label}</span>
          </label>
        ))}

        <div className="space-y-4 mt-4">
          <p className="text-sm font-bold text-gray-600">
            Please describe the problem in as much detail as possible. It will
            help us prepare for the visit and make sure we bring everything we
            need.
          </p>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm
             focus:outline-none focus:ring-2 focus:ring-secondary-1 focus:border-transparent"
            rows={4}
            value={filledDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Describe the issue..."
          />
          {touched.filledDescription && errors.filledDescription && (
            <p className="text-sm text-red-600 mt-1">
              {errors.filledDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-10 mt-6 ">
        <button
          disabled={!isValid || isProcessing}
          onClick={handleProceedClick}
          className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-secondary-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing && <ClipLoader size={16} color="#ffffff" />}
          {isProcessing ? "Processing..." : "Proceed"}
        </button>
      </div>
    </div>
  )
}

export default ReasonForVisit
