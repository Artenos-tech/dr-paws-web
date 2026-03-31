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
  imageUrl?: string
  imageAlt?: string
}

export interface BlogParagraphBlock {
  type: "paragraph"
  text: string
  emphasis?: "italic" | "strong"
}

export interface BlogListBlock {
  type: "list"
  items: string[]
}

export type BlogContentBlock = BlogParagraphBlock | BlogListBlock

export interface BlogSection {
  heading?: string
  variant?: "default" | "insight"
  blocks: BlogContentBlock[]
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
  vetInsight?: string[]
  sections?: BlogSection[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "home-cooked-vs-packaged-food-for-dogs",
    title:
      "Home-Cooked vs Packaged Food for Dogs: A Thoughtful Guide for Urban Indian Pet Parents by an Indian Vet",
    excerpt:
      "A practical guide to choosing between home-cooked, commercial, and hybrid diets for dogs in urban Indian homes.",
    category: "Nutrition",
    readTime: "8 min read",
    publishedAt: "February 23, 2026",
    imageUrl: "/assets/images/blogs/DogWithMeal.jpg",
    imageAlt: "Dog looking at a meal bowl",
    author: {
      name: "Dr. Souljai Jayakumar Sindhu",
      role: "Head Vet - Dr. Paws, Indiranagar",
      imageUrl: "/assets/images/blogVets/DrSouljai.jpg",
      imageAlt: "Portrait of Dr. Souljai Jayakumar Sindhu",
    },
    content: [],
    sections: [
      {
        blocks: [
          {
            type: "paragraph",
            text: "In many urban Indian homes today, a quiet but important conversation happens almost daily — right around mealtime.",
          },
          {
            type: "paragraph",
            text: "A pet parent stands in the kitchen wondering: “Should I cook fresh food for my dog, or is packaged food actually better?”",
          },
          {
            type: "paragraph",
            text: "It often comes from a place of love. Home-cooked food feels natural, familiar, and deeply personal. After all, if we eat fresh meals, shouldn’t our pets too?",
          },
          {
            type: "paragraph",
            text: "At Dr. Paws, we meet thoughtful pet parents every day who are trying to make the best possible nutrition choices — especially for indie dogs, adopted pets, and dogs living in apartments with relatively sedentary lifestyles. And the truth is, this is not a question with a one-size-fits-all answer.",
          },
          {
            type: "paragraph",
            text: "Instead, it is about balance, awareness, and understanding what your dog truly needs over time.",
          },
        ],
      },
      {
        heading: "Why This Question Matters More in Urban India",
        blocks: [
          {
            type: "paragraph",
            text: "Urban pet parenting in India is unique. Many dogs live indoors, have limited outdoor exercise compared to their rural counterparts, and are often fed a mix of home food and commercial diets. Additionally, a large number of families adopt indie dogs, who are often assumed to be “low-maintenance” when it comes to diet.",
          },
          {
            type: "paragraph",
            text: "But nutritional needs do not reduce simply because a dog is resilient or adapted to Indian conditions.",
          },
          {
            type: "paragraph",
            text: "We often see well-loved pets being fed meals like rice and chicken, roti and milk, or curd and vegetables — all of which sound wholesome, but may not be nutritionally complete when fed as a long-term primary diet.",
          },
          {
            type: "paragraph",
            text: "Over time, even small imbalances can quietly affect coat quality, immunity, joint strength, and digestion.",
          },
        ],
      },
      {
        heading:
          "Understanding Home-Cooked Diets: The Emotional Comfort vs Nutritional Reality",
        blocks: [
          {
            type: "paragraph",
            text: "There is something deeply reassuring about preparing fresh meals for a pet. It feels intentional and nurturing. And in some situations, home-cooked diets can be very beneficial — especially for dogs with allergies, digestive sensitivities, or specific medical conditions.",
          },
          {
            type: "paragraph",
            text: "However, the challenge is not freshness. It is nutritional completeness.",
          },
          {
            type: "paragraph",
            text: "Dogs require a precise balance of:",
          },
          {
            type: "list",
            items: [
              "Protein",
              "Calcium and phosphorus",
              "Essential fatty acids",
              "Vitamins and trace minerals",
            ],
          },
          {
            type: "paragraph",
            text: "A simple meal of chicken and rice, while easy to digest, is severely deficient in calcium and several micronutrients if fed daily without supplementation.",
          },
          {
            type: "paragraph",
            text: "In urban clinical practice, we sometimes see young dogs — including indie dogs — presenting with dull coats, low energy, or even early joint weakness, not because they were poorly cared for, but because their diet, though lovingly prepared, lacked essential balance over months.",
          },
        ],
      },
      {
        heading:
          "Packaged (Commercial) Food: Misunderstood but Scientifically Formulated",
        blocks: [
          {
            type: "paragraph",
            text: "Commercial pet food often gets perceived as “processed” or “less natural,” which can make pet parents hesitant. But high-quality packaged food is designed after extensive nutritional research to meet a dog’s complete dietary requirements.",
          },
          {
            type: "paragraph",
            text: "This is especially helpful for:",
          },
          {
            type: "list",
            items: [
              "Working professionals with busy schedules",
              "First-time pet parents",
              "Puppies in their growth phase",
              "Apartment dogs with predictable routines",
            ],
          },
          {
            type: "paragraph",
            text: "For urban households, consistency in nutrition plays a crucial role. Unlike home diets that may vary daily, scientifically formulated food ensures stable nutrient intake, which supports long-term organ health, immunity, and development.",
          },
          {
            type: "paragraph",
            text: "That said, quality matters greatly. Not all packaged foods are equal, and selecting the right one should ideally be guided by a veterinarian, considering breed, age, activity level, and health status.",
          },
        ],
      },
      {
        heading: "What About Indie Dogs? Do They Need Special Diets?",
        blocks: [
          {
            type: "paragraph",
            text: "One common misconception we gently address is: “Indie dogs can eat anything.”",
          },
          {
            type: "paragraph",
            text: "While indie dogs are generally more adaptable and resilient, their nutritional requirements remain just as important as any pedigree breed. In fact, many adopted indie dogs come from uncertain early nutritional backgrounds, making balanced feeding even more crucial during their transition into urban homes.",
          },
          {
            type: "paragraph",
            text: "We have observed that indie dogs thrive exceptionally well on balanced diets — whether commercial, home-cooked (properly formulated), or a hybrid approach. Their digestion is often robust, but long-term deficiencies can still develop silently if nutrition is not complete.",
          },
          {
            type: "paragraph",
            text: "Resilience should never be mistaken for nutritional immunity.",
          },
        ],
      },
      {
        heading: "Vet’s Insight",
        variant: "insight",
        blocks: [
          {
            type: "paragraph",
            text: "“Not long ago, we met a middle-aged indie-mix, Simba, living in an apartment with a very devoted family. His meals were entirely home-cooked — fresh chicken, rice, and vegetables prepared twice a day with great care.",
            emphasis: "italic",
          },
          {
            type: "paragraph",
            text: "On the surface, everything seemed right. He was loved, well-groomed, and fed on time. But over the past year, his coat had grown dull, his energy had dipped slightly, and he had begun experiencing occasional digestive upset.",
            emphasis: "italic",
          },
          {
            type: "paragraph",
            text: "His family had already tried addressing each concern separately — adding fish oil for the coat, probiotics for digestion, and calcium tablets for bone support. The routine became complicated. Meals felt stressful rather than comforting.",
            emphasis: "italic",
          },
          {
            type: "paragraph",
            text: "Instead of adding more supplements, we stepped back and reviewed the overall diet. The issue wasn’t lack of effort. It was a lack of nutritional balance across the whole meal.",
            emphasis: "italic",
          },
          {
            type: "paragraph",
            text: "We gradually moved Simba onto a more structured, balanced feeding plan — keeping some fresh components the family enjoyed preparing, but building them around a nutritionally complete base.",
            emphasis: "italic",
          },
          {
            type: "paragraph",
            text: "Within a few weeks, his appetite stabilized. His coat texture improved. His energy during walks picked up again. Nothing dramatic — just a steady return to vitality.”",
            emphasis: "italic",
          },
          {
            type: "paragraph",
            text: "For many urban pet families, this is the shift that makes the biggest difference:",
          },
          {
            type: "paragraph",
            text: "from trying to fix individual symptoms… to strengthening the nutritional foundation itself.",
            emphasis: "strong",
          },
          {
            type: "paragraph",
            text: "When the foundation becomes balanced, many small concerns begin to resolve quietly on their own.",
          },
        ],
      },
      {
        heading: "The Hybrid Approach: What Works Best for Many Urban Families",
        blocks: [
          {
            type: "paragraph",
            text: "In our experience with urban Indian pet parents, a thoughtfully planned combination approach often works beautifully.",
          },
          {
            type: "paragraph",
            text: "For example:",
          },
          {
            type: "list",
            items: [
              "A base of high-quality commercial food for nutritional balance",
              "Supplemented with vet-approved fresh additions like boiled vegetables, eggs, or lean meats",
            ],
          },
          {
            type: "paragraph",
            text: "This approach offers both emotional satisfaction for pet parents and nutritional stability for the dog.",
          },
          {
            type: "paragraph",
            text: "It also accommodates real-life routines — something especially important in busy city households where consistency can otherwise become challenging.",
          },
        ],
      },
      {
        heading: "Subtle Signs the Diet May Not Be Working",
        blocks: [
          {
            type: "paragraph",
            text: "Diet-related concerns rarely appear dramatically. Instead, they show up gradually in ways that are easy to overlook.",
          },
          {
            type: "paragraph",
            text: "Some gentle indicators include:",
          },
          {
            type: "list",
            items: [
              "Persistent mild shedding beyond seasonal norms",
              "Low enthusiasm during mealtimes",
              "Recurrent digestive upset",
              "Dry skin or dull coat",
              "Slow growth in puppies",
            ],
          },
          {
            type: "paragraph",
            text: "These signs do not always mean the food is “bad,” but they may suggest that the diet is not fully aligned with the pet’s physiological needs.",
          },
        ],
      },
      {
        heading: "A Quiet Clinical Insight from Everyday Practice",
        blocks: [
          {
            type: "paragraph",
            text: "Over the years, we have met many devoted pet parents who switched entirely to home-cooked diets with the best intentions. Months later, their pets presented with subtle issues like calcium deficiency, weight imbalance, or weakened immunity.",
          },
          {
            type: "paragraph",
            text: "Interestingly, once the diet was nutritionally corrected — not necessarily abandoned, but properly balanced — the improvement in energy, coat health, and overall vitality was often noticeable within weeks.",
          },
          {
            type: "paragraph",
            text: "This reinforces an important truth: It is not about choosing sides between home-cooked and packaged food. It is about nutritional adequacy over time.",
          },
        ],
      },
      {
        heading: "Making a Thoughtful Choice for Your Dog",
        blocks: [
          {
            type: "paragraph",
            text: "Every dog is different. A growing Labrador puppy in an apartment, a senior Shih Tzu, and an adopted indie dog will all have very different nutritional needs, even within the same household environment.",
          },
          {
            type: "paragraph",
            text: "Rather than asking, “Which is better?” A more helpful question is: “What is balanced, sustainable, and appropriate for my dog’s lifestyle and health stage?”",
          },
          {
            type: "paragraph",
            text: "When diet decisions are made with long-term health in mind — instead of trends or guilt — pets tend to thrive quietly and consistently.",
          },
          {
            type: "paragraph",
            text: "And in the end, that quiet, sustained wellbeing is what truly reflects good nutrition.",
          },
        ],
      },
    ],
  },
]

export const getBlogBySlug = (slug: string) =>
  blogPosts.find((post) => post.slug === slug)
