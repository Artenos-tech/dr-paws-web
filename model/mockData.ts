import IND_2ndFloor from "../public/assets/images/ClinicDetails/IND_2ndFloor.jpg";
import IND_2ndFloor1 from "../public/assets/images/ClinicDetails/IND_2ndfloor1.jpg";
import IND_Diagnostics from "../public/assets/images/ClinicDetails/IND_Diagnostics.jpg";
import IND_OPT from "../public/assets/images/ClinicDetails/IND_OPT.jpg";
import IND_Reception from "../public/assets/images/ClinicDetails/IND_Reception.jpg";
import IND_WaitingArea from "../public/assets/images/ClinicDetails/IND_WaitingArea.jpg";
import IND_Exterior1 from "../public/assets/images/ClinicDetails/IND_Exterior1.jpg";
import IND_Exterior2 from "../public/assets/images/ClinicDetails/IND_Exterior2.jpg";
import RMV_Exterior1 from "../public/assets/images/ClinicDetails/RMV_Exterior1.jpg";
import RMV_Exterior2 from "../public/assets/images/ClinicDetails/RMV_Exterior2.jpg";
import RMV_CatWaiting from "../public/assets/images/ClinicDetails/RMV_CatWaiting.png";
import RMV_ConsultRoom from "../public/assets/images/ClinicDetails/RMV_ConsultRoom.png";
import RMV_Grooming from "../public/assets/images/ClinicDetails/RMV_Grooming.png";
import RMV_Hallway from "../public/assets/images/ClinicDetails/RMV_Hallway.png";
import RMV_Hydrotherapy from "../public/assets/images/ClinicDetails/RMV_Hydrotherapy.png";
import RMV_Reception from "../public/assets/images/ClinicDetails/RMV_Reception.png";
import RMV_Retail from "../public/assets/images/ClinicDetails/RMV_Retail.png";
import dogImg from "../public/assets/images/dogimg.webp";
import catImg from "../public/assets/images/catimg.webp";
import otherPetsImg from "../public/assets/images/otherpetimg.png";
import { Clinic, Doctor, Review } from "@/model/typeDefinitions";
// import { BookingCategory } from "@/model/typeDefinitions";
// import { AppointmentStatus, AppointmentType } from "@/model/typeDefinitions";

