import dogImg from "../public/assets/images/dogimg.webp"
import catImg from "../public/assets/images/catimg.webp"
import otherPetsImg from "../public/assets/images/otherpetimg.png"

// import CareJunior from "@/public/assets/images/Membership/Care Junior.png";
// import CareSenior from "@/public/assets/images/Membership/Care Senior.png";
// import Grooming from "@/public/assets/images/Membership/Grooming.png";
// import StarCare from "@/public/assets/images/Membership/Star Care and Grooming.png";
// import { MembershipPlan } from "@/components/ui/MemberCard";

import LP_DocsThatCare from "@/public/assets/images/Landing Page/LP_DocsThatCare.png"
import LP_EverythingUnderRoof from "@/public/assets/images/Landing Page/LP_EverythingUnderRoof.png"
import LP_FeelsLikeHome from "@/public/assets/images/Landing Page/LP_FeelsLikeHome.png"
import LP_MembershipsCount from "@/public/assets/images/Landing Page/LP_MembershipsCount.png"
import LP_OneTap from "@/public/assets/images/Landing Page/LP_OneTap.png"
import LP_OnlyNecessaryTreatment from "@/public/assets/images/Landing Page/LP_OnlyNecessaryTreatments.png"
import LP_SpaceForCats from "@/public/assets/images/Landing Page/LP_SpaceForCats.png"

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
]

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
]

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
]

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
]
