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
  return (
    <div
      onClick={onSelected}
      className={`group cursor-pointer min-w-[160px] min-h-[260px] flex flex-col items-center rounded-xl px-2 pt-2 pb-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 ${
        isSelected ? `border-secondary-1 shadow-lg` : `border-amber-200`
      }`}
    >
      {/* Badge stays at the top */}
      <div className="w-full flex justify-end">
        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Recommended</span>
        </div>
      </div>

      {/* This block takes the remaining height and centers itself */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3">
        <div className="w-[110px] h-[110px] md:w-[90px] md:h-[90px] xl:w-[110px] xl:h-[110px] rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-amber-200 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Stethoscope className="w-14 h-14 md:w-10 md:h-10 xl:w-16 xl:h-16 text-amber-600" />
        </div>

        {/* Heading + description tightly grouped */}
        <div className="flex flex-col items-center">
          <h2 className="text-center text-lg font-semibold text-primary-1">
            Best Available Vet
          </h2>

          <p className="text-center text-[10.5px] text-slate-600 max-w-[220px]">
            The best available vet will be assigned based on your previous
            appointments and the availability of the vets.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BestAvailableVetCard
