"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CheckCircle2, CalendarDays, Pencil } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import {
  v3FetchPets,
  v3FetchClinics,
  v3FetchVetPrice,
  v3FetchActiveAppointmentTypesByPet,
  v3UpdateBookingFlowStep,
  type V3ActiveApptForPet,
  type V3NidanaClinicBookingFlowStep,
  type V3Pet,
  type V3Clinic,
  type V3Doctor,
  type V3TimeSlot,
  type V3Appointment,
} from "@/services/api.v3"
import StepPetSelect from "./StepPetSelect"
import StepClinicSelect from "./StepClinicSelect"
import StepVetDateTime from "./StepVetDateTime"
import StepConfirm from "./StepConfirm"

type SectionId = "pet" | "clinic" | "datetime" | "confirm"

interface Selection {
  pet: V3Pet | null
  clinic: V3Clinic | null
  doctor: V3Doctor | null
  date: string | null
  slot: V3TimeSlot | null
}

function petSummary(pet: V3Pet): string {
  const parts = [pet.name]
  if (pet.species)
    parts.push(pet.species.charAt(0).toUpperCase() + pet.species.slice(1))
  return parts.join(" · ")
}

function clinicSummary(clinic: V3Clinic): string {
  return clinic.city ? `${clinic.name} · ${clinic.city}` : clinic.name
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

function datetimeSummary(
  doctor: V3Doctor,
  date: string,
  slot: V3TimeSlot,
): string {
  return `${doctor.name} · ${formatDateShort(date)} · ${formatTime(slot.startTime)}`
}

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "pet", label: "Select a pet" },
  { id: "clinic", label: "Choose a clinic" },
  { id: "datetime", label: "Vet & appointment time" },
  { id: "confirm", label: "Confirm booking" },
]

const BOOKING_FLOW_STEP_BY_SECTION: Record<
  SectionId,
  V3NidanaClinicBookingFlowStep
> = {
  pet: "SELECT_PET",
  clinic: "SELECT_CLINIC",
  datetime: "SELECT_VET_AND_SLOT",
  confirm: "REVIEW_BOOKING",
}

