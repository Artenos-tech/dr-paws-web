/**
 * Read-only data for the public marketing pages (clinics, team, services),
 * built from the Dr Paws API (`/drpaws/*`).
 *
 * Every method mirrors the `{ ok, value: { status, body } }` result shape the
 * pages already consume via `useAPICall`.
 */
import { ErrorResponseAPIError, FetchAPIError } from "../lib/apiclient"
import { ok, err, type Result } from "../lib/result"
import {
  DrpawsError,
  drpawsFetch,
  dp,
  flattenClinics,
  mapLimit,
  isAtHomeClinic,
  type DpClinic,
  type DpProvider,
} from "./drpaws"

type DisplayError = ErrorResponseAPIError<{ message?: string }> | FetchAPIError

type DisplayResult<T> = Result<{ status: number; body: T }, DisplayError>

async function wrap<T>(fn: () => Promise<T>): Promise<DisplayResult<T>> {
  try {
    return ok({ status: 200, body: await fn() })
  } catch (e) {
    if (e instanceof DrpawsError) {
      return err(
        new ErrorResponseAPIError(e.message, e.status, { message: e.message }),
      )
    }
    return err(new FetchAPIError((e as Error).message, e as Error))
  }
}

// ─── Shapes the pages expect ──────────────────────────────────────────────────

type ImageRef = { type: "url" | "ref"; value: string }

export type ClinicForDisplay = {
  id: string
  name: string
  services: string
  image: ImageRef
  bookable: boolean
  contact: string
  comingSoon: boolean
}

export type DoctorForDisplay = {
  id: string
  displayName: string
  position: string
  experience: string
  availableToDisplayAt: { id: string; name: string }[]
  imageUrl: ImageRef
}

const FALLBACK_CLINIC_IMAGE = "/assets/images/clinic/ClinicImage.png"
const FALLBACK_DOCTOR_IMAGE = "/custom-logo.png"
const SERVICE_ICON = "/assets/images/services/UpSyringe.svg"

// ─── Clinics ──────────────────────────────────────────────────────────────────

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined

function toClinicForDisplay(c: DpClinic): ClinicForDisplay {
  const d = (c.details ?? {}) as Record<string, unknown>
  return {
    id: String(c.id),
    name: c.name,
    services: str(d.services) ?? "Veterinary care & grooming",
    image: {
      type: "url",
      value: str(d.imageUrl) ?? str(d.image) ?? FALLBACK_CLINIC_IMAGE,
    },
    bookable: d.comingSoon !== true,
    contact: c.phone ? `+${c.phone.replace(/^\+/, "")}` : "",
    comingSoon: d.comingSoon === true,
  }
}

async function loadClinics(): Promise<DpClinic[]> {
  return flattenClinics(await dp.clinics()).filter((c) => !isAtHomeClinic(c))
}

