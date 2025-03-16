// components/ui/DoctorCard.tsx
import React from "react"

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
      className={`cursor-pointer min-w-[160px] min-h-[260px]  flex flex-col items-center justify-between rounded-lg px-4 pt-6 gap-4 bg-primary-3 border-2 ${
        isSelected ? `border-secondary-1` : ``
      }`}
    >
      <p className="text-center text-sm">
        The best available vet will be assigned based on your previous
        appointments and the availability of the vets.
      </p>
      <h2 className="flex-1 pt-2 text-center text-lg font-semibold">
        Best Available Vet
      </h2>
    </div>
  )
}

export default BestAvailableVetCard