export default function ClinicVetFlow({
  bookingFlowSessionId,
  onBack,
}: {
  bookingFlowSessionId: string | null
  onBack?: () => void
}) {
  const [openSection, setOpenSection] = useState<SectionId>("pet")
  const [pets, setPets] = useState<V3Pet[]>([])
  const [clinics, setClinics] = useState<V3Clinic[]>([])
  const [priceInRupees, setPriceInRupees] = useState<number | null>(null)
  const [seniorPriceInRupees, setSeniorPriceInRupees] = useState<number | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<V3Appointment | null>(null)
  const [activeTypesByPet, setActiveTypesByPet] = useState<
    Record<string, V3ActiveApptForPet[]>
  >({})

  const [sel, setSel] = useState<Selection>({
    pet: null,
    clinic: null,
    doctor: null,
    date: null,
    slot: null,
  })

  const petRef = useRef<HTMLDivElement>(null)
  const clinicRef = useRef<HTMLDivElement>(null)
  const datetimeRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLDivElement>(null)
  const lastTrackedStepRef = useRef<V3NidanaClinicBookingFlowStep | null>(null)

  const sectionRefs: Record<SectionId, React.RefObject<HTMLDivElement>> = {
    pet: petRef,
    clinic: clinicRef,
    datetime: datetimeRef,
    confirm: confirmRef,
  }

  useEffect(() => {
    // Only what the first (pet) section needs; clinics and pricing are
    // fetched when their sections are opened.
    Promise.all([v3FetchPets(), v3FetchActiveAppointmentTypesByPet()])
      .then(([p, activeTypes]) => {
        setPets(p)
        setActiveTypesByPet(activeTypes)
      })
      .catch(() =>
        setLoadError("Failed to load data. Please refresh and try again."),
      )
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (openSection !== "clinic" || clinics.length > 0) return
    v3FetchClinics()
      .then(setClinics)
      .catch(() =>
        setLoadError("Failed to load clinics. Please refresh and try again."),
      )
  }, [openSection, clinics.length])

  useEffect(() => {
    if (openSection !== "datetime" && openSection !== "confirm") return
    if (priceInRupees !== null) return
    v3FetchVetPrice()
      .then((price) => {
        setPriceInRupees(price.priceInRupees)
        setSeniorPriceInRupees(price.seniorPriceInRupees)
      })
      .catch(() => {
        // the step falls back to per-vet consultation amounts
      })
  }, [openSection, priceInRupees])

  const trackStep = useCallback(
    async (sessionId: string, stepName: V3NidanaClinicBookingFlowStep) => {
      if (stepName === lastTrackedStepRef.current) return
      lastTrackedStepRef.current = stepName
      try {
        await v3UpdateBookingFlowStep({ sessionId, stepName })
      } catch (e) {
        console.warn("Failed to track Nidana booking flow step", e)
      }
    },
    [],
  )

  useEffect(() => {
    if (!bookingFlowSessionId) return
    void trackStep(bookingFlowSessionId, BOOKING_FLOW_STEP_BY_SECTION.pet)
  }, [bookingFlowSessionId, trackStep])

  function openAndScroll(section: SectionId) {
    setOpenSection(section)
    if (bookingFlowSessionId) {
      void trackStep(
        bookingFlowSessionId,
        BOOKING_FLOW_STEP_BY_SECTION[section],
      )
    }
    setTimeout(() => {
      sectionRefs[section].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 50)
  }

  function editSection(section: SectionId) {
    if (section === "pet") {
      setSel((s) => ({
        ...s,
        clinic: null,
        doctor: null,
        date: null,
        slot: null,
      }))
    } else if (section === "clinic") {
      setSel((s) => ({ ...s, doctor: null, date: null, slot: null }))
    }
    openAndScroll(section)
  }

  function isReachable(id: SectionId): boolean {
    if (id === "pet") return true
    if (id === "clinic") return !!sel.pet
    if (id === "datetime") return !!sel.pet && !!sel.clinic
    if (id === "confirm")
      return (
        !!sel.pet && !!sel.clinic && !!sel.doctor && !!sel.date && !!sel.slot
      )
    return false
  }

  const summaries: Partial<Record<SectionId, string>> = {}
  if (sel.pet) summaries.pet = petSummary(sel.pet)
  if (sel.clinic) summaries.clinic = clinicSummary(sel.clinic)
  if (sel.doctor && sel.date && sel.slot)
    summaries.datetime = datetimeSummary(sel.doctor, sel.date, sel.slot)

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
    return <BookingSuccess appointment={appointment} />
  }

  return (
    <>
      <div className="max-w-lg mx-auto px-4 py-8 space-y-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-1 mb-2"
          >
            ← Back
          </button>
        )}
        <h1 className="font-roca text-2xl text-primary-1 mb-6">
          Vet Consultation
        </h1>
        {SECTIONS.map(({ id, label }, i) => {
          const isOpen = openSection === id
          const summary = summaries[id]
          const isCompleted = !!summary
          const reachable = isReachable(id)
          const isEditable = isCompleted && !isOpen

          return (
            <div
              key={id}
              ref={sectionRefs[id]}
              className={[
                "rounded-2xl border transition-all scroll-mt-20",
                isOpen
                  ? "border-primary-2/40 shadow-sm bg-white"
                  : isCompleted
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-gray-50/50",
              ].join(" ")}
            >
              {/* Section header */}
              <button
                onClick={() => (isEditable ? editSection(id) : undefined)}
                disabled={!reachable || isOpen}
                className={[
                  "w-full flex items-center gap-3 px-4 py-4 text-left transition-colors",
                  isEditable ? "hover:bg-gray-50 rounded-2xl" : "",
                  isOpen ? "border-b border-gray-100" : "",
                ].join(" ")}
              >
                {/* Step circle */}
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

              {/* Section content */}
              {isOpen && (
                <div className="px-4 py-5">
                  {id === "pet" && (
                    <StepPetSelect
                      pets={pets}
                      clinics={clinics}
                      disabledInfo={(pet) => {
                        const active = activeTypesByPet[pet.id]?.find(
                          (a) => a.bucket === "CLINIC_VET",
                        )
                        return active
                          ? {
                              reason: `${pet.name} already has an upcoming vet appointment. You can't book another until it's done or cancelled.`,
                              appointmentId: active.appointmentId,
                            }
                          : null
                      }}
                      onSelect={(pet) => {
                        setSel((s) => ({ ...s, pet }))
                        openAndScroll("clinic")
                      }}
                      onPetAdded={(pet) => {
                        setPets((prev) => [...prev, pet])
                        setSel((s) => ({ ...s, pet }))
                        openAndScroll("clinic")
                      }}
                    />
                  )}

                  {id === "clinic" && (
                    <StepClinicSelect
                      clinics={clinics}
                      onSelect={(clinic) => {
                        setSel((s) => ({
                          ...s,
                          clinic,
                          doctor: null,
                          date: null,
                          slot: null,
                        }))
                        openAndScroll("datetime")
                      }}
                    />
                  )}

                  {id === "datetime" && sel.clinic && (
                    <StepVetDateTime
                      clinicId={sel.clinic.id}
                      initialDoctor={sel.doctor}
                      priceInRupees={priceInRupees ?? 599}
                      seniorPriceInRupees={seniorPriceInRupees ?? 999}
                      onSelect={(doctor, date, slot) => {
                        setSel((s) => ({ ...s, doctor, date, slot }))
                        openAndScroll("confirm")
                      }}
                    />
                  )}

                  {id === "confirm" &&
                    sel.pet &&
                    sel.clinic &&
                    sel.doctor &&
                    sel.date &&
                    sel.slot && (
                      <StepConfirm
                        pet={sel.pet}
                        clinic={sel.clinic}
                        doctor={sel.doctor}
                        date={sel.date}
                        slot={sel.slot}
                        isSeniorVet={!!sel.doctor.isSenior}
                        priceInRupees={
                          sel.doctor.consultationAmount ??
                          (sel.doctor.isSenior
                            ? seniorPriceInRupees
                            : priceInRupees)
                        }
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
      </div>
    </>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTimeFull(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, "0")} ${period}`
}

function BookingSuccess({ appointment }: { appointment: V3Appointment }) {
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
        Booking confirmed!
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Your appointment has been successfully scheduled.
      </p>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-left mb-8">
        {[
          { label: "Pet", value: appointment.petName },
          { label: "Clinic", value: appointment.clinicName },
          { label: "Vet", value: appointment.doctorName },
          { label: "Date", value: formatDate(appointment.date) },
          {
            label: "Time",
            value: `${formatTimeFull(appointment.startTime)} – ${formatTimeFull(appointment.endTime)}`,
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
        href="/v3/appointments"
        className="inline-flex items-center gap-2 rounded-xl bg-secondary-1 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full justify-center"
      >
        <CalendarDays className="h-4 w-4" />
        View appointments
      </a>
    </div>
  )
}
