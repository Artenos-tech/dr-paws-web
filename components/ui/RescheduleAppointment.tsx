"use client"

import React, { useState } from "react"
import { BookingCategory } from "@/components/ui/SelectService"
import SelectVet, { SelectedVet } from "@/components/ui/SelectVet"
import { Pet } from "@/context/UserContext"
import RescheduleConfirmed from "@/components/ui/RescheduleConfirmed"
import { AppointmentType } from "@/model/typeDefinitions"
import BackButton from "./BackButton"
import { doctorImagesMap } from "@/model/mockData"

function convertToSlots(appt_start: string, appt_end: string) {
  const startDate = new Date(appt_start)
  const endDate = new Date(appt_end)

  // Convert to +5:30 timezone
  const timeZoneOffset = 5.5 * 60 * 60 * 1000

  const date =
    new Date(startDate.getTime() + timeZoneOffset).toISOString().split("T")[0] +
    "T12:30:00.000Z"

  const formatTime = (date: Date): string => {
    const hours = date.getUTCHours().toString().padStart(2, "0")
    const minutes = date.getUTCMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const slot = formatTime(new Date(startDate.getTime() + timeZoneOffset))
  const slotEnd = formatTime(new Date(endDate.getTime() + timeZoneOffset))

  return {
    date,
    slot,
    slotEnd,
  }
}

type ReschedulingProps = {
  existingAppointment: AppointmentType
  onBack: () => void
  onDone: () => void
}

const RescheduleAppointment: React.FC<ReschedulingProps> = ({
  existingAppointment,
  onBack,
  onDone
}) => {
  const [selectedAppointment, setSelectedAppointmentState] = useState<{
    selectedServiceId: number | null
    selectedService: string | null
    selectedSubtype: BookingCategory | null
    selectedPet: Pet | null
    isGrooming: boolean
    selectedClinic: number | null
    selectedLocation: string | null
    selectClinicContact: string | null
    selectedDoctor: SelectedVet | null
    selectedDate: Date | null
    selectedSlot: string | null
    selectedSlotEnd: string | null
  }>({
    selectedServiceId: existingAppointment.appt_type_id,
    selectedService: existingAppointment.appt_type,
    selectedSubtype: null,
    selectedPet: {
      name: existingAppointment.pet_name,
      type: existingAppointment.pet_type || null,
      breed: null,
      weight: "kg",
      gender: null,
      dob: null,
      profileImage: existingAppointment.pet_profile_image,
      vetPortId: existingAppointment.pet_vetport_id,
    },
    isGrooming: existingAppointment.appt_type == "Grooming",
    selectedClinic: existingAppointment.clinic_id,
    selectedLocation: existingAppointment.clinic_location,
    selectClinicContact: existingAppointment.clinic_contact,
    selectedDoctor: null,
    selectedDate: null,
    selectedSlot: null,
    selectedSlotEnd: null,
  })

  const oldSlotDetails = convertToSlots(
    existingAppointment.appt_start,
    existingAppointment.appt_end
  )

  const [done, setDone] = useState(false)

  function notNull<T>(value: T | null): Exclude<T, null> {
    if (value === null) {
      throw new Error(`Value must not be null, got ${value}`)
    }
    return value as Exclude<T, null>
  }

  return (
    <div className="font-roca pb-20 h-full w-full">
      <main className="flex flex-col items-center w-full mt-4">
        <div className="w-full">
          {!done && (
            <>
              <BackButton navigateBack={onBack} />
              <SelectVet
                onNext={() => {
                  setDone(true)
                }}
                selectedClinic={notNull(selectedAppointment.selectedClinic)}
                selectedSvcId={notNull(selectedAppointment.selectedServiceId)}
                selectedPet={notNull(selectedAppointment.selectedPet)}
                selectedLocation={notNull(selectedAppointment.selectedLocation)}
                selectedService={notNull(selectedAppointment.selectedService)}
                selectedSubtype={selectedAppointment.selectedSubtype}
                isGrooming={selectedAppointment.isGrooming}
                isReschedule={true}
                existingAppointmentId={existingAppointment.id}
                setFinalAppointmentData={(appData) => {
                  setSelectedAppointmentState((prev) => ({
                    ...prev,
                    ...appData,
                  }))
                }}
              />
            </>
          )}

          {done && (
            <RescheduleConfirmed
              isGroomingAppointment={selectedAppointment.isGrooming}
              updatedValues={{
                selectedSvcId: notNull(selectedAppointment.selectedServiceId),
                selectedService: notNull(selectedAppointment.selectedService),
                selectedSubtype: selectedAppointment.selectedSubtype?.title,
                selectedPet: notNull(selectedAppointment.selectedPet),
                selectedClinic: notNull(selectedAppointment.selectedClinic),
                selectedLocation: notNull(selectedAppointment.selectedLocation),
                selectedVet: selectedAppointment.selectedDoctor,
                selectedDate: notNull(selectedAppointment.selectedDate),
                selectedSlot: notNull(selectedAppointment.selectedSlot),
                selectedSlotEnd: notNull(selectedAppointment.selectedSlotEnd),
                selectedDoctorImage: selectedAppointment.selectedDoctor
                  ? selectedAppointment.selectedDoctor.image.type === "url"
                    ? selectedAppointment.selectedDoctor.image.value
                    : doctorImagesMap[selectedAppointment.selectedDoctor.image.value]
                  : null,
              }}
              oldValues={{
                oldVet: {
                  id: existingAppointment.vet_vetport_id,
                  name: existingAppointment.vet_name,
                },
                oldDoctorImage: existingAppointment.vet_image
                ? existingAppointment.vet_image.type === "url"
                  ? existingAppointment.vet_image.value
                  : doctorImagesMap[existingAppointment.vet_image.value]
                : null,
                oldDate: new Date(oldSlotDetails.date),
                oldSlot: oldSlotDetails.slot,
                oldSlotEnd: oldSlotDetails.slotEnd,
              }}
              onDone={onDone}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default RescheduleAppointment
