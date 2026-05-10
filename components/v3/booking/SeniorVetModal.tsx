"use client"

import { createPortal } from "react-dom"
import { Star } from "lucide-react"

interface Props {
  doctorName: string
  seniorPrice: number
  onDismiss: () => void
}

export default function SeniorVetModal({
  doctorName,
  seniorPrice,
  onDismiss,
}: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss()
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center gap-3">
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
            <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
          </div>
          <h2 className="font-roca text-lg text-amber-900">
            Senior Vet Selected
          </h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 mb-3">
            <span className="font-semibold">{doctorName}</span> is a Senior Vet.
          </p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 mb-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-amber-800">
                Senior consultation fee
              </span>
              <span className="font-semibold text-amber-900">
                ₹{seniorPrice}
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Senior vet consultations are charged at a higher rate.
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
