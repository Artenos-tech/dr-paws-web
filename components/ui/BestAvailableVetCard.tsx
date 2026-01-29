"use client"

import React from "react"
import { Sparkles, Stethoscope } from "lucide-react"

interface BestAvailableVetCardProps {
  isSelected: boolean
  onSelected: () => void
}

const BestAvailableVetCard: React.FC<BestAvailableVetCardProps> = ({
  isSelected,
  onSelected,
}) => {
  const handleCardClick = () => {
    onSelected()
  }

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer min-w-[160px] min-h-[260px] flex flex-col items-center justify-between rounded-xl px-2 pt-2 gap-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 ${
        isSelected
          ? `border-secondary-1 shadow-lg`
          : `border-amber-200`
      }`}
    >
      <div className="w-full flex justify-end">
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Recommended</span>
        </div>
      </div>

      <div className="w-[110px] h-[110px] rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-amber-200 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
        <Stethoscope className="w-16 h-16 text-amber-600" />
      </div>

      <h2 className="flex-1 text-center text-lg font-semibold text-primary-1">
        Best Available Vet
      </h2>
    </div>
  )
}

export default BestAvailableVetCard
