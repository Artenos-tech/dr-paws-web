import React from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"
import SelectAddress from "./SelectAddress"

interface AtHomeBookingFlowProps {
  onBackToStart: () => void
}

const AtHomeBookingFlow: React.FC<AtHomeBookingFlowProps> = ({
  onBackToStart,
}) => {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBackToStart}
        className="flex gap-1 mb-4 items-center self-start"
      >
        <MdOutlineKeyboardArrowLeft /> Back
      </button>

      <SelectAddress />
    </div>
  )
}

export default AtHomeBookingFlow
