"use client"

import { FC } from "react"
import { useRouter } from "next/navigation"

type UnserviceableModalProps = {
  onClose: () => void
}

const UnserviceableModal: FC<UnserviceableModalProps> = ({ onClose }) => {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Location not serviceable</h2>
        <p className="text-sm text-gray-600 mb-6">
          Sorry, your location is too far for a home visit.
        </p>
        <div className="flex gap-3 flex-col">
          <button
            className="w-full rounded-full px-4 py-2 bg-secondary-1 text-white"
            onClick={() => {
              onClose()
              router.replace("/user/book-appointment?clinic=true")
            }}
          >
            Book clinic visit
          </button>
          <button
            className="w-full rounded-full px-4 py-2 border border-gray-400 text-gray-800"
            onClick={() => {
              onClose()
              router.replace("/user/book-appointment?home=true")
            }}
          >
            Select another address
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnserviceableModal
