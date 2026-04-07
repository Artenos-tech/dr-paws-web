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
type HomeVisitPricingSummary = {
  base_amount: number
  discount_amount: number
  final_amount: number
  coupon_applied: boolean
  coupon_code: string | null
}
interface SelectDateTimeForVisitProps {
  addressId: string
  petId: string
  date?: string
  slot?: Slot
  isConfirmationModalOpen?: boolean
  isConfirming?: boolean
  pricingSummary?: HomeVisitPricingSummary | null
  isLoadingPaymentAmount?: boolean
  isApplyingCoupon?: boolean
  couponCode?: string
  appliedCoupon?: string | null
  couponError?: string | null
  onCouponCodeChange?: (value: string) => void
  onApplyCoupon?: (date: string, slot: Slot) => Promise<void>
  onConfirm: (date: string, slot: Slot) => void
  onSlotsLoaded?: (firstAvailableSlot: Slot, date: string) => void
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
  pricingSummary,
  isLoadingPaymentAmount,
  isApplyingCoupon = false,
  couponCode = "",
  appliedCoupon = null,
  couponError = null,
  onCouponCodeChange,
  onApplyCoupon,
  onSlotsLoaded,
}) => {
  const {
    call: getAtHomeSlots,
    result: atHomeSlotsResult,
    loading: loadingSlots,
  } = useAPICall(atHomeApiClient.getAtHomeSlots)

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
      // Pre-fetch payment amount using the first available slot so the amount
      // is ready before the user selects anything.
      for (const day of parseResult.data.data.days) {
        const firstAvailable = day.slots.find((s) => s.available)
        if (firstAvailable) {
          onSlotsLoaded?.(firstAvailable, day.date)
          break
        }
      }
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
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedSlot && (isLoadingPaymentAmount || pricingSummary) && (
        <div className="mb-8">
          <p className="font-bold text-gray-600 mb-3">Amount</p>
          {isLoadingPaymentAmount ? (
            <div className="animate-pulse h-5 w-24 bg-gray-200 rounded" />
          ) : (
            <div className="space-y-1">
              {pricingSummary && pricingSummary.discount_amount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  INR {pricingSummary.base_amount}
                </p>
              )}
              <p className="font-bold text-gray-600">
                INR {pricingSummary?.final_amount}
              </p>
              {pricingSummary && pricingSummary.discount_amount > 0 && (
                <p className="text-sm font-medium text-green-600">
                  Coupon {pricingSummary.coupon_code} applied: INR{" "}
                  {pricingSummary.discount_amount} off
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {selectedDate && selectedSlot && onCouponCodeChange && onApplyCoupon && (
        <div className="mb-8 flex">
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
                onChange={(e) => onCouponCodeChange(e.target.value)}
              />
              {!appliedCoupon && (
                <button
                  type="button"
                  className="absolute right-1 top-1 bottom-1 my-auto bg-secondary-1 text-white px-4 py-1.5 rounded-md text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={() => onApplyCoupon(selectedDate, selectedSlot)}
                  disabled={isApplyingCoupon}
                >
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </button>
              )}
            </div>
            {couponError && (
              <p className="text-red-500 text-sm mt-2">{couponError}</p>
            )}
            {appliedCoupon && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Coupon Code <span className="font-bold">{appliedCoupon}</span>{" "}
                applied!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center mb-10">
        <Tooltip
          color="#f7f1de"
          styles={{ body: { color: "#33495f" } }}
          title={
            !selectedSlot
              ? "Select time slot to proceed"
              : isLoadingPaymentAmount
                ? "Loading payment amount..."
                : ""
          }
        >
          <button
            disabled={
              !selectedDate ||
              !selectedSlot ||
              isProcessing ||
              !!isLoadingPaymentAmount
            }
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
