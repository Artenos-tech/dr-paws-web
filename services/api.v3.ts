import { createAPIClient, RequestContext, z } from "../lib/apiclient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

export const V3_AUTH_TOKEN_HEADER = "X-Auth-Token"
export const V3_AUTH_TOKEN_KEY = "v3AuthToken"
export const V3_OWNER_KEY = "v3Owner"

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
  timezone: string
  email?: string | null
  phone?: string | null
  city?: string | null
  vetBookingEnabled: boolean
  groomingBookingEnabled: boolean
}

export type V3Doctor = {
  id: string
  name: string
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
    throw new Error(json?.message ?? `Request failed: ${res.status}`)
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

export async function v3CreateAppointment(input: {
  clinicId: string
  petId: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  reasonForVisit?: string
}): Promise<V3Appointment> {
  const data = await v3Post<V3ApiResponse<{ appointment: V3Appointment }>>(
    "/v3/appointments",
    input,
  )
  return data.appointment
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
    localStorage.removeItem(V3_OWNER_KEY)
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