import ParasiteControl from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/ParasiteControl.png";
import SkinInfections from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/SkinInfections.jpeg";
import Vaccination from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Vaccinations.png";
import Deworming from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/Deworming.png";
import EarEyeCheckUp from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/EarEyeCheckup.png";
import GeneralCheckUp from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/General check up.png";
import NutritionalCounceling from "@/public/assets/images/ServicesPage/PlannedCheckUpImages/NutritionalCounceling.png";
import TraumaCare from "@/public/assets/images/ServicesPage/Sickness and Emergency/TraumaCare.webp";
import PainManagement from "@/public/assets/images/ServicesPage/Sickness and Emergency/PainManagement.png";
import AllergiesAndRashes from "@/public/assets/images/ServicesPage/Sickness and Emergency/Allergies and rashes.png";
import Limping from "@/public/assets/images/ServicesPage/Sickness and Emergency/Limping.png";
import AnimalBites from "@/public/assets/images/ServicesPage/Sickness and Emergency/Animal Bites.png";
import FeverInfection from "@/public/assets/images/ServicesPage/Sickness and Emergency/FeverInfection.png";
import VomittingDiarrhoeaCare from "@/public/assets/images/ServicesPage/Sickness and Emergency/VomittingDiarrhoeaCare.png";
import AppetiteLoss from "@/public/assets/images/ServicesPage/Sickness and Emergency/AppetiteLoss.png";
import BloodTests from "@/public/assets/images/ServicesPage/Dignostics/BloodTests.png";
import Ultrasound from "@/public/assets/images/ServicesPage/Dignostics/Ultrasound.png";
import Microscopy from "@/public/assets/images/ServicesPage/Dignostics/Microscopy.png";
import UrineAnalysis from "@/public/assets/images/ServicesPage/Dignostics/UrineAnalysis.png";
import Biochemistry from "@/public/assets/images/ServicesPage/Dignostics/Biochemistry.png";
import KidneyLiverFunction from "@/public/assets/images/ServicesPage/Dignostics/KidneyLiverFunction.png";
import StoolAnalysis from "@/public/assets/images/ServicesPage/Dignostics/StoolAnalysis.png";
import HormoneAnalysis from "@/public/assets/images/ServicesPage/Dignostics/HormoneAnalysis.png";
import Xray from "@/public/assets/images/ServicesPage/Dignostics/XRay.png";
import FeverInfectionTests from "@/public/assets/images/ServicesPage/Sickness and Emergency/FeverInfection.png";
import SpayingNeutering from "@/public/assets/images/ServicesPage/Planned Surgeries/SpayingNeutering.png";
import DentalScaling from "@/public/assets/images/ServicesPage/Planned Surgeries/DentalScaling.png";
import Tumorremoval from "@/public/assets/images/ServicesPage/Planned Surgeries/Tumourremoval.png";
import ForeignBodyRemoval from "@/public/assets/images/ServicesPage/Planned Surgeries/ForeignBodyRemoval.png";
import Orthopaedic from "@/public/assets/images/ServicesPage/Planned Surgeries/Orthopaedic.png";
import SoftTissue from "@/public/assets/images/ServicesPage/Planned Surgeries/SoftTissue.png";
import ToothExtraction from "@/public/assets/images/ServicesPage/Planned Surgeries/ToothExtraction.png";
import ToothRes from "@/public/assets/images/ServicesPage/Dental/ToothRes.png";
import LaserTherapy from "@/public/assets/images/ServicesPage/Physiotherapy/LaserTherapy.png";
import Hydrotherapy from "@/public/assets/images/ServicesPage/Physiotherapy/Hydrotherapy.png";
import Trimming from "@/public/assets/images/ServicesPage/Grooming/Trimming.png";
import EarClean from "@/public/assets/images/ServicesPage/Grooming/EarClean.png";
import SpaBath from "@/public/assets/images/ServicesPage/Grooming/SpaBath.png";
import OilMassage from "@/public/assets/images/ServicesPage/Grooming/OilMassage.png";
import HairColoring from "@/public/assets/images/ServicesPage/Grooming/HairColoring.jpg";
import AnalGlandExpression from "@/public/assets/images/ServicesPage/Grooming/AnalGlandExpression.png";
import NewPetCounselling from "@/public/assets/images/ServicesPage/Pet Services/NewPetCounselling.png";
import TravelDocs from "@/public/assets/images/ServicesPage/Pet Services/TravelDocs.png";
import Microchipping from "@/public/assets/images/ServicesPage/Pet Services/Microchipping.png";

import Customer1 from "../public/assets/images/clinic/customer1.png";
import Customer2 from "../public/assets/images/clinic/customer2.png";
import Customer3 from "../public/assets/images/clinic/customer3.png";
import CareJunior from "@/public/assets/images/Membership/Care Junior.png";
import CareSenior from "@/public/assets/images/Membership/Care Senior.png";
import Grooming from "@/public/assets/images/Membership/Grooming.png";
import StarCare from "@/public/assets/images/Membership/Star Care and Grooming.png";
import { MembershipPlan } from "@/components/ui/MemberCard";

import DrAartiImg from "@/public/assets/images/vets/dr_aarti.png";
import DrArchanaImg from "@/public/assets/images/vets/dr_archana.png";
import DrDeepakImg from "@/public/assets/images/vets/dr_deepak.png";
import DrGirishImg from "@/public/assets/images/vets/dr_girish.png";
import DrGishaImg from "@/public/assets/images/vets/dr_gisha.png";
import DrHiteshImg from "@/public/assets/images/vets/dr_hitesh.png";
import DrKiranImg from "@/public/assets/images/vets/dr_kiran.png";
import DrNehaImg from "@/public/assets/images/vets/dr_neha.png";
import DrNinoImg from "@/public/assets/images/vets/dr_nino.png";
import DrPreranaImg from "@/public/assets/images/vets/dr_prerana.png";
import DrRajashreeImg from "@/public/assets/images/vets/dr_rajashree.png";
import DrShravyaImg from "@/public/assets/images/vets/dr_shravya.png";

