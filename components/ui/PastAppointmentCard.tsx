import { AppointmentType } from '@/model/typeDefinitions';
import React from 'react'
import OutlineButton from './OutlineButton';
import { customDate } from './UpcomingAppointmentCard';
import Image from 'next/image';

type PastCardProps = {
    pastAppointment: AppointmentType;
  };

const PastAppointmentCard:React.FC<PastCardProps> = ({pastAppointment}) => {
  return (
    <div className="p-4 border-l-4 border-l-primary-2 bg-primary-3 flex flex-col gap-3 rounded-lg shadow-md w-full">
      <div className="text-xs flex justify-between">
        <p className="text-secondary-1">Visited</p>
        <p className="bg-primary-2 text-primary-1 px-2 py-1 rounded-md">
          {pastAppointment.service}
        </p>
      </div>

      <div className="flex items-center">
        <Image
          src={pastAppointment.petImage}
          alt="pet-image"
          width={50}
          height={50}
        />
        <Image
          src={pastAppointment.vetImage}
          alt="vet-image"
          width={50}
          height={50}
          className="ml-[-18px]"
        />
      </div>
      <div className="space-y-1 text-primary-1">
        <p className="font-semibold">
          {pastAppointment.petName} and {pastAppointment.vetName}
        </p>
        <p>{customDate(pastAppointment.date)}</p>
        <p>{pastAppointment.time}</p>
      </div>
      <div className="self-end">
        <OutlineButton outlineBtnText="View Details" />
      </div>
    </div>
  )
}

export default PastAppointmentCard
