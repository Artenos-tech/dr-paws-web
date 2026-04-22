"use client"

import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { type V3Owner } from "@/services/api.v3"
import V3LoginFlow from "./V3LoginFlow"

interface Props {
  onSuccess: (owner: V3Owner, token: string) => void
  onClose: () => void
}

export default function V3LoginModal({ onSuccess, onClose }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="font-roca text-lg text-primary-1">
            Sign in to Dr. Paws
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-6">
          <V3LoginFlow onSuccess={onSuccess} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
