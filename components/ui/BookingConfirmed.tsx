import { Pet } from "@/context/UserContext";
import { BsCheckCircleFill } from "react-icons/bs";
import defaultPetImage from "@/public/assets/images/Appointments/petImage.png";
import Image from "next/image";
import { doctorImagesMap } from "@/model/mockData";
import { GrLocation } from "react-icons/gr";
import { HiOutlineCalendar } from "react-icons/hi";
import { MdOutlineAccessTime } from "react-icons/md";
import { addMinutes, format, parse } from "date-fns";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

type BookingConfirmedProps = {
  selectedAppointment: {
    selectedData: Record<number, Pet>;
    selectedClinic: number;
    selectedLocation: string;
    selectedService: string;
    selectedDoctor: Record<number, string>  | null;
    selectedDoctorImage: string;
    selectedDate: Date;
    selectedSlot: string;
  } 
}
const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  selectedAppointment,
}) => {
  console.log(Object.values(selectedAppointment));
  
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
  
  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center gap-4 items-center">
        <h1 className="text-3xl flex items-center gap-4">
          Booking Confirmed <BsCheckCircleFill fill="#5281a2" />
        </h1>
        <div
            className={
              `p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center
              bg-[#FFFCF3]`}
          >
            <p className="text-lg font-semibold mt-4">
              {
                Object.values(selectedAppointment.selectedData)[0]?.name
              }
              {
                ` is scheduled`
              } 
              { 
                selectedAppointment?.selectedData &&
                !Object.keys(selectedAppointment.selectedData).includes("Grooming") &&
                selectedAppointment?.selectedDoctor &&
                ` with ${Object.values(selectedAppointment.selectedDoctor)[0]}`
              }
            </p>
            <p>
              for {selectedAppointment.selectedService}
            </p>
            <>
            <div className="flex items-center my-4">
            <div className="bg-white rounded-full w-[130px] h-[130px] p-3 flex justify-center items-center">
              <Image
                src={defaultPetImage}
                alt="pet-image"
                width={130}
                height={130}
                className="rounded-full"
              />
            </div>
            <div className="bg-white rounded-full w-[130px] h-[130px] p-8 ml-[-30px] border flex justify-center items-center">
              <Image
                src={doctorImagesMap[selectedAppointment.selectedDoctorImage]}
                alt="vet-image"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            </div>
            </>
            <div className="my-4 space-y-3">
              <p
                className={`flex items-center gap-2`}
              >
                <span className="text-secondary-1">
                  <GrLocation />
                </span>{" "}
                {selectedAppointment.selectedLocation}
              </p>
              <p
                className={`flex items-center gap-2`}
              >
                <span className="text-secondary-1">
                  <HiOutlineCalendar />
                </span>
                {selectedAppointment.selectedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p
                className={`flex items-center gap-2`}
              >
                <span className="text-secondary-1">
                  <MdOutlineAccessTime />
                </span>
                {selectedAppointment?.selectedSlot} -{" "}
                {selectedAppointment?.selectedSlot &&
                  addMinutesToTime(
                    selectedAppointment.selectedSlot,
                    selectedAppointment.selectedData &&
                      Object.keys(
                        selectedAppointment.selectedData
                      ).includes("Grooming")
                      ? 90
                      : 30
                  )}
              </p>
            </div>
            <p className="italic text-gray-400 text-sm w-3/4 text-center">
              Note: For cancel or reschedule, please contact
              {selectedAppointment.selectedLocation === "RMV (Dollars Colony)"
                ? ` +91 7204996899
              (RMV Dollar Colony)`
                : ` +91 9606994627 (Indiranagar)`}
            </p> 
            <div className="flex items-center">
              <CustomButton
                buttonText="Done"
                buttonBackground="bg-secondary-1"
                buttonClickEvent={() =>
                  navigate.push("/user/my-appointments")
                }
              />
            </div>    
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmed;