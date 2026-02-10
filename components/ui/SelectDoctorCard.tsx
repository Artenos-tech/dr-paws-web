import React from "react"
import Image from "next/image"
import { Sparkles } from "lucide-react"
import defaultVetImg from "@/public/assets/images/clinic/doctorFemale.webp"
import { SelectedVet } from "./SelectVet"

interface SelectDoctorCardProps {
  doctor: SelectedVet
  isSelected: boolean
  onDoctorSelect: (
    doctorId: string,
    doctorName: string,
    doctorImage: string | null,
  ) => void
}

const SelectDoctorCard: React.FC<SelectDoctorCardProps> = ({
  doctor,
  isSelected,
  onDoctorSelect,
}) => {
  const { name, id, displayImage, tier } = doctor

  const handleCardClick = () => {
    onDoctorSelect(id, name, displayImage)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`relative cursor-pointer min-w-[160px] min-h-[260px] flex flex-col items-center justify-between rounded-lg px-4 pt-6 gap-4 border-2 ${
        tier === "SENIOR" ? "bg-amber-50" : "bg-primary-3"
      } ${
        isSelected
          ? "border-secondary-1"
          : tier === "SENIOR"
            ? "border-amber-200"
            : "border-transparent"
      }`}
    >
      {tier === "SENIOR" && (
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-[#74A7B3]  px-2 py-0.5 text-[10px] font-semibold text-white shadow-md">
          <Sparkles className="h-2.5 w-2.5" />
          Senior
        </span>
      )}
      <Image
        src={displayImage ?? defaultVetImg}
        alt={name}
        width={120}
        height={120}
        className="w-[120px] h-[120px] object-contain rounded-full aspect-[4/3] "
      />

      {/* Name */}
      <h2 className="flex-1 pt-2 text-center text-lg font-semibold">{name}</h2>
    </div>
  )
}

export default SelectDoctorCard
