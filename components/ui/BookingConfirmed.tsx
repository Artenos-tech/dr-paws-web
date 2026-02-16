import { Pet } from "@/context/UserContext"
import { BsCheckCircleFill } from "react-icons/bs"
import Image from "next/image"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import { MdOutlineAccessTime } from "react-icons/md"
import CustomButton from "./CustomButton"
import { useRouter } from "next/navigation"
import { petImageByType } from "./PetCard"
import { SelectedVet } from "./SelectVet"

type BookingConfirmedProps = {
  isGroomingAppointment: boolean
  selectedAppointment: {
    selectedSvcId: string
    selectedPet: Pet
    selectedClinic: string
    selectedLocation: string
    selectedClinicContact: string
    selectedService: string
    selectedSubtype?: string
    groomingCatalogueKeys?: string[]
    selectedVet: SelectedVet | null
    selectedDate: Date
    selectedSlot: string
    selectedSlotEnd: string
    appliedCoupon: string | null
  }
}
const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  isGroomingAppointment,
  selectedAppointment,
}) => {
  const navigate = useRouter()

  const defaultPetImageByType =
    petImageByType[
      selectedAppointment.selectedPet.type?.toLowerCase() || "other"
    ] || petImageByType.other
  const groomingHasHaircut =
    selectedAppointment.groomingCatalogueKeys?.includes("haircut") || false

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center gap-4 items-center">
        <h1 className="text-3xl flex items-center gap-4">
          Booking Confirmed <BsCheckCircleFill fill="#5281a2" />
        </h1>
        <div
          className={`p-4 text-primary-1 shadow-md my-5 flex flex-col gap-2 items-center
              bg-[#FFFCF3]`}
        >
          <p className="text-lg font-semibold mt-4 text-center">
            {selectedAppointment.selectedPet.name} is scheduled for a{" "}
            {isGroomingAppointment
              ? groomingHasHaircut
                ? "Spa Bath + Haircut"
                : "Spa Bath"
              : `${selectedAppointment.selectedService}`}
            {isGroomingAppointment
              ? ""
              : ` with ${selectedAppointment.selectedVet!.name}`}
          </p>
          <div className="flex items-center my-4 relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-whitep-3 flex justify-center items-center">
              <Image
                src={
                  selectedAppointment.selectedPet.profileImage ||
                  defaultPetImageByType
                }
                alt={`${selectedAppointment.selectedPet.name}'s profile`}
                layout="fill"
                objectFit="cover"
                sizes="128px"
                priority
              />
            </div>
            {!isGroomingAppointment && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-8 ml-[-30px] flex justify-center items-center">
                <Image
                  src={
                    selectedAppointment.selectedVet?.displayImage ||
                    defaultVetImage
                  }
                  alt={`Dr. ${selectedAppointment.selectedVet?.name}'s profile`}
                  objectFit="cover"
                  sizes="128px"
                  width={128}
                  height={128}
                />
              </div>
            )}
          </div>
          <div className="my-4 space-y-3">
            <p className={`flex items-center gap-2`}>
              <span className="text-secondary-1">
                <GrLocation />
              </span>{" "}
              {selectedAppointment.selectedLocation}
            </p>
            <p className={`flex items-center gap-2`}>
              <span className="text-secondary-1">
                <HiOutlineCalendar />
              </span>
              {selectedAppointment.selectedDate.toLocaleDateString("en-IN", {
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
              {selectedAppointment?.selectedSlot} -{" "}
              {selectedAppointment?.selectedSlotEnd}
            </p>
          </div>
          {selectedAppointment.appliedCoupon && (
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-md font-medium text-secondary-1">
                Coupon Code applied: <b>{selectedAppointment.appliedCoupon}</b>
              </div>
              <div className="text-sm">Discount redeemable at checkout</div>
            </div>
          )}
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <p className="italic text-gray-400 text-sm text-center w-full max-w-md justify-self-center">
              You’ll receive a confirmation via WhatsApp. You can cancel or
              reschedule your appointment through the app/website or by
              contacting our {selectedAppointment.selectedLocation} clinic at{" "}
              {selectedAppointment.selectedClinicContact}. You’ll receive a
              WhatsApp message confirming any changes.
            </p>
          </div>
          <div className="flex items-center">
            <CustomButton
              buttonText="Done"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={() => navigate.push("/user/my-appointments")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmed
