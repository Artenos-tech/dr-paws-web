import { StaticImageData } from "next/image";

export interface Service {
  name: string;
}

export interface ClinicBase {
  id: number;
  name: string;
  image: {
    type: "url" | "ref";
    value: StaticImageData | string
  };
  services: string;
}
export interface Clinic extends ClinicBase{
  contact: string;
  gmapsUrl: string;
  address: string;
  city: string;
  parkingInfo: string;
  timings: { 
    dayOfWeek: string | null;
    openTime: string | null;
    closeTime: string  | null;
    is24Hours: boolean | null;
  }[];
}

export type Gender = "Male" | "Female" | "";

export interface DoctorBase {
  id: number;
  displayName: string;
  imageUrl: {
    type: "url" | "ref";
    value: string | StaticImageData;
  };
  position: string;
  experience: string;
  availableToDisplayAt: {
    id: number;
    name: string
  }[];
}

export interface Doctor extends DoctorBase {
  specialization: string;
  qualification: string;
  about: string;
  passionateAbout: string;
  spiritAnimal: string;
  favPetName: string;
}

export interface Review {
  clinicId: string;
  image: StaticImageData;
  name: string;
  review: string;
}

export interface BookingCategory {
  id: string;
  title: string;
  description: string;
}

export enum AppointmentStatus {
  Upcoming = "Upcoming",
  Past = "Past",
  Cancelled = "Cancelled",
}
export interface AppointmentType {
  id: string;
  pet_vetport_id: number;
  pet_name: string;
  pet_type?: string;
  pet_profile_image: string | null;
  user_vetport_id: number;
  vet_vetport_id: number;
  vet_name: string;
  vet_image: {
    type: "url" | "ref";
    value: string;
  };
  clinic_id: number;
  clinic_name: string;
  clinic_location: string;
  clinic_contact: string;
  appt_start: string;
  appt_end: string;
  appt_status:
  | null
  | "Check In"
  | "Complete"
  | "Scheduled"
  | "Check out"
  | "Attending"
  | "Confirm"
  | "Cancel"
  | "Active"
  | "Waiting"
  | "Testing"
  | "Check-out"
  | "Check-in"
  | "Confirmed"
  appt_reason: string | null;
  appt_type: string;
  appt_type_id: number;
  category: "UPCOMING" | "PAST" | "CANCELLED";
}
