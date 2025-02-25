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

export type DoctorBase = {
  id: number;
  displayName: string;
  imageUrl: {
    type: "url" | "ref";
    value: string;
  };
  position: string;
  experience: string;
  availableToDisplayAt: {
    id: number;
    name: string
  }[];
}

export type Doctor = DoctorBase & {
  specialization: string;
  qualification: string;
  about: string;
  passionateAbout: string;
  spiritAnimal: string;
  favPetName: string;
  // clinicIds: string[];
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
