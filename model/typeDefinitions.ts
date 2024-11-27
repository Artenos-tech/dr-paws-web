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
}

export interface Pet {
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
  petImage: string;
}

export interface Doctor {
  name: string;
  description?: string;
  experience?: string;
  location: string;
  image: StaticImageData;
  specialization?: string;
  aboutVet?: string;
  tag?: string;
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