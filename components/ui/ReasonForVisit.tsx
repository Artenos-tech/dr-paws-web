"use client"

import { PhoneCall } from "lucide-react"
import React, { useEffect, useState } from "react"
import { z } from "zod"

interface ReasonForVisitProps {
  handleConfirm: (reasonForVisit: string, description: string) => void
  reason?: string
  description?: string
}

const VISIT_REASONS = [
  { key: "checkup", label: "Regular check-ups" },
  { key: "vaccination", label: "Vaccination" },
  { key: "sick", label: "My pet is sick" },
  { key: "other", label: "Something else" },
] as const

const reasonForVisitSchema = z.object({
  isEmergency: z.literal("no"),
  selectedReason: z.enum(
    VISIT_REASONS.map((r) => r.label) as [string, ...string[]],
  ),
  filledDescription: z.string().trim().min(1, "Description is required"),
})

const ReasonForVisit = ({
  handleConfirm,
  reason,
  description,
}: ReasonForVisitProps) => {
  const [isEmergency, setIsEmergency] = useState<"yes" | "no" | null>(null)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(
    reason || null,
  )

  const [filledDescription, setFilledDescription] = useState(description || "")
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const result = reasonForVisitSchema.safeParse({
      isEmergency,
      selectedReason,
      filledDescription,
    })

    setIsValid(result.success)
  }, [isEmergency, selectedReason, filledDescription])

  const handleEmergencyChange = (value: "yes" | "no") => {
    setIsEmergency(value)
    if (value === "yes") setShowEmergencyModal(true)
  }

  return (
    <div className="w-full h-full mt-4">
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h1 className="text-2xl mb-2">
              Please visit our clinics for emergencies
            </h1>
            <p className="text-gray-600 mb-12">
              If your pet needs immediate attention, please visit one of our
              clinics where we can provide immediate care.
            </p>

            <div className="flex justify-around space-x-3">
              <button
                onClick={() => {
                  setShowEmergencyModal(false)
                  setIsEmergency(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
                <div className="flex items-center space-x-2">
                  <PhoneCall />
                  <span>Call Us</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

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
              checked={selectedReason === item.label}
              onChange={() => setSelectedReason(item.label)}
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
            onChange={(e) => setFilledDescription(e.target.value)}
            placeholder="Describe the issue..."
          />
        </div>
      </div>

      <div className="flex justify-center mb-10 mt-6 ">
        <button
          disabled={!isValid}
          onClick={() =>
            selectedReason && handleConfirm(selectedReason, filledDescription)
          }
          className={`font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-secondary-1 ${
            isValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  )
}

export default ReasonForVisit
