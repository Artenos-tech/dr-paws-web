import clinic1 from "../public/assets/images/clinic-1.png";
import description1 from "../public/assets/images/description1.png";
import description2 from "../public/assets/images/description2.png";
import description3 from "../public/assets/images/description3.png";
import description4 from "../public/assets/images/description4.png";
import description5 from "../public/assets/images/description5.png";
import description6 from "../public/assets/images/description6.png";
import dogImg from "../public/assets/images/dogimg.png";
import catImg from "../public/assets/images/catimg.png";
import rabbitImg from "../public/assets/images/rabbitImg.png";
import doctorFemale from "../public/assets/images/clinic/doctorFemale.webp";
import doctorMale from "../public/assets/images/clinic/doctorMale.webp";
import ClinicDog from "../public/assets/images/clinic/maggidog.png";
import {
  AppointmentStatus,
  AppointmentType,
  Clinic,
  Review,
} from "@/model/typeDefinitions";
import ParasiteControl from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/ParasiteControl.webp";
import SkinInfections from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/SkinInfections.jpeg";
import { BookingCategory } from "@/model/typeDefinitions";
import Vaccination from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Vaccinations.png";
import Deworming from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Deworming.png";
import GeneralCheckUp from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/General check up.png";
import NutritionalCounceling from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/NutritionalCounceling.png";
import TraumaCare from "@/public/assets/images/ServicesPage/Sickness and Emergency/TraumaCare.webp";
import PainManagement from "@/public/assets/images/ServicesPage/Sickness and Emergency/PainManagement.webp";
import AllergiesAndRashes from "@/public/assets/images/ServicesPage/Sickness and Emergency/Allergies and rashes.png";
import EarInfections from "@/public/assets/images/ServicesPage/Sickness and Emergency/EarInfections.png";
import Lethargy from "@/public/assets/images/ServicesPage/Sickness and Emergency/Lethargy.png";
import Limping from "@/public/assets/images/ServicesPage/Sickness and Emergency/Limping.png";
import AnimalBites from "@/public/assets/images/ServicesPage/Sickness and Emergency/Animal Bites.png";
import FeverInfection from "@/public/assets/images/ServicesPage/Sickness and Emergency/FeverInfection.png";
import VomittingDiarrhoea from "@/public/assets/images/ServicesPage/Sickness and Emergency/VomittingDiarrhoea.webp";
import AppetiteLoss from "@/public/assets/images/ServicesPage/Sickness and Emergency/AppetiteLoss.jpg";
import BloodTests from "@/public/assets/images/ServicesPage/Dignostics/BloodTests.jpeg";
import Ultrasound from "@/public/assets/images/ServicesPage/Dignostics/Ultrsound.png";
import Microscopy from "@/public/assets/images/ServicesPage/Dignostics/Microscopy.png";
import UrineAnalysis from "@/public/assets/images/ServicesPage/Dignostics/UrineAnalysis.jpg";
import Biochemistry from "@/public/assets/images/ServicesPage/Dignostics/Biochemistry.jpg";
import KidneyLiverFunction from "@/public/assets/images/ServicesPage/Dignostics/KidneyLiverFunction.jpg";
import StoolAnalysis from "@/public/assets/images/ServicesPage/Dignostics/StoolAnalysis.png";
import HormoneAnalysis from "@/public/assets/images/ServicesPage/Dignostics/HormoneAnalysis.jpg";
import Xray from "@/public/assets/images/ServicesPage/Dignostics/XRay.png";
import Sprays from "@/public/assets/images/ServicesPage/Planned Surgeries/Sprays.png";
import DentalScaling from "@/public/assets/images/ServicesPage/Planned Surgeries/DentalScaling.jpeg";
import Tumors from "@/public/assets/images/ServicesPage/Planned Surgeries/Tumor.png";
import Foreign from "@/public/assets/images/ServicesPage/Planned Surgeries/Foreign.png";
import Ortho from "@/public/assets/images/ServicesPage/Planned Surgeries/Orthopedic.png";
import SoftTissue from "@/public/assets/images/ServicesPage/Planned Surgeries/SoftTissue.png";
import ToothEx from "@/public/assets/images/ServicesPage/Dental/ToothExt.png";
import ToothRes from "@/public/assets/images/ServicesPage/Dental/ToothRes.png";
import LaserTherapy from "@/public/assets/images/ServicesPage/Physiotherapy/LaserTherapy.png";
import WaterThreadmill from "@/public/assets/images/ServicesPage/Physiotherapy/WaterThreadmill.jpg";
import HairCut from "@/public/assets/images/ServicesPage/Grooming/HairCut.png";
import EarClean from "@/public/assets/images/ServicesPage/Grooming/EarClean.png";
import Bath from "@/public/assets/images/ServicesPage/Grooming/Bath.png";
import OilMassages from "@/public/assets/images/ServicesPage/Grooming/OilMassages.jpg";
import HairColoring from "@/public/assets/images/ServicesPage/Grooming/HairColoring.jpg";
import AnalGlandExpression from "@/public/assets/images/ServicesPage/Grooming/AnalGlandExpression.jpeg";
import Boarding from "@/public/assets/images/ServicesPage/Pet Services/Boarding.png";
import Sitting from "@/public/assets/images/ServicesPage/Pet Services/Sitting.png";
import Microchipping from "@/public/assets/images/ServicesPage/Pet Services/Microchipping.jpg";

import Customer1 from "../public/assets/images/clinic/customer1.png";
import Customer2 from "../public/assets/images/clinic/customer2.png";
import Customer3 from "../public/assets/images/clinic/customer3.png";
import ClinicOT from "../public/assets/images/clinic/clinicopertn.png";
import CareJunior from "@/public/assets/images/Membership/Care Junior.png";
import CareSenior from "@/public/assets/images/Membership/Care Senior.png";
import Grooming from "@/public/assets/images/Membership/Grooming.png";
import StarCare from "@/public/assets/images/Membership/Star Care and Grooming.png";
import { MembershipPlan } from "@/components/ui/MemberCard";

import AppointmentPetImage from "@/public/assets/images/Appointments/petImage.png";
import AppointmentVetImage from "@/public/assets/images/Appointments/vetImage.png";

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
        answer:
          "You can buy a membership through our app or website. Alternatively, you can buy one in-person at our clinics.",
      },
      {
        question: "Is Dr. Paws membership only?",
        answer:
          "No, we welcome all customers regardless of whether they have bought a membership or not. Our memberships, simply offer greater value for money.",
      },
      {
        question: "Is everything done in-house?",
        answer:
          "All our surgical and medical procedures are performed in-house. For certain specific diagnostic tests, we tie-up with external partners, but there is no difference in the process for our customers.",
      },
      {
        question: "What products do you sell in your retail section?",
        answer:
          "We have a comprehensive range of products across medicines, supplements, packaged food, treats, toys & accessories. If there’s anything specific you require, please let us know.",
      },
      {
        question: "Do you have waiting areas in your clinics?",
        answer:
          "Yes, all our clinics have two comfortable and spacious waiting areas. One is a general area for all animals, whilst the other is specially reserved for cats and their parents only.",
      },
      {
        question: "Is there parking available?",
        answer:
          "Yes, all our clinics have ample parking or a valet-service to make visiting easy and hassle-free.",
      },
    ],
  },
];

export const reviewData = [
  {
    name: "Sonia Vora",
    review:
      "Dr paws is an amazing place built to make pets and their owners feel at home! The team has a warm personal touch and the space is fabulous. If you have a pet - Dr Paws should be your first call!",
  },
  {
    name: "Menorah Bridal",
    review:
      "I’ve finally found my Neighbourhood Vet clinic, I brought in my community dog for a quick check-up today. Beautiful space in the heart of indranagar, feels like home and wonderful team at Dr.Paws.",
  },
  {
    name: "Bharath Shamasundar",
    review:
      "The best place to be if you are looking for your pet to be treated as family !! The staff truly treats your pets like family. Their compassionate care and attention to detail create a welcoming environment. From thorough examinations to personalised follow-up, they prioritise your pet's well-being, making every visit a positive experience.",
  },
];

