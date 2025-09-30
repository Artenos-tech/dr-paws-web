import { BsCheckCircleFill } from "react-icons/bs"
import Image, { StaticImageData } from "next/image"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import { MdOutlineAccessTime } from "react-icons/md"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { Pet } from "@/context/UserContext"
import CustomButton from "./CustomButton"
import { petImageByType } from "./PetCard"

type RescheduleConfirmedProps = {
  isGroomingAppointment: boolean
  updatedValues: {
    selectedSvcId: string
    selectedPet: Pet
    selectedClinic: string
    selectedLocation: string
    selectedService: string
    selectedSubtype?: string
    selectedVet: {
      id: string
      name: string
    } | null
    selectedDoctorImage: string | StaticImageData | null
    selectedDate: Date
    selectedSlot: string
    selectedSlotEnd: string
  }
  oldValues: {
    oldVet: {
      id: string
      name: string
    }
    oldDoctorImage: string | StaticImageData | null
    oldDate: Date
    oldSlot: string
    oldSlotEnd: string
  }
  onDone: () => void
}
const RescheduleConfirmed: React.FC<RescheduleConfirmedProps> = ({
  isGroomingAppointment,
  updatedValues,
  oldValues,
  onDone,
}) => {
  const defaultPetImageByType =
    petImageByType[updatedValues.selectedPet.type?.toLowerCase() || "other"] ||
    petImageByType.other

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center gap-4 items-center">
        <h1 className="text-3xl flex items-center gap-4">
          Booking Rescheduled <BsCheckCircleFill fill="#5281a2" />
        </h1>
        <div
          className={`p-4 text-primary-1 shadow-md my-5 flex flex-col gap-2 items-center
              bg-[#FFFCF3]`}
        >
          <p className="text-lg font-semibold mt-4 text-center">
            {updatedValues.selectedPet.name} is scheduled for a{" "}
            {isGroomingAppointment && updatedValues.selectedSubtype
              ? `${updatedValues.selectedSubtype}!`
              : `${updatedValues.selectedService}`}
            {isGroomingAppointment
              ? ""
              : ` with ${updatedValues.selectedVet!.name}`}
          </p>
          <div className="flex items-center my-4 relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-whitep-3 flex justify-center items-center">
              <Image
                src={
                  updatedValues.selectedPet.profileImage ||
                  defaultPetImageByType
                }
                alt={`${updatedValues.selectedPet.name}'s profile`}
                layout="fill"
                objectFit="cover"
                sizes="128px"
              />
            </div>
            {!isGroomingAppointment && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-4 ml-[-30px] flex justify-center items-center">
                <Image
                  src={updatedValues.selectedDoctorImage || defaultVetImage}
                  alt={`Dr. ${updatedValues.selectedVet?.name}'s profile`}
                  objectFit="cover"
                  sizes="128px"
                />
              </div>
            )}
          </div>
          <div className="my-4 space-y-3">
            <p className={`flex items-center gap-2`}>
              <span className="text-secondary-1">
                <GrLocation />
              </span>{" "}
              {updatedValues.selectedLocation}
            </p>
            <p className={`flex items-center gap-2`}>
              <span className="text-secondary-1">
                <HiOutlineCalendar />
              </span>
              {updatedValues.selectedDate.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className={`flex items-center gap-2`}>
              <span className="text-secondary-1">
                <MdOutlineAccessTime />
              </span>
              {updatedValues?.selectedSlot} - {updatedValues?.selectedSlotEnd}
            </p>
            <p className={`flex items-center gap-2`}>Former Timings</p>
            <p className={`flex items-center gap-2 line-through`}>
              <span className="text-secondary-1">
                <HiOutlineCalendar />
              </span>
              {oldValues.oldDate.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className={`flex items-center gap-2 line-through`}>
              <span className="text-secondary-1">
                <MdOutlineAccessTime />
              </span>
              {oldValues.oldSlot} - {oldValues.oldSlotEnd}
            </p>
          </div>
          <div className="flex items-center">
            <CustomButton
              buttonText="Done"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={onDone}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RescheduleConfirmed
