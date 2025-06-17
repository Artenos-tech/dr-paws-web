"use client"

import React, { useCallback, useEffect, useState } from "react"
import SelectDoctorCard from "./SelectDoctorCard"
import CustomButton from "./CustomButton"
import SelectCalendar from "./SelectCalendar"
import { format, isSameDay } from "date-fns"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { Pet, useUserContext } from "@/context/UserContext"
import toast, { Toaster } from "react-hot-toast"
import { ClipLoader } from "react-spinners"
import { BookingCategory } from "./SelectService"
import BestAvailableVetCard from "./BestAvailableVetCard"
import ConfirmationModal from "./ConfirmationModal"

export interface SelectedVet {
  id: string
  name: string
  displayImage: string | null
}

interface selectVetProps {
  selectedSvcId: string
  selectedPet: Pet
  selectedClinic: string
  selectedLocation: string
  selectedService: string
  selectedSubtype: BookingCategory | null
  isGrooming: boolean
  isReschedule: boolean
  // existingAppointmentId: string | null
  setFinalAppointmentData: (finalAppData: {
    selectedDoctor: SelectedVet | null
    selectedDate: Date | null
    selectedSlot: string | null
    selectedSlotEnd: string | null
    appliedCoupon: string | null
  }) => void
  onNext?: () => void
}

const BEST_AVAILABLE_VET_ID = "best-available"