export const clinicItems: Clinic[] = [
  {
    id: "1",
    image: clinic1,
    clinicName: "Indiranagar",
    services:
      "Consults | Grooming | Surgery | Dignostics | Ultrasound | Retail",
    contact: "+91 9606994627",
    location:
      "https://www.google.com/maps/place/Dr.+Paws+-+Veterinarian+in+Indiranagar,+Bengaluru+%7C+Vet+Consultation,+Pet+Vaccination,+Pet+Grooming,+Pet+Surgery+%7C+Pet+Clinic/@12.9655253,77.6385461,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae150fe803f393:0x5820ed9ef42478d3!8m2!3d12.9655253!4d77.6385461!16s%2Fg%2F11vxxyv2zc?entry=ttu&g_ep=EgoyMDI0MTExNy4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: "2",
    image: clinic1,
    clinicName: "RMV (Dollars Colony)",
    services:
      "Consults | Grooming | Surgery | Dignostics | Ultrasound | Retail",
    contact: "+91 7204996899",
    location:
      "https://www.google.com/maps/place/Dr.+Paws+-+Veterinarian+in+RMV+(Dollars+Colony)+%7C+Vet+Consultation,+Pet+Vaccination,+Pet+Grooming,+Pet+Surgery+%7C+Pet+Clinic/@13.0434066,77.5680191,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae174f82ebbe2f:0xc9a13342ab7933ac!8m2!3d13.0434014!4d77.570594!16s%2Fg%2F11w8ffwb9b?entry=tts&g_ep=EgoyMDI0MTExMi4wIPu8ASoASAFQAw%3D%3D",
  },
  // {
  //   id: "3",
  //   image: clinic1,
  //   clinicName: "HSR layout",
  //   services:
  //     "Consults | Grooming | Surgery | Dignostics | Ultrasound | Retail",
  //   contact: "Coming soon!",
  //   location: "",
  // },
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
    name: "Dr. Girish Kumar V.K.",
    // description: "DMV - Animal Welfare",
    // experience: "10 Years of Experience",
    clinicIds: ["1", "2"],
    location: "Indiranagar, Bangalore",
    image: doctorMale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Archana G.",
    // description: "DMV - Veterinary Medicine",
    // experience: "8 Years of Experience",
    clinicIds: ["1"],
    location: "Indiranagar, Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Hitesh Bhardwaj",
    // description: "DMV - Small Animal Surgery",
    // experience: "12 Years of Experience",
    clinicIds: ["2"],
    location: "RMV (Dollars Colony), Bangalore",
    image: doctorMale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Shrayva B.L.",
    // description: "DMV - Exotic Animals",
    // experience: "15 Years of Experience",
    clinicIds: ["1"],
    location: "Indiranagar, Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Prerana S.J.",
    // description: "DMV - Animal Dermatology",
    // experience: "7 Years of Experience",
    clinicIds: ["1"],
    location: "Indiranagar, Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Kiran K.S.",
    // description: "DMV - Veterinary Medicine",
    // experience: "8 Years of Experience",
    clinicIds: ["2"],
    location: "RMV (Dollars Colony), Bangalore",
    image: doctorMale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr Aarti Goswami",
    // description: "DMV - Veterinary Medicine",
    // experience: "8 Years of Experience",
    clinicIds: ["2"],
    location: "RMV (Dollars Colony), Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Neha Menon",
    // description: "DMV - Animal Dermatology",
    // experience: "7 Years of Experience",
    clinicIds: ["1"],
    location: "Indiranagar, Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Gisha Nair",
    // description: "DMV - Animal Dermatology",
    // experience: "7 Years of Experience",
    clinicIds: ["1"],
    location: "Indiranagar, Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Rajashri Bodepalli",
    // description: "DMV - Animal Dermatology",
    // experience: "7 Years of Experience",
    clinicIds: ["1"],
    location: "Indiranagar, Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Charu Nino",
    // description: "DMV - Veterinary Medicine",
    // experience: "8 Years of Experience",
    clinicIds: ["2"],
    location: "RMV (Dollars Colony), Bangalore",
    image: doctorFemale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
  },
  {
    name: "Dr. Deepak Dhindhwal",
    // description: "DMV - Veterinary Medicine",
    // experience: "8 Years of Experience",
    clinicIds: ["2"],
    location: "RMV (Dollars Colony), Bangalore",
    image: doctorMale,
    // specialization: "Veterinarian specialized in Dentistry",
    // aboutVet:
    //   "Veterinarian with DVM from National Veterinary University. Associate Vet at City Animal Hospital, Emergency Vet at Emergency Veterinary Services, and currently Director & Senior Vet at Companion Care Vet Hospital. Active member of AVMA. Passionate about animal care.",
    // tag: "Passionate about animal care and active member of AVMA.",
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

export const serviceCategories = [
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
    { name: "Parasite Control" },
    { name: "Ear & Eye Check-ups" },
  ],
  "Sickness & Emergency": [
    { name: "Care Traume" },
    { name: "Pain Management" },
    { name: "Fever and Infectious Disease Treatement" },
    { name: "Injuries" },
    { name: "Limping & Wound Care" },
    { name: "Vommiting & Diarrhoea Care" },
    { name: "Loss of Appetite & Lathergry Care" },
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
        img: SkinInfections,
        imgText: "Skin Infections",
      },
      {
        img: GeneralCheckUp,
        imgText: "Master Check-up",
      },
      {
        img: Deworming,
        imgText: "Deworming",
      },
      {
        img: ParasiteControl,
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
        img: TraumaCare,
        imgText: "Trauma Care",
      },
      {
        img: PainManagement,
        imgText: "Pain Management",
      },
      {
        img: FeverInfection,
        imgText: "Fever & Infectious Disease Treatment",
      },
      {
        img: AnimalBites,
        imgText: "Injuries",
      },
      {
        img: Limping,
        imgText: "Limping & Wound Care",
      },
      {
        img: VomittingDiarrhoea,
        imgText: "Vomiting & Diarrhoea Care",
      },
      {
        img: AppetiteLoss,
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
        img: BloodTests,
        imgText: "Blood Tests",
      },
      {
        img: Biochemistry,
        imgText: "Biochemistry Tests",
      },
      {
        img: KidneyLiverFunction,
        imgText: "Kidney & Liver Function Tests",
      },
      {
        img: UrineAnalysis,
        imgText: "Urine Analysis",
      },
      {
        img: StoolAnalysis,
        imgText: "Stool Analysis",
      },
      {
        img: HormoneAnalysis,
        imgText: "Hormone Analysis",
      },
      {
        img: Microscopy,
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
        img: DentalScaling,
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
        img: SoftTissue,
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
        img: LaserTherapy,
        imgText: "Laser Therapy",
      },
      {
        img: WaterThreadmill,
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
        img: OilMassages,
        imgText: "Oil Massages",
      },
      {
        img: HairColoring,
        imgText: "Hair Colouring",
      },
      {
        img: AnalGlandExpression,
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
        img: Microchipping,
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

export const reviews: Review[] = [
  {
    image: Customer1,
    name: "Nikita Rekhy",
    review:
      "We went to de paws for a full groom. The clinic and grooming space is super clean. The staff is extremely friendly and kind. I had requested them to keep his age in mind as he is old and cannot stand for too long and they obliged us completely. Not once did my dog bark being uncomfortable. Would highly recommend",
    clinicId: "1",
  },
  {
    image: Customer2,
    name: "Nistha Barthakur",
    review:
      "They are undoubtedly one of the most welcoming and friendly vets in town, both for pets and pet parents. The space in itself got my pet open up and the doctor was very patient and understanding towards every single concern we had. No unnecessary medicines prescribed and they were also very patient with my pet and made sure she was comfortable before even starting the consultation. Highly recommended!",
    clinicId: "1",
  },
  {
    image: Customer3,
    name: "Shashank N",
    review:
      "We've been taking our pet Milo to the clinic recently. The staff are very friendly and the vets knowledgeable.",
    clinicId: "1",
  },
  {
    image: Customer3,
    name: "Karan Srinivas",
    review:
      "I recently visited Dr Paws with my pet and the experience was really great! The staff were friendly, compassionate, and professional. Dr. Girish was able to address all of my concerns and also teach us how to manage my pet’s health. The clinic's modern facilities, convenient location, and flexible scheduling impressed me. My pet received top-notch care. I highly recommend Dr Paws for all your pet care needs!",
    clinicId: "2",
  },
  {
    image: Customer1,
    name: "Neha Toshnival",
    review:
      "What a friendly, bright place for our four-legged friends, my pet felt at home already! Thankful to have a place run and managed by equally friendly and warm people with all the facilities required. We have known Dr.Girish for some time now and he has always been helpful and reassuring. I know my pet is in safe hands here.",
    clinicId: "2",
  },
  {
    image: Customer2,
    name: "Ridhima Nair",
    review:
      "Very thoughtfully put together keeping in mind the comfort of all pets owners, with separate floors for cats and dogs. Very spacious, spread across four floors accommodating all the required services like x-ray, ultrasound, path lab, grooming areas, OT for surgeries & IPD and a huge pet store on the ground floor. And most importantly, a wonderful team of doctors, ably led by Dr. Girish and brought together by the passionate founders.",
    clinicId: "2",
  },
];

export const membershipData: MembershipPlan[] = [
  {
    title: "Puppy Membership",
    icon: CareJunior,
    description:
      "Our plan that helps prepare you and your puppy for a lifetime together",
    benefits: [
      { text: "50% discount on Vet Consultations" },
      { text: "20% discount on Grooming Sessions" },
      {
        text: "Full Puppy Vaccination Programme Included (DHPPi 9-in-1, Rabies, Kennel Cough) - Worth ₹6,860",
      },
      { text: "10% off on all Retail products" },
      { text: "10% off on all Pharmacy products" },
      { text: "15% off on in-house Diagnostic Tests" },
      { text: "10% off on external Diagnostic Tests" },
      { text: "10% off on Imaging (X-rays, Ultrasound)" },
      { text: "10% off on Elective Surgeries" },
      { text: "5% off on Non-Elective Surgeries" },
    ],
    price: "₹9,499",
    duration: "1 Year",
    petType: "Dog",
  },
  {
    title: "Adult Dog Membership",
    icon: CareSenior,
    description:
      "Our plan that helps keep you and your dog healthy and happy for life",
    benefits: [
      { text: "50% discount on Vet Consultations" },
      { text: "20% discount on Grooming Sessions" },
      {
        text: "Full Annual Vaccination Programme Included (DHPPi 9-in-1, Rabies, Kennel Cough) - Worth ₹2,540",
      },
      { text: "10% off on all Retail products" },
      { text: "10% off on all Pharmacy products" },
      { text: "15% off on in-house Diagnostic Tests" },
      { text: "10% off on external Diagnostic Tests" },
      { text: "10% off on Imaging (X-rays, Ultrasound)" },
      { text: "10% off on Elective Surgeries" },
      { text: "5% off on Non-Elective Surgeries" },
    ],
    price: "₹4,499",
    duration: "1 Year",
    petType: "Dog",
  },
  {
    title: "Senior Dog Membership",
    icon: CareSenior,
    description: "Our plan to keep your pet healthy and happy for life",
    benefits: [
      { text: "50% discount on Vet Consultations" },
      { text: "20% discount on Grooming Sessions" },
      {
        text: "Full Annual Vaccination Programme Included (DHPPi 9-in-1, Rabies, Kennel Cough) - Worth ₹2,540",
      },
      { text: "10% off on all Retail products" },
      { text: "15% off on all Pharmacy products" },
      { text: "15% off on in-house Diagnostic Tests" },
      { text: "10% off on external Diagnostic Tests" },
      { text: "10% off on Imaging (X-rays, Ultrasound)" },
      { text: "10% off on Elective Surgeries" },
      { text: "5% off on Non-Elective Surgeries" },
    ],
    price: "₹5,499",
    duration: "1 Year",
    petType: "Dog",
  },
  {
    title: "Grooming Membership",
    icon: Grooming,
    description: "Our plan to keep your furry friend looking and feeling fab!",
    benefits: [
      { text: "6 free Spa Sessions included (Worth ₹7200)" },
      { text: "30% off any other Grooming Services" },
      { text: "10% off on all Retail products" },
      { text: "10% off on all Pharmacy products" },
    ],
    price: "₹5,999",
    duration: "1 Year",
    petType: "Dog",
  },
  {
    title: "Comprehensive Membership",
    icon: StarCare,
    description:
      "Our best value plan that keeps your pet healthy and looking great",
    benefits: [
      { text: "50% discount on Vet Consultations" },
      { text: "6 Spa Sessions included (Worth ₹7200)" },
      { text: "50% off on any other Grooming Services" },
      {
        text: "Full Annual Vaccination Programme Included (DHPPi 9-in-1, Rabies, Kennel Cough) - Worth ₹2,540",
      },
      { text: "15% off on all Retail products" },
      { text: "15% off on all Pharmacy products" },
      { text: "20% off on in-house Diagnostic Tests" },
      { text: "15% off on external Diagnostic Tests" },
      { text: "15% off on Imaging (X-rays, Ultrasound)" },
      { text: "15% off on Elective Surgeries" },
      { text: "10% off on Non-Elective Surgeries" },
    ],
    price: "₹9,999",
    isPopular: true,
    duration: "1 Year",
    petType: "Dog",
  },
];

export const bookingCategories: BookingCategory[] = [
  {
    id: "Planned Visits",
    title: "Planned Visits",
    description: "Vaccination, Health Checkup...",
  },
  {
    id: "Sickness & Emergency",
    title: "Sickness & Emergency",
    description: "Trauma Care, Pain Management...",
  },
  {
    id: "Diagnostics",
    title: "Diagnostics",
    description: "Blood Tests, Biochemistry Tests...",
  },
  {
    id: "Surgeries",
    title: "Surgeries",
    description: "Spraying & Neutering, Dental Scaling...",
  },
  {
    id: "Physiotherapy",
    title: "Physiotherapy",
    description: "Laser Therapy, Water Treadmil Therapy...",
  },
  {
    id: "Grooming",
    title: "Grooming",
    description: "Spa Baths, Haircuts & Hair Shaping...",
  },
  {
    id: "Pet Services",
    title: "Pet Services",
    description: "Microchipping, Travel Document Preparation...",
  },
];

export const timeSlots = [
  "10:00am",
  "11:00am",
  "12:00pm",
  "01:00pm",
  "02:00pm",
  "03:00pm",
  "04:00pm",
  "05:00pm",
];

export const mockAppointments: AppointmentType[] = [
  {
    id: "1",
    petName: "Buddy",
    vetName: "Dr. Smith",
    petImage: AppointmentPetImage.src,
    vetImage: AppointmentVetImage.src,
    date: "2023-10-15",
    time: "10:00 AM",
    status: AppointmentStatus.Upcoming,
    service: "Vaccination",
  },
  {
    id: "2",
    petName: "Whiskers",
    vetName: "Dr. Johnson",
    petImage: AppointmentPetImage.src,
    vetImage: AppointmentVetImage.src,
    date: "2023-10-10",
    time: "02:30 PM",
    status: AppointmentStatus.Past,
    service: "Dental Cleaning",
  },
  {
    id: "3",
    petName: "Rex",
    vetName: "Dr. Lee",
    petImage: AppointmentPetImage.src,
    vetImage: AppointmentVetImage.src,
    date: "2023-10-20",
    time: "11:15 AM",
    status: AppointmentStatus.Upcoming,
    service: "Check-up",
  },
  {
    id: "4",
    petName: "Bella",
    vetName: "Dr. Wong",
    petImage: AppointmentPetImage.src,
    vetImage: AppointmentVetImage.src,
    date: "2023-09-30",
    time: "09:00 AM",
    status: AppointmentStatus.Past,
    service: "Spay/Neuter",
  },
  {
    id: "5",
    petName: "Charlie",
    vetName: "Dr. Brown",
    petImage: AppointmentPetImage.src,
    vetImage: AppointmentVetImage.src,
    date: "2023-11-05",
    time: "01:00 PM",
    status: AppointmentStatus.Upcoming,
    service: "Allergy Consultation",
  },
  {
    id: "6",
    petName: "Daisy",
    vetName: "Dr. Green",
    petImage: AppointmentPetImage.src,
    vetImage: AppointmentVetImage.src,
    date: "2023-10-12",
    time: "03:45 PM",
    status: AppointmentStatus.Cancelled,
    service: "Routine Check-up",
  },
];
