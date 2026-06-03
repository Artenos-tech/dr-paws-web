import { createAPIClient, RequestContext, z } from "../lib/apiclient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export const V3_AUTH_TOKEN_HEADER = "X-Auth-Token"
export const V3_AUTH_TOKEN_KEY = "v3AuthToken"

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

// ─── Booking API helpers ──────────────────────────────────────────────────────

function getV3Headers(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(V3_AUTH_TOKEN_KEY)
    if (token) headers[V3_AUTH_TOKEN_HEADER] = token
  }
  return headers
}

async function v3Get<T>(
  path: string,
  query?: Record<string, string | undefined>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, v)
    })
  }
  const res = await fetch(url.toString(), {
    headers: getV3Headers(),
    credentials: "include",
  })
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(
      json?.message ?? `Request failed: ${res.status}`,
    ) as Error & { status: number; errorCode?: string; body?: unknown }
    err.status = res.status
    err.errorCode = (json as any)?.errorCode
    err.body = json
    throw err
  }
  return json as T
}

async function v3Post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getV3Headers(),
    credentials: "include",
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(
      json?.message ?? `Request failed: ${res.status}`,
    ) as Error & {
      status: number
      errorCode?: string
      body?: unknown
    }
    err.status = res.status
    err.errorCode = (json as any)?.errorCode
    err.body = json
    throw err
  }
  return json as T
}

async function v3Patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: getV3Headers(),
    credentials: "include",
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(
      json?.message ?? `Request failed: ${res.status}`,
    ) as Error & {
      status: number
      errorCode?: string
      body?: unknown
    }
    err.status = res.status
    err.errorCode = (json as any)?.errorCode
    err.body = json
    throw err
  }
  return json as T
}

async function v3Put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: getV3Headers(),
    credentials: "include",
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(
      json?.message ?? `Request failed: ${res.status}`,
    ) as Error & {
      status: number
      errorCode?: string
      body?: unknown
    }
    err.status = res.status
    err.errorCode = (json as any)?.errorCode
    err.body = json
    throw err
  }
  return json as T
}

async function v3Delete<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: getV3Headers(),
    credentials: "include",
  })
  const json = await res.json()
  if (!res.ok) {
    const err = new Error(
      json?.message ?? `Request failed: ${res.status}`,
    ) as Error & {
      status: number
      errorCode?: string
      body?: unknown
    }
    err.status = res.status
    err.errorCode = (json as any)?.errorCode
    err.body = json
    throw err
  }
  return json as T
}

type V3ApiResponse<T> = { status: number; message: string } & T

export async function v3FetchPets(): Promise<V3Pet[]> {
  const data = await v3Get<V3ApiResponse<{ pets: V3Pet[] }>>("/v3/pets")
  return data.pets
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
  const data = await v3Post<V3ApiResponse<{ pet: V3Pet }>>("/v3/pets", input)
  return data.pet
}

export async function v3FetchClinics(): Promise<V3Clinic[]> {
  const data =
    await v3Get<V3ApiResponse<{ clinics: V3Clinic[] }>>("/v3/clinics")
  return data.clinics
}

export async function v3FetchAppointmentTypes(
  clinicId: string,
): Promise<V3AppointmentType[]> {
  const data = await v3Get<
    V3ApiResponse<{ appointmentTypes: V3AppointmentType[] }>
  >(`/v3/clinics/${encodeURIComponent(clinicId)}/appointment-types`)
  return data.appointmentTypes
}

export async function v3FetchDoctors(clinicId: string): Promise<V3Doctor[]> {
  const data = await v3Get<V3ApiResponse<{ doctors: V3Doctor[] }>>(
    `/v3/clinics/${encodeURIComponent(clinicId)}/doctors`,
  )
  return data.doctors
}

export async function v3FetchAvailableDates(
  clinicId: string,
  doctorId?: string,
  startDate?: string,
  endDate?: string,
): Promise<string[]> {
  const data = await v3Get<V3ApiResponse<{ dates: string[] }>>(
    `/v3/clinics/${encodeURIComponent(clinicId)}/availability/dates`,
    { doctorId, startDate, endDate },
  )
  return data.dates
}

export async function v3FetchTimeSlots(
  clinicId: string,
  date: string,
  doctorId?: string,
): Promise<V3TimeSlot[]> {
  const data = await v3Get<
    V3ApiResponse<{ date: string; timeSlots: V3TimeSlot[] }>
  >(
    `/v3/clinics/${encodeURIComponent(clinicId)}/availability/slots/${encodeURIComponent(date)}`,
    { doctorId },
  )
  return data.timeSlots
}

export async function v3FetchBestSlots(
  clinicId: string,
  date: string,
): Promise<{ slots: V3BestSlot[]; preferredDoctors: V3PreferredDoctor[] }> {
  const data = await v3Get<
    V3ApiResponse<{
      slots: V3BestSlot[]
      preferredDoctors: V3PreferredDoctor[]
    }>
  >(`/v3/clinics/${encodeURIComponent(clinicId)}/availability/best-slots`, {
    date,
  })
  return { slots: data.slots, preferredDoctors: data.preferredDoctors }
}

export async function v3StartBookingFlow(input: {
  booking_flow_type: "HOME_VISIT" | "CLINIC_VISIT"
  platform: "WEB"
}): Promise<V3BookingFlowSession> {
  const data = await v3Post<
    V3ApiResponse<{ data: { session: V3BookingFlowSession } }>
  >("/v3/booking/flow/start", input)
  return data.data.session
}

export async function v3UpdateBookingFlowStep(input: {
  sessionId: string
  stepName: V3NidanaBookingFlowStep
}): Promise<void> {
  await v3Patch<V3ApiResponse<{ data: unknown }>>(
    `/v3/booking/flow/${encodeURIComponent(input.sessionId)}/step`,
    { step_name: input.stepName },
  )
}

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
  const data = await v3Post<V3ApiResponse<{ appointment: V3Appointment }>>(
    "/v3/appointments",
    { ...input, platform: "WEB" },
  )
  return data.appointment
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

export async function v3FetchAddresses(): Promise<V3Address[]> {
  const data =
    await v3Get<V3ApiResponse<{ addresses: V3Address[] }>>("/v3/addresses/")
  return data.addresses
}

