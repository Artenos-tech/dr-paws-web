import React from "react"
import Image from "next/image"
import defaultClinicImg from "@/public/assets/images/clinic/ClinicImage.png"
import { ClipLoader } from "react-spinners"

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
  isLoading: boolean
  onSelect: () => void
}

const SelectClinicCard: React.FC<ClinicItemProps> = ({
  clinic,
  isSelected,
  isLoading,
  onSelect,
}) => {
  const { image, name, services } = clinic
  return (
    <div
      onClick={isLoading ? undefined : onSelect}
      className={`flex flex-col h-full rounded-md ${
        isLoading ? "cursor-wait" : "cursor-pointer"
      } ${isSelected ? "outline outline-2 outline-secondary-1" : "shadow-md"}`}
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
        <div className="mt-4 h-9 flex items-center justify-center">
          {isLoading && <ClipLoader size={20} color="#33495f" />}
        </div>
      </div>
    </div>
  )
}

export default SelectClinicCard