import LP_DocsThatCare from "@/public/assets/images/Landing Page/LP_DocsThatCare.png";
import LP_EverythingUnderRoof from "@/public/assets/images/Landing Page/LP_EverythingUnderRoof.png";
import LP_FeelsLikeHome from "@/public/assets/images/Landing Page/LP_FeelsLikeHome.png";
import LP_MembershipsCount from "@/public/assets/images/Landing Page/LP_MembershipsCount.png";
import LP_OneTap from "@/public/assets/images/Landing Page/LP_OneTap.png";
import LP_OnlyNecessaryTreatment from "@/public/assets/images/Landing Page/LP_OnlyNecessaryTreatments.png";
import LP_SpaceForCats from "@/public/assets/images/Landing Page/LP_SpaceForCats.png";
import { StaticImageData } from "next/image";
import ClinicImage from "@/public/assets/images/clinic/ClinicImage.png";
// import AppointmentPetImage from "@/public/assets/images/Appointments/petImage.png";
// import AppointmentVetImage from "@/public/assets/images/Appointments/vetImage.png";

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
          "Most of our clinics run from 9am to 8pm, with some offering 24x7 care. Please check information for your local clinic in ‘Locations’ or via Google.",
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
      "I've finally found my Neighbourhood Vet clinic, I brought in my community dog for a quick check-up today. Beautiful space in the heart of indranagar, feels like home and wonderful team at Dr.Paws.",
  },
  {
    name: "Bharath Shamasundar",
    review:
      "The best place to be if you are looking for your pet to be treated as family !! The staff truly treats your pets like family. Their compassionate care and attention to detail create a welcoming environment. From thorough examinations to personalised follow-up, they prioritise your pet's well-being, making every visit a positive experience.",
  },
];

export const clinicImagesMap: {[key: string]: StaticImageData} = {
  indiranagar: IND_Exterior1,
  rmv: RMV_Exterior1,
  unknown: ClinicImage,
}

