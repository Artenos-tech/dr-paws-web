"use client"

import React, { useEffect, useState } from "react"
import { BookingCategory } from "@/components/ui/SelectService"
import SelectVet, { SelectedVet } from "@/components/ui/SelectVet"
import { Pet } from "@/context/UserContext"
import RescheduleConfirmed from "@/components/ui/RescheduleConfirmed"
import { AppointmentDetails } from "@/model/typeDefinitions"
import BackButton from "./BackButton"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"

type ReschedulingProps = {
  existingAppointment: AppointmentDetails
  onBack: () => void
  onDone: () => void
  onError: () => void
}

const RescheduleAppointment: React.FC<ReschedulingProps> = ({
  existingAppointment,
  onBack,
  onDone,
  onError,
}) => {
  const [selectedAppointment, setSelectedAppointmentState] = useState<{
    selectedServiceId: string | null
    selectedService: string | null
    selectedSubtype: BookingCategory | null
    groomingCatalogueKeys: string[]
    selectedPet: Pet | null
    isGrooming: boolean
    selectedClinic: string | null
    selectedLocation: string | null
    selectedDoctor: SelectedVet | null
    selectedDate: Date | null
    selectedSlot: string | null
    selectedSlotEnd: string | null
  }>({
    selectedServiceId: existingAppointment.appt_type ?? null,
    selectedService: existingAppointment.appt_type,
    selectedSubtype: null,
    groomingCatalogueKeys: [],
    selectedPet: {
      name: existingAppointment.pet_name,
      type: existingAppointment.pet_type || null,
      breed: null,
      // weight: "kg",
      gender: null,
      dob: null,
      profileImage: existingAppointment.pet_profile_image,
      id: existingAppointment.pet_id,
      breedId: null,
    },
    isGrooming: existingAppointment.appt_type == "GROOMING",
    selectedClinic: existingAppointment.clinic_id,
    selectedLocation: existingAppointment.clinic_location ?? null,
    selectedDoctor: null,
    selectedDate: null,
    selectedSlot: null,
    selectedSlotEnd: null,
  })
  const [done, setDone] = useState(false)

  function notNull<T>(value: T | null): Exclude<T, null> {
    if (value === null) {
      throw new Error(`Value must not be null, got ${value}`)
    }
    return value as Exclude<T, null>
  }

  const {
    call: getAppointmentServiceDetails,
    loading: loadingServiceDetails,
    result: apptServiceDetails,
  } = useAPICall(api.getAppointmentServiceDetails)

  useEffect(() => {
    if (existingAppointment) {
      getAppointmentServiceDetails({ appointment_id: existingAppointment.id })
    }
  }, [existingAppointment])

  if (loadingServiceDetails) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (!apptServiceDetails?.ok) {
    return
  }
  const serviceDetails = apptServiceDetails.value.body.serviceDetails
  const rescheduleCatalogueKeys = selectedAppointment.isGrooming
    ? serviceDetails.catalogue_keys || []
    : []

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
                onRescheduleError={() => {
                  onError()
                }}
                selectedClinic={notNull(selectedAppointment.selectedClinic)}
                selectedSvcId={notNull(
                  apptServiceDetails.value.body.serviceDetails.id,
                )}
                selectedPet={notNull(selectedAppointment.selectedPet)}
                selectedLocation={notNull(selectedAppointment.selectedLocation)}
                selectedService={notNull(selectedAppointment.selectedService)}
                selectedSubtype={
                  selectedAppointment.isGrooming
                    ? null
                    : notNull(serviceDetails.subtype)
                }
                groomingCatalogueKeys={rescheduleCatalogueKeys}
                isGrooming={selectedAppointment.isGrooming}
                isReschedule={true}
                setFinalAppointmentData={(appData) => {
                  setSelectedAppointmentState((prev) => ({
                    ...prev,
                    ...appData,
                  }))
                }}
                existingAppointment={{
                  appointmentId: existingAppointment.id,
                  subBookingId: existingAppointment.sub_booking_id,
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
                groomingCatalogueKeys: rescheduleCatalogueKeys,
                selectedPet: notNull(selectedAppointment.selectedPet),
                selectedClinic: notNull(selectedAppointment.selectedClinic),
                selectedLocation: notNull(selectedAppointment.selectedLocation),
                selectedVet: selectedAppointment.selectedDoctor ?? null,
                selectedDate: notNull(selectedAppointment.selectedDate),
                selectedSlot: notNull(selectedAppointment.selectedSlot),
                selectedSlotEnd: notNull(selectedAppointment.selectedSlotEnd),
                selectedDoctorImage:
                  selectedAppointment.selectedDoctor?.displayImage || null,
              }}
              oldValues={{
                oldVet: {
                  id: existingAppointment.vet_id ?? null,
                  name: existingAppointment.vet_name ?? null,
                },
                oldDoctorImage: existingAppointment.vet_image || null,
                oldDate: new Date(existingAppointment.booking_date),
                oldSlot: existingAppointment.appt_start,
                oldSlotEnd: existingAppointment.appt_end,
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