export async function v3CreateAddress(input: {
  tag?: string | null
  line1: string
  line2?: string | null
  pincode: string
  latitude?: number | null
  longitude?: number | null
  directions?: string | null
}): Promise<V3Address> {
  const data = await v3Post<V3ApiResponse<{ address: V3Address }>>(
    "/v3/addresses/",
    input,
  )
  return data.address
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

export async function v3FetchHomeVisitPrice(opts?: {
  couponCode?: string
}): Promise<{
  priceInRupees: number
  originalPriceInRupees?: number
  discountInRupees?: number
  couponApplied?: string
  couponError?: string
}> {
  const params = opts?.couponCode ? { couponCode: opts.couponCode } : undefined
  const data = await v3Get<
    V3ApiResponse<{
      priceInRupees: number
      originalPriceInRupees?: number
      discountInRupees?: number
      couponApplied?: string
      couponError?: string
    }>
  >("/v3/booking/at-home/price", params)
  return {
    priceInRupees: data.priceInRupees,
    originalPriceInRupees: data.originalPriceInRupees,
    discountInRupees: data.discountInRupees,
    couponApplied: data.couponApplied,
    couponError: data.couponError,
  }
}

export async function v3CheckHomeVisitServiceable(
  pincode: string,
): Promise<{ serviceable: boolean; clinicSlug?: string }> {
  const data = await v3Get<
    V3ApiResponse<{ serviceable: boolean; clinicSlug?: string }>
  >("/v3/booking/at-home/serviceable", { pincode })
  return { serviceable: data.serviceable, clinicSlug: data.clinicSlug }
}

export async function v3FetchHomeVisitSlots(
  addressId: string,
  date: string,
): Promise<{ clinicSlug: string; slots: V3HomeVisitSlot[] }> {
  const data = await v3Get<
    V3ApiResponse<{
      clinicSlug: string
      date: string
      slots: V3HomeVisitSlot[]
    }>
  >("/v3/booking/at-home/slots", { addressId, date })
  return { clinicSlug: data.clinicSlug, slots: data.slots }
}

export async function v3CreateHomeVisitAppointment(input: {
  addressId: string
  petId: string
  date: string
  startTime: string
  isEmergency: boolean
  reasonCode: string
  petParentNotes: string
  bookingFlowSessionId?: string
}): Promise<V3HomeVisitAppointment> {
  const data = await v3Post<
    V3ApiResponse<{ appointment: V3HomeVisitAppointment }>
  >("/v3/booking/at-home/appointments", { ...input, platform: "WEB" })
  return data.appointment
}

export async function v3GetHomeVisitAppointment(
  id: string,
): Promise<V3HomeVisitAppointment> {
  const data = await v3Get<
    V3ApiResponse<{ appointment: V3HomeVisitAppointment }>
  >(`/v3/booking/at-home/appointments/${encodeURIComponent(id)}`)
  return data.appointment
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

export type V3AppointmentListItem =
  | (V3AppointmentCommon & {
      bookingType: "CLINIC_VISIT"
      clinicStatus: string
    })
  | (V3AppointmentCommon & {
      bookingType: "HOME_VISIT"
      visitStatus: string
      address: V3AppointmentListAddress | null
    })

export async function v3FetchAppointments(
  page: number,
  pageSize: number,
): Promise<{ items: V3AppointmentListItem[]; hasNext: boolean }> {
  const data = await v3Get<
    V3ApiResponse<{
      appointments: V3AppointmentListItem[]
      hasNext: boolean
    }>
  >("/v3/appointments", { page: String(page), pageSize: String(pageSize) })
  return { items: data.appointments, hasNext: data.hasNext }
}

export async function v3GetAppointment(
  id: string,
): Promise<V3AppointmentListItem> {
  const data = await v3Get<
    V3ApiResponse<{ appointment: V3AppointmentListItem }>
  >(`/v3/appointments/${encodeURIComponent(id)}`)
  return data.appointment
}

export type V3AppointmentStatus = {
  visitStatus: string
  canModifyOrCancel: boolean
  startOtp: string | null
}

export async function v3GetAppointmentStatus(
  id: string,
): Promise<V3AppointmentStatus> {
  const data = await v3Get<V3ApiResponse<V3AppointmentStatus>>(
    `/v3/appointments/${encodeURIComponent(id)}/status`,
  )
  return data
}

// ─── Documents ────────────────────────────────────────────────────────────────

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
  const query: Record<string, string | undefined> = {}
  if (params.type) query.type = params.type
  if (params.petId) query.petId = params.petId
  if (params.page != null) query.page = String(params.page)
  if (params.pageSize != null) query.pageSize = String(params.pageSize)
  const data = await v3Get<
    V3ApiResponse<{
      counts: V3DocumentCounts
      documents: V3Document[]
      hasNext: boolean
    }>
  >("/v3/documents", query)
  return {
    counts: data.counts,
    documents: data.documents,
    hasNext: data.hasNext,
  }
}

export type V3DocumentDownload = {
  url: string | null
  expiresIn: number
  fileName: string
  isGenerating: boolean
}

export async function v3GetDocumentDownloadUrl(
  downloadId: string,
  type: V3DocumentType,
): Promise<V3DocumentDownload> {
  const data = await v3Get<V3ApiResponse<V3DocumentDownload>>(
    `/v3/documents/${encodeURIComponent(downloadId)}/download`,
    { type },
  )
  return {
    url: data.url,
    expiresIn: data.expiresIn,
    fileName: data.fileName,
    isGenerating: data.isGenerating,
  }
}

// Fetches the document via our server proxy (which strips Content-Disposition:
// attachment and has no CORS constraints against S3). Returns a blob object URL
// suitable for window.open() inline viewing, or null on failure.
export async function v3FetchDocumentView(
  downloadId: string,
  type: V3DocumentType,
): Promise<string | null> {
  const url = new URL(
    `${API_BASE_URL}/v3/documents/${encodeURIComponent(downloadId)}/view`,
  )
  url.searchParams.set("type", type)
  try {
    const res = await fetch(url.toString(), {
      headers: getV3Headers(),
      credentials: "include",
    })
    if (!res.ok) return null
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

// ─── Visit / booking type meta ────────────────────────────────────────────────

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

export async function v3FetchVisitTypes(): Promise<{
  visitTypes: V3VisitType[]
  clinicSubtypes: V3VisitType[]
}> {
  const data = await v3Get<
    V3ApiResponse<{ visitTypes: V3VisitType[]; clinicSubtypes: V3VisitType[] }>
  >("/v3/booking/visit-types")
  return { visitTypes: data.visitTypes, clinicSubtypes: data.clinicSubtypes }
}

export async function v3FetchVetPrice(): Promise<{
  priceInRupees: number
  seniorPriceInRupees: number
}> {
  const data = await v3Get<
    V3ApiResponse<{ priceInRupees: number; seniorPriceInRupees: number }>
  >("/v3/booking/vet/price")
  return {
    priceInRupees: data.priceInRupees,
    seniorPriceInRupees: data.seniorPriceInRupees,
  }
}

export async function v3FetchGroomingServiceTypes(petId?: string): Promise<{
  groomingTypes: V3GroomingServiceType[]
  petGroomingAttributes: V3PetGroomingAttributes | null
}> {
  const data = await v3Get<
    V3ApiResponse<{
      groomingTypes: V3GroomingServiceType[]
      petGroomingAttributes?: V3PetGroomingAttributes
    }>
  >("/v3/booking/grooming/types", petId ? { petId } : undefined)
  return {
    groomingTypes: data.groomingTypes,
    petGroomingAttributes: data.petGroomingAttributes ?? null,
  }
}

export async function v3FetchGroomingDates(
  clinicId: string,
  groomingTypeKey: string,
  petId: string,
  startDate?: string,
  endDate?: string,
): Promise<string[]> {
  const data = await v3Get<V3ApiResponse<{ dates: string[] }>>(
    `/v3/clinics/${encodeURIComponent(clinicId)}/grooming/availability/dates`,
    { groomingTypeKey, petId, startDate, endDate },
  )
  return data.dates
}

export async function v3FetchGroomingSlots(
  clinicId: string,
  date: string,
  groomingTypeKey: string,
  petId: string,
): Promise<{ date: string; slots: V3GroomingSlot[]; groomers: V3Doctor[] }> {
  const data = await v3Get<
    V3ApiResponse<{
      date: string
      slots: V3GroomingSlot[]
      groomers: V3Doctor[]
    }>
  >(
    `/v3/clinics/${encodeURIComponent(clinicId)}/grooming/availability/slots/${encodeURIComponent(date)}`,
    { groomingTypeKey, petId },
  )
  return { date: data.date, slots: data.slots, groomers: data.groomers }
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
  const data = await v3Post<V3ApiResponse<{ appointment: V3Appointment }>>(
    "/v3/appointments/grooming",
    { ...input, platform: "WEB" },
  )
  return data.appointment
}

export async function v3CancelAppointment(id: string): Promise<void> {
  await v3Delete<V3ApiResponse<{}>>(
    `/v3/appointments/${encodeURIComponent(id)}`,
  )
}

export async function v3FetchSpecies(): Promise<V3SpeciesOption[]> {
  const data =
    await v3Get<V3ApiResponse<{ species: V3SpeciesOption[] }>>("/v3/species")
  return data.species
}

export async function v3FetchBreeds(species: string): Promise<V3BreedOption[]> {
  const data = await v3Get<V3ApiResponse<{ breeds: V3BreedOption[] }>>(
    "/v3/breeds",
    {
      species,
    },
  )
  return data.breeds
}

export async function v3GetMe(): Promise<V3Owner> {
  const data = await v3Get<V3ApiResponse<{ owner: V3Owner }>>("/v3/me")
  return data.owner
}

export async function v3UpdateOwner(input: {
  firstName?: string
  lastName?: string
  email?: string | null
}): Promise<V3Owner> {
  const data = await v3Put<V3ApiResponse<{ owner: V3Owner }>>(
    "/v3/owners/me",
    input,
  )
  return data.owner
}

export async function v3UpdatePet(
  id: string,
  input: {
    name?: string
    species?: string
    breed?: string | null
    gender?: string
    dateOfBirth?: string | null
    weight?: string | null
    reproductiveStatus?: string | null
  },
): Promise<V3Pet> {
  const data = await v3Put<V3ApiResponse<{ pet: V3Pet }>>(
    `/v3/pets/${id}`,
    input,
  )
  return data.pet
}

function initRequestContext() {
  const ctx = new RequestContext()
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(V3_AUTH_TOKEN_KEY)
    if (token) ctx.addHeader(V3_AUTH_TOKEN_HEADER, token)
  }
  return ctx
}

const requestContext = initRequestContext()

export function setV3AuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(V3_AUTH_TOKEN_KEY, token)
    requestContext.addHeader(V3_AUTH_TOKEN_HEADER, token)
  }
}

