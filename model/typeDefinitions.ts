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
  user_vetport_id: number;
  vet_vetport_id: number;
  vet_name: string;
  clinic_id: number;
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
    | "Confirmed"
    | "Check-in"
    | "Check-out"
    ;
  appt_reason: string | null;
}
