import { useAPICall } from "@/hooks/apicall";
import { BsCheckCircleFill } from "react-icons/bs";

type BookingConfirmedProps = {
  selectedAppointment: {
    selectedData: Record<number, {name: string} | null>;
    selectedClinic: number | null;
    selectedLocation: string | null;
    selectedDoctor: Record<number, string> | null;
    selectedDate: Date | null;
    selectedSlot: string | null;
  } 
}
const BookingConfirmed: React.FC<BookingConfirmedProps> = ({
  selectedAppointment,
}) => {

  const { call: getDoctors, result: getDoctorsResult } = useAPICall(api.getDoctors)
  
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
              {/* {selectedAppointment?.selectedData &&
                Object.keys(selectedAppointment.selectedData).includes(
                  "Grooming"
                ) ? (
                `${
                  Object.values(selectedAppointment?.selectedData || {})[0]
                    ?.name
                } is scheduled`
              ) : (
                `${
                  Object.values(selectedAppointment?.selectedData || {})[0]
                    ?.name
                } is scheduled with ${selected?.name}`} */}
            </p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmed;