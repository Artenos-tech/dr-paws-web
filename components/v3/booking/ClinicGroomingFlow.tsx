"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  CheckCircle2,
  Pencil,
  MapPin,
  CalendarDays,
  Scissors,
  ChevronRight,
} from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"

import {
  v3FetchPets,
  v3FetchClinics,
  v3FetchGroomingServiceTypes,
  v3FetchGroomingSlots,
  v3CreateGroomingAppointment,
  v3UpdateBookingFlowStep,
  type V3NidanaClinicBookingFlowStep,
  type V3Pet,
  type V3Clinic,
  type V3GroomingServiceType,
  type V3PetGroomingAttributes,
  type V3GroomingSlot,
  type V3Appointment,
} from "@/services/api.v3"
import StepPetSelect from "./StepPetSelect"
import StepClinicSelect from "./StepClinicSelect"
import AddPetModal from "./AddPetModal"

type SectionId = "groomingType" | "pet" | "clinic" | "datetime" | "confirm"

interface Selection {
  groomingType: V3GroomingServiceType | null
  pet: V3Pet | null
  clinic: V3Clinic | null
  date: string | null
  slot: V3GroomingSlot | null
}

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "pet", label: "Select a pet" },
  { id: "groomingType", label: "Choose a grooming service" },
  { id: "clinic", label: "Choose a clinic" },
  { id: "datetime", label: "Pick a date & time" },
  { id: "confirm", label: "Confirm booking" },
]

const BOOKING_FLOW_STEP_BY_SECTION: Record<
  SectionId,
  V3NidanaClinicBookingFlowStep
