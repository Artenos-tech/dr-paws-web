"use client"

import { useEffect, useState } from "react"
import {
  Home,
  Stethoscope,
  Scissors,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import { v3FetchVisitTypes, type V3VisitType } from "@/services/api.v3"

type TopType = "HOME_VISIT" | "CLINIC_VISIT"
type BookingType = "HOME_VISIT" | "VET_CONSULTATION" | "GROOMING"

interface Props {
  onSelect: (type: BookingType) => void
  initialStep?: "top" | "clinic-subtype"
}

const FALLBACK_VISIT_TYPES: V3VisitType[] = [
  {
    key: "HOME_VISIT",
    title: "Vet at Home",
    description: "A vet visits your home at a convenient time",
  },
  {
    key: "CLINIC_VISIT",
    title: "Clinic Visit",
    description: "Book an appointment at one of our partner clinics",
  },
]

const FALLBACK_CLINIC_SUBTYPES: V3VisitType[] = [
  {
    key: "VET_CONSULTATION",
    title: "Vet Consultation",
    description: "Consult a vet for check-ups, vaccinations and more",
  },
  {
    key: "GROOMING",
    title: "Grooming",
    description: "Professional grooming for your pet",
  },
]

function typeIcon(key: string) {
  const cls = "h-6 w-6 text-primary-2"
  if (key === "HOME_VISIT") return <Home className={cls} />
  if (key === "VET_CONSULTATION") return <Stethoscope className={cls} />
  if (key === "GROOMING") return <Scissors className={cls} />
  return <Stethoscope className={cls} />
}

export default function BookingTypeSelector({ onSelect, initialStep }: Props) {
  const [step, setStep] = useState<"top" | "clinic-subtype">(
    initialStep ?? "top",
  )
  const [visitTypes, setVisitTypes] =
    useState<V3VisitType[]>(FALLBACK_VISIT_TYPES)
  const [clinicSubtypes, setClinicSubtypes] = useState<V3VisitType[]>(
    FALLBACK_CLINIC_SUBTYPES,
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    v3FetchVisitTypes()
      .then(({ visitTypes: vt, clinicSubtypes: cs }) => {
        if (vt.length > 0) setVisitTypes(vt)
        if (cs.length > 0) setClinicSubtypes(cs)
      })
      .catch(() => {
        // fallback values already set
      })
      .finally(() => setLoading(false))
  }, [])

  const displayTypes = step === "top" ? visitTypes : clinicSubtypes
  const heading =
    step === "top" ? "How would you like to book?" : "What type of appointment?"

  function handleTopSelect(type: TopType) {
    if (type === "HOME_VISIT") {
      onSelect("HOME_VISIT")
    } else {
      setStep("clinic-subtype")
    }
  }

  function handleSubtypeSelect(key: string) {
    if (key === "VET_CONSULTATION" || key === "GROOMING") {
      onSelect(key)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {step === "clinic-subtype" && (
        <button
          onClick={() => setStep("top")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      <h1 className="font-roca text-2xl text-primary-1 mb-6">{heading}</h1>

      <div className="space-y-3">
        {displayTypes.map((type) => (
          <button
            key={type.key}
            onClick={() =>
              step === "top"
                ? handleTopSelect(type.key as TopType)
                : handleSubtypeSelect(type.key)
            }
            className="w-full flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group shadow-sm"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-2/10 flex items-center justify-center group-hover:bg-primary-2/20 transition-colors">
              {typeIcon(type.key)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary-1 text-base">
                {type.title}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                {type.description}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-2 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
