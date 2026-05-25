"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  CheckCircle2,
  Pencil,
  Home,
  MapPin,
  CalendarDays,
  Plus,
  ChevronRight,
} from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"

import {
  v3FetchPets,
  v3FetchClinics,
  v3FetchAddresses,
  v3CreateAddress,
  v3CheckHomeVisitServiceable,
  v3FetchHomeVisitSlots,
  v3FetchHomeVisitPrice,
  v3InitiateHomeVisitAppointment,
  v3StartBookingFlow,
  v3UpdateBookingFlowStep,
  type V3Pet,
  type V3Clinic,
  type V3Address,
  type V3HomeVisitSlot,
  type V3HomeVisitAppointment,
  type V3NidanaHomeVisitBookingFlowStep,
} from "@/services/api.v3"
import { load } from "@cashfreepayments/cashfree-js"
import StepPetSelect from "./StepPetSelect"
import StepVisitDetails, {
  reasonLabel,
  type VisitReasonCode,
} from "./StepVisitDetails"
import MapAddressPicker, { type GeocodedLocation } from "./MapAddressPicker"

type SectionId = "address" | "pet" | "visitDetails" | "datetime" | "confirm"

interface VisitDetails {
  reasonCode: VisitReasonCode
  petParentNotes: string
}

interface Selection {
  address: V3Address | null
  pet: V3Pet | null
  visitDetails: VisitDetails | null
  date: string | null
  slot: V3HomeVisitSlot | null
}

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "address", label: "Where should the vet visit?" },
  { id: "pet", label: "Select a pet" },
  { id: "visitDetails", label: "Tell us about the visit" },
  { id: "datetime", label: "Pick a date & time" },
  { id: "confirm", label: "Confirm home visit" },
]

const BOOKING_FLOW_STEP_BY_SECTION: Record<
  SectionId,
  V3NidanaHomeVisitBookingFlowStep
> = {
  address: "SELECT_ADDRESS",
  pet: "SELECT_PET",
  visitDetails: "SELECT_REASON_FOR_VISIT",
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

export default function HomeVisitFlow({
  onBack,
  couponCode,
}: {
  onBack?: () => void
  couponCode?: string
}) {
  const [openSection, setOpenSection] = useState<SectionId>("address")
  const [pets, setPets] = useState<V3Pet[]>([])
  const [clinics, setClinics] = useState<V3Clinic[]>([])
  const [addresses, setAddresses] = useState<V3Address[]>([])
  const [priceInRupees, setPriceInRupees] = useState<number | null>(null)
  const [originalPriceInRupees, setOriginalPriceInRupees] = useState<
    number | null
  >(null)
  const [discountInRupees, setDiscountInRupees] = useState<number | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<V3HomeVisitAppointment | null>(
    null,
  )
  const [bookingFlowSessionId, setBookingFlowSessionId] = useState<
    string | null
  >(null)

  const [sel, setSel] = useState<Selection>({
    address: null,
    pet: null,
    visitDetails: null,
    date: null,
    slot: null,
  })

  const refs: Record<SectionId, React.RefObject<HTMLDivElement>> = {
    address: useRef<HTMLDivElement>(null),
    pet: useRef<HTMLDivElement>(null),
    visitDetails: useRef<HTMLDivElement>(null),
    datetime: useRef<HTMLDivElement>(null),
    confirm: useRef<HTMLDivElement>(null),
  }
  const lastTrackedStepRef = useRef<V3NidanaHomeVisitBookingFlowStep | null>(
    null,
  )
  const openSectionRef = useRef<SectionId>("address")

  useEffect(() => {
    Promise.all([
      v3FetchPets(),
      v3FetchClinics(),
      v3FetchAddresses(),
      v3FetchHomeVisitPrice(couponCode ? { couponCode } : undefined),
    ])
      .then(([p, c, a, price]) => {
        setPets(p)
        setClinics(c)
        setAddresses(a)
        setPriceInRupees(price.priceInRupees)
        setOriginalPriceInRupees(price.originalPriceInRupees ?? null)
        setDiscountInRupees(price.discountInRupees ?? null)
        setCouponError(price.couponError ?? null)
      })
      .catch(() =>
        setLoadError("Failed to load data. Please refresh and try again."),
      )
      .finally(() => setLoading(false))
  }, [])

  const trackStep = useCallback(
    async (sessionId: string, stepName: V3NidanaHomeVisitBookingFlowStep) => {
      if (stepName === lastTrackedStepRef.current) return
      lastTrackedStepRef.current = stepName
      try {
        await v3UpdateBookingFlowStep({ sessionId, stepName })
      } catch (e) {
        console.warn("Failed to track Nidana home-visit booking flow step", e)
      }
    },
    [],
  )

  useEffect(() => {
    const startSession = async () => {
      try {
        const session = await v3StartBookingFlow({
          booking_flow_type: "HOME_VISIT",
          platform: "WEB",
        })
        setBookingFlowSessionId(session.id)
        await trackStep(
          session.id,
          BOOKING_FLOW_STEP_BY_SECTION[openSectionRef.current],
        )
      } catch (e) {
        console.warn(
          "Failed to start Nidana home-visit booking flow session",
          e,
        )
      }
    }

    void startSession()
  }, [trackStep])

  function openAndScroll(section: SectionId) {
    openSectionRef.current = section
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
    if (section === "address") {
      setSel((s) => ({
        ...s,
        pet: null,
        visitDetails: null,
        date: null,
        slot: null,
      }))
    } else if (section === "pet") {
      setSel((s) => ({
        ...s,
        visitDetails: null,
        date: null,
        slot: null,
      }))
    } else if (section === "visitDetails") {
      setSel((s) => ({ ...s, date: null, slot: null }))
    } else if (section === "datetime") {
      setSel((s) => ({ ...s, slot: null }))
    }
    openAndScroll(section)
  }

  function isReachable(id: SectionId): boolean {
    if (id === "address") {
      return true
    }
    if (id === "pet") {
      return !!sel.address
    }
    if (id === "visitDetails") {
      return !!sel.address && !!sel.pet
    }
    if (id === "datetime") {
      return !!sel.address && !!sel.pet && !!sel.visitDetails
    }
    if (id === "confirm") {
      return (
        !!sel.address &&
        !!sel.pet &&
        !!sel.visitDetails &&
        !!sel.date &&
        !!sel.slot
      )
    }
    return false
  }

  const summaries: Partial<Record<SectionId, string>> = {}
  if (sel.address) {
    summaries.address = addressSummary(sel.address)
  }
  if (sel.pet) {
    summaries.pet = sel.pet.name
  }
  if (sel.visitDetails) {
    summaries.visitDetails = reasonLabel(sel.visitDetails.reasonCode)
  }
  if (sel.date && sel.slot) {
    summaries.datetime = `${formatDateShort(sel.date)} · ${formatTime(sel.slot.startTime)}`
  }

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
    return <HomeVisitSuccess appointment={appointment} />
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
      <h1 className="font-roca text-2xl text-primary-1 mb-6">Home Visit</h1>
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
                {id === "address" && (
                  <StepAddressSelect
                    addresses={addresses}
                    onSelect={(address) => {
                      setSel((s) => ({
                        ...s,
                        address,
                        pet: null,
                        date: null,
                        slot: null,
                      }))
                      openAndScroll("pet")
                    }}
                    onAddressAdded={(address) => {
                      setAddresses((prev) => [address, ...prev])
                      setSel((s) => ({
                        ...s,
                        address,
                        pet: null,
                        date: null,
                        slot: null,
                      }))
                      openAndScroll("pet")
                    }}
                  />
                )}
                {id === "pet" && (
                  <StepPetSelect
                    pets={pets}
                    clinics={clinics}
                    onSelect={(pet) => {
                      setSel((s) => ({ ...s, pet }))
                      openAndScroll("visitDetails")
                    }}
                    onPetAdded={(pet) => {
                      setPets((prev) => [...prev, pet])
                      setSel((s) => ({ ...s, pet }))
                      openAndScroll("visitDetails")
                    }}
                  />
                )}
                {id === "visitDetails" && (
                  <StepVisitDetails
                    initialIsEmergency={sel.visitDetails ? false : null}
                    initialReasonCode={sel.visitDetails?.reasonCode ?? null}
                    initialPetParentNotes={
                      sel.visitDetails?.petParentNotes ?? ""
                    }
                    onConfirm={({ reasonCode, petParentNotes }) => {
                      setSel((s) => ({
                        ...s,
                        visitDetails: { reasonCode, petParentNotes },
                      }))
                      openAndScroll("datetime")
                    }}
                  />
                )}
                {id === "datetime" && sel.address && (
                  <StepHomeVisitDateTime
                    addressId={sel.address.id}
                    onSelect={(date, slot) => {
                      setSel((s) => ({ ...s, date, slot }))
                      openAndScroll("confirm")
                    }}
                  />
                )}
                {id === "confirm" &&
                  sel.address &&
                  sel.pet &&
                  sel.visitDetails &&
                  sel.date &&
                  sel.slot && (
                    <StepHomeVisitConfirm
                      address={sel.address}
                      pet={sel.pet}
                      visitDetails={sel.visitDetails}
                      date={sel.date}
                      slot={sel.slot}
                      priceInRupees={priceInRupees}
                      originalPriceInRupees={originalPriceInRupees}
                      discountInRupees={discountInRupees}
                      couponError={couponError}
                      couponCode={couponCode}
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
  )
}

function addressSummary(a: V3Address): string {
  const parts = [a.line1]
  if (a.line2) {
    parts.push(a.line2)
  }
  parts.push(a.pincode)
  return parts.join(", ")
}

function StepAddressSelect({
  addresses,
  onSelect,
  onAddressAdded,
}: {
  addresses: V3Address[]
  onSelect: (address: V3Address) => void
  onAddressAdded: (address: V3Address) => void
}) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div>
      <div className="space-y-3">
        {addresses.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-2/10 flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-2" />
            </div>
            <div className="flex-1 min-w-0">
              {a.tag && (
                <div className="font-semibold text-primary-1 text-sm">
                  {a.tag}
                </div>
              )}
              <div className="text-sm text-gray-700 truncate">{a.line1}</div>
              <div className="text-xs text-gray-500 truncate">
                {[a.line2, a.pincode].filter(Boolean).join(" · ")}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-2 transition-colors flex-shrink-0" />
          </button>
        ))}

        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-2 hover:bg-primary-2/5 transition-all text-left group"
        >
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary-2/10 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 group-hover:text-primary-2" />
          </div>
          <div>
            <div className="font-semibold text-gray-600 group-hover:text-primary-1">
              Add a new address
            </div>
            <div className="text-sm text-gray-400">
              We&apos;ll check serviceability before saving
            </div>
          </div>
        </button>
      </div>

      {showAdd && (
        <AddAddressModal
          onClose={() => setShowAdd(false)}
          onAdded={(a) => {
            setShowAdd(false)
            onAddressAdded(a)
          }}
        />
      )}
    </div>
  )
}

type ServiceabilityState =
  | { kind: "idle" }
  | { kind: "checking"; pincode: string }
  | { kind: "ok"; pincode: string }
  | { kind: "no"; pincode: string }
  | { kind: "no-pincode" } // map gave us a pin but no postal code came back
  | { kind: "error"; pincode: string; message: string }

function AddAddressModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: (a: V3Address) => void
}) {
  const [location, setLocation] = useState<GeocodedLocation | null>(null)
  const [serviceability, setServiceability] = useState<ServiceabilityState>({
    kind: "idle",
  })
  const [pinAcked, setPinAcked] = useState(false)
  const [tag, setTag] = useState("")
  const [line1, setLine1] = useState("")
  const [line1EditedByUser, setLine1EditedByUser] = useState(false)
  const [line2, setLine2] = useState("")
  const [directions, setDirections] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-fill line1 from the geocoded pin until the user edits it.
  useEffect(() => {
    if (!location) {
      return
    }
    if (!line1EditedByUser) {
      setLine1(location.suggestedLine1)
    }
  }, [location, line1EditedByUser])

  // Check serviceability whenever the pin's pincode changes. Debounced so
  // we don't fire while the user is actively dragging.
  useEffect(() => {
    if (!location) {
      setServiceability({ kind: "idle" })
      return
    }
    if (!location.pincode) {
      setServiceability({ kind: "no-pincode" })
      return
    }
    const pincode = location.pincode
    setServiceability({ kind: "checking", pincode })
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const { serviceable } = await v3CheckHomeVisitServiceable(pincode)
        if (cancelled) {
          return
        }
        setServiceability({
          kind: serviceable ? "ok" : "no",
          pincode,
        })
      } catch (e) {
        if (cancelled) {
          return
        }
        const err = e as { message?: string }
        setServiceability({
          kind: "error",
          pincode,
          message: err.message ?? "Failed to check serviceability",
        })
      }
    }, 350)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.pincode])

  const canConfirmPin = serviceability.kind === "ok"

  async function handleSave() {
    if (!location) {
      setError("Pick a location on the map first")
      return
    }
    if (serviceability.kind !== "ok") {
      setError("This pincode isn't serviceable. Pick a different location.")
      return
    }
    if (!line1.trim()) {
      setError("Address line 1 is required")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const created = await v3CreateAddress({
        tag: tag.trim() || null,
        line1: line1.trim(),
        line2: line2.trim() || null,
        pincode: serviceability.pincode,
        latitude: location.lat,
        longitude: location.lng,
        directions: directions.trim() || null,
      })
      onAdded(created)
    } catch (e) {
      const err = e as { message?: string }
      setError(err.message ?? "Failed to save address")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 sm:px-4">
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white max-h-[95vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 className="font-semibold text-primary-1 text-lg">
            {pinAcked ? "Address details" : "Drop a pin on your home"}
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!pinAcked ? (
            <>
              <p className="text-xs text-gray-500 mb-3">
                Search, tap on the map, or drag the pin. We&apos;ll use this to
                guide the vet to your door.
              </p>
              <MapAddressPicker
                onChange={(loc) => setLocation(loc)}
                height={320}
              />
              {location?.formattedAddress && (
                <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">
                    Selected
                  </span>
                  {location.formattedAddress}
                </div>
              )}
              {location && <ServiceabilityBanner state={serviceability} />}
            </>
          ) : (
            <>
              <div className="rounded-xl bg-gray-50 px-3 py-2 mb-4 flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">
                    Pinned location
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {location?.formattedAddress ?? ""}
                  </div>
                </div>
                <button
                  onClick={() => setPinAcked(false)}
                  className="text-xs font-medium text-primary-2 hover:underline flex-shrink-0"
                >
                  Change
                </button>
              </div>
              <div className="space-y-3">
                <Field label="Tag (optional)">
                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Home, Office…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
                <Field label="Address line 1">
                  <input
                    value={line1}
                    onChange={(e) => {
                      setLine1(e.target.value)
                      setLine1EditedByUser(true)
                    }}
                    placeholder="House / flat, street"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
                <Field label="Address line 2 (optional)">
                  <input
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Apartment, building, area"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
                <Field label="Directions for the vet (optional)">
                  <textarea
                    value={directions}
                    onChange={(e) => setDirections(e.target.value)}
                    rows={2}
                    placeholder="Landmark, gate code, parking…"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:border-primary-2 focus:outline-none focus:ring-1 focus:ring-primary-2"
                  />
                </Field>
              </div>
            </>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          {!pinAcked ? (
            <button
              onClick={() => {
                if (!canConfirmPin) {
                  return
                }
                setError(null)
                setPinAcked(true)
              }}
              disabled={!canConfirmPin}
              className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              Confirm location
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={submitting}
              className="w-full rounded-xl bg-secondary-1 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save address"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ServiceabilityBanner({ state }: { state: ServiceabilityState }) {
  if (state.kind === "idle") {
    return null
  }
  if (state.kind === "checking") {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-600">
        <ClipLoader color="#33495f" size={12} />
        Checking serviceability for {state.pincode}…
      </div>
    )
  }
  if (state.kind === "ok") {
    return (
      <div className="mt-2 rounded-xl bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
        ✓ Home visits available at pincode {state.pincode}
      </div>
    )
  }
  if (state.kind === "no") {
    return (
      <div className="mt-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
        We don&apos;t currently offer home visits at pincode {state.pincode}.
        Try a different location.
      </div>
    )
  }
  if (state.kind === "no-pincode") {
    return (
      <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
        Couldn&apos;t read a pincode for this spot. Drop the pin slightly closer
        to a road or building.
      </div>
    )
  }
  return (
    <div className="mt-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
      {state.message}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      {children}
    </label>
  )
}

function StepHomeVisitDateTime({
  addressId,
  onSelect,
}: {
  addressId: string
  onSelect: (date: string, slot: V3HomeVisitSlot) => void
}) {
  const [date, setDate] = useState(() => todayInIST())
  const [slots, setSlots] = useState<V3HomeVisitSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    v3FetchHomeVisitSlots(addressId, date)
      .then(({ slots }) => {
        if (!cancelled) {
          setSlots(slots)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError((e as Error).message ?? "Failed to load slots")
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [addressId, date])

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
          No home-visit slots available on this day. Try another date.
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

function StepHomeVisitConfirm({
  address,
  pet,
  visitDetails,
  date,
  slot,
  priceInRupees,
  originalPriceInRupees,
  discountInRupees,
  couponError,
  couponCode,
  bookingFlowSessionId,
  onSuccess,
  onEdit,
}: {
  address: V3Address
  pet: V3Pet
  visitDetails: VisitDetails
  date: string
  slot: V3HomeVisitSlot
  priceInRupees: number | null
  originalPriceInRupees: number | null
  discountInRupees: number | null
  couponError: string | null
  couponCode?: string
  bookingFlowSessionId: string | null
  onSuccess: (appt: V3HomeVisitAppointment) => void
  onEdit: (section: SectionId) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      const result = await v3InitiateHomeVisitAppointment({
        addressId: address.id,
        petId: pet.id,
        date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isEmergency: false,
        reasonCode: visitDetails.reasonCode,
        petParentNotes: visitDetails.petParentNotes,
        couponCode: couponError ? undefined : couponCode,
        bookingFlowSessionId: bookingFlowSessionId ?? undefined,
      })
      if (result.action === "APPOINTMENT_CONFIRMED") {
        onSuccess(result.appointment)
        return
      }
      const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as
        | "sandbox"
        | "production"
        | undefined
      if (!cashfreeEnv) {
        throw new Error("Payment environment is not configured")
      }
      const cashfree = await load({ mode: cashfreeEnv })
      await cashfree.checkout({
        paymentSessionId: result.order.paymentSessionId,
        returnUrl:
          window.location.origin +
          "/v3/book/home-visit/payment?order_id=" +
          result.order.orderId,
        redirectTarget: "_self",
      })
    } catch (e) {
      const err = e as { errorCode?: string; message?: string }
      setError(
        err.errorCode === "SLOT_UNAVAILABLE"
          ? "This slot was just taken. Pick a different time above."
          : (err.message ?? "Failed to start payment. Please try again."),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 mb-5">
        <SummaryRow
          label="Address"
          value={addressSummary(address)}
          icon={<MapPin className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("address")}
        />
        <SummaryRow
          label="Pet"
          value={pet.name}
          icon={<Home className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("pet")}
        />
        <SummaryRow
          label="Reason"
          value={`${reasonLabel(visitDetails.reasonCode)} — ${visitDetails.petParentNotes}`}
          icon={<Pencil className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("visitDetails")}
        />
        <SummaryRow
          label="When"
          value={`${formatDateShort(date)} · ${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`}
          icon={<CalendarDays className="h-5 w-5 text-primary-2" />}
          onEdit={() => onEdit("datetime")}
        />
      </div>

      {couponError && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {couponError}
        </div>
      )}

      {priceInRupees !== null && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-gray-700">
              Home visit fee
            </span>
            {discountInRupees !== null && originalPriceInRupees !== null ? (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPriceInRupees}
                </span>
                <span className="font-semibold text-green-700">
                  ₹{priceInRupees}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-primary-1">
                ₹{priceInRupees}
              </span>
            )}
          </div>
          {discountInRupees !== null && (
            <p className="mt-1 text-xs font-medium text-green-600">
              You save ₹{discountInRupees} with this offer
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Pay now to confirm your home visit.
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
        {submitting ? "Starting payment..." : "Pay and confirm home visit"}
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

function HomeVisitSuccess({
  appointment,
}: {
  appointment: V3HomeVisitAppointment
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
        Home visit booked!
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        We&apos;ll send the vet&apos;s details closer to your appointment.
      </p>

      <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-left mb-8">
        {[
          { label: "Date", value: formatDateShort(appointment.apptDate) },
          {
            label: "Time",
            value: `${formatTime(appointment.apptStart)} - ${formatTime(appointment.apptEnd)}`,
          },
          { label: "Status", value: appointment.visitStatus },
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
