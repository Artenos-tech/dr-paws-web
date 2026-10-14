import {
  DrpawsError,
  AUTH_TOKEN_KEY,
  API_BASE_URL,
  dp,
  flattenClinics,
  getAuthToken,
  isAtHomeClinic,
  minutesBetween,
  removeAuthToken,
  storeAuthToken,
  toHHMM,
  toYMD,
  type DpAppointment,
  type DpGroomingItem,
  type DpPet,
  type DpProvider,
  type DpSlot,
  type DpUser,
} from "./drpaws"
import { ErrorResponseAPIError, FetchAPIError } from "../lib/apiclient"
import { ok, err, type Result } from "../lib/result"

// Booking/auth client for the signed-in app. Implemented on the Dr Paws API
// (`/drpaws/*`); the V3* types below are the shapes the UI consumes.

// ─── Types ────────────────────────────────────────────────────────────────────

export type V3Pet = {
  id: string
  name: string
  species?: string | null
  breed?: string | null
  gender: string
  dateOfBirth?: string | null
  weight?: string | null
  reproductiveStatus?: string | null
}

export type V3Clinic = {
  id: string
  name: string
  neighborhood: string
  city: string
  address?: string
  heroImageUrl?: string
  phone?: string
  vetEnabled: boolean
  groomingEnabled: boolean
}

export type V3AppointmentType = {
  key: string
  name: string
  description: string
  durationMinutes?: number
}

export type V3Doctor = {
  id: string
  name: string
  isSenior?: boolean
  consultationAmount?: number
}

export type V3TimeSlot = {
  startTime: string
  endTime: string
  isAvailable: boolean
  doctorId?: string
  doctorName?: string
}

export type V3Appointment = {
  id: string
  petId: string
  petName: string
  doctorId: string
  doctorName: string
  clinicId: string
  clinicName: string
  date: string
  startTime: string
  endTime: string
  status: string
  reasonForVisit?: string | null
  createdAt: string
}

export type V3BestSlot = {
  startTime: string
  endTime: string
  doctorIds: string[]
  doctorNames: Record<string, string>
}

export type V3PreferredDoctor = {
  doctorId: string
  appCount: number
}

export type V3BookingFlowSession = {
  id: string
  user_id: string
  booking_flow_type: "HOME_VISIT" | "CLINIC_VISIT"
  booking_provider: "NIDANA"
  platform: "WEB" | "APP"
  status: "ACTIVE" | "COMPLETED" | "ABANDONED"
  last_step: string | null
  started_at: string
  last_activity_at: string
  completed_at: string | null
  abandoned_at: string | null
}

export type V3NidanaClinicBookingFlowStep =
  | "SELECT_SERVICE"
  | "SELECT_PET"
  | "SELECT_CLINIC"
  | "SELECT_DATE_TIME"
  | "SELECT_VET_AND_SLOT"
  | "REVIEW_BOOKING"

export type V3NidanaHomeVisitBookingFlowStep =
  | "SELECT_ADDRESS"
  | "SELECT_PET"
  | "SELECT_REASON_FOR_VISIT"
  | "SELECT_DATE_TIME"
  | "REVIEW_BOOKING"

export type V3NidanaBookingFlowStep =
  | V3NidanaClinicBookingFlowStep
  | V3NidanaHomeVisitBookingFlowStep

export type V3SpeciesOption = { value: string; label: string }

export type V3BreedOption = {
  value: string
  label: string
  coatType: string | null
  bodySize: string | null
}

// Our internal clinic-visit booking lifecycle, as reported by the order-status
// API (mirrors the home-visit one).
export type V3ClinicVisitPaymentOrderStatus =
  | "AWAITING_PAYMENT"
  | "BOOKED"
  | "EXPIRED"

export type V3ClinicVisitInitiateResponse =
  | {
      action: "PAYMENT_REQUIRED"
      paymentRequired: true
      order: V3PaymentOrder
    }
  | {
      action: "APPOINTMENT_CONFIRMED"
      paymentRequired: false
      appointment: V3Appointment
    }

export type V3Address = {
  id: string
  tag: string | null
  line1: string
  line2: string | null
  pincode: string
  latitude: number | null
  longitude: number | null
  directions: string | null
}

export type V3HomeVisitSlot = {
  startTime: string
  endTime: string
  doctorIds: string[]
  doctorNames: Record<string, string>
}

export type V3HomeVisitAppointment = {
  id: string
  nidanaAppointmentId: string
  petId: string
  addressId: string
  clinicSlug: string
  apptDate: string
  apptStart: string
  apptEnd: string
  reasonForVisit: string | null
  isEmergency: boolean | null
  reasonCode: string | null
  petParentNotes: string | null
  visitStatus: string
}

export type V3PaymentOrder = {
  orderId: string
  paymentSessionId: string
  amount: number
  currency: "INR"
  expiresAt: string | null
}

// Our internal booking lifecycle, as reported by the order-status API.

// Our internal booking lifecycle, as reported by the order-status API.
export type V3HomeVisitPaymentOrderStatus =
  | "AWAITING_PAYMENT"
  | "BOOKED"
  | "EXPIRED"

export type V3HomeVisitInitiateResponse =
  | {
      action: "PAYMENT_REQUIRED"
      paymentRequired: true
      order: V3PaymentOrder
    }
  | {
      action: "APPOINTMENT_CONFIRMED"
      paymentRequired: false
      appointment: V3HomeVisitAppointment
    }

