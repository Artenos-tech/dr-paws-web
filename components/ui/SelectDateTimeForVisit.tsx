"use client"

import React, { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import { z } from "zod"
import ClipLoader from "react-spinners/ClipLoader"
import toast from "react-hot-toast"
import { Tooltip } from "antd"

type Slot = { startTime: string; endTime: string }
type SlotWithAvailability = Slot & { available: boolean }
interface SelectDateTimeForVisitProps {
  addressId: string
  petId: string
  date?: string
  slot?: Slot
  isConfirmationModalOpen?: boolean
  isConfirming?: boolean
  onConfirm: (date: string, slot: Slot) => void
  isReschedule?: boolean
}

type DaySlots = { date: string; slots: SlotWithAvailability[] }

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
  }
}

const formatTime = (time: string) => {
  const [h, m] = time.split(":").map(Number)
  const date = new Date()
  date.setHours(h, m)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const slotSchema = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  available: z.boolean(),
})

const daySlotsSchema = z.object({
  date: z.string().min(1),
  slots: z.array(slotSchema),
})

const responseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    days: z.array(daySlotsSchema),
  }),
})

const SelectDateTimeForVisit: React.FC<SelectDateTimeForVisitProps> = ({
  onConfirm,
  addressId,
  petId,
  date: initialDate,
  slot: initialSlot,
  isConfirmationModalOpen,
  isConfirming,
  isReschedule,
}) => {
  const {
    call: getAtHomeSlots,
    result: atHomeSlotsResult,
    loading: loadingSlots,
  } = useAPICall(atHomeApiClient.getAtHomeSlots)

  const {
    call: getHomeVisitPaymentAmount,
    result: homeVisitPaymentAmountResult,
    loading: homeVisitPaymentAmountLoading,
  } = useAPICall(atHomeApiClient.getHomeVisitPaymentAmount)

  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDate || null,
  )
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(
    initialSlot || null,
  )
  const [days, setDays] = useState<DaySlots[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Convert date (YYYY-MM-DD) to UTC ISO string
  function convertBookingDateToIso(date: string) {
    const dateParts = date.split("-")
    return new Date(
      Date.UTC(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2]),
      ),
    ).toISOString()
  }

  useEffect(() => {
    if (!isConfirmationModalOpen && isProcessing && !isConfirming) {
      setIsProcessing(false)
    }
  }, [isConfirmationModalOpen, isProcessing, isConfirming])

  useEffect(() => {
    if (!addressId) return
    getAtHomeSlots({ addressid: addressId, petid: petId })
  }, [addressId])

  useEffect(() => {
    if (!atHomeSlotsResult) return

    if (!atHomeSlotsResult.ok) {
      toast.error("Failed to load available slots. Please try again.")
      setDays([])
      return
    }

    const parseResult = responseSchema.safeParse(atHomeSlotsResult.value.body)
    if (parseResult.success) {
      setDays(parseResult.data.data.days)
    } else {
      console.error("Invalid slot data format:", parseResult.error)
      toast.error("Invalid slot data received. Please contact support.")
      setDays([])
    }
  }, [atHomeSlotsResult])

  useEffect(() => {
    if (!addressId || !selectedDate || !selectedSlot) return
    getHomeVisitPaymentAmount({
      address_id: addressId,
      pet_id: petId,
      booking_date: convertBookingDateToIso(selectedDate),
      appt_start: selectedSlot.startTime,
      appt_end: selectedSlot.endTime,
    })
  }, [addressId, selectedDate, selectedSlot])

  useEffect(() => {
    if (days.length && !selectedDate && !initialDate) {
      setSelectedDate(days[0].date)
    }
  }, [days, selectedDate, initialDate])

  const activeDay = useMemo(
    () => days.find((d) => d.date === selectedDate),
    [days, selectedDate],
  )

  const handleProceedClick = () => {
    if (isProcessing) return
    if (!selectedDate || !selectedSlot) return
    setIsProcessing(true)
    onConfirm(selectedDate, selectedSlot)
  }

  if (!addressId) {
    return (
      <div className="w-full mt-4">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            Address is missing. Please go back and select an address.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-2">When should our vet arrive?</h1>
      <p className="text-gray-600 mb-6">
        Choose a convenient slot for your home visit
      </p>
      <div className={clsx(isProcessing && "pointer-events-none opacity-70")}>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {days.slice(0, 5).map((day) => {
            const formatted = formatDate(day.date)
            const isActive = selectedDate === day.date
            return (
              <button
                key={day.date}
                disabled={isProcessing}
                onClick={() => {
                  if (isProcessing) return
                  setSelectedDate(day.date)
                  setSelectedSlot(null)
                }}
                className={clsx(
                  "bg-primary-3 rounded-lg p-2 text-center text-sm transition border-2",
                  isActive
                    ? "border-secondary-1"
                    : "border-transparent hover:border-secondary-1",
                )}
              >
                <div className="font-semibold">{formatted.day}</div>
                <div className="text-xs">{formatted.date}</div>
              </button>
            )
          })}
        </div>

        <div className="mb-8">
          <p className="font-bold text-gray-600 mb-3">Available slots</p>

          {loadingSlots && (
            <div className="flex justify-center items-center py-6">
              <ClipLoader color="#4f46e5" size={24} />
            </div>
          )}

          {!loadingSlots && (!activeDay || activeDay.slots?.length === 0) && (
            <p className="text-sm text-gray-500">
              No slots available for this date
            </p>
          )}

          {!loadingSlots && activeDay && activeDay.slots?.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-3">
              {activeDay.slots.map((slot) => {
                const isSelected = selectedSlot?.startTime === slot.startTime
                return (
                  <button
                    key={`${slot.startTime}-${slot.endTime}`}
                    onClick={() => {
                      if (isProcessing) return

                      setSelectedSlot(slot)
                    }}
                    disabled={!slot.available || isProcessing}
                    className={clsx(
                      "bg-primary-3 flex items-center justify-center gap-1 rounded-lg border-2 px-3 py-2 text-xs sm:text-sm transition duration-150",
                      isSelected
                        ? "border-secondary-1 bg-secondary-1/10 shadow-md"
                        : slot.available
                          ? "border-transparent hover:border-secondary-1 hover:bg-secondary-1/5"
                          : "border-transparent bg-gray-100 text-gray-400 cursor-not-allowed opacity-60",
                    )}
                  >
                    <span>{formatTime(slot.startTime)}</span>
                    <span>-</span>
                    <span>{formatTime(slot.endTime)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedDate && selectedSlot && (
        <div className="mb-8">
          <p className="font-bold text-gray-600 mb-3">Amount</p>
          {homeVisitPaymentAmountLoading && (
            <div className="flex justify-center items-center py-6">
              <ClipLoader color="#4f46e5" size={24} />
            </div>
          )}
          {!homeVisitPaymentAmountLoading &&
            !homeVisitPaymentAmountResult?.ok && (
              <p className="text-sm text-gray-500">
                Payment information could not be retrieved. Please try again
                later.
              </p>
            )}
          {!homeVisitPaymentAmountLoading &&
            homeVisitPaymentAmountResult &&
            homeVisitPaymentAmountResult.ok && (
              <p className="font-bold text-gray-600 mb-3">
                INR {homeVisitPaymentAmountResult.value.body.data.amount}
              </p>
            )}
        </div>
      )}

      <div className="flex flex-col items-center justify-center mb-10">
        <Tooltip
          color="#f7f1de"
          styles={{ body: { color: "#33495f" } }}
          title={!selectedSlot ? "Select time slot to proceed" : ""}
        >
          <button
            disabled={!selectedDate || !selectedSlot || isProcessing}
            onClick={handleProceedClick}
            className="btn rounded-full text-white px-10 py-2 tracking-wider bg-secondary-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing && <ClipLoader size={16} color="#ffffff" />}
            {isProcessing
              ? "Processing..."
              : isReschedule
                ? "Reschedule"
                : "Proceed to Pay"}
          </button>
        </Tooltip>
        {isProcessing && !isReschedule && (
          <p className="mt-2 text-xs text-gray-500">
            Do not go back. Initiating payment
          </p>
        )}
      </div>
    </div>
  )
}

export default SelectDateTimeForVisit
