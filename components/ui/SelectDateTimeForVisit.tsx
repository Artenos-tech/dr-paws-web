"use client"

import React, { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { z } from "zod"
import ClipLoader from "react-spinners/ClipLoader"
import toast from "react-hot-toast"

interface SelectDateTimeForVisitProps {
  addressId?: string
  date?: string
  slot?: { startTime: string; endTime: string }
  isConfirmationModalOpen?: boolean
  isConfirming?: boolean
  onConfirm: (
    date: string,
    slot: { startTime: string; endTime: string },
  ) => void
}

type Slot = { startTime: string; endTime: string }
type DaySlots = { date: string; slots: Slot[] }

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
  date: initialDate,
  slot: initialSlot,
  isConfirmationModalOpen,
  isConfirming,
}) => {
  const {
    call: getAtHomeSlots,
    result: atHomeSlotsResult,
    loading: loadingSlots,
  } = useAPICall(mockAtHomeClient.getAtHomeSlots)

  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDate || null,
  )
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(
    initialSlot || null,
  )
  const [days, setDays] = useState<DaySlots[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isConfirmationModalOpen && isProcessing && !isConfirming) {
      setIsProcessing(false)
    }
  }, [isConfirmationModalOpen, isProcessing, isConfirming])

  useEffect(() => {
    if (!addressId) return
    getAtHomeSlots({ addressid: addressId })
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
    if (days.length && !selectedDate && !initialDate) {
      setSelectedDate(days[0].date)
    }
  }, [days, selectedDate, initialDate])

  const activeDay = useMemo(
    () => days.find((d) => d.date === selectedDate),
    [days, selectedDate],
  )

  const handleProceedClick = () => {
    if (!selectedDate || !selectedSlot) return
    setIsProcessing(true)
    onConfirm(selectedDate, selectedSlot)
  }

  if (!addressId) {
    return (
      <div className="w-full mt-4">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            Address ID is missing. Please go back and select an address.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-2">When should our vet arrive?</h1>
      <p className="text-gray-600 mb-6">
        Choose a convenient slot for your at-home visit
      </p>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {days.slice(0, 5).map((day) => {
          const formatted = formatDate(day.date)
          const isActive = selectedDate === day.date
          return (
            <button
              key={day.date}
              onClick={() => {
                setSelectedDate(day.date)
                setSelectedSlot(null)
              }}
              className={clsx(
                "rounded-lg border-2 p-2 text-center text-sm transition",
                isActive
                  ? "border-secondary-1"
                  : "border-gray-300 hover:border-secondary-1",
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeDay.slots.map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime
              return (
                <button
                  key={`${slot.startTime}-${slot.endTime}`}
                  onClick={() => setSelectedSlot(slot)}
                  className={clsx(
                    "rounded-lg border-2 px-3 py-2 text-sm transition",
                    isSelected
                      ? "border-secondary-1"
                      : "border-gray-300 hover:border-secondary-1",
                  )}
                >
                  {formatTime(slot.startTime)}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-center mb-10">
        <button
          disabled={!selectedDate || !selectedSlot || isProcessing}
          onClick={handleProceedClick}
          className="btn rounded-full text-white px-10 py-2 tracking-wider bg-secondary-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isProcessing && <ClipLoader size={16} color="#ffffff" />}
          {isProcessing ? "Processing..." : "Proceed to Pay"}
        </button>
      </div>
    </div>
  )
}

export default SelectDateTimeForVisit
