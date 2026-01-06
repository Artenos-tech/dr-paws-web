"use client"

import React, { useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { useAPICall } from "@/hooks/apicall"
import { mockAtHomeClient } from "@/services/api.athome"
import { z } from "zod"
import ClipLoader from "react-spinners/ClipLoader"

interface SelectDateTimeForVisitProps {
  addressId?: string
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
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
})

const daySlotsSchema = z.object({
  date: z.string().nonempty(),
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
}) => {
  const { call, result, loading } = useAPICall(mockAtHomeClient.getAtHomeSlots)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [days, setDays] = useState<DaySlots[]>([])

  useEffect(() => {
    if (!addressId) return
    call({ addressid: addressId })
  }, [addressId])

  useEffect(() => {
    if (result && "value" in result) {
      const parseResult = responseSchema.safeParse(result.value.body)
      if (parseResult.success) {
        setDays(parseResult.data.data.days)
      } else {
        setDays([])
      }
    }
  }, [result])

  useEffect(() => {
    if (days.length && !selectedDate) setSelectedDate(days[0].date)
  }, [days])

  const activeDay = useMemo(
    () => days.find((d) => d.date === selectedDate),
    [days, selectedDate],
  )

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

        {loading && (
          <div className="flex justify-center items-center py-6">
            <ClipLoader color="#4f46e5" size={24} />
          </div>
        )}

        {!loading && activeDay?.slots?.length === 0 && (
          <p className="text-sm text-gray-500">No slots available</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {activeDay?.slots?.map((slot, idx) => {
            const isSelected = selectedSlot?.startTime === slot.startTime
            return (
              <button
                key={idx}
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
      </div>

      <div className="flex justify-center mb-10">
        <button
          disabled={!selectedDate || !selectedSlot}
          onClick={() =>
            selectedDate &&
            selectedSlot &&
            onConfirm(selectedDate, selectedSlot)
          }
          className={clsx(
            "btn rounded-full text-white px-10 py-2 tracking-wider bg-secondary-1",
            (!selectedDate || !selectedSlot) && "opacity-50 cursor-not-allowed",
          )}
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  )
}

export default SelectDateTimeForVisit
