import Image from "next/image"
import { Tooltip } from "antd"
import tickMark from "@/public/assets/images/Booking/tick-svgrepo-com.svg"
import { petImageByType } from "./PetCard"
import { BookingPet } from "@/model/typeDefinitions"

interface PetSelectItemProps {
  pet: BookingPet
  isSelected: boolean
  isServiceable?: boolean
  onSelect: () => void
}

const PetSelectItem = ({
  pet,
  isSelected,
  isServiceable = true,
  onSelect,
}: PetSelectItemProps) => {
  const petImage =
    //TODO: uncomment once api is integrated
    // pet.profile_image ||
    petImageByType[pet.type?.toLowerCase() || "other"]?.src ||
    petImageByType.other.src

  return (
    <Tooltip
      title={isServiceable ? "" : "Only Cats and Dogs"}
      color="#f7f1de"
      styles={{ body: { color: "black" } }}
    >
      <div
        onClick={isServiceable ? onSelect : undefined}
        className={`relative m-2 text-center group
          ${isServiceable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
        `}
      >
        <div className="relative w-[100px] h-[100px] mx-auto">
          <Image
            src={petImage}
            alt={pet.name}
            fill
            sizes="100px"
            className={`rounded-full border-2 object-cover
              ${isSelected ? "opacity-50 border-secondary-1" : "border-gray-300"}
            `}
          />

          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src={tickMark} alt="selected" width={40} height={40} />
            </div>
          )}
        </div>

        <p className="mt-2 font-medium">{pet.name}</p>
      </div>
    </Tooltip>
  )
}

export default PetSelectItem