> = {
  groomingType: "SELECT_SERVICE",
  pet: "SELECT_PET",
  clinic: "SELECT_CLINIC",
  datetime: "SELECT_DATE_TIME",
  confirm: "REVIEW_BOOKING",
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

function todayInIST(): string {
  const now = new Date()
  const istOffsetMs = 5.5 * 60 * 60 * 1000
  const ist = new Date(now.getTime() + istOffsetMs)
  return ist.toISOString().slice(0, 10)
}

function nextNDates(n: number): string[] {
  const out: string[] = []
  const start = new Date(todayInIST() + "T00:00:00Z")
  for (let i = 0; i < n; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

export default function ClinicGroomingFlow({
  bookingFlowSessionId,
  onBack,
}: {
  bookingFlowSessionId: string | null
  onBack?: () => void
}) {
  const [openSection, setOpenSection] = useState<SectionId>("pet")
  const [pets, setPets] = useState<V3Pet[]>([])
  const [clinics, setClinics] = useState<V3Clinic[]>([])
  const [groomingTypes, setGroomingTypes] = useState<V3GroomingServiceType[]>(
    [],
  )
  const [petGroomingAttributes, setPetGroomingAttributes] =
    useState<V3PetGroomingAttributes | null>(null)
  const [groomingTypesLoading, setGroomingTypesLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<V3Appointment | null>(null)
  const [breedCheckPet, setBreedCheckPet] = useState<V3Pet | null>(null)
  const [showEditBreedModal, setShowEditBreedModal] = useState(false)

  const [sel, setSel] = useState<Selection>({
    groomingType: null,
    pet: null,
    clinic: null,
    date: null,
    slot: null,
  })

  const refs: Record<SectionId, React.RefObject<HTMLDivElement>> = {
    groomingType: useRef<HTMLDivElement>(null),
    pet: useRef<HTMLDivElement>(null),
    clinic: useRef<HTMLDivElement>(null),
    datetime: useRef<HTMLDivElement>(null),
    confirm: useRef<HTMLDivElement>(null),
  }
  const lastTrackedStepRef = useRef<V3NidanaClinicBookingFlowStep | null>(null)

  useEffect(() => {
    Promise.all([v3FetchPets(), v3FetchClinics()])
      .then(([p, c]) => {
        setPets(p)
        setClinics(c)
      })
      .catch(() =>
        setLoadError("Failed to load data. Please refresh and try again."),
      )
      .finally(() => setLoading(false))
  }, [])

  const trackStep = useCallback(
    async (sessionId: string, stepName: V3NidanaClinicBookingFlowStep) => {
      if (stepName === lastTrackedStepRef.current) return
      lastTrackedStepRef.current = stepName
      try {
        await v3UpdateBookingFlowStep({ sessionId, stepName })
      } catch (e) {
        console.warn("Failed to track Nidana grooming booking flow step", e)
      }
    },
    [],
  )

  useEffect(() => {
    if (!bookingFlowSessionId) return
    void trackStep(bookingFlowSessionId, BOOKING_FLOW_STEP_BY_SECTION.pet)
  }, [bookingFlowSessionId, trackStep])

  async function fetchGroomingTypes(pet: V3Pet) {
    setGroomingTypes([])
    setPetGroomingAttributes(null)
    setGroomingTypesLoading(true)
    try {
      const { groomingTypes, petGroomingAttributes } =
        await v3FetchGroomingServiceTypes(pet.id)
      setGroomingTypes(groomingTypes)
      setPetGroomingAttributes(petGroomingAttributes)
    } catch {
      setLoadError(
        "Failed to load grooming services. Please refresh and try again.",
      )
    } finally {
      setGroomingTypesLoading(false)
    }
  }

  function openAndScroll(section: SectionId) {
    setOpenSection(section)
    if (bookingFlowSessionId) {
      void trackStep(
        bookingFlowSessionId,
        BOOKING_FLOW_STEP_BY_SECTION[section],
      )
    }
    setTimeout(() => {
      refs[section].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 50)
  }

  function editSection(section: SectionId) {
    if (section === "pet") {
      setSel((s) => ({
        ...s,
        groomingType: null,
        clinic: null,
        date: null,
        slot: null,
      }))
      setGroomingTypes([])
    } else if (section === "groomingType") {
      setSel((s) => ({ ...s, clinic: null, date: null, slot: null }))
    } else if (section === "clinic") {
      setSel((s) => ({ ...s, date: null, slot: null }))
    } else if (section === "datetime") {
      setSel((s) => ({ ...s, slot: null }))
    }
    openAndScroll(section)
  }

  function isReachable(id: SectionId): boolean {
    if (id === "pet") return true
    if (id === "groomingType") return !!sel.pet
    if (id === "clinic") return !!sel.pet && !!sel.groomingType
    if (id === "datetime")
      return !!sel.pet && !!sel.groomingType && !!sel.clinic
    if (id === "confirm")
      return (
        !!sel.pet &&
        !!sel.groomingType &&
        !!sel.clinic &&
        !!sel.date &&
        !!sel.slot
      )
    return false
  }

  const summaries: Partial<Record<SectionId, string>> = {}
  if (sel.groomingType) summaries.groomingType = sel.groomingType.displayName
  if (sel.pet) summaries.pet = sel.pet.name
  if (sel.clinic) summaries.clinic = sel.clinic.name
  if (sel.date && sel.slot)
    summaries.datetime = `${formatDateShort(sel.date)} · ${formatTime(sel.slot.startTime)}`

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <ClipLoader color="#33495f" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>{loadError}</p>
      </div>
    )
  }

  if (appointment) {
    return <GroomingBookingSuccess appointment={appointment} />
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-3">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1 mb-2"
        >
          ← Back
        </button>
      )}
      <h1 className="font-roca text-2xl text-primary-1 mb-6">Grooming</h1>

      {SECTIONS.map(({ id, label }, i) => {
        const isOpen = openSection === id
        const summary = summaries[id]
        const isCompleted = !!summary
        const reachable = isReachable(id)
        const isEditable = isCompleted && !isOpen

        return (
          <div
            key={id}
            ref={refs[id]}
            className={[
              "rounded-2xl border transition-all scroll-mt-20",
              isOpen
                ? "border-primary-2/40 shadow-sm bg-white"
                : isCompleted
                  ? "border-gray-200 bg-white"
                  : "border-gray-100 bg-gray-50/50",
            ].join(" ")}
          >
            <button
              onClick={() => (isEditable ? editSection(id) : undefined)}
              disabled={!reachable || isOpen}
              className={[
                "w-full flex items-center gap-3 px-4 py-4 text-left transition-colors",
                isEditable ? "hover:bg-gray-50 rounded-2xl" : "",
                isOpen ? "border-b border-gray-100" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                  isCompleted
                    ? "bg-primary-2 text-white"
                    : isOpen
                      ? "bg-primary-2 text-white ring-4 ring-primary-2/20"
                      : reachable
                        ? "bg-gray-100 text-gray-500"
                        : "bg-gray-100 text-gray-300",
                ].join(" ")}
              >
                {isCompleted ? "✓" : i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className={[
                    "text-sm font-semibold",
                    isOpen
                      ? "text-primary-1"
                      : isCompleted
                        ? "text-gray-800"
                        : reachable
                          ? "text-gray-500"
                          : "text-gray-300",
                  ].join(" ")}
                >
                  {label}
                </div>
                {isCompleted && !isOpen && (
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {summary}
                  </div>
                )}
              </div>

              {isEditable && (
                <Pencil className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="px-4 py-5">
                {id === "pet" && (
                  <>
                    <StepPetSelect
                      pets={pets}
                      clinics={clinics}
                      onSelect={async (pet) => {
                        setSel((s) => ({
                          ...s,
                          pet,
                          groomingType: null,
                          clinic: null,
                          date: null,
                          slot: null,
                        }))
                        if (!pet.breed) {
                          setBreedCheckPet(pet)
                          return
                        }
                        setBreedCheckPet(null)
                        await fetchGroomingTypes(pet)
                        openAndScroll("groomingType")
                      }}
                      onPetAdded={async (pet) => {
                        setPets((prev) => [...prev, pet])
                        setSel((s) => ({
                          ...s,
                          pet,
                          groomingType: null,
                          clinic: null,
                          date: null,
                          slot: null,
                        }))
                        if (!pet.breed) {
                          setBreedCheckPet(pet)
                          return
                        }
                        setBreedCheckPet(null)
                        await fetchGroomingTypes(pet)
                        openAndScroll("groomingType")
                      }}
                    />
                    {breedCheckPet && (
                      <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                        <p className="text-sm text-amber-800">
                          We need <strong>{breedCheckPet.name}</strong>&apos;s
                          breed to show the right grooming services and pricing.
                          Please update their profile.
                        </p>
                        <button
                          onClick={() => setShowEditBreedModal(true)}
                          className="text-sm font-medium text-amber-800 underline underline-offset-2"
                        >
                          Set breed for {breedCheckPet.name} →
                        </button>
                      </div>
                    )}
                  </>
                )}

                {id === "groomingType" && (
                  <StepGroomingTypeSelect
                    groomingTypes={groomingTypes}
                    petGroomingAttributes={petGroomingAttributes}
                    loading={groomingTypesLoading}
                    onSelect={(gt) => {
                      setSel((s) => ({
                        ...s,
                        groomingType: gt,
                        clinic: null,
                        date: null,
                        slot: null,
                      }))
                      openAndScroll("clinic")
                    }}
                  />
                )}

                {id === "clinic" && (
                  <StepClinicSelect
                    clinics={clinics}
                    mode="grooming"
                    onSelect={(clinic) => {
                      setSel((s) => ({
                        ...s,
                        clinic,
                        date: null,
                        slot: null,
                      }))
                      openAndScroll("datetime")
                    }}
                  />
                )}

                {id === "datetime" &&
                  sel.clinic &&
                  sel.groomingType &&
                  sel.pet && (
                    <StepGroomingDateTime
                      clinicId={sel.clinic.id}
                      groomingTypeKey={sel.groomingType.key}
                      petId={sel.pet.id}
                      onSelect={(date, slot) => {
                        setSel((s) => ({ ...s, date, slot }))
                        openAndScroll("confirm")
                      }}
                    />
                  )}

                {id === "confirm" &&
                  sel.groomingType &&
                  sel.pet &&
                  sel.clinic &&
                  sel.date &&
                  sel.slot && (
                    <StepGroomingConfirm
                      groomingType={sel.groomingType}
                      pet={sel.pet}
                      clinic={sel.clinic}
                      date={sel.date}
                      slot={sel.slot}
                      priceInRupees={sel.groomingType.priceInRupees ?? null}
                      bookingFlowSessionId={bookingFlowSessionId}
                      onSuccess={(appt) => setAppointment(appt)}
                      onEdit={editSection}
                    />
                  )}
              </div>
            )}
          </div>
        )
      })}

      {showEditBreedModal && breedCheckPet && (
        <AddPetModal
          clinics={clinics}
          petToEdit={breedCheckPet}
          onClose={() => setShowEditBreedModal(false)}
          onSaved={async (updatedPet) => {
            setShowEditBreedModal(false)
            setPets((prev) =>
              prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)),
            )
            if (updatedPet.breed) {
              setBreedCheckPet(null)
              setSel((s) => ({
                ...s,
                pet: updatedPet,
                groomingType: null,
                clinic: null,
                date: null,
                slot: null,
              }))
              await fetchGroomingTypes(updatedPet)
              openAndScroll("groomingType")
            } else {
              setBreedCheckPet(updatedPet)
            }
          }}
        />
      )}
    </div>
  )
}

