import { StaticImageData } from "next/image";

export interface Service {
  name: string;
}

export interface Clinic {
  id: string;
  clinicName: string;
  image: StaticImageData;
  services: string;
  contact: string;
  location: string;
  parkingInformation: string;
  timings: { [key: string]: string };
}

export type Gender = "Male" | "Female" | "";


export interface Doctor {
  id: string;
  name: string;
  position?: string;
  experience?: string;
  location: string;
  image: StaticImageData;
  specialization?: string;
  qualification?: string;
  aboutMe?: string;
  vetPassionInfo?: string;
  spiritAnimalInfo?: string;
  favouritePet?: string;
  clinicIds: string[];
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
  vet_image: string;
  clinic_id: number;
  clinic_name: string;
  clinic_location: string;
  clinic_contact: string;
  appt_start: string;
  appt_end: string;
  appt_status:
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
  appt_type: string | null;
  appt_type_id: number
  category: "UPCOMING" | "PAST" | "CANCELLED";
}
