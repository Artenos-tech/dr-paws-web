import React from "react"

interface GroomingAddonModalProps {
  isOpen: boolean
  addHaircut: boolean
  setAddHaircut: (value: boolean) => void
  onClose: (confirmed: boolean) => void
}

export default function GroomingAddonModal({
  isOpen,
  addHaircut,
  setAddHaircut,
  onClose,
}: GroomingAddonModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg">
        <div className="p-4 sm:p-6 flex flex-col items-center justify-between gap-4 sm:gap-6">
          <h2 className="text-xl sm:text-2xl mb-1 sm:mb-2 text-center">
            Select a Service
          </h2>
          <div className="w-full grid gap-3 sm:gap-4">
            <label
              className={`w-full border p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                !addHaircut
                  ? "border-[#5281a2] bg-[#f0f6fa]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="groomingPackage"
                  checked={!addHaircut}
                  onChange={() => setAddHaircut(false)}
                  className="mt-1 h-4 w-4 sm:h-5 sm:w-5 accent-[#5281a2]"
                />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-medium">
                    Spa Bath
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Complete hygiene care including bath with shampoo &
                    conditioner, nail trim, sanitary trim, ear cleaning, teeth
                    brushing, paw-pad trim, drying, and finishing perfume.
                  </span>
                </div>
              </div>
            </label>
            <div className="text-xs sm:text-sm text-[#8b5a00] font-semibold">
              Haircut can be added for +₹999
            </div>
            <label
              className={`w-full border p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                addHaircut
                  ? "border-[#5281a2] bg-[#f0f6fa]"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="groomingPackage"
                  checked={addHaircut}
                  onChange={() => setAddHaircut(true)}
                  className="mt-1 h-4 w-4 sm:h-5 sm:w-5 accent-[#5281a2]"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm sm:text-base font-medium">
                    Spa Bath + Haircut
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Everything in a Spa Bath plus a full-body haircut
                  </span>
                </div>
              </div>
            </label>
          </div>
          <div className="flex justify-between w-full mt-2 sm:mt-4 space-x-3">
            <button
              onClick={() => onClose(false)}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-[#5281a2] border border-[#5281a2] hover:bg-[#5281a2] hover:text-white transition-colors text-sm sm:text-base flex-1"
            >
              Cancel
            </button>
            <button
              onClick={() => onClose(true)}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base flex-1 bg-[#5281a2] hover:bg-[#3a6d8e] transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
