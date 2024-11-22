import { AppointmentType } from "@/model/typeDefinitions";
import React from "react";
import OutlineButton from "./OutlineButton";
import { customDate } from "./UpcomingAppointmentCard";
import Image from "next/image";

type CancelledCardProps = {
  cancelledAppointment: AppointmentType;
};

const CancelledAppointmentCard: React.FC<CancelledCardProps> = ({
  cancelledAppointment,
}) => {
  return (
    <div className="p-4 border-l-4 border-l-[#C6C4C4] bg-[#F1F1F1] flex flex-col gap-3 rounded-lg shadow-md w-full">
      <div className="text-xs flex justify-between">
        <p className="text-[#909090]">{cancelledAppointment.status}</p>
        <p className="bg-[#E0E0E0] text-primary-1 px-2 py-1 rounded-md">
          {cancelledAppointment.service}
        </p>
      </div>

      <div className="flex items-center">
        <Image
          src={cancelledAppointment.petImage}
          alt="pet-image"
          width={50}
          height={50}
        />
        <Image
          src={cancelledAppointment.vetImage}
          alt="vet-image"
          width={50}
          height={50}
          className="ml-[-18px]"
        />
      </div>
      <div className="space-y-1 text-[#909090]">
        <p className="font-semibold">
          {cancelledAppointment.petName} and {cancelledAppointment.vetName}
        </p>
        <p>{customDate(cancelledAppointment.date)}</p>
        <p>{cancelledAppointment.time}</p>
      </div>
      <div className="self-end">
        <OutlineButton outlineBtnText="View Details" />
      </div>
    </div>
  );
};

export default CancelledAppointmentCard;