export function clearV3Auth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(V3_AUTH_TOKEN_KEY)
    requestContext.removeHeader(V3_AUTH_TOKEN_HEADER)
  }
}

const ownerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  countryCode: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  postalCode: z.string().nullish(),
})

export type V3Owner = z.infer<typeof ownerSchema>

export default createAPIClient({
  baseUrl: API_BASE_URL,
  baseResponseSchema: z.object({
    status: z.number(),
    message: z.string(),
  }),
  requestContext,
  endpointConfig: {
    loginOTP: {
      method: "POST",
      path: "/v3/login/otp",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({ mobile: z.string() }),
      responseSchema: z.object({}),
      errorResponseSchema: z.object({}),
    },

    loginVerify: {
      method: "POST",
      path: "/v3/login/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        otp: z.string(),
      }),
      responseSchema: z.object({
        token: z.string(),
        owner: ownerSchema,
      }),
      errorResponseSchema: z.object({ errorCode: z.string().optional() }),
    },

    signupVerify: {
      method: "POST",
      path: "/v3/signup/verify",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({
        mobile: z.string(),
        otp: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().nullable().optional(),
      }),
      responseSchema: z.object({
        token: z.string(),
        owner: ownerSchema,
      }),
      errorResponseSchema: z.object({}),
    },

    logout: {
      method: "POST",
      path: "/v3/logout",
      pathParamsSchema: z.object({}),
      requestSchema: z.object({}),
      responseSchema: z.object({}),
      errorResponseSchema: z.object({}),
    },
  },
})
