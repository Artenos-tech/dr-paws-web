import circleImg1 from "@/public/assets/images/circleImg1.jpg";
import circleImg2 from "@/public/assets/images/circleImg2.png";
import circleImg3 from "@/public/assets/images/circleImg3.png";
import membershipImg1 from "@/public/assets/images/membershipImg1.png";
import planLogo1 from "@/public/assets/images/planLogo1.png";
import clinic1 from "../public/assets/images/clinic-1.png";
import description1 from "../public/assets/images/description1.png";
import description2 from "../public/assets/images/description2.png";
import description3 from "../public/assets/images/description3.png";
import description4 from "../public/assets/images/description4.png";
import description5 from "../public/assets/images/description5.png";
import description6 from "../public/assets/images/description6.png";
import dogImg from "../public/assets/images/dogimg.png";
import catImg from "../public/assets/images/catimg.png";
import birdImg from "../public/assets/images/birdimg.png";
import doctorImage from "../public/assets/images/clinic/doctor.png";
import ClinicDog from "../public/assets/images/clinic/maggidog.png";
import { ServiceCategory, Service } from "@/model/typeDefinitions";
import Vaccination from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Vaccinations.png";
import Deworming from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Deworming.png";
import GeneralCheckUp from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/General check up.png";
import BehaviorlCounceling from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Behavioral Counseling.png";
import NutritionalCounceling from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/NutritionalCounceling.png";
import DigestiveProblems from "@/public/assets/images/ServicesPage/Sickness and Emergency/Digestive Problems.png";
import AllergiesAndRashes from "@/public/assets/images/ServicesPage/Sickness and Emergency/Allergies and rashes.png";
import EarInfections from "@/public/assets/images/ServicesPage/Sickness and Emergency/EarInfections.png";
import Lethargy from "@/public/assets/images/ServicesPage/Sickness and Emergency/Lethargy.png";
import Limping from "@/public/assets/images/ServicesPage/Sickness and Emergency/Limping.png";
import AnimalBites from "@/public/assets/images/ServicesPage/Sickness and Emergency/Animal Bites.png";
import EyeIssues from "@/public/assets/images/ServicesPage/Sickness and Emergency/EyeIssues.png";
import Accident from "@/public/assets/images/ServicesPage/Sickness and Emergency/Accident and trauma.png";
import Ultrasound from "@/public/assets/images/ServicesPage/Dignostics/Ultrsound.png";
import Microscopy from "@/public/assets/images/ServicesPage/Dignostics/Microscopy.png";
import Parasite from "@/public/assets/images/ServicesPage/Dignostics/Parasite.png";
import Blood from "@/public/assets/images/ServicesPage/Dignostics/Blood.png";
import Xray from "@/public/assets/images/ServicesPage/Dignostics/XRay.png";
import Sprays from "@/public/assets/images/ServicesPage/Planned Surgeries/Sprays.png";
import Tumors from "@/public/assets/images/ServicesPage/Planned Surgeries/Tumor.png";
import Blader from "@/public/assets/images/ServicesPage/Planned Surgeries/Blader.png";
import Foreign from "@/public/assets/images/ServicesPage/Planned Surgeries/Foreign.png";
import Ortho from "@/public/assets/images/ServicesPage/Planned Surgeries/Orthopedic.png";
import ToothEx from "@/public/assets/images/ServicesPage/Dental/ToothExt.png";
import ToothRes from "@/public/assets/images/ServicesPage/Dental/ToothRes.png";
import Gum from "@/public/assets/images/ServicesPage/Dental/Gum.png";
import Xray1 from "@/public/assets/images/ServicesPage/Dental/Xray-1.png";
import Dental from "@/public/assets/images/ServicesPage/Dental/Dental.png";
import HairCut from "@/public/assets/images/ServicesPage/Grooming/HairCut.png";
import NailCut from "@/public/assets/images/ServicesPage/Grooming/NailCut.png";
import EarClean from "@/public/assets/images/ServicesPage/Grooming/EarClean.png";
import Bath from "@/public/assets/images/ServicesPage/Grooming/Bath.png";
import HairStyle from "@/public/assets/images/ServicesPage/Grooming/HairStyle.png";
import Boarding from "@/public/assets/images/ServicesPage/Pet Services/Boarding.png";
import Sitting from "@/public/assets/images/ServicesPage/Pet Services/Sitting.png";
import Training from "@/public/assets/images/ServicesPage/Pet Services/Training.png";

import Customer1 from "../public/assets/images/clinic/customer1.png";
import Customer2 from "../public/assets/images/clinic/customer2.png";
import Customer3 from "../public/assets/images/clinic/customer3.png";
import ClinicOT from "../public/assets/images/clinic/clinicopertn.png";

export const circleImageList = [
  {
    image: circleImg1,
    circleText: "Dog & Cat Boarding",
  },
  {
    image: circleImg2,
    circleText: "Deworming",
  },
  {
    image: circleImg3,
    circleText: "Dog Training",
  },
];

export const membershipDataList = [
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
  {
    planName: "Star Care & Grooming",
    planLogo: planLogo1,
    pet: {
      name: "Moca",
      image: membershipImg1,
    },
    benefits: [
      "6 free-of-cost consultations every year",
      "50% discount on additional consultations",
      "Annual deworming",
      "20% discount on diagnostic tests and scans",
      "20% discount on planned surgeries and procedures",
      "10% off retail products & medicines",
      "10% off any grooming service",
    ],
    planInfo: {
      expiresOn: "March 31, 2024",
      nextPaymentOn: "Feb 5, 2024",
    },
  },
];

export const FaqData = [
  {
    heading: "About BearHug",
    qaList: [
      {
        question: "What makes BearHug different?",
        answer:
          "BearHug provides personalized pet care with a focus on comfort and health.",
      },
      {
        question: "How much do you charge for your services?",
        answer:
          "Our pricing varies based on the services provided. Contact us for a detailed quote.",
      },
      {
        question: "What animals does BearHug treat?",
        answer:
          "Dr. Paws is a versatile veterinarian offering expert care to a variety of animals, including cats, dogs, hamsters, unicorns (just kidding, we wish!), and many more.",
      },
    ],
  },
  {
    heading: "At the clinic",
    qaList: [
      {
        question: "What makes BearHug different?",
        answer:
          "BearHug provides personalized pet care with a focus on comfort and health.",
      },
      {
        question: "How much do you charge for your services?",
        answer:
          "Our pricing varies based on the services provided. Contact us for a detailed quote.",
      },
      {
        question: "What animals does BearHug treat?",
        answer:
          "Dr. Paws is a versatile veterinarian offering expert care to a variety of animals, including cats, dogs, hamsters, unicorns (just kidding, we wish!), and many more.",
      },
    ],
  },
  {
    heading: "About BearHug",
    qaList: [
      {
        question: "What makes BearHug different?",
        answer:
          "BearHug provides personalized pet care with a focus on comfort and health.",
      },
      {
        question: "How much do you charge for your services?",
        answer:
          "Our pricing varies based on the services provided. Contact us for a detailed quote.",
      },
      {
        question: "What animals does BearHug treat?",
        answer:
          "Dr. Paws is a versatile veterinarian offering expert care to a variety of animals, including cats, dogs, hamsters, unicorns (just kidding, we wish!), and many more.",
      },
    ],
  },
];

export const reviewData = {
  name: "Rahul Shah",
  review:
    "Dr. Paws is Fantastic Execptional care, friendly staff, and a welcoming atmosphere, Highly recommend for pet owners!",
};

export const clinicItems = [
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
  {
    image: clinic1,
    clinicName: "Indiranagar Clinic",
    branch: "OPD",
    description: "Surgery",
  },
];

export const descriptionItems = [
  {
    image: description1,
    title: "A Clinic That Feels Like Home",
    desciption:
      "Our modern clinics make you feel like you never left home, making visits stress-free for you and your pet",
    button: {
      buttonText: "See Our Clinics",
      buttonBackground: "bg-secondary-1",
      buttonLink: "/clinics",
    },
  },
  {
    image: description2,
    title: "Memberships That Work",
    desciption:
      "Our memberships provide great value care and provide all the services you’re likely to need. Even if you’re facing an emergency, our memberships cover you.",
    button: {
      buttonText: "Book a Member",
      buttonBackground: "bg-accent",
      buttonLink: "",
    },
  },
  {
    image: description3,
    title: "Doctors That Care",
    desciption:
      "We’re in the business of looking after your best friend. We'll listen and answer all your questions and treat your pet like our own",
    button: {
      buttonText: "Book a Visit",
      buttonBackground: "bg-secondary-1",
      buttonLink: "",
    },
  },
  {
    image: description4,
    title: "Everything In Your Control",
    desciption:
      "Book appointments in a few taps, and always stay updated and informed on your pet’s health with our app",
    button: {
      buttonText: "Book a Member",
      buttonBackground: "bg-accent",
      buttonLink: "",
    },
  },
  {
    image: description5,
    title: "Only The Necessary Care",
    desciption:
      "We're pet-lovers first and business-people second. No over-testing, prescribing unnecessary medicines, or pushing procedures that are not needed",
    button: {
      buttonText: "Book a Visit",
      buttonBackground: "bg-secondary-1",
      buttonLink: "",
    },
  },
  {
    image: description6,
    title: "All The Services You Need, Under One Roof",
    desciption:
      "Aside from our world-class veterinary care, our clinics offer grooming, boarding, sitting, nutritionist, and training services",
    button: {
      buttonText: "See Our Services",
      buttonBackground: "bg-secondary-2",
      buttonLink: "/services",
    },
  },
];

export const bannerItems = [
  {
    bannerImage: dogImg,
    bannerText: "Dog",
  },
  {
    bannerImage: catImg,
    bannerText: "Cat",
  },
  {
    bannerImage: birdImg,
    bannerText: "Bird",
  },
];

export const doctors = [
  {
    name: "Dr. Emily Thompson",
    description: "DMV - Animal Welfare",
    experience: "10 Years of Experience",
    location: "Andheri West, Indiranagar",
    image: doctorImage,
  },
  {
    name: "Dr. Nampally Rohit",
    description: "DMV - Veterinary Medicine",
    experience: "8 Years of Experience",
    location: "HSR, Bangalore",
    image: doctorImage,
  },
  {
    name: "Dr. Sarah Johnson",
    description: "DMV - Small Animal Surgery",
    experience: "12 Years of Experience",
    location: "Jayanagar, Bangalore",
    image: doctorImage,
  },
  {
    name: "Dr. Rajesh Sharma",
    description: "DMV - Exotic Animals",
    experience: "15 Years of Experience",
    location: "Whitefield, Bangalore",
    image: doctorImage,
  },
  {
    name: "Dr. Priya Menon",
    description: "DMV - Animal Dermatology",
    experience: "7 Years of Experience",
    location: "Vasant Kunj, Delhi",
    image: doctorImage,
  },
  {
    name: "Dr. John Doe",
    description: "DMV - Veterinary Medicine",
    experience: "8 Years of Experience",
    location: "Koramangala, Bangalore",
    image: doctorImage,
  },
];

export const photos = [
  description1,
  ClinicDog,
  description2,
  description3,
  description4,
  description5,
  description6,
  ClinicOT,
];

export const serviceCategories: ServiceCategory[] = [
  "Planned Check-Ups",
  "Sickness & Emergency",
  "Diagnostics",
  "Planned Surgeries",
  "Dental",
  "Grooming",
  "Pet Services",
];

export const servicesData: Record<ServiceCategory, Service[]> = {
  "Planned Check-Ups": [
    { name: "Vaccinations" },
    { name: "Deworming" },
    { name: "Nutritional Counselling" },
    { name: "Behavioural Counselling" },
  ],
  "Sickness & Emergency": [
    { name: "Emergency Treatment" },
    { name: "Pain Management" },
    { name: "Injury and Wound Care" },
    { name: "Fever and Infections" },
  ],
  Diagnostics: [
    { name: "Blood Tests" },
    { name: "X-Rays" },
    { name: "Ultrasound Imaging" },
    { name: "Urinalysis" },
  ],
  "Planned Surgeries": [
    { name: "Spaying & Neutering" },
    { name: "Dental Surgery" },
    { name: "Tumor Removal" },
    { name: "Orthopedic Surgery" },
  ],
  Dental: [
    { name: "Teeth Cleaning" },
    { name: "Oral Examinations" },
    { name: "Gum Disease Treatment" },
    { name: "Tooth Extraction" },
  ],
  Grooming: [
    { name: "Bathing" },
    { name: "Hair Trimming" },
    { name: "Nail Clipping" },
    { name: "Ear Cleaning" },
  ],
  "Pet Services": [
    { name: "Microchipping" },
    { name: "Pet Travel Certificates" },
    { name: "Adoption Counseling" },
    { name: "Pet Health Insurance Consultation" },
  ],
};

export const ServiceTabsData = [
  {
    id: "planned-checkups",
    title: "Planned check-ups",
    description:
      "Regular check-ups and preventative measures are essential to keep your pet in the best health. Take care of any vaccinations, get any help you need, or simply visit us to ensure your pet is doing just fine!",
    imageDetails: [
      {
        img: Vaccination,
        imgText: "Vaccinations",
      },
      {
        img: Deworming,
        imgText: "Deworming",
      },
      {
        img: GeneralCheckUp,
        imgText: "General Check-up",
      },
      {
        img: BehaviorlCounceling,
        imgText: "Behavioral Counseling",
      },
      {
        img: NutritionalCounceling,
        imgText: "Nutritional Counseling",
      },
    ],
  },
  {
    id: "sickness-emergency",
    title: "Sickness & Emergency",
    description:
      "When your pet falls ill or faces an emergency, we know it's a stressful time. We're here for you and will do our best to get your pet back to their usual happy & healthy self.",
    imageDetails: [
      {
        img: DigestiveProblems,
        imgText: "Digestive Problems",
      },
      {
        img: AllergiesAndRashes,
        imgText: "Allergies & Rashes",
      },
      {
        img: EarInfections,
        imgText: "Ear Infections",
      },
      {
        img: Lethargy,
        imgText: "Lethargy",
      },
      {
        img: Limping,
        imgText: "Limping",
      },
      {
        img: AnimalBites,
        imgText: "Animal Bites",
      },
      {
        img: EyeIssues,
        imgText: "Eye Issues",
      },
      {
        img: Accident,
        imgText: "Accident / Trauma",
      },
    ],
  },
  {
    id: "Diagonstics",
    title: "Diagonstics",
    description:
      "When your pet isn’t feeling their best, it’s important to get to the bottom if it as soon as possible. We offer a wide range of tests and scans, coupled with strong interpretation expertise to make sure the right treatment plan is offered right away.",
    imageDetails: [
      {
        img: Ultrasound,
        imgText: "Ultrasound & ECG",
      },
      {
        img: Microscopy,
        imgText: "Microscopy",
      },
      {
        img: Parasite,
        imgText: "Parasite Detection",
      },
      {
        img: Blood,
        imgText: "Blood & Urine Tests",
      },
      {
        img: Xray,
        imgText: "X-Ray (Body & Dental)",
      },
    ],
  },
  {
    id: "Planned Surgeries",
    title: "Planned Surgeries",
    description:
      "Occasionally it becomes essential to take a more serious course of action to help your animal. We offer a wide range of surgical procedures to ensure your animal gets back to health, as soon as possible. Wherever we can’t help we’ll refer you to a vet that can.",
    imageDetails: [
      {
        img: Sprays,
        imgText: "Spays & Neuters",
      },
      {
        img: Tumors,
        imgText: "Tumour / Mass Removal",
      },
      {
        img: Blader,
        imgText: "Bladder Stone Removal",
      },
      {
        img: Foreign,
        imgText: "Foreign Body Removal",
      },
      {
        img: Ortho,
        imgText: "Orthopedic Surgeries",
      },
    ],
  },
  {
    id: "Dental",
    title: "Dental",
    description:
      "Just like in us humans, oral health is an essential part of making sure your animal maintains great health internally and externally. We offer a range of dental treatments to keep your animal pain-free with great hygiene",
    imageDetails: [
      {
        img: ToothEx,
        imgText: "Tooth Extraction",
      },
      {
        img: ToothRes,
        imgText: "Tooth Restoration",
      },
      {
        img: Xray1,
        imgText: "X-Ray",
      },
      {
        img: Gum,
        imgText: "Gum Treatment",
      },
      {
        img: Dental,
        imgText: "Dental Cleaning / Polishing",
      },
    ],
  },
  {
    id: "Grooming",
    title: "Grooming",
    description:
      "Who doesn’t like to see their best friend looking and feeling their best? Dr. Paws specially designed grooming studios help you to take care of your animal so they turn heads and feel amazing at all times",
    imageDetails: [
      {
        img: HairCut,
        imgText: "Hair Cuts",
      },
      {
        img: NailCut,
        imgText: "Nail Clipping",
      },
      {
        img: EarClean,
        imgText: "Ear Cleaning",
      },
      {
        img: Bath,
        imgText: "Bathing",
      },
      {
        img: HairStyle,
        imgText: "Hair Styling & Brushing",
      },
    ],
  },
  {
    id: "Pet Services",
    title: "Pet Services",
    description:
      "Occasionally it becomes essential to take a more serious course of action to help your animal. We offer a wide range of surgical procedures to ensure your animal gets back to health, as soon as possible. Wherever we can’t help we’ll refer you to a vet that can.",
    imageDetails: [
      {
        img: Boarding,
        imgText: "Dog & Cat Boarding",
      },
      {
        img: Sitting,
        imgText: "Dog & Cat Sitting",
      },
      {
        img: Training,
        imgText: "Dog Training",
      },
    ],
  },
];

export const reviews = [
  {
    image: Customer1,
    name: "Vishnu K",
    review:
      "Dr. Paws is Fantastic Execptional care, friendly staff, and a welcoming atmosphere, Highly recommend for pet owners!",
  },
  {
    image: Customer2,
    name: "Rahul Shah",
    review:
      "I’m very happy with the staff & Vets in the clinic, all are helpful & friendly.",
  },
  {
    image: Customer3,
    name: "Bindu Naidu",
    review:
      "We've been taking our pet Milo to the clinic recently. The staff are very friendly and the vets knowledgeable.",
  },
];