function mapsUrl(c: DpClinic): string {
  if (c.latitude != null && c.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name)}`
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

function experienceLabel(p: DpProvider): string {
  if (p.graduatedIn) {
    const years = new Date().getFullYear() - p.graduatedIn
    if (years > 0) return `${years}+ years`
  }
  return p.totalAppointmentsLabel ? `${p.totalAppointmentsLabel} consults` : ""
}

function providerDetails(p: DpProvider) {
  const d = (p.details ?? {}) as Record<string, unknown>
  const photo = (d.profilePhoto ?? {}) as { url?: string }
  const list = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []
  return {
    photo: str(photo.url) ?? FALLBACK_DOCTOR_IMAGE,
    specialities: list(d.specialities),
    qualifications: list(d.qualifications),
    about: str(d.about) ?? str(p.profile) ?? "",
  }
}

type ClinicDoctors = { clinic: DpClinic; vets: DpProvider[] }

async function loadClinicDoctors(): Promise<ClinicDoctors[]> {
  const clinics = await loadClinics()
  return mapLimit(clinics, 3, async (clinic) => {
    const providers = await dp
      .providers(clinic.id)
      .catch(() => [] as DpProvider[])
    return {
      clinic,
      vets: providers.filter((p) => !/groom/i.test(p.serviceType ?? "")),
    }
  })
}

type AggregatedDoctor = {
  provider: DpProvider
  clinics: { id: string; name: string }[]
}

async function loadAllDoctors(): Promise<AggregatedDoctor[]> {
  const byId = new Map<number, AggregatedDoctor>()
  for (const { clinic, vets } of await loadClinicDoctors()) {
    for (const vet of vets) {
      const entry = byId.get(vet.id) ?? { provider: vet, clinics: [] }
      entry.clinics.push({ id: String(clinic.id), name: clinic.name })
      byId.set(vet.id, entry)
    }
  }
  return Array.from(byId.values())
}

function toDoctorForDisplay(a: AggregatedDoctor): DoctorForDisplay {
  const d = providerDetails(a.provider)
  return {
    id: String(a.provider.id),
    displayName: a.provider.name,
    position: d.specialities[0] ?? "Veterinarian",
    experience: experienceLabel(a.provider),
    availableToDisplayAt: a.clinics,
    imageUrl: { type: "url", value: d.photo },
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────

type ServiceGroup = {
  id: string
  title: string
  description: string
  items: string[]
}

async function loadServiceGroups(): Promise<ServiceGroup[]> {
  const clinics = await loadClinics()
  const groups: ServiceGroup[] = []

  groups.push({
    id: "veterinary",
    title: "Veterinary Care",
    description:
      "Consult an experienced vet at any of our clinics for your pet's health and wellbeing.",
    items: [
      "General consultation",
      "Vaccination & preventive care",
      "Health check-ups",
      "Dermatology",
      "Surgery & orthopaedics",
      "Emergency & critical care",
    ],
  })

  const grooming = (
    await mapLimit(clinics, 3, (c) => dp.groomingItems(c.id).catch(() => []))
  ).flat()
  const groomingNames = Array.from(new Set(grooming.map((g) => g.name)))
  if (groomingNames.length > 0) {
    groups.push({
      id: "grooming",
      title: "Grooming",
      description: "Keep your pet clean, comfortable and looking their best.",
      items: groomingNames,
    })
  }

  const first = clinics[0]
  if (first) {
    const categories = await drpawsFetch<
      { name: string; subcategories?: { name: string | null }[] }[]
    >("GET", "/drpaws/catalog/categories", {
      query: { clinicId: first.id },
      auth: false,
    }).catch(() => [])
    const names = categories.flatMap((c) => [
      c.name,
      ...(c.subcategories ?? [])
        .map((s) => s.name)
        .filter((n): n is string => !!n),
    ])
    if (names.length > 0) {
      groups.push({
        id: "pharmacy",
        title: "Pharmacy & Supplies",
        description:
          "Food, treats, supplements and essentials available at our clinics.",
        items: names,
      })
    }
  }
  return groups
}

// ─── Public API ───────────────────────────────────────────────────────────────

const api = {
  getClinicsForDisplay: (_params: object) =>
    wrap(async () => ({
      clinics: (await loadClinics()).map(toClinicForDisplay),
    })),

  getClinicForDisplay: (params: { clinicid: string }) =>
    wrap(async () => {
      const clinic = (await loadClinics()).find(
        (c) => String(c.id) === params.clinicid,
      )
      if (!clinic) throw new DrpawsError("Clinic not found", 404)
      const d = (clinic.details ?? {}) as Record<string, unknown>
      return {
        clinic: {
          ...toClinicForDisplay(clinic),
          gmapsUrl: str(d.gmapsUrl) ?? mapsUrl(clinic),
          address: str(d.address) ?? clinic.city ?? "",
          city: clinic.city ?? "",
          parkingInfo: str(d.parkingInfo) ?? "",
          timings: [] as {
            dayOfWeek: string | null
            openTime: string | null
            closeTime: string | null
            is24Hours: boolean
          }[],
          gallery: [] as string[],
          reviews: [] as {
            id: string
            author: string
            rating: number
            review_text: string
            review_created_at: string
            profile_image: string | null
          }[],
        },
      }
    }),

  getDoctorsForDisplay: (_params: object) =>
    wrap(async () => {
      const all = await loadAllDoctors()
      // Only vets with a published profile (photo/specialities) are shown.
      const featured = all.filter((a) => {
        const d = providerDetails(a.provider)
        return d.photo !== FALLBACK_DOCTOR_IMAGE || d.specialities.length > 0
      })
      return {
        doctors: (featured.length > 0 ? featured : all).map(toDoctorForDisplay),
      }
    }),

  getDoctorsForClinicForDisplay: (params: { clinicid: string }) =>
    wrap(async () => {
      const all = await loadAllDoctors()
      return {
        doctors: all
          .filter((a) => a.clinics.some((c) => c.id === params.clinicid))
          .map(toDoctorForDisplay),
      }
    }),

  getDoctorForDisplay: (params: { doctorid: string }) =>
    wrap(async () => {
      const found = (await loadAllDoctors()).find(
        (a) => String(a.provider.id) === params.doctorid,
      )
      if (!found) return { doctor: null }
      const d = providerDetails(found.provider)
      return {
        doctor: {
          ...toDoctorForDisplay(found),
          qualification: d.qualifications.join(", "),
          specialization: d.specialities.join(", "),
          about: d.about,
          passionateAbout: "",
          favPetName: "",
          spiritAnimal: "",
        },
      }
    }),

  getServiceCategoriesOffered: (_params: object) =>
    wrap(async () => ({
      serviceCategories: (await loadServiceGroups()).map((g) => g.title),
    })),

  getServicesOverview: (_params: object) =>
    wrap(async () => ({
      servicesOverview: Object.fromEntries(
        (await loadServiceGroups()).map((g) => [
          g.title,
          g.items.map((name) => ({ name })),
        ]),
      ) as Record<string, { name: string }[]>,
    })),

  getServicesDetails: (_params: object) =>
    wrap(async () => ({
      servicesDetails: (await loadServiceGroups()).map((g) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        services: g.items.map((title) => ({ img: SERVICE_ICON, title })),
      })),
    })),
}

export default api
