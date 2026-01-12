import exp from "constants"
import { StaticImageData } from "next/image"

export interface Service {
  name: string
}

export interface ClinicBase {
  id: string
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
  gallery: Array<string>
  reviews: Array<{
    id: string
    author: string
    review_text: string
    review_created_at: string
    rating: number
    profile_image: string | null
  }>
}

export type Gender = "Male" | "Female" | ""

export interface DoctorBase {
  id: string
  displayName: string
  imageUrl: {
    type: "url" | "ref"
    value: string
  }
  position: string
  experience: string
  availableToDisplayAt: {
    id: string
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

export type AppointmentCategory =
  | "UPCOMING"
  | "ACTIVE"
  | "COMPLETED"
  | "REQUESTED"
  | "CANCELLED"

export type AppointmentTypeEnum =
  | "VET_CONSULTATION"
  | "GROOMING"
  | "HOME_VISIT"
export type AppointmentPaymentStatus =
  | "PAID"
  | "UNPAID"
  | "NO_BILL"
  | "PARTIALLY_PAID"
  | "OVERPAID"

export type PetType = "DOG" | "CAT" | "OTHER"

export interface AppointmentType {
  id: string
  sub_booking_id: string
  clinic_id: string
  pet_id: string

  pet_name: string
  pet_type: PetType | null
  pet_profile_image: string | null

  booking_date: string
  appt_start: string
  appt_end: string
  appt_type_id: string

  appt_type_title: "Vet Consultation" | "Grooming" | "Home Visit"
  appt_type: AppointmentTypeEnum

  category: AppointmentCategory

  clinic_name?: string
  clinic_location?: string
  clinic_contact: string

  coupon_code?: string | null

  vet_id?: string | null
  vet_name?: string | null
  vet_image?: string | null
  vet_contact?: string | null

  address?: Address

  visit_status?:
    | "UNCONFIRMED"
    | "CONFIRMED"
    | "DELAYED"
    | "REACHED"
    | "CANCELLED"
    | "VISIT_STARTED"
    | "VISIT_FINISHED"

  helpline_no?: string
  start_otp?: string | null
  invoice_id: string
  payment_status: AppointmentPaymentStatus
  total_tax_amount: number
  total_billing_amount: number
  sos_status?: "ACTIVE" | "INACTIVE"
}

export interface AppointmentApiDetails {
  id: string
  sub_booking_id: string
  clinic_id: string
  clinic_location?: string

  pet_id: string
  appt_type_id?: string

  pet_name: string
  pet_type: "DOG" | "CAT" | "OTHER" | null
  pet_profile_image: string | null

  booking_date: string
  appt_start: string
  appt_end: string

  appt_type_title: "Vet Consultation" | "Grooming" | "Home Visit"
  appt_type: "VET_CONSULTATION" | "GROOMING" | "HOME_VISIT"

  category: "UPCOMING" | "ACTIVE" | "COMPLETED" | "REQUESTED" | "CANCELLED"

  invoice_id: string | null

  total_tax_amount: number
  total_billing_amount: number
  payment_status: "PAID" | "UNPAID" | "NO_BILL" | "PARTIALLY_PAID" | "OVERPAID"

  vet_id?: string | null
  vet_name?: string | null
  vet_image?: string | null
  vet_contact?: string | null

  address?: Address

  visit_status?:
    | "UNCONFIRMED"
    | "CONFIRMED"
    | "DELAYED"
    | "REACHED"
    | "CANCELLED"
    | "VISIT_STARTED"
    | "VISIT_FINISHED"

  helpline_no?: string
  start_otp?: string | null

  refund_status?: RefundStatus
  coupon_code?: string

  sos_status?: "ACTIVE" | "INACTIVE"
}

export type RefundStatus =
  | "NOT_APPLICABLE"
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSED"
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "ONHOLD"
  | "CANCELLED"

// export interface AppointmentType {
//   id: string
//   sub_booking_id: string
//   pet_id: string
//   pet_name: string
//   pet_type?: "DOG" | "CAT" | "OTHER" | null
//   pet_profile_image: string | null
//   vet_id: string
//   vet_name: string
//   vet_image: string | null
//   clinic_id: string
//   clinic_name: string
//   clinic_location: string
//   clinic_contact: string
//   appt_start: string
//   booking_date: string
//   appt_end: string
//   appt_status: string | null
//   // appt_reason: string | null
//   appt_type: string | null
//   appt_type_id: string
//   category: "UPCOMING" | "COMPLETED" | "REQUESTED" | "CANCELLED"
//   coupon_code?: string | null
//   invoice_id: string
//   total_tax_amount: number
//   total_billing_amount: number
//   payment_status: "PAID" | "UNPAID" | "NO_BILL" | "PARTIALLY_PAID" | "OVERPAID"
// }
export type Address = {
  id: string
  tag: string
  location: { lat: number; long: number }
  address_line1: string
  address_line2: string
  directions?: string
  pincode?: number
}

export type AddressFormValues = Omit<Address, "id" | "location" | "pincode">

export type BookingPet = {
  id: string
  name: string
  profile_image: string | null
  type: "DOG" | "CAT" | "OTHER"
  serviceable: boolean
}
