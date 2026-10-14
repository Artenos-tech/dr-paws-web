"use client"

import { useEffect, useState } from "react"
import { Stethoscope, Scissors, ChevronRight } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import { v3FetchVisitTypes, type V3VisitType } from "@/services/api.v3"

type BookingType = "VET_CONSULTATION" | "GROOMING"

interface Props {
  onSelect: (type: BookingType) => void
}

const FALLBACK_SUBTYPES: V3VisitType[] = [
  {
    key: "VET_CONSULTATION",
    title: "Vet Consultation",
    description: "Consult a vet for check-ups, vaccinations and more",
  },
]

function typeIcon(key: string) {
  const cls = "h-6 w-6 text-primary-2"
  if (key === "GROOMING") return <Scissors className={cls} />
  return <Stethoscope className={cls} />
}

export default function BookingTypeSelector({ onSelect }: Props) {
  const [subtypes, setSubtypes] = useState<V3VisitType[]>(FALLBACK_SUBTYPES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    v3FetchVisitTypes()
      .then(({ clinicSubtypes }) => {
        if (clinicSubtypes.length > 0) setSubtypes(clinicSubtypes)
      })
      .catch(() => {
        // fallback values already set
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-roca text-2xl text-primary-1 mb-6">
        What type of appointment?
      </h1>

      <div className="space-y-3">
        {subtypes.map((type) => (
          <button
            key={type.key}
            onClick={() => {
              if (type.key === "VET_CONSULTATION" || type.key === "GROOMING") {
                onSelect(type.key)
              }
            }}
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
