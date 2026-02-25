import { ClipLoader } from "react-spinners"

type ConfirmationType = "CANCEL" | "RESCHEDULE" | null

type ConfirmationProps = {
  confirmationType: ConfirmationType
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationCard = ({
  confirmationType,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationProps) => {
  const isCancel = confirmationType === "CANCEL"

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl">
        {isCancel ? "Cancel Booking" : "Reschedule Booking"}
      </h1>

      <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-6 items-center bg-[#FFFCF3] rounded-lg">
        <h1 className="text-center text-2xl font-semibold font-sans">
          {isCancel
            ? "Are you sure you want to cancel this booking?"
            : "Are you sure you want to reschedule this booking?"}
        </h1>

        <p className="text-center">
          You will receive a Whatsapp notification confirming the{" "}
          {confirmationType === "RESCHEDULE" ? "rescheduled" : "cancellation"}
          {" "}booking
        </p>

        <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-full text-sm text-white bg-secondary-1"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
          >
            {loading ? <ClipLoader color="#33495f" size={18} /> : "Yes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationCard
