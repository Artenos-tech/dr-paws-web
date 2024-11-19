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
import rabbitImg from "../public/assets/images/rabbitimg.png";
import doctorImage from "../public/assets/images/clinic/doctor.png";
import ClinicDog from "../public/assets/images/clinic/maggidog.png";
// import { ServiceCategory } from "@/model/typeDefinitions";
import { Service, Clinic, BookingCategory } from "@/model/typeDefinitions";
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
import CareJunior from "@/public/assets/images/Membership/Care Junior.png";
import CareSenior from "@/public/assets/images/Membership/Care Senior.png";
import Grooming from "@/public/assets/images/Membership/Grooming.png";
import StarCare from "@/public/assets/images/Membership/Star Care and Grooming.png";

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
    heading: "About Dr. Paws",
    qaList: [
      {
        question: "How do I book an appointment?",
        answer:
          "The easiest way to book is through our app or website. If you prefer calling or sending a WhatsApp to your local clinic to book, please feel free to do this.",
      },
      {
        question: "Which animals do you treat?",
        answer:
          "We treat all small domestic animals including dogs, cats, rabbits, hamsters, guinea pigs, birds, and reptiles. Our ability to treat complex cases in exotic / rare species will vary by doctor.",
      },
      {
        question: "What are your timings?",
        answer:
          "Most of our clinics run from 9am to 8pm, with some offering 24x7 care. Please check information for your local clinic in ‘Our Locations’ or via Google.",
      },
      {
        question: "How do I buy a membership?",
        answer: "You can buy a membership through our app or website. Alternatively, you can buy one in-person at our clinics."
      },
      {
        question: "Is Dr. Paws membership only?",
        answer: "No, we welcome all customers regardless of whether they have bought a membership or not. Our memberships, simply offer greater value for money."
      },
      {
        question: "Is everything done in-house?",
        answer: "All our surgical and medical procedures are performed in-house. For certain specific diagnostic tests, we tie-up with external partners, but there is no difference in the process for our customers."
      },
      {
        question: "What products do you sell in your retail section?",
        answer: "We have a comprehensive range of products across medicines, supplements, packaged food, treats, toys & accessories. If there’s anything specific you require, please let us know."
      },
      {
        question: "Do you have waiting areas in your clinics?",
        answer: "Yes, all our clinics have two comfortable and spacious waiting areas. One is a general area for all animals, whilst the other is specially reserved for cats and their parents only."
      },
      {
        question: "Is there parking available?",
        answer: "Yes, all our clinics have ample parking or a valet-service to make visiting easy and hassle-free."
      },

    ],
  },

 
];

export const reviewData = {
  name: "Rahul Shah",
  review:
    "Dr. Paws is Fantastic Execptional care, friendly staff, and a welcoming atmosphere, Highly recommend for pet owners!",
};
//
export const clinicItems: Clinic[] = [
  {
    id: "1",
    image: clinic1,
    clinicName: "Indiranagar",
    services:
      "Consults | Grooming | Surgery | Dignostics | Ultrasound | Retail",
    contact: "+91 9606994627",
  },
  {
    id: "2",
    image: clinic1,
    clinicName: "RMV (Dollars Colony)",
    services:
      "Consults | Grooming | Surgery | Dignostics | Ultrasound | Retail",
    contact: "+91 7204996899",
  },
  {
    id: "3",
    image: clinic1,
    clinicName: "HSR layout",
    services:
      "Consults | Grooming | Surgery | Dignostics | Ultrasound | Retail",
    contact: "+91 7204996899",
  },
];

export const descriptionItems = [
  {
    image: description1,
    title: "A Clinic That Feels Like Home",
    desciption:
      "Our thoughtfully designed clinics are all about warmth & comfort, making each visit stress-free.",
    button: {
      buttonText: "See Our Clinics",
      buttonBackground: "bg-secondary-1",
      buttonLink: "/clinics",
    },
  },
  {
    image: description3,
    title: "Doctors That Care",
    desciption:
      " We’re here to look after your best friend. It’s our duty to listen, answer all your questions, and explain what we’re seeing in a way that makes sense.",
    button: {
      buttonText: "View Our Team",
      buttonBackground: "bg-accent",
      buttonLink: "/team",
    },
  },
  {
    image: description4,
    title: "Everything Under One Roof",
    desciption:
      "From consults through to emergency surgeries, we have you covered. We also offer grooming, diagnostic tests, imaging, and retail.",
    button: {
      buttonText: "View Our Services",
      buttonBackground: "bg-secondary-1",
      buttonLink: "/services",
    },
  },
  {
    image: description5,
    title: "Only the Necessary Treatment",
    desciption:
      "We’re here to earn your trust. We commit to never over-prescribing medicines, tests, and procedures.",
    button: {
      buttonText: "Book a Visit",
      buttonBackground: "bg-accent",
      buttonLink: "",
    },
  },
  {
    image: description6,
    title: "A Space Just for Cats",
    desciption:
      "At Dr. Paws, cats are not an afterthought- with our dedicated cat waiting rooms, consult rooms, and grooming studios, our clinics are designed around the needs of cats.",
    button: {
      buttonText: "Book a Visit",
      buttonBackground: "bg-secondary-1",
      buttonLink: "",
    },
  },
  {
    image: description2,
    title: "Memberships That Count",
    desciption:
      "Our membership packs are tailor-made to offer great value and cover all the essentials to keep your pet happy & healthy.",
    button: {
      buttonText: "Become a member",
      buttonBackground: "bg-secondary-2",
      buttonLink: "",
    },
  },
  {
    image: description4,
    title: "Your Pet’s Health in a Tap",
    desciption:
      "Book appointments in a few taps, and always stay updated and informed on your pet’s health with our app",
    button: {
      buttonText: "Download App",
      buttonBackground: "bg-secondary-2",
      buttonLink: "",
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
    bannerImage: rabbitImg,
    bannerText: "Small Animal",
  },
];

export const doctors = [
  {
    name: "Dr. Emily Thompson",
    description: "DMV - Animal Welfare",
    experience: "10 Years of Experience",
    location: "Andheri West, Indiranagar",
    image: doctorImage,
    specialization: "Veterinarian specialized in Dentistry",
    aboutVet:
      "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Nampally Rohit",
    description: "DMV - Veterinary Medicine",
    experience: "8 Years of Experience",
    location: "HSR, Bangalore",
    image: doctorImage,
    specialization: "Veterinarian specialized in Dentistry",
    aboutVet:
      "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Sarah Johnson",
    description: "DMV - Small Animal Surgery",
    experience: "12 Years of Experience",
    location: "Jayanagar, Bangalore",
    image: doctorImage,
    specialization: "Veterinarian specialized in Dentistry",
    aboutVet:
      "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Rajesh Sharma",
    description: "DMV - Exotic Animals",
    experience: "15 Years of Experience",
    location: "Whitefield, Bangalore",
    image: doctorImage,
    specialization: "Veterinarian specialized in Dentistry",
    aboutVet:
      "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Priya Menon",
    description: "DMV - Animal Dermatology",
    experience: "7 Years of Experience",
    location: "Vasant Kunj, Delhi",
    image: doctorImage,
    specialization: "Veterinarian specialized in Dentistry",
    aboutVet:
      "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. John Doe",
    description: "DMV - Veterinary Medicine",
    experience: "8 Years of Experience",
    location: "Koramangala, Bangalore",
    image: doctorImage,
    specialization: "Veterinarian specialized in Dentistry",
    aboutVet:
      "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    tag: "Passionate about animal care and active member of AVMA.",
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

export const serviceCategories= [
  "Planned Visits",
  "Sickness & Emergency",
  "Diagnostics",
  "Surgeries",
  "Physiotherapy",
  "Grooming",
  "Pet Services",
];

export const servicesData = {
  "Planned Visits": [
    { name: "Vaccinations" },
    { name: "Skin infections" },
    { name: "Master Health Check-ups" },
    { name: "Deworming" },
    { name: "Parasite Control"},
    { name: "Ear & Eye Check-ups"}
  ],
  "Sickness & Emergency": [
    { name: "Care Traume" },
    { name: "Pain Management" },
    { name: "Fever and Infectious Disease Treatement" },
    { name: "Injuries" },
    { name: "Limping & Wound Care" },
    { name: "Vommiting & Diarrhoea Care"},
    { name: "Loss of Appetite & Lathergry Care"}
  ],
  Diagnostics: [
    { name: "Blood Tests" },
    { name: "Biochemistry Tests" },
    { name: "Kidney & Liver Function Tests" },
    { name: "Urine Analysis" },
    { name: "Stool Analysis" },
    { name: "Hormone Analysis" },
    { name: "Microscopy" },
    { name: "Allergy Tests" },
    { name: "Fever & Infection Tests" },
    { name: "X-Ray" },
    { name: "Ultrasound" },
  ],
  Surgeries: [
    { name: "Spaying & Neutering" },
    { name: "Dental Scaling" },
    { name: "Tumour & Mass Removals" },
    { name: "Foreign-Body Removals" },
    { name: "Tooth Extractions" },
    { name: "Orthopaedic Surgeries" },
    { name: "Soft-Tissue Surgeries" },
  ],
  Physiotherapy: [
    { name: "Laser Therapy" },
    { name: "Water Treadmill Therapy" },
  ],
  Grooming: [
    { name: "Spa Baths" },
    { name: "Haircuts & Hair Shaping" },
    { name: "Ear Cleaning" },
    { name: "Dental Cleaning" },
    { name: "Oil Massages" },
    { name: "Hair Colouring" },
    { name: "Anal Gland Expression" },
  ],
  "Pet Services": [
    { name: "Microchipping" },
    { name: "Travel Document Preparation" },
    { name: "Nutritional Counselling" },
    { name: "New-Pet Preparation & Counselling" },
  ],
};

export const ServiceTabsData = [
  {
    id: "planned-Visits",
    title: "Planned Visits",
    description:
      "Regular check-ups and preventative measures are essential to keep your pet in the best health. Take care of any vaccinations, get any help you need, or simply visit us to ensure your pet is doing just fine!",
    imageDetails: [
      {
        img: Vaccination,
        imgText: "Vaccinations",
      },
      {
        img: Deworming,
        imgText: "Skin Infections",
      },
      {
        img: GeneralCheckUp,
        imgText: "Master Check-up",
      },
      {
        img: BehaviorlCounceling,
        imgText: "Deworming",
      },
      {
        img: NutritionalCounceling,
        imgText: "Parasite Control",
      },
      {
        img: EarInfections,
        imgText: "Ear & Eye Check-ups",
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
        imgText: "Trauma Care",
      },
      {
        img: AllergiesAndRashes,
        imgText: "Pain Management",
      },
      {
        img: EarInfections,
        imgText: "Fever & Infectious Disease Treatment",
      },
      {
        img: Lethargy,
        imgText: "Injuries",
      },
      {
        img: Limping,
        imgText: "Limping & Wound Care",
      },
      {
        img: AnimalBites,
        imgText: "Vomiting & Diarrhoea Care",
      },
      {
        img: EyeIssues,
        imgText: "Loss of Appetite & Lethargy Care",
      },
    ],
  },
  {
    id: "Diagonstics",
    title: "Diagonstics",
    description:
      "Our pets don’t always communicate what’s wrong making diagnostic tests a crucial part of our care. With our wide range of tests and expert doctors, we’ll do our best to diagnose exactly what’s going as soon as possible.",
    imageDetails: [
      {
        img: Ultrasound,
        imgText: "Blood Tests",
      },
      {
        img: Microscopy,
        imgText: "Biochemisty Tests",
      },
      {
        img: Parasite,
        imgText: "Kidney & Liver Function Tests",
      },
      {
        img: Blood,
        imgText: "Urine Analysis",
      },
      {
        img: Xray,
        imgText: "Stool Analysis",
      },
      {
        img: Xray,
        imgText: "Hormone Analysis",
      },
      {
        img: Xray,
        imgText: "Microscopy",
      },
      {
        img: AllergiesAndRashes,
        imgText: "Allergy Tests",
      },
      {
        img: Lethargy,
        imgText: "Fever & Infection Tests",
      },
      {
        img: Xray,
        imgText: "X-Ray",
      },
      {
        img: Ultrasound,
        imgText: "Ultrasound",
      },
    ],
  },
  {
    id: "Surgeries",
    title: "Surgeries",
    description:
      "Our wide range of surgeries and deep doctor expertise, allow us to help get your pet back to their healthy self, should intervention be required. If we can’t help, we’ll refer you to a place that can.",
    imageDetails: [
      {
        img: Sprays,
        imgText: "Spaying & Neutering",
      },
      {
        img: Tumors,
        imgText: "Dental Scaling",
      },
      {
        img: Tumors,
        imgText: "Tumor and Mass Removals",
      },
      {
        img: Foreign,
        imgText: "Foreign Body Removals",
      },
      {
        img: ToothEx,
        imgText: "Tooth Extractions",
      },
      {
        img: Ortho,
        imgText: "Orthopaedic Surgeries",
      },
      {
        img: Ortho,
        imgText: "Soft-Tissue Surgeries",
      },
    ],
  },
  {
    id: "Physiotherapy",
    title: "Physiotherapy",
    description:
      "We offer a range of specialised therapies with cutting-edge equipment to help pets deal with chronic mobility conditions, or prevent them in the first-place.",
    imageDetails: [
      {
        img: ToothEx,
        imgText: "Laser Therapy",
      },
      {
        img: ToothRes,
        imgText: "Water Treadmill Therapy",
      },
    ],
  },
  {
    id: "Grooming",
    title: "Grooming",
    description:
      "Our state-of-the-art grooming studios help to keep you pet looking and feeling great.",
    imageDetails: [
      {
        img: Bath,
        imgText: "Spa Baths",
      },
      {
        img: HairCut,
        imgText: "Haircuts & Hair Shaping",
      },
      {
        img: EarClean,
        imgText: "Ear Cleaning",
      },
      {
        img: ToothRes,
        imgText: "Dental Cleaning",
      },
      {
        img: NailCut,
        imgText: "Oil Massages",
      },
      {
        img: HairStyle,
        imgText: "Hair Colouring",
      },
      {
        img: HairStyle,
        imgText: "Anal Gland Expression",
      },
    ],
  },
  {
    id: "Pet Services",
    title: "Pet Services",
    description:
      "We offer a range of services to help make pet-ownership easier and stress-free",
    imageDetails: [
      {
        img: Boarding,
        imgText: "Microchipping",
      },
      {
        img: Sitting,
        imgText: "Travel Document Preparation",
      },
      {
        img: NutritionalCounceling,
        imgText: "Nutritional Counselling",
      },
      {
        img: Boarding,
        imgText: "New-Pet Preparation Counselling",
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

export const membershipData = [
  {
    title: "Care Junior",
    icon: CareJunior,
    description:
      "Our plan that helps prepare you and your puppy or kitten for a lifetime together",
    benefits: [
      { text: "6 free-of-cost consultations every year" },
      { text: "50% discount on additional consultations" },
      { text: "Comprehensive vaccination programme" },
      { text: "Annual deworming" },
      { text: "10 free training sessions" },
      { text: "10% discount on diagnostic tests and scans" },
      { text: "10% off retail products & medicines" },
      { text: "10% off any grooming service" },
    ],
  },
  {
    title: "Care Senior",
    icon: CareSenior,
    description: "Our plan to keep your pet healthy and happy for life",
    benefits: [
      { text: "6 free-of-cost consultations every year" },
      { text: "50% discount on additional consultations" },
      { text: "Free annual vaccination boosters" },
      { text: "Annual deworming" },
      { text: "20% discount on diagnostic tests and scans" },
      { text: "20% discount on planned surgeries and procedures" },
      { text: "10% off retail products & medicines" },
      { text: "10% off any grooming service" },
    ],
  },
  {
    title: "Grooming",
    icon: Grooming,
    description: "Our plan to keep your furry friend looking and feeling fab!",
    benefits: [
      { text: "6 free spa sessions per year" },
      { text: "2 free haircuts every year" },
      { text: "50% off any other grooming service" },
      { text: "50% off veterinary consultations" },
      { text: "10% off vaccinations" },
      { text: "Annual deworming" },
      { text: "10% off diagnostic test and scans" },
      { text: "10% discount on planned surgeries and procedures" },
    ],
  },
  {
    title: "Star Care Grooming",
    icon: StarCare,
    description:
      "Our best value plan that keeps your pet healthy and looking great",
    benefits: [
      { text: "Unlimited vet consultations" },
      { text: "12 free spa sessions per year" },
      { text: "2 free haircuts every year" },
      { text: "50% off any other grooming service" },
      { text: "Free annual vaccination boosters" },
      { text: "Annual deworming consultation" },
      { text: "25% discount on diagnostic tests and scans" },
      { text: "25% discount on planned surgeries and procedures" },
      { text: "15% off retail products & medicines" },
    ],
    isPopular: true,
  },
];


export const bookingCategories: BookingCategory[] = [
  {
    id: "Planned Visits",
    title: "Planned Visits",
    description: "vaccination, health checkup...",
  },
  {
    id: "Sickness & Emergency",
    title: "Sickness & Emergency",
    description: "lethargy, vomiting, limping...",
  },
  {
    id: "Diagnostics",
    title: "Diagnostics",
    description: "blood test, tick fever test...",
  },
  {
    id: "Surgeries",
    title: "Surgeries",
    description: "vaccination, health checkup...",
  },
  {
    id: "Physiotherapy",
    title: "Physiotherapy",
    description: "lethargy, vomiting, limping...",
  },
  { 
    id: "Grooming", 
    title: "Grooming", 
    description: "haircut, spa..." },
  {
    id: "Pet Services",
    title: "Pet Services",
    description: "training, boarding...",
  },
];