const SelectVet: React.FC<selectVetProps> = ({
  selectedClinic,
  selectedSvcId,
  selectedPet,
  selectedSubtype,
  selectedLocation,
  selectedService,
  setFinalAppointmentData,
  isGrooming,
  onNext,
  isReschedule,
  // existingAppointmentId,
}) => {
  const { user } = useUserContext()

  const [selectedDoctor, setSelectedDoctor] = useState<SelectedVet | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string
    endTime: string
  } | null>(null)
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [chosenVetId, setChosenVetId] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState<string>("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const {
    call: getSlotsForStaff,
    result: slotsForStaffResult,
    loading: loadingSlotsForStaff,
  } = useAPICall(api.getSlotsForStaff)

  const {
    call: getGroomingSlots,
    result: groomingSlotsResult,
    loading: loadingGroomingSlots,
  } = useAPICall(api.getSlotsForGrooming)

  const {
    call: getBestAvailableVetSchedule,
    result: bestAvailableVetScheduleResult,
    loading: loadingBestAvailableVetSchedule,
  } = useAPICall(api.getBestAvailableVetSchedule)

  const { call: getCouponCodes, result: couponCodes } = useAPICall(
    api.getCouponCodes,
  )

  const { call: createAnAppointment, loading: loadingAppointmentCreation } =
    useAPICall(api.createAppointment)

  // const { call: rescheduleAppointment, loading: loadingRescheduleAppointment } =
  //   useAPICall(api.rescheduleAppointment)

  const {
    call: getDoctorsForClinic,
    result: doctorsResult,
    loading: loadingDoctors,
  } = useAPICall(api.getDoctorsForClinic)

  const { call: getDoctor } = useAPICall(api.getDoctor)

  const fetchSlotsForStaff = useCallback(async () => {
    if (!selectedDoctor) {
      throw new Error("Doctor must be selected")
    }
    if (
      selectedSvcId &&
      selectedSubtype &&
      selectedClinic &&
      selectedPet &&
      !isGrooming
    ) {
      await getSlotsForStaff({
        staffid: selectedDoctor.id,
        clinicid: selectedClinic,
        catalogue: selectedSubtype.id,
        petid: selectedPet.id,
        pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
        // isgrooming: isGrooming ? "y" : "n",
        date: format(selectedDate, "dd/MM/yyyy"),
      })
    }
  }, [
    selectedSvcId,
    selectedDoctor,
    selectedClinic,
    getSlotsForStaff,
    isGrooming,
  ])

  const fetchGroomingSlots = useCallback(async () => {
    if (
      selectedSvcId &&
      selectedSubtype &&
      selectedClinic &&
      selectedPet &&
      isGrooming
    ) {
      await getGroomingSlots({
        clinicid: selectedClinic,
        catalogue: selectedSubtype.id,
        petid: selectedPet.id,
        pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
        date: format(selectedDate, "dd/MM/yyyy"),
      })
    }
  }, [
    selectedSvcId,
    selectedSubtype,
    selectedClinic,
    selectedPet,
    selectedDate,
    isGrooming,
  ])

  const fetchBestAvailableVetSlots = useCallback(async () => {
    if (selectedSvcId && selectedSubtype && selectedClinic && selectedPet) {
      await getBestAvailableVetSchedule({
        clinicid: selectedClinic,
        catalogue: selectedSubtype.id,
        petid: selectedPet.id,
        pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
        // isgrooming: isGrooming ? "y" : "n",
        date: format(selectedDate, "dd/MM/yyyy"),
      })
    }
  }, [selectedClinic, selectedSvcId, selectedDate])

  const fetchDoctors = useCallback(async () => {
    if (selectedSubtype && selectedPet) {
      await getDoctorsForClinic({
        clinicid: selectedClinic,
        grooming: isGrooming ? "y" : "n",
        catalogue: selectedSubtype?.id,
        date: format(selectedDate, "dd/MM/yyyy"),
        petid: selectedPet.id,
        pettype: selectedPet.type as "DOG" | "CAT" | "OTHER",
      })
    }
  }, [selectedClinic, getDoctorsForClinic])

  // on initial mount, for non grooming appts
  useEffect(() => {
    getCouponCodes({})
    if (!isGrooming) fetchDoctors()
    else fetchGroomingSlots()
  }, [])

  // when a different doctor is selected
  useEffect(() => {
    if (!selectedDoctor || isGrooming) return
    setSelectedSlot(null)
    const isBestAvailable = selectedDoctor.id === BEST_AVAILABLE_VET_ID
    if (isBestAvailable) fetchBestAvailableVetSlots()
    else fetchSlotsForStaff()
  }, [selectedDoctor])

  // for best available vet
  useEffect(() => {
    if (
      selectedDoctor?.id === BEST_AVAILABLE_VET_ID &&
      selectedSlot &&
      selectedDate &&
      bestAvailableVetScheduleResult?.ok
    ) {
      try {
        const vetId = selectPreferredOrRandomAvailableVetId()
        setChosenVetId(vetId)
      } catch (err) {
        console.error("Vet selection error:", err)
        setChosenVetId(null)
      }
    }
  }, [
    selectedSlot,
    selectedDoctor,
    selectedDate,
    bestAvailableVetScheduleResult,
  ])

  // when a different date is selected
  useEffect(() => {
    if ((selectedDoctor || isGrooming) && selectedDate) {
      if (selectedDoctor && selectedDoctor.id === BEST_AVAILABLE_VET_ID)
        fetchBestAvailableVetSlots()
      else if (selectedDoctor && !isGrooming) fetchSlotsForStaff()
      else fetchGroomingSlots()
    }
  }, [selectedDate])

  function selectPreferredOrRandomAvailableVetId(): string {
    if (!bestAvailableVetScheduleResult?.ok) {
      throw new Error("Best available vet schedule not loaded")
    }
    if (!selectedDate) {
      throw new Error("Date must be selected")
    }
    if (!selectedSlot) {
      throw new Error("Slot must be selected")
    }

    const { slots, preferredVets } = bestAvailableVetScheduleResult.value.body

    const matchedSlot = slots.find(
      (slot) =>
        slot.startTime === selectedSlot.startTime &&
        slot.endTime === selectedSlot.endTime,
    )

    if (!matchedSlot || matchedSlot.staffIds.length === 0) {
      throw new Error("No available vets for the selected slot")
    }

    // Find preferred vets who are available in this slot
    const preferredAvailableVets = preferredVets
      .filter(({ staffId }) => matchedSlot.staffIds.includes(staffId))
      .sort((a, b) => b.appCount - a.appCount)

    if (preferredAvailableVets.length > 0) {
      const maxAppCount = Math.max(
        ...preferredAvailableVets.map((vet) => vet.appCount),
      )
      const topVets = preferredAvailableVets
        .map((vet, index) => ({ ...vet, index }))
        .filter((vet) => vet.appCount === maxAppCount)

      const randomTopVet = topVets[Math.floor(Math.random() * topVets.length)]

      return preferredAvailableVets[randomTopVet.index].staffId
    }

    // Pick a random vet from available staff for the slot
    const randomIndex = Math.floor(Math.random() * matchedSlot.staffIds.length)
    return matchedSlot.staffIds[randomIndex]
  }

  const handleNextClick = async () => {
    if (!(selectedDoctor || isGrooming)) {
      toast.error("Doctor must be selected or grooming must be selected")
      return
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot before proceeding.")
      return
    }
    const selectedDoc =
      selectedDoctor?.id === BEST_AVAILABLE_VET_ID &&
      doctors.find((doc) => doc.id === chosenVetId)
    setFinalAppointmentData({
      selectedDoctor: selectedDoc || selectedDoctor,
      selectedDate,
      selectedSlot: selectedSlot?.startTime ?? null,
      selectedSlotEnd: selectedSlot?.endTime ?? null,
      appliedCoupon: appliedCoupon,
    })
    setIsConfirmationModalOpen(true)
  }

  const handleConfirmBooking = async () => {
    if (!isReschedule) {
      setIsConfirmationModalOpen(false)
      if (user && selectedSlot && selectedDate && selectedDoctor) {
        try {
          const response = await createAnAppointment({
            vet_id:
              selectedDoctor.id === BEST_AVAILABLE_VET_ID && chosenVetId
                ? chosenVetId
                : selectedDoctor.id,
            pet_id: selectedPet.id,
            clinic_id: selectedClinic,
            // appt_reason: selectedSubtype?.title || null,
            appt_start: selectedSlot.startTime.replace(":", ""),
            appt_end: selectedSlot.endTime.replace(":", ""),
            booking_date: format(selectedDate, "dd/MM/yyyy"),
            appt_type_id: selectedSvcId,
            subtype_id: selectedSubtype?.id as string,
            pet_type: selectedPet.type as "DOG" | "CAT" | "OTHER",
            is_grooming: isGrooming,
            ...(appliedCoupon && {
              coupon_code: appliedCoupon,
            }),
          })
          if (response.ok) {
            toast.success("Appointment created successfully!", {
              duration: 3000,
              position: "bottom-right",
            })
            if (onNext) {
              onNext() // Navigate to the next page only if the API succeeds
            }
          } else {
            toast.error("Failed to create appointment. Please try again.", {
              duration: 3000,
              position: "bottom-right",
            })
          }
        } catch (error) {
          console.error("Error creating appointment:", error)
          toast.error("An unexpected error occurred. Please try again.", {
            duration: 3000,
            position: "bottom-right",
          })
        }
      } else {
        toast.error("Please fill out all required fields before proceeding.", {
          duration: 3000,
          position: "bottom-right",
        })
      }
    } else {
      setIsConfirmationModalOpen(false)
      // if (
      //   user &&
      //   selectedSlot &&
      //   selectedDate &&
      //   selectedDoctor &&
      //   existingAppointmentId
      // ) {
      //   const [hours, minutes] = selectedSlot.split(":").map(Number)
      //   selectedDate.setHours(hours, minutes, 0, 0)
      //   const apptStartUnixTimestamp = Math.floor(selectedDate.getTime() / 1000)
      //   selectedDate.setMinutes(
      //     selectedDate.getMinutes() +
      //       (!isGrooming ? 30 : selectedSubtype?.id === "spa-bath" ? 60 : 90),
      //   )
      //   const apptEndUnixTimestamp = Math.floor(selectedDate.getTime() / 1000)
      //   try {
      //     const response = await rescheduleAppointment({
      //       appointmentid: existingAppointmentId,
      //       vet_id:
      //         selectedDoctor.id === BEST_AVAILABLE_VET_ID
      //           ? selectPreferredOrRandomAvailableVetId()
      //           : selectedDoctor.id,
      //       appt_start: apptStartUnixTimestamp,
      //       appt_end: apptEndUnixTimestamp,
      //     })
      //     if (response.ok) {
      //       toast.success("Appointment rescheduled successfully!", {
      //         duration: 3000,
      //         position: "bottom-right",
      //       })
      //       if (onNext) {
      //         onNext()
      //       }
      //     } else {
      //       toast.error("Failed to reschedule appointment. Please try again.", {
      //         duration: 3000,
      //         position: "bottom-right",
      //       })
      //     }
      //   } catch (error) {
      //     console.error("Error rescheduling appointment:", error)
      //     toast.error("An unexpected error occurred. Please try again.", {
      //       duration: 3000,
      //       position: "bottom-right",
      //     })
      //   }
      // } else {
      //   toast.error("Please fill out all required fields before proceeding.", {
      //     duration: 3000,
      //     position: "bottom-right",
      //   })
      // }
    }
  }

  const handleDateSelect = (date: Date) => {
    if (!isSameDay(date, selectedDate)) {
      setSelectedDate(date)
      setSelectedSlot(null)
    }
  }

  const handleSlotSelect = async (time: {
    startTime: string
    endTime: string
    staffIds?: string[]
  }) => {
    setSelectedSlot(
      selectedSlot && selectedSlot.startTime === time.startTime ? null : time,
    )
    if (time.staffIds && isGrooming) {
      const response = await getDoctor({
        staffid:
          time.staffIds[Math.floor(Math.random() * time.staffIds.length)],
      })
      if (response.ok) {
        const doctor = response.value.body.staff
        setSelectedDoctor(doctor)
      }
    }
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code")
      setCouponError("Please enter a coupon code.")
      setAppliedCoupon(null)
      return
    }
    const validCoupons = couponCodes?.ok ? couponCodes.value.body.codes : []
    const found = validCoupons.find(
      (code) => code.toLowerCase() === couponCode.trim().toLowerCase(),
    )
    if (!found) {
      toast.error("Invalid coupon code")
      setCouponError("Invalid coupon code. Please try again.")
      setCouponCode("")
      setAppliedCoupon(null)
    } else {
      toast.success("Coupon applied!")
      setCouponError(null)
      setAppliedCoupon(found)
    }
  }

  const doctors = doctorsResult?.ok ? doctorsResult.value.body.staff : []

  const availableSlotsLoading =
    loadingSlotsForStaff ||
    loadingBestAvailableVetSchedule ||
    loadingGroomingSlots

  const availableSlotsError =
    slotsForStaffResult?.ok === false ||
    bestAvailableVetScheduleResult?.ok === false ||
    groomingSlotsResult?.ok === false

  const availableSlots =
    selectedDoctor && !isGrooming
      ? selectedDoctor.id === BEST_AVAILABLE_VET_ID
        ? bestAvailableVetScheduleResult?.ok
          ? bestAvailableVetScheduleResult.value.body.slots
          : null
        : slotsForStaffResult?.ok
          ? slotsForStaffResult.value.body.slots
          : null
      : groomingSlotsResult?.ok
        ? groomingSlotsResult.value.body.slots
        : null

  const isNextButtonEnabled =
    (selectedDoctor !== null || isGrooming) &&
    // selectedDate !== null &&
    selectedSlot !== null

  if (loadingDoctors) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-12 px-4 lg:px-0">
      {!isGrooming && (
        <div>
          <h1 className="text-3xl font-bold mb-2">Select Vet</h1>
          <p className="text-gray-600 mb-12">
            Which of our experts would you like to see?
          </p>
          <DoctorSelectionCarousel
            options={doctors}
            selectedDoctor={selectedDoctor}
            onDoctorSelected={(doctor) => {
              setSelectedDoctor(doctor)
              setSelectedDate(new Date()) // Reset date and slot on doctor change
            }}
          />
        </div>
      )}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Select Date and Time</h1>
          <p className="text-gray-600 mb-4">When would you like to visit us?</p>
        </div>

        {
          (selectedDoctor || isGrooming) &&
            (availableSlotsLoading ? (
              <div className="m-auto my-1">
                <ClipLoader color="#33495f" />
              </div>
            ) : availableSlotsError ? (
              <p className="text-gray-500 text-sm">
                Cannot load the available slots. Please try again later.
              </p>
            ) : availableSlots ? (
              <AppointmentDateAndTimeSelector
                show={false}
                selectedDate={selectedDate}
                onDateSelected={handleDateSelect}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelected={handleSlotSelect}
              />
            ) : null) // result starts out as undefined before API call is made
        }
      </div>
      {/* Coupon Code Section */}
      {(selectedDoctor || isGrooming) &&
        selectedDate &&
        selectedSlot &&
        couponCodes && (
          <div className="flex">
            <div className="w-full max-w-md">
              <h2 className="text-lg font-semibold">Have a coupon code?</h2>
              <p className="text-gray-600 mb-4">
                Enter it below to redeem your discount
              </p>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className={`w-full border ${
                    couponError
                      ? "border-red-500"
                      : appliedCoupon
                        ? "border-green-500"
                        : "border-gray-300"
                  } rounded-md py-2 px-4 pr-24`}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase())
                    setCouponError(null)
                    if (appliedCoupon) setAppliedCoupon(null)
                  }}
                  // disabled={!!appliedCoupon}
                />
                {!appliedCoupon && (
                  <button
                    className="absolute right-1 top-1 bottom-1 my-auto bg-secondary-1 text-white px-4 py-1.5 rounded-md text-sm"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </button>
                )}
              </div>
              {couponError && (
                <p className="text-red-500 text-sm mt-2">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-green-600 text-sm mt-2 font-medium">
                  Coupon <span className="font-bold">{appliedCoupon}</span>{" "}
                  applied!
                </p>
              )}
            </div>
          </div>
        )}
      <div className="my-4 flex justify-center">
        <CustomButton
          buttonText={isReschedule ? "Reschedule" : "Book"}
          buttonBackground="bg-secondary-1"
          disabled={
            !isNextButtonEnabled || loadingAppointmentCreation
            // || loadingRescheduleAppointment
          }
          loading={
            isNextButtonEnabled && loadingAppointmentCreation
            // || loadingRescheduleAppointment
          }
          buttonClickEvent={handleNextClick}
        />
      </div>
      {selectedDate && selectedSlot && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmBooking}
          bookingDetails={{
            petName: selectedPet.name,
            service: selectedSubtype?.title || selectedService,
            doctorName:
              selectedDoctor && selectedDoctor.id === BEST_AVAILABLE_VET_ID
                ? doctors.find((doc) => {
                    return doc.id === chosenVetId
                  })?.name
                : !isGrooming
                  ? selectedDoctor?.name
                  : undefined,
            location: selectedLocation,
            date: selectedDate,
            slot: selectedSlot.startTime,
            couponCode: appliedCoupon,
          }}
        />
      )}
      <Toaster />
    </div>
  )
}