export const clinicItems: Clinic[] = [
  {
    id: 1,
    name: "Dr. Paws, Indiranagar",
    image: {
      type: "url",
      value: IND_Exterior1
    },
    services:
      "Consults | Surgeries | Grooming | Diagnostics | X-Ray | Ultrasound | Retail",
    address: "Indiranagar",
    city: "Bangalore",
    contact: "+91 9606994627",
    gmapsUrl: "https://maps.app.goo.gl/p3JpKF8ud82urwFt6",
    parkingInfo:
      "Ample parking available outside clinic, and in surrounding lanes",
    timings: [
      {
        dayOfWeek: "Monday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      },
      {
        dayOfWeek: "Tuesday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      },
      {
        dayOfWeek: "Wednesday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      },
      {
        dayOfWeek: "Thursday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      },
      {
        dayOfWeek: "Friday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      },
      {
        dayOfWeek: "Saturday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      },
      {
        dayOfWeek: "Sunday",
        openTime: "09:00",
        closeTime: "21:00",
        is24Hours: false
      }
    ]
  },
  {
    id: 2,
    name: "Dr. Paws, RMV (Dollars Colony)",
    image: {
      type: "url",
      value: RMV_Exterior1
    },
    services:
      "Consults | Surgeries | Grooming | Diagnostics | X-Ray | Ultrasound | Hydrotherapy | Retail",
    contact: "+91 7204996899",
    address: "RMV (Dollars Colony)",
    city: "Bangalore",
    gmapsUrl: "https://www.google.com/maps/place/Dr.+Paws+RMV+-+24x7+Pet+Clinic+in+Sanjay+Nagar,+Bengaluru+%7C+Vet+Consultation,+Pet+Vaccination,+Pet+Grooming,+Pet+Surgery/data=!4m2!3m1!1s0x0:0xc9a13342ab7933ac?sa=X&ved=1t:2428&ictx=111",
    parkingInfo:
      "Ample parking available outside clinic, and in surrounding lanes",
    timings: [
      {
        dayOfWeek: "Monday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      },
      {
        dayOfWeek: "Tuesday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      },
      {
        dayOfWeek: "Wednesday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      },
      {
        dayOfWeek: "Thursday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      },
      {
        dayOfWeek: "Friday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      },
      {
        dayOfWeek: "Saturday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      },
      {
        dayOfWeek: "Sunday",
        openTime: "00:00",
        closeTime: "23:59",
        is24Hours: true
      }
    ]
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
    image: LP_FeelsLikeHome,
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
    image: LP_DocsThatCare,
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
    image: LP_EverythingUnderRoof,
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
    image: LP_OnlyNecessaryTreatment,
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
    image: LP_SpaceForCats,
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
    image: LP_MembershipsCount,
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
    image: LP_OneTap,
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
    bannerText: "Dogs.",
  },
  {
    bannerImage: catImg,
    bannerText: "Cats.",
  },
  {
    bannerImage: otherPetsImg,
    bannerText: "Other Pets.",
  },
];

export const doctorImagesMap: {[key: string]: StaticImageData} = {
  "dr-girish-kumar": DrGirishImg,
  "dr-archana-g": DrArchanaImg,
  "dr-hitesh-bhardwaj": DrHiteshImg,
  "dr-shravya-b-l": DrShravyaImg,
  "dr-prerana-s-j": DrPreranaImg,
  "dr-kiran-k-s": DrKiranImg,
  "dr-aarti-goswami": DrAartiImg,
  "dr-neha-menon": DrNehaImg,
  "dr-charu-nino": DrNinoImg,
  "dr-deepak-dhindhwal": DrDeepakImg,
  "dr-gisha-nair": DrGishaImg,
  "dr-rajasri-bodepudi": DrRajashreeImg,
};

export const doctors: Doctor[] = [
  {
    id: 112,
    displayName: "Dr. Girish Kumar V.K.",
    position: "Chief Veterinary Officer",
    experience: "16 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar",
    }, {
      id: 2,
      name: "RMV (Dollars Colony)",
    }],
    imageUrl: {
      type: "url",
      value: DrGirishImg
    },
    qualification: "BVSc & AH, MVSc (Clinical Medicine)",
    specialization: "Cardiology, Ultrasonography, Internal Medicine",
    about:
      "As the Chief Veterinary Officer at Dr. Paws, aside from my daily clinical practice, I am responsible for shaping the medical standards and procedures across all our clinics. I completed my BVSc from Mannuthy Veterinary College, Kerala, before completing my Master's from Madras Veterinary College. I am particularly interested in cardiology and internal medicine, and have spent a lot of time working on ultrasonography and with cats. Prior to joining Dr. Paws, I spent 12 years at Cessna Lifeline where I was a Branch Head, and before this I was a Junior Vet in Malaysia.",
    passionateAbout:
      "I love playing the detective and uncovering the mysteries of what's making a pet sick.",
    spiritAnimal:
      "It's definitely a giant panda, because what's better than sitting around and being goofy?",
    favPetName: "Ozzy",
  },
  {
    id: 136,
    displayName: "Dr. Archana G.",
    position: "Lead Veterinarian",
    experience: "6 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar",
    }],
    imageUrl: {
      type: "url",
      value: DrArchanaImg
    },
    specialization: "Surgery, Internal Medicine",
    about:
      "I'm a huge pet-lover firstly, who also happens to be a Dogtor! I particularly love cats and have two of my own called Floki & Quisp. I started my veterinary journey at the Hassan Veterinary College, Karnataka, before completing my Master's in Surgery & Radiology at the Kerala Veterinary & Animal Science University in Wayanad. Post this, I've worked across pet hospitals and establised chains in Kochi, Mumbai and Bangalore.",
    passionateAbout:
      "As a vet, I love having the ability to be able to help animals who cannot speak for themselves, and seeing them get better.",
    spiritAnimal:
      "Definitely a cat! I love the indoors and am very stingy about sharing my space (mentally and physically) with too many people!",
    favPetName: "Dost",
    qualification: "BVSc & AH, MVSc (Surgery & Radiology)",
  },
  {
    id: 1737,
    displayName: "Dr. Hitesh Bhardwaj",
    position: "Lead Veterinarian",
    experience: "5 Years",
    availableToDisplayAt: [{
      id: 2,
      name: "RMV (Dollars Colony)",
    }],
    imageUrl: {
      type: "url",
      value: DrHiteshImg
    },
    specialization: "Critical Care & Soft-Tissue Surgery",
    about:
      "I'm a Lead Vet at Dr. Paws, having graduated with a BVSc from the Bihar Veterinary College in Patna. Post this I have completed a Post Graduate Diploma in Animal Welfare from the Indira Gandhi National Open University. Prior to Dr. Paws I have worked at established small-animal clinics including Crown Vet, Jeeva Pet Hospital & SKS Veterinary.",
    passionateAbout:
      "I love being able to treat those creatures that can't explain what's going on.",
    spiritAnimal:
      "My spirit anumal is a hawk, as it teaches me how to focus.",
    favPetName: "Laddu",
    qualification: "BVSc & AH, Post Graduate Diploma (Animal Welfare)",
  },
  {
    id: 138,
    displayName: "Dr. Shravya B.L.",
    position: "Veterinarian",
    experience: "3 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar",
    }],
    imageUrl: {
      type: "url",
      value: DrShravyaImg
    },
    specialization: "Gynaecology & Obstetrics",
    about:
      "I'm a passionate veterinarian who graduated from Veterinary College, Hassan, KVAFSU in 2019. Post this, I completed my post graduation in Veterinary Gynaecology and Obstetrics from Veterinary College, Bengaluru, KVAFSU in 2021. ",
    passionateAbout:
      "I love my job because I can meet numerous innocent animals full of love, and I feel empowered when I help them heal.",
    spiritAnimal:
      "My spirit animal is a bear because deep inside I just want to hibernate (hehe)!",
    favPetName:
      "My favourite pet name is Shunti, which means ginger in Kannada",
    qualification: "BVSc & AH, MVSc (Gynaecology & Obstetrics)",
  },
  {
    id: 140,
    displayName: "Dr. Prerana S.J.",
    position: "Veterinarian",
    experience: "3 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar"
    }],
    imageUrl: {
      type: "url",
      value: DrPreranaImg
    },
    specialization: "Soft Tissue Surgeries, Orthopaedic Surgeries",
    about:
      "I completed my Bachelor's at Hassan Veterinary College in 2019, and later specialized in Veterinary Surgery and Radiology at Bangalore Veterinary College. After this, I began my professional journey practicing at private pet hospitals, where I've had the opportunity to work with a wide range of patients. Along the way, I’ve continued to expand my knowledge through many training programs, including workshops in veterinary orthopaedics and emergency critical care. I was also privileged to undertake observerships at the esteemed Queens Veterinary School Hospital in Cambridge, UK, where I gained valuable insights in neurology, soft tissue surgery, and orthopaedics.",
    passionateAbout:
      "I love getting paid to cuddle animals, play detective with their health issues, and celebrating little victories like a wagging tail or a purr of approval. Being a veterinary surgeon allows me to combine precision with compassion as I help animals heal through skilled, life-changing procedures. The thrill of successfully performing surgery and seeing a pet recover is an incredibly rewarding experience every time.",
    spiritAnimal:
      "I love being a veterinary surgeon because it allows me to combine precision with compassion, helping animals heal through skilled, life-changing procedures. The thrill of successfully performing surgery and seeing a pet recover is an incredibly rewarding experience every time.",
    favPetName: "",
    qualification: "BVSc & AH, MVSc (Surgery & Radiology)",
  },
  {
    id: 236,
    displayName: "Dr. Kiran K.S.",
    position: "Veterinarian",
    experience: "2 Years",
    availableToDisplayAt: [{
      id: 2,
      name: "RMV (Dollars Colony)"
    }],
    imageUrl: {
      type: "url",
      value: DrKiranImg
    },
    specialization: "Surgery & Veterinary Endoscopy",
    about:
      "I graduated from the Veterinary College in Bidar, KVAFSU Karnataka, and pursued M.V.Sc. in Veterinary Surgery and Radiology from Maharashtra Animal and Fisheries Sciences University, MAFSU Nagpur. I specialize in Minimally Invasive Procedures (Veterinary Endoscopy), as well as small animal soft-tissue surgeries and basic orthopedic surgeries. With over two years of clinical experience in small animal practice, I have also handled emergency shifts.",
    passionateAbout:
      "Being a vet, I love the diversity of our profession where you can find and explore yourself, as well as different species of animals. My profession doesn't include only medical services; it also includes animal and public health, welfare and prevention of suffering.",
    spiritAnimal:
      "My spiritual animal is the cat, as it symbolizes curiosity, adventure, independence, and the mastery of patience.",
    favPetName: "Jessy",
    qualification: "BVSc & AH, MVSc (Surgery & Radiology)",
  },
  {
    id: 1465,
    displayName: "Dr Aarti Goswami",
    position: "Veterinarian",
    experience: "3 Years",
    availableToDisplayAt: [{
      id: 2,
      name: "RMV (Dollars Colony)"
    }],
    imageUrl: {
      type: "url",
      value: DrAartiImg
    },
    specialization: "Surgery & Radiology",
    about:
      "I'm a veterinarian who completed both my Bachelor's and Master's degrees from GBPUAT, Pantnagar, Uttarakhand",
    passionateAbout:
      "Animals do not have a voice. It's our job to identify what's troubling them. And when we send them home after treating them, there's an immense joy in knowing that the pet is healthy and the pet parents are content. This is what I love the most about being a veterinarian.",
    spiritAnimal:
      "An elephant is my spirit animal. He's majestic, mystical, strong and wise. They help me to reconnect with my own positive attributes. It helps me lead a positive and balanced life.",
    favPetName: "My favourite pet name is Dexter",
    qualification: "BVSc & AH, MVSc (Surgery & Radiology)",
  },
  {
    id: 143,
    displayName: "Dr. Neha Menon",
    position: "Veterinarian",
    experience: "2 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar"
    }],
    imageUrl: {
      type: "url",
      value: DrNehaImg
    },
    specialization: "Internal Medicine, Alternative Therapies",
    about:
      "Meet Dr. Neha Menon, the vet who believes in healing your pets with more than just prescriptions - her secret ingredients include homeopathy, herbal remedies, and a whole lot of tail wags! If your furry friend needs some zen, she's the one to call! She combines holistic medicine and good vibes to make sure your pet feels their best, inside and out, because she's a firm believe that sometimes the best prescription is a little less kibble and a lot more care",
    passionateAbout:
      "I love being a veterinary doctor because where else can you spend your day giving belly rubs, saving lives, and getting kissed by animals who think you're a rock star? It's a pawsome gig!",
    spiritAnimal:
      "The cow, gentle and nurturing, feels like my spirit animal, reminding me to offer compassionate care, soothe pain, and heal with patience. Its steady dedication guides me, inspiring me to serve with love in every act of healing",
    favPetName: "Trif, as this was my pup's name",
    qualification: "BVSc & AH",
  },
  {
    id: 144,
    displayName: "Dr. Gisha Nair",
    position: "Veterinarian",
    experience: "5 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar"
    }],
    imageUrl: {
      type: "url",
      value: DrGishaImg
    },
    specialization: "Ophthalmology and Soft-Tissue Surgery",
    about:
      "I'm a dedicated veterinarian who graduated from the College of Veterinary Sciences, Wayanad, Kerala. Post this, I have worked as a Chief Surgeon at a Small Animal Clinic in Kochi, before shifting to Hyderabad to work on Animal Control with the GHMC. I have also completed research work, including on specialised eye-related topics like the transplantation of processed human amniotic membrane for the management of dry melanotic cornea in dogs.",
    passionateAbout:
      "It's not just about working with cute animals (though that's a big plus!). It's about helping them and making a difference. Every day, we get to help animals feel better.",
    spiritAnimal:
      "My spirit animal is a deer because I am gentle and compassionate, introspective and thoughtful, and a bit reserved but with a deep inner strength.",
    favPetName: "Luttappi",
    qualification: "BVSc & AH",
  },
  {
    id: 147,
    displayName: "Dr. Rajashri Bodepalli",
    position: "Veterinarian",
    experience: "3 Years",
    availableToDisplayAt: [{
      id: 1,
      name: "Indiranagar"
    }],
    imageUrl: {
      type: "url",
      value: DrRajashreeImg
    },
    specialization:
      "Critical Care, Preventative Medicine, Radiography, Soft-Tissue Surgery",
    about:
      "I completed my Bachelor's degree from the College of Veterinary Science, Tirupati before moving into small animal veterinary practice. At my last clinic, I gained significant exposure across a wide-range of surgeries and performed numerous X-Rays and Ultrasounds. I am particularly interested in preventative medicine, so that we can help our furry friends to avoid falling sick, as far as possible.",
    passionateAbout:
      "As a vet, I love being able to interact with furry pets, heping and treating them across all aspects of care so that their quality of life imprives.",
    spiritAnimal:
      "The tiger is my spirit animal. Super strong, elegant, and reserved but confident, I strive to be like one always.",
    favPetName: "Paco",
    qualification: "BVSc & AH",
  },
  {
    id: 320,
    displayName: "Dr. Charu Nino",
    position: "Veterinarian",
    experience: "2 Years",
    availableToDisplayAt: [{
      id: 2,
      name: "RMV (Dollars Colony)"
    }],
    imageUrl: {
      type: "url",
      value: DrNinoImg
    },
    specialization: "General Medicine & OPD",
    about:
      "I'm a passionate veterinarian, who graduated from the College of Veterinary Sciences in Guwahati, Assam. Aside from this, I'm a passionate pet lover and pet-parent to two Persian cats.",
    passionateAbout:
      "What I love about being a vet is seeing animals get better. Not every day is the same. Learning all the time, new ways to help animals, new tools, and new medicines.",
    spiritAnimal:
      "My spirit animal is a beaver because I am persistent, diligent and believe in teamwork.",
    favPetName: "Sir Don Pedro",
    qualification: "BVSc & AH",
  },
  {
    id: 146,
    displayName: "Dr. Deepak Dhindhwal",
    position: "Veterinarian",
    experience: "1 Year",
    availableToDisplayAt: [{
      id: 2,
      name: "RMV (Dollars Colony)"
    }],
    imageUrl: {
      type: "url",
      value: DrDeepakImg
    },
    specialization: "General Medicine",
    about:
      "I'm an enthusiastic vet who's completed his BVSc from the Veterinary College, Bengaluru (KVAFSU). I have spent 1.5 years in the college hospital and completed a 1 year internship, where I gained exposure across emergency cases, surgeries, and exotic animals.",
    passionateAbout:
      "I love those wagging tails, happy purrs, and joyful woofs. Nothing beats the moment a pet feels their best because of my care!",
    spiritAnimal:
      "My spirit animal is a wolf because they symbolise loyalty, intelligence, and protection. Wolves are known for their strong sense of community, much like how we care for and protect animals and their families. They also represent a deep understanding of nature and instinct, qualities essential in diagnosing and treating animals with empathy and skill.",
    favPetName: "Ghost - come meet her (my Husky) at the RMV clinic!",
    qualification: "BVSc & AH",
  },
];

