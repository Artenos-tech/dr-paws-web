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
  parkingInformation: string
}

export type Gender = "Male" | "Female" | "";
export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
  weight: number | null;
  gender: Gender;
  dob: string | null;
  age: {
    years: number | null;
    months: number | null;
  };
  profileImage: string | StaticImageData | null;
  birthday?: string;
}

export interface Doctor {
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
