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
export interface PetInfo {
  petId: string;
  name: string;
  type: string;
  breed: string;
  gender: string;
  age: {
    years: number;
    months: number;
  };
  birthday: string;
  weight: string;
  petImage: StaticImageData | string;
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
