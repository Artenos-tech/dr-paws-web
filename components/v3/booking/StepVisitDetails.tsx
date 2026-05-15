"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { ClipLoader } from "react-spinners"
import { MdOutlineInfo } from "react-icons/md"
import { Tooltip } from "antd"

export const VISIT_REASON_CODES = [
  "VACCINATION",
  "CHECK_UP",
  "SICK",
  "DIAGNOSTICS",
  "FOLLOW_UP",
  "OTHER",
] as const

export type VisitReasonCode = (typeof VISIT_REASON_CODES)[number]

export const VISIT_REASONS: { key: VisitReasonCode; label: string }[] = [
  { key: "SICK", label: "My pet is sick" },
  { key: "CHECK_UP", label: "General check-up" },
  { key: "VACCINATION", label: "Vaccination/Deworming" },
  { key: "DIAGNOSTICS", label: "Diagnostics" },
  { key: "FOLLOW_UP", label: "Follow-up" },
  { key: "OTHER", label: "Something else" },
]

export function reasonLabel(code: VisitReasonCode): string {
  return VISIT_REASONS.find((r) => r.key === code)?.label ?? code
}

interface StepVisitDetailsProps {
  initialIsEmergency?: boolean | null
  initialReasonCode?: VisitReasonCode | null
  initialPetParentNotes?: string
  onConfirm: (input: {
    isEmergency: false
    reasonCode: VisitReasonCode
    petParentNotes: string
  }) => void
}

const schema = z.object({
  isEmergency: z.literal("no"),
  reasonCode: z.enum(VISIT_REASON_CODES),
  petParentNotes: z.string().trim().min(1, "Description is required"),
})

const emergencyInfoMessage = (
  <div className="w-72 max-h-56 overflow-y-auto overscroll-contain text-sm p-4">
    <p className="font-semibold mb-2">
      A pet emergency is any condition that requires immediate medical attention
      and cannot wait for a scheduled home visit.
    </p>
    <p className="mb-2">This includes, but is not limited to:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Difficulty breathing, choking, or collapse</li>
      <li>Seizures, unconsciousness, or sudden extreme weakness</li>
      <li>
        Severe bleeding, deep wounds, or major trauma (accident, fall, bite)
      </li>
      <li>Persistent vomiting or diarrhea, especially with blood</li>
      <li>Inability to stand, walk, or sudden paralysis</li>
      <li>Suspected poisoning or ingestion of harmful substances</li>
      <li>Extreme pain, bloated abdomen, or signs of shock</li>
    </ul>
    <p className="mt-3 font-semibold text-red-600">
      Home visits are not suitable for emergencies.
    </p>
  </div>
)

export default function StepVisitDetails({
  initialIsEmergency,
  initialReasonCode,
  initialPetParentNotes,
  onConfirm,
}: StepVisitDetailsProps) {
  const router = useRouter()

  const [isEmergency, setIsEmergency] = useState<"yes" | "no">(
    initialIsEmergency === true ? "yes" : "no",
  )
  const [reasonCode, setReasonCode] = useState<VisitReasonCode | null>(
    initialReasonCode ?? null,
  )
  const [petParentNotes, setPetParentNotes] = useState(
    initialPetParentNotes ?? "",
  )
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [touchedNotes, setTouchedNotes] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const parsed = schema.safeParse({
    isEmergency,
    reasonCode,
    petParentNotes,
  })
  const isValid = parsed.success
  const notesError =
    !parsed.success &&
    parsed.error.errors.find((e) => e.path[0] === "petParentNotes")?.message

  useEffect(() => {
    document.body.style.overflow = showEmergencyModal ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showEmergencyModal])

  function handleEmergencyChange(value: "yes" | "no") {
    setIsEmergency(value)
    if (value === "yes") {
      setShowEmergencyModal(true)
      setReasonCode(null)
      setPetParentNotes("")
      setTouchedNotes(false)
    }
  }

  function handleModalCancel() {
    setShowEmergencyModal(false)
    setIsEmergency("no")
  }

  function handleGoToClinicVisit() {
    router.push("/v3/book")
  }

  function handleProceed() {
    if (!isValid || reasonCode === null) return
    setIsProcessing(true)
    onConfirm({
      isEmergency: false,
      reasonCode,
      petParentNotes: petParentNotes.trim(),
    })
  }

  return (
    <div className="w-full h-full mt-4">
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h1 className="text-2xl mb-2">
              Please book a clinic visit for emergencies
            </h1>
            <p className="text-gray-600 mb-4">
              Home visits aren&apos;t suitable for emergencies. For immediate
              attention, please book a clinic visit so our team can prepare to
              receive your pet right away.
            </p>
            <div className="flex justify-around space-x-3">
              <button
                onClick={handleModalCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleGoToClinicVisit}
                className="px-4 py-2 bg-primary-1 text-white rounded-lg"
              >
                Book clinic visit
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
        <p className="font-bold text-gray-600 flex">
          <span>Is it a medical emergency?</span>
          <Tooltip
            title={emergencyInfoMessage}
            color="#f7f1de"
            styles={{ body: { color: "#33495f", width: 300 } }}
          >
            <MdOutlineInfo className="mt-1 ml-1" size={16} />
          </Tooltip>
        </p>
        <div className="flex space-x-6">
          {(["yes", "no"] as const).map((val) => (
            <label key={val} className="flex items-center space-x-2">
              <input
                type="radio"
                checked={isEmergency === val}
                onChange={() => handleEmergencyChange(val)}
              />
              <span>{val === "yes" ? "Yes" : "No"}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <p className="font-bold text-gray-600">Reason for appointment</p>
        {VISIT_REASONS.map((item) => (
          <label key={item.key} className="flex items-center space-x-2">
            <input
              type="radio"
              checked={reasonCode === item.key}
              onChange={() => setReasonCode(item.key)}
            />
            <span>{item.label}</span>
          </label>
        ))}

        <div className="space-y-4 mt-4">
          <p className="text-sm font-bold text-gray-600">
            Please describe the problem in as much detail as possible. It will
            help us prepare for the visit and make sure we bring everything we
            need.
            <span className="text-red-500">*</span>
          </p>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-1 focus:border-transparent"
            rows={4}
            value={petParentNotes}
            onChange={(e) => setPetParentNotes(e.target.value)}
            onBlur={() => setTouchedNotes(true)}
            placeholder="Describe the issue..."
          />
          {touchedNotes && notesError && (
            <p className="text-sm text-red-600 mt-1">{notesError}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-10 mt-6">
        <Tooltip
          color="#f7f1de"
          styles={{ body: { color: "#33495f" } }}
          title={!isValid ? "Select reason and fill in notes to proceed" : ""}
        >
          <button
            disabled={!isValid || isProcessing}
            onClick={handleProceed}
            className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-secondary-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing && <ClipLoader size={16} color="#ffffff" />}
            {isProcessing ? "Processing..." : "Proceed"}
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