type V3AppointmentCommon = {
  id: string
  petId: string
  petName: string
  doctorName: string
  clinicId: string
  clinicName: string
  date: string
  startTime: string
  endTime: string
  category: "veterinary" | "grooming" | null
  groomingTypeKey: string | null
  appointmentTypeName: string | null
  reasonForVisit: string | null
  canModifyOrCancel: boolean
  modificationDeadline: string | null
}

export type V3AppointmentListAddress = {
  line1: string
  line2: string | null
  pincode: string
  directions: string | null
}

// Self-cancellation policy + refund preview. Returned for both booking types.

// Self-cancellation policy + refund preview. Returned for both booking types.
export type V3CancellationPolicy = {
  allowed: boolean
  disabledReason: "NIDANA_LOCKED" | null
  refund: { amount: number } | null
  refundDeclinedReason: "PAST_REFUND_WINDOW" | null
  // Refund window for this booking, sourced from the server so the policy copy
  // isn't hardcoded. refundCutoffHours drives the relative phrasing ("at least N
  // hours before"); refundCutoffAt is the resolved cutoff instant (ISO) for the
  // absolute phrasing ("full refund if cancelled by …"). Optional for backward
  // compatibility with older servers — clients fall back to 24h when absent.
  refundCutoffHours?: number
  refundCutoffAt?: string | null
}

export type V3HomeVisitRefundSummary = {
  status: "INITIATED" | "COMPLETED" | "FAILED"
  amount: number
  initiatedAt: string
  completedAt: string | null
}

export type V3AppointmentListItem =
  | (V3AppointmentCommon & {
      bookingType: "CLINIC_VISIT"
      clinicStatus: string
      cancellation: V3CancellationPolicy
      payment: { amount: number } | null
      refund: V3HomeVisitRefundSummary | null
      // Seniority tier of the booked vet; used to lock a prepaid reschedule to
      // its paid tier. null for grooming / non-veterinary.
      vetTier: "SENIOR" | "STANDARD" | null
    })
  | (V3AppointmentCommon & {
      bookingType: "HOME_VISIT"
      visitStatus: string
      address: V3AppointmentListAddress | null
      cancellation: V3CancellationPolicy
      payment: { amount: number } | null
      refund: V3HomeVisitRefundSummary | null
    })

export type V3ActiveApptBucket = "CLINIC_VET" | "CLINIC_GROOMING" | "HOME_VISIT"

// The active appointment blocking a given type bucket for a pet, including its
// id so the booking flows can link to it for cancel/reschedule.

// The active appointment blocking a given type bucket for a pet, including its
// id so the booking flows can link to it for cancel/reschedule.
export type V3ActiveApptForPet = {
  bucket: V3ActiveApptBucket
  appointmentId: string
}

// Per-pet map of the appointment-type buckets the user already has an active
// (upcoming, still-scheduled) booking in. Used by the booking flows to disable
// pets that can't take another appointment of the type being booked, and to
// link to the existing appointment.

export type V3AppointmentStatus = {
  visitStatus: string
  canModifyOrCancel: boolean
  startOtp: string | null
}

export type V3DocumentType =
  | "invoice"
  | "credit_note"
  | "payment_receipt"
  | "diagnostic"
  | "emr"
  | "prescription"
  | "estimate"
  | "vaccination"
  | "consent_form"

export type V3DocumentFile = {
  downloadId: string
  name: string
  fileType: string
  createdAt: string
}

export type V3Document = {
  id: string
  name: string
  type: V3DocumentType
  petId: string | null
  petName: string | null
  createdAt: string
  amount: number | null
  clinicId: string | null
  doctorName: string | null
  files: V3DocumentFile[]
}

export type V3DocumentCounts = {
  invoices: number
  credit_notes: number
  payment_receipts: number
  diagnostics: number
  emrs: number
  prescriptions: number
  estimates: number
  vaccinations: number
  consent_forms: number
}

export type V3DocumentDownload = {
  url: string | null
  expiresIn: number
  fileName: string
  isGenerating: boolean
}

export type V3VisitType = { key: string; title: string; description: string }

export type V3GroomingServiceType = {
  key: string
  displayName: string
  priceInRupees?: number
}

export type V3PetGroomingAttributes = {
  coatType: string
  bodySize: string | null
}

export type V3GroomingSlot = {
  startTime: string
  endTime: string
  durationMinutes: number
  groomerIds: string[]
  groomerNames: Record<string, string>
}

export type V3CancelAppointmentResult = {
  refund: { amount: number } | null
  refundDeclinedReason: "PAST_REFUND_WINDOW" | null
}

export type V3Owner = {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  countryCode?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
}

// ─── Auth token helpers (used by V3UserContext) ───────────────────────────────

export const V3_AUTH_TOKEN_KEY = AUTH_TOKEN_KEY

export function setV3AuthToken(token: string) {
  storeAuthToken(token)
}

export function clearV3Auth() {
  removeAuthToken()
}

// ─── Lookups / caches ─────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000

function memo<T>(fn: () => Promise<T>): () => Promise<T> {
  let value: Promise<T> | null = null
  let at = 0
  return () => {
    if (!value || Date.now() - at > CACHE_TTL_MS) {
      at = Date.now()
      value = fn().catch((e) => {
        value = null
        throw e
      })
    }
    return value
  }
}

function memoBy<K, T>(fn: (key: K) => Promise<T>): (key: K) => Promise<T> {
  const cache = new Map<K, { at: number; value: Promise<T> }>()
  return (key) => {
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value
    const value = fn(key).catch((e) => {
      cache.delete(key)
      throw e
    })
    cache.set(key, { at: Date.now(), value })
    return value
  }
}

const getAllClinics = memo(async () => flattenClinics(await dp.clinics()))

const getProviders = memoBy((clinicId: number) => dp.providers(clinicId))

const getGroomingCatalog = memoBy((clinicId: number) =>
  dp.groomingItems(clinicId),
)

function isGroomer(p: DpProvider): boolean {
  return /groom/i.test(p.serviceType ?? "")
}

async function getVets(clinicId: number): Promise<DpProvider[]> {
  const providers = await getProviders(clinicId)
  return providers.filter((p) => !isGroomer(p))
}

async function clinicName(clinicId: number): Promise<string> {
  try {
    const clinics = await getAllClinics()
    return clinics.find((c) => c.id === clinicId)?.name ?? ""
  } catch {
    return ""
  }
}

async function providerName(
  clinicId: number,
  providerId?: number | null,
): Promise<string> {
  if (providerId == null) return ""
  try {
    const providers = await getProviders(clinicId)
    return providers.find((p) => p.id === providerId)?.name ?? ""
  } catch {
    return ""
  }
}

