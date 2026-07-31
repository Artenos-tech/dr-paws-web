"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Bone,
  CalendarCheck,
  CheckCircle2,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react"

import ContactInfoModal from "@/components/ui/ContactInfoModal"
import CustomButton from "@/components/ui/CustomButton"
import DescriptionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png"

const includedItems = [
  "Comprehensive Veterinary Nutrition Consultation",
  "Body Condition Score (BCS) Assessment",
  "Muscle Condition Score (MCS) Assessment",
  "Personalized Nutrition Assessment",
  "Individual Calorie Calculations",
  "Customized Diet Plan",
  "Homemade Recipe Formulation (where appropriate)",
  "Kibble Recommendations",
  "Supplement Recommendations (if required)",
  "Diet Transition Guidance",
  "Two Follow-Up Consultations",
]

const suitableFor = [
  "Puppies & Kittens",
  "Healthy Adult Dogs & Cats",
  "Senior Pets",
  "Overweight Pets",
  "Underweight Pets",
  "Homemade Diet Formulation",
  "Breed-Specific Nutrition",
  "Performance & Working Dogs",
  "Medical Nutrition Support",
]

const medicalConditions = [
  "Kidney Disease",
  "Liver Disease",
  "Diabetes",
  "Pancreatitis",
  "Food Allergies",
  "Skin Conditions",
  "Gastrointestinal Disorders",
  "Cancer",
  "Orthopedic Conditions",
  "Recovery After Surgery",
]

const whyChooseUs = [
  {
    icon: Sparkles,
    title: "Personalized for Every Pet",
    description:
      "Every nutrition plan is customized according to your pet's age, breed, body condition, lifestyle, and health needs.",
  },
  {
    icon: Stethoscope,
    title: "Veterinary Expertise",
    description:
      "Your consultation is conducted by a licensed Veterinarian with specialized expertise in veterinary nutrition.",
  },
  {
    icon: ScrollText,
    title: "Evidence-Based Recommendations",
    description:
      "Our recommendations are based on current veterinary nutritional guidelines and are never influenced by food brands.",
  },
  {
    icon: Bone,
    title: "Practical & Sustainable",
    description:
      "We create realistic nutrition plans using commercial diets, homemade recipes, or a combination of both, tailored to your pet and your lifestyle.",
  },
  {
    icon: CalendarCheck,
    title: "Continued Support",
    description:
      "Your consultation includes follow-up sessions to monitor progress and make adjustments whenever needed.",
  },
]

const NutritionConsultPage = () => {
  const [isContactModalOpen, setContactIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col w-full items-center font-roca pb-20">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        {/* Hero */}
        <div className="w-full flex flex-col lg:gap-8 xl:gap-0 lg:flex-row items-center justify-between xl:space-x-14 xl:items-center space-y-8 xl:space-y-0 mt-[20px] lg:mt-[40px] xl:mt-[80px]">
          <div className="w-full">
            <Image
              src={DescriptionImage}
              alt="Pet nutrition consultation at Dr. Paws"
              className="w-full rounded-md"
            />
          </div>
          <div className="w-full text-center lg:text-left text-primary-1 md:my-4 lg:my-0 mt-4">
            <span className="inline-flex rounded-full border border-secondary-1 bg-primary-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-1">
              Nutrition Consultation
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-5xl mt-3">
              Dr. Paws Personalized Nutrition Program
            </h1>
            <p className="text-sm md:text-base font-semibold mt-2">
              Give Your Pet the Nutrition They Need to Thrive
            </p>
            <p className="text-xs md:text-sm xl:text-base xl:w-3/4 my-3 md:my-5">
              Every pet has unique nutritional needs based on their age,
              breed, lifestyle, body condition, and medical history. At Dr.
              Paws, our Personalized Nutrition Program provides dietary
              recommendations tailored specifically to your pet&apos;s
              individual needs.
            </p>
            <p className="text-xs md:text-sm xl:text-base xl:w-3/4 my-3 md:my-5">
              Whether your pet needs help with weight management, managing a
              chronic health condition, improving overall wellbeing, or
              transitioning to a balanced homemade diet, we create
              personalized nutrition plans designed to support their health
              at every stage of life.
            </p>
            <CustomButton
              buttonText="Book a Nutrition Consultation"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={() => setContactIsModalOpen(true)}
            />
          </div>
        </div>

        {/* What's included */}
        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl text-primary-1 text-center">
            Every Dr. Paws Personalized Nutrition Consultation Includes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {includedItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-primary-3 bg-primary-3 p-4 text-primary-1"
              >
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-secondary-1"
                  size={20}
                />
                <span className="text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who it's for */}
        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl text-primary-1 text-center">
            Is This Consultation Right for Your Pet?
          </h2>
          <p className="text-xs md:text-sm xl:text-base text-primary-1 text-center max-w-3xl">
            Our Personalized Nutrition Program is suitable for:
          </p>
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {suitableFor.map((item) => (
              <span
                key={item}
                className="rounded-full border border-primary-1 px-4 py-2 text-xs md:text-sm text-primary-1"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="text-xs md:text-sm xl:text-base text-primary-1 text-center max-w-3xl mt-4">
            We also provide nutritional management for pets with:
          </p>
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {medicalConditions.map((item) => (
              <span
                key={item}
                className="rounded-full bg-secondary-2 px-4 py-2 text-xs md:text-sm text-white"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Why choose us */}
        <div className="w-full flex flex-col items-center gap-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl text-primary-1 text-center">
            Why Choose Dr. Paws?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {whyChooseUs.map((reason) => {
              const ReasonIcon = reason.icon
              return (
                <div
                  key={reason.title}
                  className="flex flex-col gap-3 rounded-xl border border-primary-3 p-5 text-primary-1"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-2 text-secondary-1">
                    <ReasonIcon size={20} />
                  </span>
                  <h3 className="text-base md:text-lg font-semibold">
                    {reason.title}
                  </h3>
                  <p className="text-xs md:text-sm">{reason.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="w-[75%] flex flex-col items-center gap-4 md:gap-6">
          <ShieldCheck className="text-secondary-1" size={28} />
          <p className="text-center text-primary-1 text-sm font-sans italic font-semibold">
            Let us help your pet live a healthier, happier life with a
            nutrition plan tailored just for them.
          </p>
          <CustomButton
            buttonText="Book a Nutrition Consultation"
            buttonBackground="bg-secondary-2"
            buttonClickEvent={() => setContactIsModalOpen(true)}
          />
        </div>
      </main>

      <ContactInfoModal
        isOpen={isContactModalOpen}
        onRequestClose={() => setContactIsModalOpen(false)}
      />
    </div>
  )
}

export default NutritionConsultPage
