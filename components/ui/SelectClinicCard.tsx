import React from "react"
import Image from "next/image"
import defaultClinicImg from "@/public/assets/images/clinic/ClinicImage.png"

type Clinic = {
  image: {
    type: "url" | "ref"
    value: string
  }
  services: string
  id: string
  name: string
  location: string
}
interface ClinicItemProps {
  clinic: Clinic
  isSelected: boolean
  onSelect: () => void
  onNext?: () => void
}

const SelectClinicCard: React.FC<ClinicItemProps> = ({
  clinic,
  isSelected,
  onSelect,
  onNext,
}) => {
  const { image, name, services } = clinic
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col h-full cursor-pointer rounded-md  ${
        isSelected ? "outline outline-2 outline-secondary-1" : "shadow-md"
      }`}
    >
      <div className="image-container">
        <Image
          src={image.value === "unknown" ? defaultClinicImg : image.value}
          alt={name + " image"}
          className="image rounded-t-md"
          height={200}
          width={100}
        />
      </div>
      <div className="flex flex-col flex-grow px-6 pt-6 pb-6 bg-primary-3">
        <h1 className="text-primary-1 text-lg">{name}</h1>
        <div className="flex gap-2 text-primary-1 text-base mt-2">
          <p>{services}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isSelected && onNext) onNext()
          }}
          className={`mt-4 w-full bg-secondary-1 text-white py-2 px-4 rounded-md text-sm font-medium transition-opacity ${
            isSelected && onNext
              ? "opacity-100 hover:opacity-90"
              : "opacity-0 pointer-events-none"
          }`}
        >
          Continue with this clinic
        </button>
      </div>
    </div>
  )
}

export default SelectClinicCard