const DoctorSelectionCarousel = ({
  options,
  selectedDoctor,
  onDoctorSelected,
}: {
  options: SelectedVet[]
  selectedDoctor: SelectedVet | null
  onDoctorSelected: (doctor: SelectedVet) => void
}) => {
  return (
    <Carousel className="pr-1 w-[90%] sm:w-full mx-auto">
      <CarouselContent className="-ml-1">
        <CarouselItem
          key={"best"}
          className="basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
        >
          <BestAvailableVetCard
            isSelected={selectedDoctor?.id === BEST_AVAILABLE_VET_ID}
            onSelected={() =>
              onDoctorSelected({
                id: BEST_AVAILABLE_VET_ID,
                name: "Best Available Vet",
                displayImage: null,
              })
            }
          />
        </CarouselItem>
        {options.map((doctor) => (
          <CarouselItem
            key={doctor.id}
            className="basis-full sm:basis-5/12 lg:basis-1/4 xl:basis-1/5"
          >
            <SelectDoctorCard
              doctor={doctor}
              isSelected={selectedDoctor?.id === doctor.id}
              onDoctorSelect={(id, name, displayImage) => {
                onDoctorSelected({ id, name, displayImage })
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const AppointmentDateAndTimeSelector = ({
  show,
  selectedDate,
  onDateSelected,
  availableSlots,
  selectedSlot,
  onSlotSelected,
}: {
  show: boolean
  selectedDate: Date
  onDateSelected: (date: Date) => void
  availableSlots: Array<{
    startTime: string
    endTime: string
    staffIds?: string[]
  }>
  selectedSlot: { startTime: string; endTime: string } | null
  onSlotSelected: (slot: { startTime: string; endTime: string }) => void
}) => {
  return (
    <div className="flex flex-col justify-center items-center xl:flex-row gap-8">
      <div
        className={`w-full flex-shrink-0 lg:w-1/2 xl:w-1/3 ${
          show ? "opacity-100 pointer-events-none" : ""
        }`}
      >
        <SelectCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelected}
        />
      </div>

      {/* Timeslots Section */}
      {selectedDate && (
        <div className="w-full">
          <div className="font-semibold text-xs text-gray-800 lg:text-lg">
            Available timeslots for{" "}
            <span className="text-secondary-1">
              {format(selectedDate, "EEEE, MMM d")}
            </span>
          </div>
          <div
            className=" w-full grid grid-cols-2 gap-2 lg:gap-4 mt-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))",
            }}
          >
            {availableSlots &&
            Array.isArray(availableSlots) &&
            availableSlots.length > 0 ? (
              availableSlots.map((time, index) => (
                <button
                  key={index}
                  type="button"
                  className={` text-center bg-primary-3 py-2 px-6 sm:py-1 sm:px-6 lg:py-2 lg:px-8 w-full rounded-md cursor-pointer shadow-md ${
                    selectedSlot?.startTime === time.startTime
                      ? "border border-secondary-1"
                      : ""
                  }`}
                  onClick={() => onSlotSelected(time)}
                >
                  {time.startTime}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No slots available for the selected date. Please try another
                day.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectVet
