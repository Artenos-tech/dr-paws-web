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
  branch: string;
  description: string;
}