// ─── Step: grooming type selection ───────────────────────────────────────────

function groomingAttributeLabel(
  attrs: V3PetGroomingAttributes | null,
): string | null {
  if (!attrs) return null
  const parts: string[] = []
  if (attrs.bodySize)
    parts.push(attrs.bodySize.charAt(0).toUpperCase() + attrs.bodySize.slice(1))
  if (attrs.coatType)
    parts.push(
      attrs.coatType.charAt(0).toUpperCase() +
        attrs.coatType.slice(1) +
        " coat",
    )
  return parts.length > 0 ? parts.join(" · ") : null
}

function StepGroomingTypeSelect({
  groomingTypes,
  petGroomingAttributes,
  loading,
  onSelect,
}: {
  groomingTypes: V3GroomingServiceType[]
  petGroomingAttributes: V3PetGroomingAttributes | null
  loading?: boolean
  onSelect: (gt: V3GroomingServiceType) => void
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <ClipLoader color="#33495f" size={24} />
      </div>
    )
  }

  const attributeLabel = groomingAttributeLabel(petGroomingAttributes)

  return (
    <div className="space-y-3">
      {groomingTypes.map((gt) => (
        <button
          key={gt.key}
          onClick={() => onSelect(gt)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group"
        >
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-2/10 flex items-center justify-center">
            <Scissors className="h-5 w-5 text-primary-2" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-primary-1">{gt.displayName}</div>
            <div className="text-sm text-gray-500 mt-0.5">
              {attributeLabel && <span className="mr-2">{attributeLabel}</span>}
              {gt.priceInRupees != null && <span>₹{gt.priceInRupees}</span>}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-2 transition-colors flex-shrink-0" />
        </button>
      ))}

      {groomingTypes.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-8">
          No grooming services available at this time.
        </p>
      )}
    </div>
  )
}

