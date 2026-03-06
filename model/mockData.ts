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

export interface BlogAuthor {
  name: string
  role: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishedAt: string
  imageUrl: string
  imageAlt: string
  author: BlogAuthor
  content: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "first-48-hours-with-a-new-puppy",
    title: "The First 48 Hours With a New Puppy: A Calm Start Guide",
    excerpt:
      "A practical plan to help your puppy settle in with less stress, better sleep, and safer routines.",
    category: "Puppy Care",
    readTime: "6 min read",
    publishedAt: "February 12, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Golden puppy resting on a bed",
    author: {
      name: "Dr. Ayesha Menon",
      role: "Veterinary Surgeon",
    },
    content: [
      "The first two days shape how a puppy feels about your home. Keep the environment quiet, avoid introducing too many people at once, and give your puppy a fixed corner with bedding, water, and a safe chew toy.",
      "Use short bathroom breaks every 2-3 hours, especially after meals and naps. Reward successful toilet trips immediately so your puppy links the behavior with praise.",
      "Feed small, scheduled meals and avoid frequent food changes in the first week. Sudden diet changes can trigger loose stools and make adjustment harder.",
      "Night crying is common. Stay close, keep lights dim, and offer calm reassurance without turning bedtime into playtime.",
      "Book a vet check early to discuss deworming, vaccination timelines, and early socialization targets. A strong routine in week one prevents many behavior and health issues later.",
      "Give your puppy short nap breaks between new experiences. Overtired puppies become mouthy and restless, which often looks like misbehavior but is usually fatigue.",
      "Begin simple name-response and leash-introduction sessions indoors for 2-3 minutes at a time. Early low-pressure training builds confidence and makes outdoor transitions smoother.",
    ],
  },
  {
    slug: "cat-hiding-after-moving-home",
    title: "Why Cats Hide After Moving Home and What You Should Do",
    excerpt:
      "Many cats hide for days after a move. Here is how to reduce stress and help them regain confidence safely.",
    category: "Cat Behavior",
    readTime: "5 min read",
    publishedAt: "January 29, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Curious tabby cat sitting near a window",
    author: {
      name: "Dr. Rahul Bhat",
      role: "Companion Animal Vet",
    },
    content: [
      "Hiding is a normal safety response for cats in unfamiliar environments. New smells, sounds, and layout changes can make even confident cats feel threatened.",
      "Start with one quiet room. Place litter, food, water, and a covered hideout in separate corners so your cat can move around without pressure.",
      "Do not pull your cat out from hiding. Instead, sit quietly in the room, speak softly, and let your cat approach on its own timeline.",
      "Use familiar bedding and toys carrying known scent. This can shorten adjustment time and reduce anxiety-driven behaviors like over-grooming.",
      "If your cat refuses food for over 24 hours, or hides continuously for several days without exploring, schedule a clinical check to rule out stress-related illness.",
      "Keep mealtimes and light cycles predictable during the first week after a move. Routine lowers stress and helps cats map the new environment faster.",
      "Pheromone diffusers and vertical resting spots like shelves or cat trees can improve confidence. Many cats recover sooner when they can observe safely from higher ground.",
    ],
  },
  {
    slug: "summer-hydration-rules-for-pets",
    title: "Summer Hydration Rules Every Pet Parent Should Follow",
    excerpt:
      "Simple hydration routines can prevent heat stress during warmer months, especially for flat-faced and senior pets.",
    category: "Seasonal Care",
    readTime: "7 min read",
    publishedAt: "February 3, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Dog drinking water outdoors on a warm day",
    author: {
      name: "Dr. Neha Arora",
      role: "Emergency Vet",
    },
    content: [
      "Dehydration builds faster than most owners expect. Always place multiple water bowls in shaded areas and refresh them through the day.",
      "Walk dogs in early mornings or late evenings. Hot pavement can burn paw pads, and intense afternoon heat can trigger dangerous overheating.",
      "Add moisture to meals when needed: wet food, diluted bone broth, or water mixed into kibble can improve fluid intake for picky pets.",
      "Watch for early warning signs: heavy panting, dry gums, low energy, and sticky saliva. These signs can escalate quickly in brachycephalic breeds.",
      "If your pet shows vomiting, collapse, or confusion in heat, seek emergency care immediately. Heatstroke is time-sensitive and should never be managed at home.",
      "Carry foldable water bowls on walks and offer small sips every 15-20 minutes in warm weather. Frequent small intake is usually better tolerated than one large drink.",
      "For at-risk pets, track resting respiratory rate and daily energy during peak summer weeks. Subtle trend changes can signal heat strain before an emergency develops.",
    ],
  },
  {
    slug: "home-first-aid-kit-for-dogs-and-cats",
    title: "Build a Home First-Aid Kit for Dogs and Cats in 15 Minutes",
    excerpt:
      "A well-prepared pet first-aid kit helps you respond safely while you are on the way to a clinic.",
    category: "Emergency Prep",
    readTime: "6 min read",
    publishedAt: "February 18, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1583512603806-077998240c7a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Veterinarian checking a dog with medical kit nearby",
    author: {
      name: "Dr. Kiran Nair",
      role: "Critical Care Vet",
    },
    content: [
      "A pet first-aid kit should contain gauze, non-stick pads, saline, antiseptic wipes, tweezers, a digital thermometer, and vet-safe bandage wrap.",
      "Keep your vet number and 24x7 emergency contact printed inside the kit. During emergencies, quick access to numbers saves time.",
      "Never use human painkillers unless your veterinarian has explicitly advised a dose. Many common human medicines are toxic to pets.",
      "Use a muzzle only if needed for safety and only if breathing is normal. Injured pets may bite out of fear, even when they are usually gentle.",
      "First aid is temporary support, not full treatment. Your goal is to stabilize and transport safely, not to complete care at home.",
      "Check kit expiry dates every 2-3 months and replace used items immediately. An outdated kit can fail at the exact moment you need it most.",
      "Include copies of your pet's prescription list, allergies, and recent medical history. Clear records help emergency teams make faster and safer decisions.",
    ],
  },
  {
    slug: "how-often-should-you-groom-your-pet",
    title: "How Often Should You Groom Your Pet? A Practical Timeline",
    excerpt:
      "Different coat types need different grooming frequencies. Use this schedule to avoid matting and skin problems.",
    category: "Grooming",
    readTime: "5 min read",
    publishedAt: "January 16, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Pet being brushed during grooming session",
    author: {
      name: "Dr. Simran Kapur",
      role: "Dermatology Focus Vet",
    },
    content: [
      "Short-coated dogs usually need weekly brushing, while long-coated breeds may need brushing every day to prevent painful tangles.",
      "Cats also benefit from brushing, especially long-haired breeds and senior cats that groom less effectively on their own.",
      "Bathing frequency depends on coat, lifestyle, and skin condition. Over-bathing can strip natural oils and worsen itch in sensitive pets.",
      "Regular nail trims improve gait and reduce joint strain. Most pets need trimming every 3-5 weeks, but activity levels can change this.",
      "If you notice odor, dandruff, bald patches, or repeated ear scratching, move from routine grooming to a veterinary skin evaluation.",
      "Use species-safe grooming products and avoid heavily fragranced shampoos. Irritation from harsh products is a common cause of post-groom itch.",
      "Keep grooming sessions short and reward-based, especially for anxious pets. Positive repetition reduces resistance and makes long-term coat care easier.",
    ],
  },
  {
    slug: "vaccination-checklist-for-indoor-pets",
    title: "Do Indoor Pets Need Vaccines? Yes, and Here Is Why",
    excerpt:
      "Indoor pets still face infection risks through visitors, surfaces, and occasional outdoor exposure.",
    category: "Preventive Care",
    readTime: "6 min read",
    publishedAt: "February 24, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Cat at a veterinary consultation",
    author: {
      name: "Dr. Vikram Sethi",
      role: "Preventive Medicine Vet",
    },
    content: [
      "Indoor does not mean zero risk. Viruses and bacteria can enter homes through shoes, clothes, carriers, and new pets.",
      "Core vaccines protect against serious diseases with high transmission or severe outcomes. Your vet will set timing by age and prior records.",
      "Puppies and kittens require booster series because maternal antibodies can interfere with early doses. Timely boosters are essential for reliable immunity.",
      "Adults need periodic boosters and routine health checks to maintain protection. Missing reminders creates avoidable immunity gaps.",
      "Vaccination plans should be personalized. Travel patterns, boarding history, and neighborhood disease trends all affect final recommendations.",
      "Even strictly indoor pets may need boosters before grooming, daycare, or boarding stays. Many facilities require up-to-date vaccine records for safety.",
      "Ask your clinic for a yearly preventive calendar that includes vaccines, deworming, and parasite control. A single schedule improves compliance and reduces missed care.",
    ],
  },
]

export const getBlogBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug)
