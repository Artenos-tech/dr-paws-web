import { Pet } from "@/context/UserContext";
import { BsCheckCircleFill } from "react-icons/bs";

type BookingConfirmedProps = {
  selectedAppointment: {
    selectedData: Record<number, Pet>;
    selectedClinic: number;
    selectedLocation: string;
    selectedDoctor: Record<number, string>;
    selectedDate: Date;
    selectedSlot: string;
  } 
}
const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  selectedAppointment,
}) => {
  console.log(Object.values(selectedAppointment.selectedData)[0]);
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
                ` with ${Object.values(selectedAppointment.selectedDoctor)[0]}`
              }
            </p>
            <p>
              for 
              {/* {bookingDetails?.service}  */}
              {/* {appointmentId
                ? " Service" // TO-DO: Later give booking service
                : selectedAppointment?.selectedData &&
                  Object.keys(selectedAppointment.selectedData).includes(
                    "Grooming"
                  )
                ? " Grooming"
                : ` ${serviceType} consultation`} */}
            </p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmed;