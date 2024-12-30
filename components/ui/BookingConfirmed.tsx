import { Pet } from "@/context/UserContext";
import { BsCheckCircleFill } from "react-icons/bs";
import Image from "next/image";
import { doctorImagesMap } from "@/model/mockData";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCalendar } from "react-icons/hi";
import { MdOutlineAccessTime } from "react-icons/md";
import { addMinutes, format, parse } from "date-fns";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";
import { petImageByType } from "./PetCard";

type BookingConfirmedProps = {
  isGroomingAppointment: boolean;
  selectedAppointment: {
    selectedSvcId: number;
    selectedPet: Pet;
    selectedClinic: number;
    selectedLocation: string;
    selectedClinicContact: string;
    selectedService: string;
    selectedSubtype?: string;
    selectedVet: {
      id: number;
      name: string;
    } | null;
    selectedDoctorImage: string | null;
    selectedDate: Date;
    selectedSlot: string;
  };
};
const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  isGroomingAppointment,
  selectedAppointment,
}) => {
  const navigate = useRouter();
  const addMinutesToTime = (time: string, minutes: number): string => {
    try {
      const parsedTime = parse(time, "HH:mm", new Date());
      const updatedTime = addMinutes(parsedTime, minutes);
      return format(updatedTime, "HH:mm");
    } catch (error) {
      console.error("Error parsing time:", error);
      return "";
    }
  };

  const defaultPetImageByType =
    petImageByType[
      selectedAppointment.selectedPet.type?.toLowerCase() || "other"
    ] || petImageByType.other;

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
            {isGroomingAppointment && selectedAppointment.selectedSubtype
              ? `${selectedAppointment.selectedSubtype}!`
              : `${selectedAppointment.selectedService}`}
            {isGroomingAppointment
              ? ""
              : ` with ${selectedAppointment.selectedVet!.name}`}
          </p>
          <div className="flex items-center my-4">
            <div className="bg-white rounded-full w-[130px] h-[130px] p-3 flex justify-center items-center">
              <Image
                src={
                  selectedAppointment.selectedPet.profileImage ||
                  defaultPetImageByType
                }
                alt="pet-image"
                width={130}
                height={130}
                className="rounded-full"
              />
            </div>
            {selectedAppointment.selectedDoctorImage &&
              doctorImagesMap[selectedAppointment.selectedDoctorImage] && (
                <div className="bg-white rounded-full w-[130px] h-[130px] p-8 ml-[-30px] border flex justify-center items-center">
                  <Image
                    src={
                      doctorImagesMap[selectedAppointment.selectedDoctorImage]
                    }
                    alt="vet-image"
                    width={100}
                    height={100}
                    className="rounded-full"
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
              {selectedAppointment.selectedDate.toLocaleDateString("en-US", {
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
              {selectedAppointment?.selectedSlot &&
                addMinutesToTime(selectedAppointment.selectedSlot, 30)}
            </p>
          </div>
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <p className="italic text-gray-400 text-sm text-center w-full max-w-md">
              To cancel or reschedule your appointment, please contact our{" "}
              {selectedAppointment.selectedLocation} clinic on{" "}
              {selectedAppointment.selectedClinicContact}
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
  );
};

export default BookingConfirmed;