// ─── Step: date & time ───────────────────────────────────────────────────────

function StepGroomingDateTime({
  clinicId,
  groomingTypeKey,
  petId,
  onSelect,
}: {
  clinicId: string
  groomingTypeKey: string
  petId: string
  onSelect: (date: string, slot: V3GroomingSlot) => void
}) {
  const [date, setDate] = useState(() => todayInIST())
  const [slots, setSlots] = useState<V3GroomingSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    v3FetchGroomingSlots(clinicId, date, groomingTypeKey, petId)
      .then(({ slots: s }) => {
        if (!cancelled) setSlots(s)
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message ?? "Failed to load slots")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [clinicId, date, groomingTypeKey, petId])

  const dates = nextNDates(7)

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
        {dates.map((d) => {
          const active = d === date
          return (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={[
                "flex-shrink-0 rounded-xl border px-3 py-2 text-sm transition-all",
                active
                  ? "border-primary-2 bg-primary-2/10 text-primary-1 font-semibold"
                  : "border-gray-200 text-gray-600 hover:border-primary-2/50",
              ].join(" ")}
            >
              {formatDateShort(d)}
            </button>
          )
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <ClipLoader color="#33495f" size={24} />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-6">
          No grooming slots available on this day. Try another date.
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={`${slot.startTime}-${slot.endTime}`}
              onClick={() => onSelect(date, slot)}
              className="rounded-xl border border-gray-200 px-2 py-2 text-sm text-gray-700 hover:border-primary-2 hover:bg-primary-2/5 transition-all"
            >
              {formatTime(slot.startTime)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Step: confirm ───────────────────────────────────────────────────────────

function StepGroomingConfirm({
  groomingType,
  pet,
  clinic,
  date,
  slot,
  priceInRupees,
  bookingFlowSessionId,
  onSuccess,
  onEdit,
}: {
  groomingType: V3GroomingServiceType
  pet: V3Pet
  clinic: V3Clinic
  date: string
  slot: V3GroomingSlot
  priceInRupees: number | null
  bookingFlowSessionId: string | null
  onSuccess: (appt: V3Appointment) => void
  onEdit: (section: SectionId) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const groomerId = slot.groomerIds[0]

  async function handleConfirm() {
    if (!groomerId) {
      setError("No groomer available for this slot.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const appt = await v3CreateGroomingAppointment({
        clinicId: clinic.id,
        petId: pet.id,
        groomerId,
        groomingTypeKey: groomingType.key,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        bookingFlowSessionId: bookingFlowSessionId ?? undefined,
      })
      onSuccess(appt)
    } catch (e) {
      const err = e as { errorCode?: string; message?: string }
      setError(
        err.errorCode === "SLOT_UNAVAILABLE"
          ? "This slot was just taken. Pick a different time above."
          : (err.message ?? "Failed to book grooming. Please try again."),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 mb-5">
        <SummaryRow
          label="Service"
          value={groomingType.displayName}
          icon={<Scissors className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("groomingType")}
        />
        <SummaryRow
          label="Pet"
          value={pet.name}
          icon={<Scissors className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("pet")}
        />
        <SummaryRow
          label="Clinic"
          value={clinic.name}
          icon={<MapPin className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("clinic")}
        />
        <SummaryRow
          label="When"
          value={`${formatDateShort(date)} · ${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`}
          icon={<CalendarDays className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("datetime")}
        />
      </div>

      {priceInRupees != null && (
        <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-700">
              Grooming fee
            </span>
            <span className="font-semibold text-primary-1">
              ₹{priceInRupees}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Payment collected at the clinic.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={submitting}
        className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Booking…" : "Confirm grooming"}
      </button>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  icon,
  onEdit,
}: {
  label: string
  value: string
  icon: React.ReactNode
  onEdit: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-primary-2/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </div>
        <div className="font-semibold text-primary-1">{value}</div>
      </div>
      <button
        onClick={onEdit}
        className="text-xs font-medium text-primary-2 hover:underline flex-shrink-0"
      >
        Edit
      </button>
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

function GroomingBookingSuccess({
  appointment,
}: {
  appointment: V3Appointment
}) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="flex justify-center mb-5">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <h2 className="font-roca text-2xl text-primary-1 mb-2">
        Grooming booked!
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Your grooming appointment has been successfully scheduled.
      </p>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-left mb-8">
        {[
          { label: "Pet", value: appointment.petName },
          { label: "Clinic", value: appointment.clinicName },
          {
            label: "Date",
            value: new Date(appointment.date + "T00:00:00").toLocaleDateString(
              "en-IN",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            ),
          },
          {
            label: "Time",
            value: `${formatTime(appointment.startTime)} – ${formatTime(appointment.endTime)}`,
          },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3 flex justify-between gap-4">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-semibold text-primary-1 text-right">
              {value}
            </span>
          </div>
        ))}
      </div>

      <a
        href="/v3"
        className="inline-flex items-center gap-2 rounded-xl bg-secondary-1 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full justify-center"
      >
        Back to home
      </a>
    </div>
  )
}
