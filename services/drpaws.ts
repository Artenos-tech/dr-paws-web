/**
 * Thin client for the Dr Paws API (`/drpaws/*`).
 *
 * Auth is a bearer token issued by `/drpaws/auth/*`. The token is kept in
 * localStorage under the same key the app has always used, so existing
 * contexts keep working.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export const AUTH_TOKEN_KEY = "v3AuthToken"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function storeAuthToken(token: string) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch {
    // ignore storage errors
  }
}

export function removeAuthToken() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {
    // ignore storage errors
  }
}

export class DrpawsError extends Error {
  status: number
  errorCode?: string
  body?: unknown
  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
    if (status === 409 && /slot|unavailable|already booked/i.test(message)) {
      this.errorCode = "SLOT_UNAVAILABLE"
    }
  }
}

type Query = Record<string, string | number | boolean | null | undefined>

function messageFromBody(body: unknown, fallback: string): string {
  const detail = (body as { detail?: unknown } | null)?.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string }
    if (first?.msg) return first.msg
  }
  const message = (body as { message?: unknown } | null)?.message
  if (typeof message === "string") return message
  return fallback
}

export async function drpawsFetch<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  opts?: {
    query?: Query
    body?: unknown
    auth?: boolean
    signal?: AbortSignal
  },
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (opts?.query) {
    Object.entries(opts.query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    })
  }
  const headers: Record<string, string> = {}
  if (opts?.body !== undefined) headers["Content-Type"] = "application/json"
  if (opts?.auth !== false) {
    const token = getAuthToken()
    if (token) headers["Authorization"] = `Bearer ${token}`
  }
  const res = await fetch(url.toString(), {
    method,
    headers,
    body: opts?.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts?.signal,
  })
  const text = await res.text()
  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      json = null
    }
  }
  if (!res.ok) {
    throw new DrpawsError(
      messageFromBody(json, `Request failed: ${res.status}`),
      res.status,
      json,
    )
  }
  return json as T
}

// ─── Wire types (subset of the OpenAPI schema we use) ─────────────────────────

export type DpOwner = {
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

export type DpLoginVerify = {
  exists: boolean
  token?: string | null
  owner?: DpOwner | null
}

export type DpPet = {
  id: number
  name: string
  species?: string | null
  type?: string | null
  breed?: string | null
  gender?: string | null
  dob?: string | null
  is_deceased?: boolean
}

export type DpUser = {
  id: number
  first_name: string
  last_name: string
  phone_number: string
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  home_clinic_id?: number | null
  app_clinic_id?: number | null
  pets?: DpPet[]
}

export type DpClinic = {
  id: number
  name: string
  city?: string | null
  phone?: string | null
  latitude?: number | null
  longitude?: number | null
  distanceKm?: number | null
  details?: Record<string, unknown> | null
}

export type DpClinicsByCity = { city: string; clinics: DpClinic[] }

export type DpProvider = {
  id: number
  name: string
  serviceType?: string | null
  practiceType?: string | null
  graduatedIn?: number | null
  profile?: string | null
  details?: Record<string, unknown> | null
  consultDurationMinutes?: number
  totalAppointmentsLabel?: string
  nextAvailableAt?: string | null
  consultationPriceInRupees?: number | null
  clientProviderRelationship?: { appointmentCount: number } | null
}

export type DpSlot = {
  date: string
  startTime: string
  endTime?: string | null
  groomers?: { id: number; name: string }[] | null
}

export type DpGroomingItem = {
  id: number
  name: string
  priceInRupees?: number | null
  details?: Record<string, unknown> | null
  appointmentTypeId?: string | null
}

export type DpAppointment = {
  id: number
  petId?: number | null
  petName?: string | null
  doctorId?: number | null
  clinicId: number
  status?: string | null
  date: string
  startTime?: string | null
  endTime?: string | null
  reasonForVisit?: string | null
  priceInRupees?: number | null
  groomingCatalogId?: number | null
}

export type DpRecords = {
  appointmentId: number
  petId?: number | null
  clinicalRecord?: {
    clinicalNotes?: string | null
    assessment?: unknown
    loopStatus?: string | null
  } | null
  prescriptions?: {
    documentId: number
    referenceId?: string | null
    notes?: string | null
    prescribedByDoctorName?: string | null
  }[]
  invoices?: {
    documentId: number
    invoiceNumber?: string | null
    invoiceType?: string | null
    amount?: number | null
  }[]
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** The API wants "<2-digit country code><10-digit number>"; the UI collects 10 digits. */
export function withCountryCode(mobile: string, countryCode = "91"): string {
  const digits = mobile.replace(/\D/g, "")
  return digits.length === 10 ? `${countryCode}${digits}` : digits
}

