"use client"

import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  User,
  CalendarDays,
  Clock,
  Loader2,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react"
import {
  v3FetchDoctors,
  v3FetchAvailableDates,
  v3FetchTimeSlots,
  v3FetchBestSlots,
  type V3Doctor,
  type V3TimeSlot,
  type V3BestSlot,
  type V3PreferredDoctor,
} from "@/services/api.v3"

interface Props {
  clinicId: string
  initialDoctor?: V3Doctor | null
  priceInRupees: number
  seniorPriceInRupees: number
  mode?: "booking" | "reschedule"
  onSelect: (doctor: V3Doctor, date: string, slot: V3TimeSlot) => void
  onSeniorVetPicked: (doctor: V3Doctor, date: string, slot: V3TimeSlot) => void
  onSelectionInvalidated?: () => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

interface CalendarProps {
  availableDates: Set<string>
  selectedDate: string | null
  onSelectDate: (d: string) => void
}

function MiniCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const days = daysInMonth(viewYear, viewMonth)
  const todayStr = toDateStr(today)

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else setViewMonth(viewMonth - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else setViewMonth(viewMonth + 1)
  }

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })

  const cells: (string | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= days; d++) {
    const pad = String(viewMonth + 1).padStart(2, "0")
    cells.push(`${viewYear}-${pad}-${String(d).padStart(2, "0")}`)
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-primary-1">
          {monthLabel}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-xs text-gray-400 font-medium py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={`empty-${i}`} />
          const isAvailable = availableDates.has(dateStr)
          const isSelected = selectedDate === dateStr
          const isPast = dateStr < todayStr
          return (
            <button
              key={dateStr}
              onClick={() => isAvailable && !isPast && onSelectDate(dateStr)}
              disabled={!isAvailable || isPast}
              className={[
                "aspect-square rounded-lg text-xs font-medium transition-all",
                isSelected
                  ? "bg-primary-2 text-white"
                  : isAvailable && !isPast
                    ? "bg-primary-2/10 text-primary-2 hover:bg-primary-2 hover:text-white"
                    : "text-gray-300 cursor-default",
              ].join(" ")}
            >
              {new Date(dateStr + "T00:00:00").getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function resolveDoctor(
  slot: V3BestSlot,
  preferredDoctors: V3PreferredDoctor[],
  allDoctors: V3Doctor[],
): V3Doctor {
  for (const { doctorId } of preferredDoctors) {
    if (slot.doctorIds.includes(doctorId)) {
      return (
        allDoctors.find((d) => d.id === doctorId) ?? {
          id: doctorId,
          name: slot.doctorNames[doctorId],
        }
      )
    }
  }
  const id = slot.doctorIds[0]
  return (
    allDoctors.find((d) => d.id === id) ?? { id, name: slot.doctorNames[id] }
  )
}

export default function StepVetDateTime({
  clinicId,
  initialDoctor,
  priceInRupees,
  seniorPriceInRupees,
  mode: flowMode = "booking",
  onSelect,
  onSeniorVetPicked,
  onSelectionInvalidated,
}: Props) {
  const [mode, setMode] = useState<"specific" | "best">("specific")
  const [seniorOnly, setSeniorOnly] = useState(false)

  // ── Specific-vet mode state ───────────────────────────────────────────────
  const [doctors, setDoctors] = useState<V3Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<V3Doctor | null>(
    initialDoctor ?? null,
  )
  const [loadingDoctors, setLoadingDoctors] = useState(true)

  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [loadingDates, setLoadingDates] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const [slots, setSlots] = useState<V3TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // ── Best-available mode state ─────────────────────────────────────────────
  const [bestAvailableDates, setBestAvailableDates] = useState<Set<string>>(
    new Set(),
  )
  const [loadingBestDates, setLoadingBestDates] = useState(false)
  const [bestSelectedDate, setBestSelectedDate] = useState<string | null>(null)

  const [bestSlots, setBestSlots] = useState<V3BestSlot[]>([])
  const [preferredDoctors, setPreferredDoctors] = useState<V3PreferredDoctor[]>(
    [],
  )
  const [loadingBestSlots, setLoadingBestSlots] = useState(false)

  const slotsRef = useRef<HTMLDivElement>(null)

  // ── Specific-vet effects ──────────────────────────────────────────────────
  useEffect(() => {
    setLoadingDoctors(true)
    v3FetchDoctors(clinicId)
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoadingDoctors(false))
  }, [clinicId])

  useEffect(() => {
    if (!selectedDoctor) return
    setLoadingDates(true)
    setSelectedDate(null)
    setSlots([])

    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 29)

    v3FetchAvailableDates(
      clinicId,
      selectedDoctor.id,
      toDateStr(today),
      toDateStr(endDate),
    )
      .then((dates) => setAvailableDates(new Set(dates)))
      .catch(console.error)
      .finally(() => setLoadingDates(false))
  }, [selectedDoctor, clinicId])

  useEffect(() => {
    if (!selectedDate || !selectedDoctor) return
    setLoadingSlots(true)
    setSlots([])

    v3FetchTimeSlots(clinicId, selectedDate, selectedDoctor.id)
      .then(setSlots)
      .catch(console.error)
      .finally(() => setLoadingSlots(false))
  }, [selectedDate, selectedDoctor, clinicId])

  useEffect(() => {
    if (!selectedDate) return
    const timer = setTimeout(() => {
      slotsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 150)
    return () => clearTimeout(timer)
  }, [selectedDate, loadingSlots])

  // ── Best-available effects ────────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "best") return
    setLoadingBestDates(true)
    setBestSelectedDate(null)
    setBestSlots([])

    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 29)

    v3FetchAvailableDates(
      clinicId,
      undefined,
      toDateStr(today),
      toDateStr(endDate),
    )
      .then((dates) => setBestAvailableDates(new Set(dates)))
      .catch(console.error)
      .finally(() => setLoadingBestDates(false))
  }, [mode, clinicId])

  useEffect(() => {
    if (!bestSelectedDate) return
    setLoadingBestSlots(true)
    setBestSlots([])
    setPreferredDoctors([])

    v3FetchBestSlots(clinicId, bestSelectedDate)
      .then(({ slots, preferredDoctors }) => {
        setBestSlots(slots)
        setPreferredDoctors(preferredDoctors)
      })
      .catch(console.error)
      .finally(() => setLoadingBestSlots(false))
  }, [bestSelectedDate, clinicId])

  useEffect(() => {
    if (!bestSelectedDate) return
    const timer = setTimeout(() => {
      slotsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 150)
    return () => clearTimeout(timer)
  }, [bestSelectedDate, loadingBestSlots])

  const availableSlots = slots.filter((s) => s.isAvailable)
  const isReschedule = flowMode === "reschedule"

  function handleSlotPicked(doctor: V3Doctor, date: string, slot: V3TimeSlot) {
    if (doctor.isSenior && !seniorOnly) {
      onSeniorVetPicked(doctor, date, slot)
    } else {
      onSelect(doctor, date, slot)
    }
  }

  function switchToBest() {
    setMode("best")
    onSelectionInvalidated?.()
  }

  function switchToSpecific() {
    setMode("specific")
    setBestSelectedDate(null)
    setBestSlots([])
    onSelectionInvalidated?.()
  }

  // ── Best-available UI ─────────────────────────────────────────────────────
  if (mode === "best") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-primary-2/30 bg-primary-2/5 px-4 py-3 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary-2 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-primary-1">
              Best available vet
            </div>
            <div className="text-xs text-gray-500">
              We&apos;ll match you with the best available vet for your pet.
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5 text-primary-2" />
            <h3 className="font-semibold text-primary-1">Choose a date</h3>
          </div>
          {loadingBestDates ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary-2" />
            </div>
          ) : (
            <MiniCalendar
              availableDates={bestAvailableDates}
              selectedDate={bestSelectedDate}
              onSelectDate={(date) => {
                setBestSelectedDate(date)
                onSelectionInvalidated?.()
              }}
            />
          )}
          {!loadingBestDates && bestAvailableDates.size === 0 && (
            <p className="text-sm text-center text-gray-500 mt-2">
              No available dates in the next 2 months.
            </p>
          )}
        </div>

        {bestSelectedDate && (
          <div ref={slotsRef} className="scroll-mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary-2" />
              <h3 className="font-semibold text-primary-1">
                {formatDate(bestSelectedDate)}
              </h3>
            </div>
            {loadingBestSlots ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary-2" />
              </div>
            ) : bestSlots.length === 0 ? (
              <p className="text-sm text-center text-gray-500 py-4">
                No available slots on this date. Please choose another day.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {bestSlots.map((slot) => {
                  const vetCount = slot.doctorIds.length
                  return (
                    <button
                      key={slot.startTime}
                      onClick={() => {
                        const doctor = resolveDoctor(
                          slot,
                          preferredDoctors,
                          doctors,
                        )
                        const legacySlot: V3TimeSlot = {
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                          isAvailable: true,
                        }
                        handleSlotPicked(doctor, bestSelectedDate, legacySlot)
                      }}
                      className="rounded-xl border border-primary-2/30 bg-primary-2/5 px-3 py-2.5 text-sm font-medium text-primary-2 hover:bg-primary-2 hover:text-white hover:border-primary-2 transition-all text-center"
                    >
                      <div>{formatTime(slot.startTime)}</div>
                      {vetCount > 1 && (
                        <div className="text-xs opacity-70 mt-0.5">
                          {vetCount} vets
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <button
          onClick={switchToSpecific}
          className="text-sm text-gray-400 hover:text-primary-2 transition-colors"
        >
          ← Choose a specific vet instead
        </button>
      </div>
    )
  }

  // ── Specific-vet UI ───────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Vet selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="h-5 w-5 text-primary-2" />
          <h3 className="font-semibold text-primary-1">Select a vet</h3>
        </div>

        {/* Best available prompt */}
        <button
          onClick={switchToBest}
          className="w-full flex items-center gap-3 rounded-xl border border-primary-2/40 bg-primary-2/5 px-4 py-3 text-left hover:bg-primary-2/10 transition-colors mb-3"
        >
          <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-2/15 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-primary-2">
              Best available vet
            </div>
            <div className="text-xs text-gray-500">
              Let us match you with the best available vet for your pet
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-primary-2/60 flex-shrink-0" />
        </button>

        {!loadingDoctors && doctors.some((d) => d.isSenior) && (
          <div className="flex items-center justify-end mb-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="flex items-center gap-1 text-xs font-medium text-amber-700">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Senior vets
              </span>
              <button
                role="switch"
                aria-checked={seniorOnly}
                onClick={() => {
                  setSeniorOnly((v) => !v)
                  setSelectedDoctor(null)
                  setSelectedDate(null)
                  setSlots([])
                  onSelectionInvalidated?.()
                }}
                className={[
                  "relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                  seniorOnly ? "bg-amber-400" : "bg-gray-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                    seniorOnly ? "translate-x-4" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </label>
          </div>
        )}
        {loadingDoctors ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary-2" />
          </div>
        ) : (
          <div className="space-y-2">
            {(seniorOnly ? doctors.filter((d) => d.isSenior) : doctors).map(
              (doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc)
                    onSelectionInvalidated?.()
                  }}
                  className={[
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left",
                    selectedDoctor?.id === doc.id
                      ? doc.isSenior
                        ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                        : "border-primary-2 bg-primary-2/5 ring-1 ring-primary-2"
                      : doc.isSenior
                        ? "border-amber-300 bg-amber-50/60 hover:border-amber-400 hover:bg-amber-50"
                        : "border-gray-200 hover:border-primary-2/50 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                      doc.isSenior ? "bg-amber-100" : "bg-primary-2/10",
                    ].join(" ")}
                  >
                    <User
                      className={[
                        "h-5 w-5",
                        doc.isSenior ? "text-amber-600" : "text-primary-2",
                      ].join(" ")}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary-1">
                        {doc.name}
                      </span>
                      {doc.isSenior && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 border border-amber-300 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                          Senior
                        </span>
                      )}
                    </div>
                    {!isReschedule && (
                      <div className="text-xs text-gray-400">
                        {doc.isSenior
                          ? `Senior Veterinarian · ₹${seniorPriceInRupees}`
                          : `Veterinarian · ₹${priceInRupees}`}
                      </div>
                    )}
                  </div>
                  {selectedDoctor?.id === doc.id && (
                    <div
                      className={[
                        "h-2 w-2 rounded-full flex-shrink-0",
                        doc.isSenior ? "bg-amber-500" : "bg-primary-2",
                      ].join(" ")}
                    />
                  )}
                </button>
              ),
            )}
            {(seniorOnly ? doctors.filter((d) => d.isSenior) : doctors)
              .length === 0 && (
              <p className="text-center text-sm text-gray-500 py-6">
                {seniorOnly
                  ? "No senior vets available at this clinic."
                  : "No doctors available at this clinic."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Date selection */}
      {selectedDoctor && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5 text-primary-2" />
            <h3 className="font-semibold text-primary-1">Choose a date</h3>
          </div>
          {loadingDates ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary-2" />
            </div>
          ) : (
            <MiniCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date)
                onSelectionInvalidated?.()
              }}
            />
          )}
          {!loadingDates && availableDates.size === 0 && (
            <p className="text-sm text-center text-gray-500 mt-2">
              No available dates in the next 2 months for this doctor.
            </p>
          )}
        </div>
      )}

      {/* Time slot selection */}
      {selectedDate && selectedDoctor && (
        <div ref={slotsRef} className="scroll-mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-primary-2" />
            <h3 className="font-semibold text-primary-1">
              {formatDate(selectedDate)}
            </h3>
          </div>
          {loadingSlots ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-primary-2" />
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-center text-gray-500 py-4">
              No available slots on this date. Please choose another day.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.startTime}
                  onClick={() =>
                    handleSlotPicked(selectedDoctor, selectedDate, slot)
                  }
                  className="rounded-xl border border-primary-2/30 bg-primary-2/5 px-3 py-2.5 text-sm font-medium text-primary-2 hover:bg-primary-2 hover:text-white hover:border-primary-2 transition-all text-center"
                >
                  {formatTime(slot.startTime)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
