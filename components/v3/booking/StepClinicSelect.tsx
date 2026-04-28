"use client"

import { MapPin, Phone, ChevronRight } from "lucide-react"
import type { V3Clinic } from "@/services/api.v3"

interface Props {
  clinics: V3Clinic[]
  onSelect: (clinic: V3Clinic) => void
}

export default function StepClinicSelect({ clinics, onSelect }: Props) {
  const vetClinics = clinics.filter((c) => c.vetBookingEnabled)

  return (
    <div>
      <div className="space-y-3">
        {vetClinics.map((clinic) => (
          <button
            key={clinic.id}
            onClick={() => onSelect(clinic)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-2/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-2" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary-1">{clinic.name}</div>
              {clinic.city && (
                <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {clinic.city}
                </div>
              )}
              {clinic.phone && (
                <div className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  {clinic.phone}
                </div>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-2 transition-colors flex-shrink-0" />
          </button>
        ))}

        {vetClinics.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-8">
            No clinics available for booking at this time.
          </p>
        )}
      </div>
    </div>
  )
}