export const dp = {
  requestOtp: (mobile: string) =>
    drpawsFetch<{ message: string }>("POST", "/drpaws/auth/login/otp", {
      body: { mobile: withCountryCode(mobile) },
      auth: false,
    }),
  loginVerify: (mobile: string, otp: string) =>
    drpawsFetch<DpLoginVerify>("POST", "/drpaws/auth/login/verify", {
      body: { mobile: withCountryCode(mobile), otp },
      auth: false,
    }),
  signupVerify: (input: {
    mobile: string
    otp: string
    firstName: string
    lastName: string
  }) =>
    drpawsFetch<DpLoginVerify>("POST", "/drpaws/auth/signup/verify", {
      body: { ...input, mobile: withCountryCode(input.mobile) },
      auth: false,
    }),
  logout: () =>
    drpawsFetch<{ message: string }>("POST", "/drpaws/auth/logout", {
      body: {},
    }),
  me: () =>
    drpawsFetch<{ user: DpUser; pets: DpPet[] }>("GET", "/drpaws/auth/user"),
  updateProfile: (input: {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
  }) => drpawsFetch<DpUser>("PATCH", "/drpaws/auth/profile", { body: input }),
  addPet: (input: {
    name: string
    clinic_id: number
    species?: string | null
    breed?: string | null
    gender?: string | null
    date_of_birth?: string | null
  }) => drpawsFetch<DpPet>("POST", "/drpaws/auth/pet", { body: input }),
  clinics: () =>
    drpawsFetch<DpClinicsByCity[]>("GET", "/drpaws/clinics", { auth: false }),
  breeds: (species: string) =>
    drpawsFetch<unknown[]>("GET", "/drpaws/pets/breeds", {
      query: { species },
      auth: false,
    }),
  providers: (clinicId: number, petId?: number) =>
    drpawsFetch<DpProvider[]>("GET", "/drpaws/booking/providers", {
      query: { clinicId, petId },
      auth: false,
    }),
  vetDates: (q: {
    clinicId: number
    providerId: number
    startDate: string
    endDate: string
  }) =>
    drpawsFetch<string[]>("GET", "/drpaws/booking/slots/veterinary/dates", {
      query: q,
    }),
  vetSlots: (q: { clinicId: number; providerId: number; date: string }) =>
    drpawsFetch<DpSlot[]>("GET", "/drpaws/booking/slots/veterinary", {
      query: q,
    }),
  groomingItems: (clinicId: number, petId?: number) =>
    drpawsFetch<DpGroomingItem[]>(
      "GET",
      "/drpaws/booking/catalog/grooming-items",
      { query: { clinicId, petId }, auth: false },
    ),
  groomingDates: (q: {
    clinicId: number
    petId: number
    appointmentTypeId: string
    startDate: string
    endDate: string
  }) =>
    drpawsFetch<string[]>("GET", "/drpaws/booking/slots/grooming/dates", {
      query: q,
    }),
  groomingSlots: (q: {
    clinicId: number
    petId: number
    appointmentTypeId: string
    date: string
  }) =>
    drpawsFetch<DpSlot[]>("GET", "/drpaws/booking/slots/grooming", {
      query: q,
    }),
  bookVet: (input: {
    clinicId: number
    providerId: number
    petId: number
    date: string
    startTime: string
    reasonForVisit?: string | null
    couponCode?: string | null
  }) =>
    drpawsFetch<DpAppointment>("POST", "/drpaws/booking/appointments/vet", {
      body: input,
    }),
  bookGrooming: (input: {
    clinicId: number
    providerId: number
    petId: number
    groomingCatalogId: number
    date: string
    startTime: string
    couponCode?: string | null
  }) =>
    drpawsFetch<DpAppointment>(
      "POST",
      "/drpaws/booking/appointments/grooming",
      { body: input },
    ),
  appointments: (page: number, size: number) =>
    drpawsFetch<DpAppointment[]>("GET", "/drpaws/booking/appointments", {
      query: { page, size },
    }),
  appointment: (id: number) =>
    drpawsFetch<DpAppointment>("GET", `/drpaws/booking/appointments/${id}`),
  cancelAppointment: (id: number) =>
    drpawsFetch<unknown>("DELETE", `/drpaws/booking/appointments/${id}`),
  records: (appointmentId: number) =>
    drpawsFetch<DpRecords>("GET", `/drpaws/medical-records/${appointmentId}`),
  applyCoupon: (sessionId: string, code: string) =>
    drpawsFetch<{
      percentOff: string
      priceInRupees?: number | null
      seniorPriceInRupees?: number | null
    }>("POST", "/drpaws/coupon/apply", {
      body: { session_id: sessionId, code },
      auth: false,
    }),
}

// ─── Small helpers shared by the adapters ─────────────────────────────────────

const CLINIC_TIME_ZONE = "Asia/Kolkata"

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: CLINIC_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

/**
 * "12:30" | "12:30:00" → "12:30" (already clinic-local).
 * "2026-10-15T07:00:00+00:00" → "12:30" (timestamps with an offset are real
 * instants, so convert to clinic time).
 */
export function toHHMM(value: string | null | undefined): string {
  if (!value) return ""
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5)
  if (/(Z|[+-]\d{2}:?\d{2})$/.test(value)) {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return clockFormat.format(d)
  }
  const m = value.match(/T(\d{2}):(\d{2})/)
  return m ? `${m[1]}:${m[2]}` : value
}

/** Date part of an ISO string. */
export function toYMD(value: string | null | undefined): string {
  if (!value) return ""
  return value.slice(0, 10)
}

export function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 0
  return eh * 60 + em - (sh * 60 + sm)
}

export function isAtHomeClinic(clinic: Pick<DpClinic, "name">): boolean {
  return /at[-\s]?home/i.test(clinic.name)
}

export function flattenClinics(groups: DpClinicsByCity[]): DpClinic[] {
  return groups.flatMap((g) => g.clinics)
}