function cleanClinicName(name: string): string {
  return name.replace(/^dr\.?\s*paws\s*/i, "").trim() || name
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function plusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function unavailable(message: string): never {
  throw new DrpawsError(message, 501)
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapPet(p: DpPet): V3Pet {
  return {
    id: String(p.id),
    name: p.name,
    species: p.species ?? p.type ?? null,
    breed: p.breed ?? null,
    gender: p.gender ?? "",
    dateOfBirth: p.dob ?? null,
    weight: null,
    reproductiveStatus: null,
  }
}

function mapOwner(u: DpUser): V3Owner {
  return {
    id: String(u.id),
    firstName: u.first_name,
    lastName: u.last_name,
    phoneNumber: u.phone_number,
    countryCode: null,
    email: u.email ?? null,
    address: u.address ?? null,
    city: u.city ?? null,
    state: u.state ?? null,
    postalCode: u.postal_code ?? null,
  }
}

const TERMINAL_STATUSES = new Set([
  "cancelled",
  "canceled",
  "completed",
  "checking out",
  "no show",
  "missed",
])

function isTerminal(status: string | null | undefined): boolean {
  return !!status && TERMINAL_STATUSES.has(status.toLowerCase())
}

function startsInFuture(a: DpAppointment): boolean {
  const time = toHHMM(a.startTime) || "00:00"
  return new Date(`${toYMD(a.date)}T${time}:00`).getTime() > Date.now()
}

async function mapAppointment(a: DpAppointment): Promise<V3Appointment> {
  const [cName, dName] = await Promise.all([
    clinicName(a.clinicId),
    providerName(a.clinicId, a.doctorId),
  ])
  return {
    id: String(a.id),
    petId: a.petId != null ? String(a.petId) : "",
    petName: a.petName ?? "",
    doctorId: a.doctorId != null ? String(a.doctorId) : "",
    doctorName: dName,
    clinicId: String(a.clinicId),
    clinicName: cName,
    date: toYMD(a.date),
    startTime: toHHMM(a.startTime),
    endTime: toHHMM(a.endTime),
    status: a.status ?? "Scheduled",
    reasonForVisit: a.reasonForVisit ?? null,
    createdAt: "",
  }
}

async function mapListItem(a: DpAppointment): Promise<V3AppointmentListItem> {
  const base = await mapAppointment(a)
  const modifiable = !isTerminal(a.status) && startsInFuture(a)
  const isGrooming = a.groomingCatalogId != null
  return {
    id: base.id,
    petId: base.petId,
    petName: base.petName,
    doctorName: base.doctorName,
    clinicId: base.clinicId,
    clinicName: base.clinicName,
    date: base.date,
    startTime: base.startTime,
    endTime: base.endTime,
    category: isGrooming ? "grooming" : "veterinary",
    groomingTypeKey: isGrooming ? String(a.groomingCatalogId) : null,
    appointmentTypeName: isGrooming ? "Grooming" : "Consultation",
    reasonForVisit: base.reasonForVisit ?? null,
    canModifyOrCancel: modifiable,
    modificationDeadline: null,
    bookingType: "CLINIC_VISIT",
    clinicStatus: base.status,
    cancellation: {
      allowed: modifiable,
      disabledReason: null,
      refund: null,
      refundDeclinedReason: null,
    },
    payment:
      a.priceInRupees != null ? { amount: Number(a.priceInRupees) } : null,
    refund: null,
    vetTier: null,
  }
}

function confirmed(appointment: V3Appointment): V3ClinicVisitInitiateResponse {
  return {
    action: "APPOINTMENT_CONFIRMED",
    paymentRequired: false,
    appointment,
  }
}

// ─── Pets / owner ─────────────────────────────────────────────────────────────

export async function v3FetchPets(): Promise<V3Pet[]> {
  const { user, pets } = await dp.me()
  return (pets ?? user.pets ?? []).filter((p) => !p.is_deceased).map(mapPet)
}

export async function v3CreatePet(input: {
  name: string
  clinicId: string
  species?: string
  breed?: string
  gender?: string
  dateOfBirth?: string | null
  weight?: string
  reproductiveStatus?: string
}): Promise<V3Pet> {
  const pet = await dp.addPet({
    name: input.name,
    clinic_id: Number(input.clinicId),
    species: input.species ?? null,
    breed: input.breed ?? null,
    gender: input.gender ?? null,
    date_of_birth: input.dateOfBirth ?? null,
  })
  return mapPet(pet)
}

export async function v3UpdatePet(
  _id: string,
  _input: {
    name?: string
    species?: string
    breed?: string | null
    gender?: string
    dateOfBirth?: string | null
    weight?: string | null
    reproductiveStatus?: string | null
  },
): Promise<V3Pet> {
  return unavailable(
    "Editing pet details isn't available yet. Please contact the clinic.",
  )
}

export async function v3GetMe(): Promise<V3Owner> {
  const { user } = await dp.me()
  return mapOwner(user)
}

export async function v3UpdateOwner(input: {
  firstName?: string
  lastName?: string
  email?: string | null
}): Promise<V3Owner> {
  const user = await dp.updateProfile(input)
  return mapOwner(user)
}

const SPECIES: V3SpeciesOption[] = [
  { value: "canine", label: "Dog" },
  { value: "feline", label: "Cat" },
]

const FALLBACK_BREEDS: Record<string, string[]> = {
  canine: [
    "Indie / Indian Pariah",
    "Labrador Retriever",
    "Golden Retriever",
    "German Shepherd",
    "Beagle",
    "Pug",
    "Shih Tzu",
    "Siberian Husky",
    "Pomeranian",
    "Rottweiler",
    "Doberman",
    "Boxer",
    "Cocker Spaniel",
    "Dachshund",
    "Lhasa Apso",
    "Mixed breed",
  ],
  feline: [
    "Indian Domestic / Indie",
    "Persian",
    "Siamese",
    "Maine Coon",
    "Bengal",
    "British Shorthair",
    "Ragdoll",
    "Mixed breed",
  ],
}

export async function v3FetchSpecies(): Promise<V3SpeciesOption[]> {
  return SPECIES
}

export async function v3FetchBreeds(species: string): Promise<V3BreedOption[]> {
  let fromApi: unknown[] = []
  try {
    fromApi = await dp.breeds(species)
  } catch {
    // fall through to the static list
  }
  const mapped = fromApi
    .map((b) => {
      if (typeof b === "string") return { value: b, label: b }
      const o = b as Record<string, unknown>
      const label = String(o.name ?? o.label ?? o.breed ?? o.value ?? "")
      return label ? { value: String(o.value ?? label), label } : null
    })
    .filter((b): b is { value: string; label: string } => b !== null)
  const options =
    mapped.length > 0
      ? mapped
      : (FALLBACK_BREEDS[species.toLowerCase()] ?? []).map((n) => ({
          value: n,
          label: n,
        }))
  return options.map((o) => ({ ...o, coatType: null, bodySize: null }))
}

// ─── Clinics / doctors / availability ─────────────────────────────────────────

export async function v3FetchClinics(): Promise<V3Clinic[]> {
  const clinics = (await getAllClinics()).filter((c) => !isAtHomeClinic(c))
  const grooming = await Promise.all(
    clinics.map((c) =>
      getGroomingCatalog(c.id)
        .then((items) => items.length > 0)
        .catch(() => false),
    ),
  )
  return clinics.map((c, i) => {
    const details = (c.details ?? {}) as Record<string, unknown>
    return {
      id: String(c.id),
      name: c.name,
      neighborhood: cleanClinicName(c.name),
      city: c.city ?? "",
      address:
        typeof details.address === "string" ? details.address : undefined,
      heroImageUrl:
        typeof details.heroImageUrl === "string"
          ? details.heroImageUrl
          : undefined,
      phone: c.phone ?? undefined,
      vetEnabled: true,
      groomingEnabled: grooming[i],
    }
  })
}

export async function v3FetchAppointmentTypes(
  _clinicId: string,
): Promise<V3AppointmentType[]> {
  return [
    {
      key: "VET_CONSULTATION",
      name: "Vet Consultation",
      description: "Consult a vet for check-ups, vaccinations and more",
    },
  ]
}

export async function v3FetchDoctors(clinicId: string): Promise<V3Doctor[]> {
  const vets = await getVets(Number(clinicId))
  return vets.map((p) => ({
    id: String(p.id),
    name: p.name,
    consultationAmount: p.consultationPriceInRupees ?? undefined,
  }))
}

async function vetSlotsFor(
  clinicId: number,
  date: string,
  doctorId?: string,
): Promise<{ provider: DpProvider; slots: DpSlot[] }[]> {
  const vets = await getVets(clinicId)
  const targets = doctorId
    ? vets.filter((p) => String(p.id) === doctorId)
    : vets
  return Promise.all(
    targets.map(async (provider) => ({
      provider,
      slots: await dp
        .vetSlots({ clinicId, providerId: provider.id, date })
        .catch(() => [] as DpSlot[]),
    })),
  )
}

export async function v3FetchAvailableDates(
  clinicId: string,
  doctorId?: string,
  startDate?: string,
  endDate?: string,
): Promise<string[]> {
  const cid = Number(clinicId)
  const vets = await getVets(cid)
  const targets = doctorId
    ? vets.filter((p) => String(p.id) === doctorId)
    : vets
  const lists = await Promise.all(
    targets.map((p) =>
      dp
        .vetDates({
          clinicId: cid,
          providerId: p.id,
          startDate: startDate ?? today(),
          endDate: endDate ?? plusDays(30),
        })
        .catch(() => [] as string[]),
    ),
  )
  return Array.from(new Set(lists.flat().map(toYMD))).sort()
}

export async function v3FetchTimeSlots(
  clinicId: string,
  date: string,
  doctorId?: string,
): Promise<V3TimeSlot[]> {
  const groups = await vetSlotsFor(Number(clinicId), date, doctorId)
  const slots = groups.flatMap(({ provider, slots }) =>
    slots.map((s) => ({
      startTime: toHHMM(s.startTime),
      endTime: toHHMM(s.endTime),
      isAvailable: true,
      doctorId: String(provider.id),
      doctorName: provider.name,
    })),
  )
  return slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export async function v3FetchBestSlots(
  clinicId: string,
  date: string,
): Promise<{ slots: V3BestSlot[]; preferredDoctors: V3PreferredDoctor[] }> {
  const groups = await vetSlotsFor(Number(clinicId), date)
  const byStart = new Map<string, V3BestSlot>()
  for (const { provider, slots } of groups) {
    for (const s of slots) {
      const start = toHHMM(s.startTime)
      const entry = byStart.get(start) ?? {
        startTime: start,
        endTime: toHHMM(s.endTime),
        doctorIds: [],
        doctorNames: {},
      }
      entry.doctorIds.push(String(provider.id))
      entry.doctorNames[String(provider.id)] = provider.name
      byStart.set(start, entry)
    }
  }
  const preferredDoctors = groups
    .map(({ provider }) => ({
      doctorId: String(provider.id),
      appCount: provider.clientProviderRelationship?.appointmentCount ?? 0,
    }))
    .filter((d) => d.appCount > 0)
    .sort((a, b) => b.appCount - a.appCount)
  return {
    slots: Array.from(byStart.values()).sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    ),
    preferredDoctors,
  }
}

// ─── Booking flow tracking (client-side only) ─────────────────────────────────

export async function v3StartBookingFlow(input: {
  booking_flow_type: "HOME_VISIT" | "CLINIC_VISIT"
  platform: "WEB"
}): Promise<V3BookingFlowSession> {
  const now = new Date().toISOString()
  return {
    id: `local-${Date.now()}`,
    user_id: "",
    booking_flow_type: input.booking_flow_type,
    booking_provider: "NIDANA",
    platform: input.platform,
    status: "ACTIVE",
    last_step: null,
    started_at: now,
    last_activity_at: now,
    completed_at: null,
    abandoned_at: null,
  }
}

export async function v3UpdateBookingFlowStep(_input: {
  sessionId: string
  stepName: V3NidanaBookingFlowStep
}): Promise<void> {
  // The Dr Paws API doesn't track booking funnels; nothing to do.
}

// ─── Vet booking ──────────────────────────────────────────────────────────────

export async function v3CreateAppointment(input: {
  clinicId: string
  petId: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  reasonForVisit?: string
  appointmentTypeKey?: string
  bookingFlowSessionId?: string
}): Promise<V3Appointment> {
  const created = await dp.bookVet({
    clinicId: Number(input.clinicId),
    providerId: Number(input.doctorId),
    petId: Number(input.petId),
    date: input.date,
    startTime: input.startTime,
    reasonForVisit: input.reasonForVisit ?? null,
  })
  return mapAppointment(created)
}

export async function v3InitiateVetAppointment(input: {
  clinicId: string
  petId: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  reasonForVisit?: string
  couponCode?: string
  bookingFlowSessionId?: string
}): Promise<V3ClinicVisitInitiateResponse> {
  const created = await dp.bookVet({
    clinicId: Number(input.clinicId),
    providerId: Number(input.doctorId),
    petId: Number(input.petId),
    date: input.date,
    startTime: input.startTime,
    reasonForVisit: input.reasonForVisit ?? null,
    couponCode: input.couponCode ?? null,
  })
  return confirmed(await mapAppointment(created))
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

type PriceQuote = {
  priceInRupees: number
  originalPriceInRupees?: number
  discountInRupees?: number
  couponApplied?: string
  couponError?: string
}

const COUPON_SESSION_KEY = "drpawsCouponSession"

function couponSessionId(): string {
  try {
    let id = localStorage.getItem(COUPON_SESSION_KEY)
    if (!id) {
      id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(COUPON_SESSION_KEY, id)
    }
    return id
  } catch {
    return `web-${Date.now()}`
  }
}

async function withCoupon(
  base: number,
  couponCode: string | undefined,
): Promise<PriceQuote> {
  if (!couponCode) return { priceInRupees: base }
  try {
    const res = await dp.applyCoupon(couponSessionId(), couponCode)
    const percent = Number(res.percentOff)
    const discounted =
      res.priceInRupees != null
        ? Number(res.priceInRupees)
        : Number.isFinite(percent)
          ? Math.round(base * (1 - percent / 100))
          : base
    return {
      priceInRupees: discounted,
      originalPriceInRupees: base,
      discountInRupees: Math.max(0, base - discounted),
      couponApplied: couponCode,
    }
  } catch (e) {
    return {
      priceInRupees: base,
      couponError: (e as Error).message || "Invalid coupon code",
    }
  }
}

async function findVetById(doctorId: string): Promise<DpProvider | null> {
  const clinics = (await getAllClinics()).filter((c) => !isAtHomeClinic(c))
  for (const c of clinics) {
    const vets = await getVets(c.id).catch(() => [] as DpProvider[])
    const hit = vets.find((p) => String(p.id) === doctorId)
    if (hit) return hit
  }
  return null
}

export async function v3FetchVetPrice(opts?: {
  doctorId?: string
  isSenior?: boolean
  couponCode?: string
}): Promise<
  PriceQuote & {
    seniorPriceInRupees: number
  }
> {
  let base: number | null = null
  if (opts?.doctorId) {
    base = (await findVetById(opts.doctorId))?.consultationPriceInRupees ?? null
  }
  if (base == null) {
    // No specific vet yet: quote the lowest consultation fee on offer.
    const clinics = (await getAllClinics()).filter((c) => !isAtHomeClinic(c))
    const prices: number[] = []
    for (const c of clinics.slice(0, 3)) {
      const vets = await getVets(c.id).catch(() => [] as DpProvider[])
      vets.forEach((v) => {
        if (v.consultationPriceInRupees != null)
          prices.push(v.consultationPriceInRupees)
      })
    }
    base = prices.length > 0 ? Math.min(...prices) : 0
  }
  const quote = await withCoupon(base, opts?.couponCode)
  return { ...quote, seniorPriceInRupees: base }
}

// ─── Grooming ─────────────────────────────────────────────────────────────────

async function groomingItemFor(
  clinicId: number,
  key: string,
): Promise<DpGroomingItem | null> {
  const items = await getGroomingCatalog(clinicId)
  return items.find((i) => i.name === key || String(i.id) === key) ?? null
}

export async function v3FetchGroomingServiceTypes(_petId?: string): Promise<{
  groomingTypes: V3GroomingServiceType[]
  petGroomingAttributes: V3PetGroomingAttributes | null
}> {
  const clinics = (await getAllClinics()).filter((c) => !isAtHomeClinic(c))
  const catalogs = await Promise.all(
    clinics.map((c) => getGroomingCatalog(c.id).catch(() => [])),
  )
  const byName = new Map<string, V3GroomingServiceType>()
  for (const item of catalogs.flat()) {
    const existing = byName.get(item.name)
    if (
      !existing ||
      (item.priceInRupees != null &&
        (existing.priceInRupees == null ||
          item.priceInRupees < existing.priceInRupees))
    ) {
      byName.set(item.name, {
        key: item.name,
        displayName: item.name,
        priceInRupees: item.priceInRupees ?? undefined,
      })
    }
  }
  return {
    groomingTypes: Array.from(byName.values()),
    petGroomingAttributes: null,
  }
}

export async function v3FetchGroomingPrice(input: {
  petId: string
  groomingTypeKey: string
  couponCode?: string
}): Promise<PriceQuote> {
  const { groomingTypes } = await v3FetchGroomingServiceTypes()
  const base =
    groomingTypes.find((g) => g.key === input.groomingTypeKey)?.priceInRupees ??
    0
  return withCoupon(base, input.couponCode)
}

export async function v3FetchGroomingDates(
  clinicId: string,
  groomingTypeKey: string,
  petId: string,
  startDate?: string,
  endDate?: string,
): Promise<string[]> {
  const cid = Number(clinicId)
  const item = await groomingItemFor(cid, groomingTypeKey)
  if (!item?.appointmentTypeId) return []
  const dates = await dp.groomingDates({
    clinicId: cid,
    petId: Number(petId),
    appointmentTypeId: item.appointmentTypeId,
    startDate: startDate ?? today(),
    endDate: endDate ?? plusDays(30),
  })
  return Array.from(new Set(dates.map(toYMD))).sort()
}

export async function v3FetchGroomingSlots(
  clinicId: string,
  date: string,
  groomingTypeKey: string,
  petId: string,
): Promise<{ date: string; slots: V3GroomingSlot[]; groomers: V3Doctor[] }> {
  const cid = Number(clinicId)
  const item = await groomingItemFor(cid, groomingTypeKey)
  if (!item?.appointmentTypeId) return { date, slots: [], groomers: [] }
  const raw = await dp.groomingSlots({
    clinicId: cid,
    petId: Number(petId),
    appointmentTypeId: item.appointmentTypeId,
    date,
  })
  const groomerMap = new Map<string, V3Doctor>()
  const slots = raw.map((s) => {
    const groomers = s.groomers ?? []
    groomers.forEach((g) =>
      groomerMap.set(String(g.id), { id: String(g.id), name: g.name }),
    )
    const start = toHHMM(s.startTime)
    const end = toHHMM(s.endTime)
    return {
      startTime: start,
      endTime: end,
      durationMinutes: minutesBetween(start, end),
      groomerIds: groomers.map((g) => String(g.id)),
      groomerNames: Object.fromEntries(
        groomers.map((g) => [String(g.id), g.name]),
      ),
    }
  })
  return {
    date,
    slots: slots.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    groomers: Array.from(groomerMap.values()),
  }
}

async function bookGrooming(input: {
  clinicId: string
  petId: string
  groomerId: string
  groomingTypeKey: string
  date: string
  startTime: string
  couponCode?: string
}): Promise<V3Appointment> {
  const cid = Number(input.clinicId)
  const item = await groomingItemFor(cid, input.groomingTypeKey)
  if (!item) {
    throw new DrpawsError("This grooming service isn't available here", 404)
  }
  const created = await dp.bookGrooming({
    clinicId: cid,
    providerId: Number(input.groomerId),
    petId: Number(input.petId),
    groomingCatalogId: item.id,
    date: input.date,
    startTime: input.startTime,
    couponCode: input.couponCode ?? null,
  })
  return mapAppointment(created)
}

export async function v3CreateGroomingAppointment(input: {
  clinicId: string
  petId: string
  groomerId: string
  groomingTypeKey: string
  date: string
  startTime: string
  endTime: string
  bookingFlowSessionId?: string
}): Promise<V3Appointment> {
  return bookGrooming(input)
}

export async function v3InitiateGroomingAppointment(input: {
  clinicId: string
  petId: string
  groomerId: string
  groomingTypeKey: string
  date: string
  startTime: string
  endTime: string
  couponCode?: string
  bookingFlowSessionId?: string
}): Promise<V3ClinicVisitInitiateResponse> {
  return confirmed(await bookGrooming(input))
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function v3FetchAppointments(
  page: number,
  pageSize: number,
): Promise<{ items: V3AppointmentListItem[]; hasNext: boolean }> {
  const raw = await dp.appointments(page, pageSize)
  const items = await Promise.all(raw.map(mapListItem))
  return { items, hasNext: raw.length >= pageSize }
}

export async function v3FetchActiveAppointmentTypesByPet(): Promise<
  Record<string, V3ActiveApptForPet[]>
> {
  const raw = await dp.appointments(1, 50)
  const out: Record<string, V3ActiveApptForPet[]> = {}
  for (const a of raw) {
    if (a.petId == null || isTerminal(a.status) || !startsInFuture(a)) continue
    const key = String(a.petId)
    ;(out[key] ??= []).push({
      bucket: a.groomingCatalogId != null ? "CLINIC_GROOMING" : "CLINIC_VET",
      appointmentId: String(a.id),
    })
  }
  return out
}

export async function v3GetAppointment(
  id: string,
): Promise<V3AppointmentListItem> {
  return mapListItem(await dp.appointment(Number(id)))
}

export async function v3GetAppointmentStatus(
  id: string,
): Promise<V3AppointmentStatus> {
  const a = await dp.appointment(Number(id))
  return {
    visitStatus: a.status ?? "Scheduled",
    canModifyOrCancel: !isTerminal(a.status) && startsInFuture(a),
    startOtp: null,
  }
}

export async function v3CancelAppointment(
  id: string,
): Promise<V3CancelAppointmentResult> {
  await dp.cancelAppointment(Number(id))
  return { refund: null, refundDeclinedReason: null }
}

// ─── Visit types ──────────────────────────────────────────────────────────────

export async function v3FetchVisitTypes(): Promise<{
  visitTypes: V3VisitType[]
  clinicSubtypes: V3VisitType[]
}> {
  const clinics = (await getAllClinics()).filter((c) => !isAtHomeClinic(c))
  const grooming = await Promise.all(
    clinics.map((c) =>
      getGroomingCatalog(c.id)
        .then((items) => items.length > 0)
        .catch(() => false),
    ),
  )
  const clinicSubtypes: V3VisitType[] = [
    {
      key: "VET_CONSULTATION",
      title: "Vet Consultation",
      description: "Consult a vet for check-ups, vaccinations and more",
    },
  ]
  if (grooming.some(Boolean)) {
    clinicSubtypes.push({
      key: "GROOMING",
      title: "Grooming",
      description: "Professional grooming for your pet",
    })
  }
  return {
    visitTypes: [
      {
        key: "CLINIC_VISIT",
        title: "Clinic Visit",
        description: "Book an appointment at one of our clinics",
      },
    ],
    clinicSubtypes,
  }
}

// ─── Documents (medical records) ──────────────────────────────────────────────

function emptyCounts(): V3DocumentCounts {
  return {
    invoices: 0,
    credit_notes: 0,
    payment_receipts: 0,
    diagnostics: 0,
    emrs: 0,
    prescriptions: 0,
    estimates: 0,
    vaccinations: 0,
    consent_forms: 0,
  }
}

const COUNT_KEY: Partial<Record<V3DocumentType, keyof V3DocumentCounts>> = {
  invoice: "invoices",
  prescription: "prescriptions",
  emr: "emrs",
}

async function loadDocuments(): Promise<V3Document[]> {
  const appts = await dp.appointments(1, 30)
  const withRecords = await Promise.all(
    appts.map(async (a) => ({
      appt: a,
      records: await dp.records(a.id).catch(() => null),
    })),
  )
  const docs: V3Document[] = []
  for (const { appt, records } of withRecords) {
    if (!records) continue
    const petId = appt.petId != null ? String(appt.petId) : null
    const common = {
      petId,
      petName: appt.petName ?? null,
      createdAt: toYMD(appt.date),
      clinicId: String(appt.clinicId),
    }
    const doctorName = await providerName(appt.clinicId, appt.doctorId)
    for (const inv of records.invoices ?? []) {
      docs.push({
        id: `invoice-${inv.documentId}`,
        name: inv.invoiceNumber ? `Invoice ${inv.invoiceNumber}` : "Invoice",
        type: "invoice",
        amount: inv.amount ?? null,
        doctorName: doctorName || null,
        files: [
          {
            downloadId: String(inv.documentId),
            name: inv.invoiceNumber ?? "Invoice",
            fileType: "pdf",
            createdAt: common.createdAt,
          },
        ],
        ...common,
      })
    }
    for (const rx of records.prescriptions ?? []) {
      docs.push({
        id: `prescription-${rx.documentId}`,
        name: rx.referenceId
          ? `Prescription ${rx.referenceId}`
          : "Prescription",
        type: "prescription",
        amount: null,
        doctorName: rx.prescribedByDoctorName ?? (doctorName || null),
        files: [
          {
            downloadId: String(rx.documentId),
            name: rx.referenceId ?? "Prescription",
            fileType: "pdf",
            createdAt: common.createdAt,
          },
        ],
        ...common,
      })
    }
    if (records.clinicalRecord?.clinicalNotes) {
      docs.push({
        id: `emr-${appt.id}`,
        name: "Clinical notes",
        type: "emr",
        amount: null,
        doctorName: doctorName || null,
        files: [],
        ...common,
      })
    }
  }
  return docs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function v3FetchDocuments(params: {
  type?: V3DocumentType
  petId?: string
  page?: number
  pageSize?: number
}): Promise<{
  counts: V3DocumentCounts
  documents: V3Document[]
  hasNext: boolean
}> {
  const all = await loadDocuments()
  const byPet = params.petId ? all.filter((d) => d.petId === params.petId) : all
  const counts = emptyCounts()
  for (const d of byPet) {
    const key = COUNT_KEY[d.type]
    if (key) counts[key] += 1
  }
  const filtered = params.type
    ? byPet.filter((d) => d.type === params.type)
    : byPet
  const pageSize = params.pageSize ?? filtered.length
  const start = ((params.page ?? 1) - 1) * pageSize
  return {
    counts,
    documents: filtered.slice(start, start + pageSize),
    hasNext: start + pageSize < filtered.length,
  }
}

async function fetchDocumentBlob(
  downloadId: string,
): Promise<{ url: string | null; fileName: string }> {
  const token = getAuthToken()
  const res = await fetch(
    `${API_BASE_URL}/drpaws/medical-records/${encodeURIComponent(downloadId)}/download`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  )
  if (!res.ok) {
    throw new DrpawsError(`Download failed: ${res.status}`, res.status)
  }
  const type = res.headers.get("content-type") ?? ""
  if (type.includes("application/json")) {
    const json = (await res.json()) as {
      url?: string
      downloadUrl?: string
      fileName?: string
    }
    return {
      url: json.url ?? json.downloadUrl ?? null,
      fileName: json.fileName ?? "document",
    }
  }
  const blob = await res.blob()
  return { url: URL.createObjectURL(blob), fileName: "document" }
}

export async function v3GetDocumentDownloadUrl(
  downloadId: string,
  _type: V3DocumentType,
): Promise<V3DocumentDownload> {
  const { url, fileName } = await fetchDocumentBlob(downloadId)
  return { url, expiresIn: 300, fileName, isGenerating: false }
}

export async function v3FetchDocumentView(
  downloadId: string,
  _type: V3DocumentType,
): Promise<string | null> {
  try {
    return (await fetchDocumentBlob(downloadId)).url
  } catch {
    return null
  }
}

// ─── Auth client (OTP login) ──────────────────────────────────────────────────

type AuthErrorBody = { message?: string; errorCode?: string }
type AuthError = ErrorResponseAPIError<AuthErrorBody> | FetchAPIError
type AuthResult<T> = Result<{ status: number; body: T }, AuthError>

async function authCall<T>(fn: () => Promise<T>): Promise<AuthResult<T>> {
  try {
    return ok({ status: 200, body: await fn() })
  } catch (e) {
    if (e instanceof ErrorResponseAPIError) return err(e)
    if (e instanceof DrpawsError) {
      return err(
        new ErrorResponseAPIError<AuthErrorBody>(e.message, e.status, {
          message: e.message,
          errorCode: e.errorCode,
        }),
      )
    }
    return err(new FetchAPIError((e as Error).message, e as Error))
  }
}

function toOwner(
  res: { exists: boolean; token?: string | null; owner?: V3Owner | null },
  onMissing: AuthErrorBody,
  status: number,
): { token: string; owner: V3Owner } {
  if (!res.token || !res.owner) {
    throw new ErrorResponseAPIError<AuthErrorBody>(
      onMissing.message ?? "Authentication failed",
      status,
      onMissing,
    )
  }
  return { token: res.token, owner: res.owner }
}

const api = {
  loginOTP: (params: { mobile: string }) =>
    authCall(async () => {
      await dp.requestOtp(params.mobile)
      return {}
    }),

  loginVerify: (params: { mobile: string; otp: string }) =>
    authCall(async () => {
      const res = await dp.loginVerify(params.mobile, params.otp)
      return toOwner(
        res,
        {
          message: "No account found for this number",
          errorCode: "USER_NOT_FOUND",
        },
        404,
      )
    }),

  signupVerify: (params: {
    mobile: string
    otp: string
    firstName: string
    lastName: string
    email?: string | null
  }) =>
    authCall(async () => {
      const res = await dp.signupVerify({
        mobile: params.mobile,
        otp: params.otp,
        firstName: params.firstName,
        lastName: params.lastName,
      })
      return toOwner(res, { message: "Could not create account" }, 400)
    }),

  logout: (_params: object) =>
    authCall(async () => {
      await dp.logout()
      return {}
    }),
}

export default api