export const photos = [
  {
    id: "1",
    photos: [
      IND_Exterior1,
      IND_Exterior2,
      IND_2ndFloor1,
      IND_2ndFloor,
      IND_WaitingArea,
      IND_Diagnostics,
      IND_OPT,
      IND_Reception,
    ],
  },
  {
    id: "2",
    photos: [
      RMV_Exterior1,
      RMV_Exterior2,
      RMV_CatWaiting,
      RMV_ConsultRoom,
      RMV_Grooming,
      RMV_Hallway,
      RMV_Hydrotherapy,
      RMV_Reception,
      RMV_Retail,
    ],
  },
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
    { name: "Skin Infections" },
    { name: "Master Health Check-ups" },
    { name: "Deworming" },
    { name: "Parasite Control" },
    { name: "Ear & Eye Check-ups" },
  ],
  "Sickness & Emergency": [
    { name: "Trauma Care" },
    { name: "Pain Management" },
    { name: "Fever and Infectious Disease Treatment" },
    { name: "Injuries" },
    { name: "Limping & Wound Care" },
    { name: "Vomiting & Diarrhoea Care" },
    { name: "Loss of Appetite & Lethargy Care" },
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
    { name: "Eye Surgeries" },
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
    vetPortId: 5,
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
        img: EarEyeCheckUp,
        imgText: "Ear & Eye Check-ups",
      },
    ],
  },
  {
    id: "sickness-emergency",
    vetPortId: 10,
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
        img: VomittingDiarrhoeaCare,
        imgText: "Vomiting & Diarrhoea Care",
      },
      {
        img: AppetiteLoss,
        imgText: "Loss of Appetite & Lethargy Care",
      },
    ],
  },
  {
    id: "Diagnostics",
    vetPortId: 12,
    title: "Diagnostics",
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
        img: FeverInfectionTests,
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
    vetPortId: 13,
    title: "Surgeries",
    description:
      "Our wide range of surgeries and deep doctor expertise, allow us to help get your pet back to their healthy self, should intervention be required. If we can’t help, we’ll refer you to a place that can.",
    imageDetails: [
      {
        img: SpayingNeutering,
        imgText: "Spaying & Neutering",
      },
      {
        img: DentalScaling,
        imgText: "Dental Scaling",
      },
      {
        img: Tumorremoval,
        imgText: "Tumor and Mass Removals",
      },
      {
        img: ForeignBodyRemoval,
        imgText: "Foreign Body Removals",
      },
      {
        img: ToothExtraction,
        imgText: "Tooth Extractions",
      },
      {
        img: Orthopaedic,
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
    vetPortId: 27,
    title: "Physiotherapy",
    description:
      "We offer a range of specialised therapies with cutting-edge equipment to help pets deal with chronic mobility conditions, or prevent them in the first-place.",
    imageDetails: [
      {
        img: LaserTherapy,
        imgText: "Laser Therapy",
      },
      {
        img: Hydrotherapy,
        imgText: "Water Treadmill Therapy",
      },
    ],
  },
  {
    id: "Grooming",
    vetPortId: 8,
    title: "Grooming",
    description:
      "Our state-of-the-art grooming studios help to keep you pet looking and feeling great.",
    imageDetails: [
      {
        img: SpaBath,
        imgText: "Spa Baths",
      },
      {
        img: Trimming,
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
        img: OilMassage,
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
    vetPortId: 24,
    title: "Pet Services",
    description:
      "We offer a range of services to help make pet-ownership easier and stress-free",
    imageDetails: [
      {
        img: Microchipping,
        imgText: "Microchipping",
      },
      {
        img: TravelDocs,
        imgText: "Travel Document Preparation",
      },
      {
        img: NutritionalCounceling,
        imgText: "Nutritional Counselling",
      },
      {
        img: NewPetCounselling,
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
      "We went to dr paws for a full groom. The clinic and grooming space is super clean. The staff is extremely friendly and kind. I had requested them to keep his age in mind as he is old and cannot stand for too long and they obliged us completely. Not once did my dog bark being uncomfortable. Would highly recommend",
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
      { text: "10% off on Physiotherapy" },
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
      { text: "10% off on Physiotherapy" },
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
      { text: "15% off on Physiotherapy" },
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
      { text: "15% off on Physiotherapy" },
      { text: "15% off on Elective Surgeries" },
      { text: "10% off on Non-Elective Surgeries" },
    ],
    price: "₹9,999",
    isPopular: true,
    duration: "1 Year",
    petType: "Dog",
  },
];
