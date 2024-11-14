// typeDefinitions.ts

import { StaticImageData } from "next/image";

export type ServiceCategory =
  | "Planned Check-Ups"
  | "Sickness & Emergency"
  | "Diagnostics"
  | "Planned Surgeries"
  | "Dental"
  | "Grooming"
  | "Pet Services";

export interface Service {
  name: string;
}

export interface Clinic {
  id: string;
  clinicName: string;
  image: StaticImageData;
  services: string
  contact: string
}
export interface Pet {
  petId: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: string;
  birthday: string;
  weight: string;
  petImage: StaticImageData | string
}

export interface Doctor {
  name: string;
  description: string;
  experience: string;
  location: string;
  image: StaticImageData;
  specialization: string;
  aboutVet: string;
  tag: string;
}
