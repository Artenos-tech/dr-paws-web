
// typeDefinitions.ts

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
