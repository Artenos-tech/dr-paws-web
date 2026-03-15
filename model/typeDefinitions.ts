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
  | "CANCELLED"

export type AppointmentTypeEnum = "VET_CONSULTATION" | "GROOMING" | "HOME_VISIT"
export type AppointmentPaymentStatus =
  | "PAID"
  | "UNPAID"
  | "NO_BILL"
  | "PARTIALLY_PAID"
  | "OVERPAID"

export type PetType = "DOG" | "CAT" | "OTHER"

export type VisitStatus =
  | "UNCONFIRMED"
  | "VET_CONFIRMED"
  | "VET_DELAYED"
  | "VET_REACHED"
  | "CANCELLED"
  | "VISIT_STARTED"
  | "VISIT_FINISHED"

export interface AppointmentListItem {
  id: string
  sub_booking_id: string
  clinic_id: string

  pet_name: string
  pet_type: PetType | null
  pet_profile_image: string | null

  booking_type: "HOME_VISIT" | "CLINIC_VISIT"
  booking_date: string
  appt_start: string
  appt_end: string

  appt_type_title: "Vet Consultation" | "Grooming" | "Home Visit"
  appt_type: AppointmentTypeEnum

  category: AppointmentCategory

  clinic_name?: string
  clinic_location?: string
  clinic_contact: string

  coupon_code?: string | null

  // vet_id?: string | null
  vet_name?: string | null
  vet_image?: string | null
  vet_contact?: string | null

  address?: AddressWithPincode

  visit_status?: VisitStatus

  helpline_no?: string
  start_otp?: string | null
  sos_status?: "ACTIVE" | "INACTIVE"
}

export interface AppointmentDetails extends AppointmentListItem {
  pet_id: string
  clinic_contact: string
  invoice_id: string | null
  total_tax_amount: number
  total_billing_amount: number
  payment_status: "PAID" | "UNPAID" | "NO_BILL" | "PARTIALLY_PAID" | "OVERPAID"
  vet_id?: string | null
  refund?: {
    id: string | null
    status: RefundStatus
    amount: number
  }
  reason_for_visit?: ReasonForVisitEnum
  notes?: string
}
export type ReasonForVisitEnum =
  | "VACCINATION"
  | "CHECK_UP"
  | "SICK"
  | "DIAGNOSTICS"
  | "FOLLOW_UP"
  | "OTHER"

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

export type Address = {
  id: string
  tag: string
  location: { lat: number; long: number }
  address_line1: string
  address_line2: string
  directions?: string
}

export type AddressWithPincode = Address & {
  pincode: string
}

export type AddressFormValues = Omit<Address, "id" | "location" | "pincode">

export type BookingPet = {
  id: string
  name: string
  profile_image: string | null
  type: "DOG" | "CAT" | "OTHER"
  serviceable: boolean
}
