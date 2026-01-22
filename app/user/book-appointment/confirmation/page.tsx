"use client"

import { useAPICall } from "@/hooks/apicall"
import { useSearchParams } from "next/navigation"
import atHomeAPIClient from "@/services/api.athome"
import { Suspense, useEffect, useState } from "react"
import { AppointmentDetails } from "@/model/typeDefinitions"
import { petImageByType } from "@/components/ui/PetCard"
import { BsCheckCircleFill } from "react-icons/bs"
import Image from "next/image"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import { parse } from "date-fns"
import { MdOutlineAccessTime } from "react-icons/md"

const BookingConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams()
  // const navigate = useRouter()
  const appointmentId = searchParams.get("appointment_id")
  const subBookingId = searchParams.get("sub_booking_id")
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<AppointmentDetails | null>(null)
  const {
    call: getBookingById,
    result: getBookingByIdResult,
    loading: loadingGetBookingById,
  } = useAPICall(atHomeAPIClient.getAppointmentDetails)

  useEffect(() => {
    if (appointmentId && subBookingId)
      getBookingById({
        appointment_id: appointmentId,
        sub_booking_id: subBookingId,
      })
  }, [appointmentId, subBookingId])

  useEffect(() => {
    if (getBookingByIdResult?.ok) {
      setConfirmedAppointment(getBookingByIdResult.value.body.data.appointment)
    }
  }, [getBookingByIdResult])

  const defaultPetImageByType =
    petImageByType[confirmedAppointment?.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  if (loadingGetBookingById || !confirmedAppointment) {
    return
  }

  return (
    <Suspense>
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
              {confirmedAppointment?.pet_name} is scheduled for a{" "}
              {confirmedAppointment?.appt_type_title}
            </p>
            <div className="flex items-center my-4 relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-whitep-3 flex justify-center items-center">
                <Image
                  src={
                    confirmedAppointment?.pet_profile_image ||
                    defaultPetImageByType
                  }
                  alt={`${confirmedAppointment?.pet_name}'s profile`}
                  layout="fill"
                  objectFit="cover"
                  sizes="128px"
                  priority
                />
              </div>
              <div className="my-4 space-y-3">
                <p className={`flex items-center gap-2`}>
                  <span className="text-secondary-1">
                    <GrLocation />
                  </span>{" "}
                  {confirmedAppointment?.address?.tag}
                </p>
                <p className={`flex items-center gap-2`}>
                  <span className="text-secondary-1">
                    <HiOutlineCalendar />
                  </span>
                  {parse(
                    confirmedAppointment.booking_date,
                    "dd-MM-yyyy",
                    new Date(),
                  ).toLocaleDateString("en-IN", {
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
                  {confirmedAppointment.appt_start} -{" "}
                  {confirmedAppointment.appt_end}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default BookingConfirmationPage
