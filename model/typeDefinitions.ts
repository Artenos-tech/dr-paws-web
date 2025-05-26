import { StaticImageData } from "next/image"

export interface Service {
  name: string
}

export interface ClinicBase {
  id: number
  name: string
  image: {
    type: "url" | "ref"
    value: StaticImageData | string
  }
  services: string
}
export interface Clinic extends ClinicBase {
  contact: string
  bookable?: boolean
  gmapsUrl: string
  address: string
  city: string

  parkingInfo: string
  timings: {
    dayOfWeek: string | null
    openTime: string | null
    closeTime: string | null
    is24Hours: boolean | null
  }[]
  gallery?: {
    [imageId: string]: {
      imageUrl: string
      imageOrder: number
    }
  }
  reviews?: {
    id: string
    author: string
    review_text: string
    review_created_at: string
    rating: number
    profile_image: string | null
  }[]
}

export type Gender = "Male" | "Female" | ""

export interface DoctorBase {
  id: number
  displayName: string
  imageUrl: {
    type: "url" | "ref"
    value: string | StaticImageData
  }
  position: string
  experience: string
  availableToDisplayAt: {
    id: number
    name: string
  }[]
}

export interface Doctor extends DoctorBase {
  specialization: string
  qualification: string
  about: string
  passionateAbout: string
  spiritAnimal: string
  favPetName: string
}

export interface Review {
  clinicId: string
  image: StaticImageData
  name: string
  review: string
}

export interface BookingCategory {
  id: string
  title: string
  description: string
}

export enum AppointmentStatus {
  Upcoming = "Upcoming",
  Past = "Past",
  Cancelled = "Cancelled",
}
export interface AppointmentType {
  id: string
  pet_id: string
  pet_name: string
  pet_type?: string
  pet_profile_image: string | null
  // user_vetport_id: number
  vet_id: string
  vet_name: string
  vet_image: string | null
  // vet_image: {
  //   type: "url" | "ref"
  //   value: string
  // }
  clinic_id: string
  clinic_name: string
  clinic_location: string
  clinic_contact: string
  appt_start: string
  booking_date: string
  appt_end: string
  appt_status: string | null
  // appt_reason: string | null
  appt_type: string | null
  appt_type_id: string
  category: "UPCOMING" | "COMPLETED" | "REQUESTED"
}
