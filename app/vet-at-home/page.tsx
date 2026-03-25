"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  ChevronDown,
  CalendarClock,
  ClipboardList,
  HeartPulse,
  MapPin,
  PawPrint,
  PhoneCall,
  Star,
  Stethoscope,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import toast from "react-hot-toast"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const vetAtHomePhoneNumber = "9740141212"

const loveAtHomeReasons = [
  {
    title: "Transporting Pets Isn’t Always Easy",
    description:
      "Many pet parents struggle to find pet-friendly transport, especially for large dogs or anxious pets. Our vets come to you instead.",
  },
  {
    title: "Clinics Can Be Stressful for Pets",
    description:
      "New smells, unfamiliar animals, and waiting rooms can cause anxiety. Home visits allow pets to stay calm in familiar surroundings.",
  },
  {
    title: "Senior Pets May Struggle to Travel",
    description:
      "Older pets or pets recovering from illness often find travel uncomfortable. At-home care allows them to receive medical attention without leaving home.",
  },
  {
    title: "Busy Schedules Make Clinic Visits Hard",
    description:
      "Between work, traffic, and daily life, finding time for clinic visits can be difficult. At-home appointments make veterinary care more convenient.",
  },
]

const servicesAvailableAtHome = [
  {
    icon: Stethoscope,
    title: "General Vet Consults",
    subtitle:
      "If your pet seems unwell or simply due for a health check, our veterinarians can examine them in the comfort of your home.",
    points: [
      "Perform a full physical examination",
      "Evaluate symptoms such as vomiting, skin issues, or lethargy",
      "Provide prescriptions and treatment plans",
      "Guide you on diet, behaviour, and preventive care",
    ],
    note: "If additional diagnostics are needed, our team will guide you on the next steps.",
  },
  {
    icon: ClipboardList,
    title: "Vaccinations & Deworming",
    subtitle: "Routine preventive care can be safely done at home.",
    points: [
      "Core and non-core vaccinations",
      "Puppy and kitten vaccine schedules",
      "Deworming treatments",
      "Parasite prevention guidance",
    ],
    note: "Our vets will also maintain your pet’s vaccination records and reminders.",
  },
  {
    icon: CalendarClock,
    title: "Diagnostic Tests",
    subtitle: "Many diagnostic tests can be initiated at home.",
    points: [
      "Blood tests",
      "Urine tests",
      "Skin scrapings",
      "Other lab samples",
    ],
    note: "These samples are processed through our in-house labs and diagnostic partners (if applicable) and results are shared digitally.",
    extraNote:
      "Imaging procedures such as X-rays and ultrasounds require clinic visits.",
  },
  {
    icon: HeartPulse,
    title: "Chronic Illness & Post-Surgery Care",
    subtitle: "Some conditions require consistent follow-up care.",
    points: [
      "CKD",
      "FIP",
      "Long-term medical conditions",
      "Fluid therapy",
      "Injections",
      "Medication administration",
      "Wound care",
      "Post-surgery recovery monitoring",
    ],
    note: "Our vets can provide ongoing medical support for pets with chronic illnesses and recovery needs.",
  },
  {
    icon: PawPrint,
    title: "Senior Pet Care",
    subtitle:
      "As pets age, they often require more frequent monitoring and support.",
    points: [
      "Routine health checks",
      "Diagnostic testing",
      "Pain management",
      "Injections and medications",
      "Laser therapy",
      "Mobility and comfort assessments",
    ],
    note: "Our at-home care helps senior pets stay comfortable for longer.",
  },
  {
    icon: MapPin,
    title: "Travel Requirements & Certificates",
    subtitle: "Preparing pets for travel can involve several steps.",
    points: [
      "Fit-to-travel examinations",
      "Vaccination verification",
      "Required diagnostic tests",
      "Microchipping",
    ],
    note: "Completing these steps at home makes travel preparation significantly easier.",
  },
]

const ambulanceImage = {
  image: "/assets/images/ambulance.png",
  alt: "White ambulance parked near a sidewalk",
}

const atHomeDoctors = [
  {
    name: "Dr. Anchima Manohar",
    qualification: "BVSc & AH",
    experience: "8+ years of experience",
    bio: "Specializes in preventive care and internal medicine, with a focus on calm and low-stress home consultations for pets.",
  },
  {
    name: "Dr. Abhiram S.",
    qualification: "BVSc & AH, MVSc",
    experience: "7+ years of experience",
    bio: "Experienced in vaccination planning, diagnostics, and long-term treatment support for pets requiring regular medical follow-up.",
  },
  {
    name: "Dr. Jonin Singh Laishangbam",
    qualification: "BVSc & AH",
    experience: "6+ years of experience",
    bio: "Provides compassionate home-visit care with strong expertise in senior pet monitoring, recovery support, and chronic care management.",
  },
]

const testimonials = [
  {
    reviewer: "Priya N.",
    rating: 5,
    review:
      "Booked a home visit for my senior dog and the doctor was extremely patient and thorough. The whole process was smooth and stress-free.",
  },
  {
    reviewer: "Rahul K.",
    rating: 5,
    review:
      "Very professional team. They explained everything clearly, handled our cat gently, and shared a clear treatment plan after the visit.",
  },
  {
    reviewer: "Sneha M.",
    rating: 5,
    review:
      "Excellent experience with Dr. Paws at-home service. On-time arrival, great communication, and genuine care for my pet.",
  },
  {
    reviewer: "Arjun S.",
    rating: 5,
    review:
      "From booking to consultation, everything was easy. The vet answered all our questions and even gave practical diet guidance.",
  },
  {
    reviewer: "Neha R.",
    rating: 5,
    review:
      "The home visit made a huge difference for our anxious pup. Calm, efficient, and very caring team. Highly recommended.",
  },
]

const getFaqs = (emergencyPhone: string) => [
  {
    question: "How do I book an at-home vet appointment?",
    answer: `You can book directly through our website or app. Alternatively, call or WhatsApp our Vet-At-Home helpline at ${emergencyPhone} between 10 AM and 7 PM.`,
  },
  {
    question: "What services can be done during a home visit?",
    answer:
      "Our vets provide general consultations and key services including vaccinations, deworming, diagnostic tests, microchipping, and travel certificates. Certain medical treatments such as IV fluid therapy, injections, and laser therapy can also be performed during home visits.",
  },
  {
    question: "Do you provide grooming services at home?",
    answer:
      "We do not provide full grooming services such as bathing or haircuts. However, basic hygiene procedures such as ear cleaning and nail clipping may be performed during a medical visit if required.",
  },
  {
    question: "Can you treat community pets?",
    answer:
      "Yes. To ensure the safety of the animal and our team, we request that community pets be kept restrained in an indoor, secure, well-lit area before the vet arrives.",
  },
  {
    question: "Can I cancel or reschedule an appointment?",
    answer:
      "Appointments can be rescheduled up to 3 hours before the scheduled visit at no charge. Cancellations within 24 hours of the appointment are not permitted since the veterinarian's time slot is reserved exclusively for your visit.",
  },
  {
    question: "What if my pet needs further treatment?",
    answer:
      "If additional care is required, our team will guide you to the next steps. You can contact our Vet-At-Home helpline (10 AM - 7 PM) for support, or visit one of our Dr. Paws clinics across Bangalore.",
  },
]

export default function VetAtHomePage() {
  const [expandedServices, setExpandedServices] = useState<number[]>([])
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [pincodeInput, setPincodeInput] = useState("")
  const [pincodeStatus, setPincodeStatus] = useState<
    "idle" | "serviceable" | "notServiceable" | "invalid" | "error"
  >("idle")
  const { call: getServiceablePincodes, loading: isCheckingPincode } =
    useAPICall(atHomeApiClient.getServiceablePincodes)
  const {
    call: getHomeVisitFeatureFlag,
    loading: isCheckingHomeVisitFeatureFlag,
    result: homeVisitFeatureFlagResult,
  } = useAPICall(atHomeApiClient.getHomeVisitFeatureFlag)

  const {
    call: getEmergencyContact,
    loading: isCheckingEmergencyContact,
    result: emergencyContactResult,
  } = useAPICall(atHomeApiClient.getEmergencyContact)

  const emergencyContactNumber =
    emergencyContactResult?.ok &&
    emergencyContactResult.value.body.emergencyPhone
      ? `+91 ${emergencyContactResult.value.body.emergencyPhone}`
      : `+91 ${vetAtHomePhoneNumber}`
  const emergencyWhatsAppNumber = emergencyContactNumber.replace(/\D/g, "")

  const whatsappBookingLink = `https://wa.me/${emergencyWhatsAppNumber}?text=Hello%2C%20I%27d%20like%20to%20book%20a%20Vet-At-Home%20appointment.`

  const faqs = useMemo(
    () => getFaqs(emergencyContactNumber),
    [emergencyContactNumber],
  )

  useEffect(() => {
    const fetchHomeVisitFeatureFlag = async () => {
      await getHomeVisitFeatureFlag({ platform: "web" })
    }
    const fetchEmergencyContact = async () => {
      await getEmergencyContact({})
    }
    fetchHomeVisitFeatureFlag()
    fetchEmergencyContact()
  }, [])

  const toggleServiceCard = (index: number) => {
    setExpandedServices((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    )
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index))
  }

  const handlePincodeInput = (value: string) => {
    const normalizedValue = value.replace(/\D/g, "").slice(0, 6)
    setPincodeInput(normalizedValue)
    if (pincodeStatus !== "idle") {
      setPincodeStatus("idle")
    }
  }

  const handleCheckAvailability = async () => {
    if (pincodeInput.length !== 6) {
      setPincodeStatus("invalid")
      return
    }

    const serviceablePincodesResult = await getServiceablePincodes({})
    if (!serviceablePincodesResult?.ok) {
      setPincodeStatus("error")
      return
    }

    const isServiceable = serviceablePincodesResult.value.body.data.pincodes
      .map((pincode) => pincode.trim())
      .includes(pincodeInput)

    setPincodeStatus(isServiceable ? "serviceable" : "notServiceable")
  }

  const handleCopyVetAtHomeNumber = async () => {
    try {
      await navigator.clipboard.writeText(emergencyContactNumber)
      toast.success("Phone number was copied to clipboard")
    } catch {
      toast.error("Unable to copy phone number")
    } finally {
      setIsAmbulanceModalOpen(false)
    }
  }

  const isHomeVisitEnabled =
    homeVisitFeatureFlagResult?.ok &&
    homeVisitFeatureFlagResult.value.body.enableHomeVisits

  return (
    <main className="w-full pb-20 md:pb-0">
      {(isCheckingHomeVisitFeatureFlag || isHomeVisitEnabled) && (
        <div className="fixed right-6 top-24 z-40 hidden md:block">
          {isCheckingHomeVisitFeatureFlag ? (
            <div className="animate-pulse h-9 w-40 rounded-full bg-secondary-1/40" />
          ) : (
            <Link
              href="/user/book-appointment?home=true"
              className="font-open-sans btn rounded-full bg-secondary-1 px-6 py-2 text-sm tracking-wide text-white shadow-[0_10px_24px_rgba(51,73,95,0.2)]"
            >
              Book At-Home Visit
            </Link>
          )}
        </div>
      )}

      <section className="relative h-screen overflow-hidden bg-[#f8f1e5]">
        <div className="absolute inset-0 lg:hidden">
          <img
            src="/assets/images/VAH_Pic1.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-[0.08]"
          />
        </div>

        <div className="absolute inset-y-0 right-0 hidden w-[65%] overflow-hidden lg:block">
          <img
            src="/assets/images/VAH_Pic1.png"
            alt="Veterinarian examining a black dog at home"
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-[linear-gradient(90deg,#f8f1e5_0%,rgba(248,241,229,0.86)_48%,rgba(248,241,229,0)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 -left-16 w-32 bg-[linear-gradient(90deg,#f8f1e5_0%,rgba(248,241,229,0.94)_38%,rgba(248,241,229,0)_100%)] blur-2xl" />
        </div>

        <div className="relative z-10 flex h-full">
          <div className="flex h-full w-full items-center lg:w-[35%]">
            <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24">
              <div className="max-w-[560px]">
                <img
                  src="/assets/images/VAHByDrPaws.png"
                  alt="Vet at Home by Dr. Paws"
                  className="mb-6 h-auto w-[clamp(10rem,17vw,15rem)]"
                />

                <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#e8a44a]">
                  Premium At-Home Veterinary Care
                </p>

                <h1 className="mb-6 text-[clamp(2.2rem,4vw,4.4rem)] font-thin leading-[0.98] tracking-[-0.04em] text-primary-1">
                  Dr. Paws Expertise.
                  <br />
                  Now At Your Doorstep.
                </h1>

                <p className="mb-6 max-w-[500px] text-[clamp(1.05rem,1.6vw,1.18rem)] uppercase font-light leading-[1.78] text-primary-1">
                  Skip the travel, avoid the stress,
                  <br />
                  and let your pet receive expert
                  care where they feel most comfortable.
                </p>

                <div className="mb-12 flex flex-col gap-3">
                  {[
                    "Trusted by 17,000+ pet parents",
                    "5.0\u2605 rated veterinary clinics",
                    "Experienced veterinary doctors",
                  ].map((text) => (
                    <div
                      key={text}
                      className="flex items-center gap-[11px] text-[0.9rem] font-semibold uppercase text-primary-1"
                    >
                      <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full border border-[#d6c29d] bg-[#fff5de] text-[#94662e]">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      </span>
                      {text}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-[14px] lg:flex-nowrap lg:items-center lg:gap-3">
                  {isCheckingHomeVisitFeatureFlag && (
                    <div className="h-10 w-48 animate-pulse rounded-full bg-primary-1/10 lg:w-[48%]" />
                  )}
                  {!isCheckingHomeVisitFeatureFlag && isHomeVisitEnabled && (
                    <Link
                      href="/user/book-appointment?home=true"
                      className="font-open-sans btn rounded-full border border-[#efbf73] bg-primary-2 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary-1 shadow-[0_8px_18px_rgba(51,73,95,0.14)] transition-transform hover:translate-y-[-1px] md:px-10 md:text-base lg:flex-none lg:px-7 lg:py-3 lg:text-sm lg:whitespace-nowrap xl:px-8"
                    >
                      Book an At-Home Visit
                    </Link>
                  )}

                  <Link
                    href={`https://wa.me/${emergencyWhatsAppNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-open-sans btn rounded-full border border-[#b0bb96] bg-secondary-2 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(51,73,95,0.12)] transition-transform hover:translate-y-[-1px] md:px-10 md:text-base lg:flex-none lg:px-7 lg:py-3 lg:text-sm lg:whitespace-nowrap xl:px-8"
                  >
                    WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none hidden lg:block lg:w-[65%]" />
        </div>

        <div className="absolute bottom-8 right-8 z-20 hidden flex-col gap-3 lg:flex">
          {[
            { num: "17k+", label: "Happy Pet Parents" },
            { num: "5.0\u2605", label: "Average Rating" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="min-w-40 rounded-[6px] border border-[rgba(148,102,46,0.14)] bg-[rgba(255,255,255,0.82)] px-6 py-[18px] backdrop-blur-md"
            >
              <div className="mb-1 text-[1.85rem] font-bold leading-none text-[#94662e]">
                {num}
              </div>
              <div className="text-[0.72rem] font-normal uppercase tracking-[0.08em] text-primary-1/70">
                {label}
              </div>
            </div>
          ))}
          </div>
      </section>

      <section className="relative overflow-hidden bg-white py-10 md:py-12">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#e1d5bf] bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_100%)] p-6 shadow-[0_10px_24px_rgba(51,73,95,0.08)] md:p-8">
            <h2 className="text-2xl font-bold leading-tight text-primary-1 md:text-4xl">
              Check If We Serve Your Area
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-1/80 md:text-base">
              Enter your pincode to confirm if Vet-At-Home visits are available
              in your neighbourhood.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => handlePincodeInput(e.target.value)}
                placeholder="Enter Pincode"
                className="h-11 w-full rounded-xl border border-[#d9c9ad] bg-white px-4 text-sm text-primary-1 outline-none transition-colors placeholder:text-primary-1/45 focus:border-[#94662e] sm:max-w-[260px]"
              />
              <button
                type="button"
                onClick={handleCheckAvailability}
                className="font-open-sans btn h-11 rounded-xl bg-secondary-1 px-5 text-xs tracking-wide text-white disabled:opacity-60 md:text-sm"
                disabled={isCheckingPincode}
              >
                {isCheckingPincode ? "Checking..." : "Check Availability"}
              </button>
            </div>

            {pincodeStatus === "serviceable" && (
              <div className="mt-4 rounded-xl border border-[#b9dfbf] bg-[#f3fff4] px-4 py-3">
                <p className="text-sm font-semibold text-[#1f7a2e] md:text-base">
                  Great news! We offer Vet-At-Home visits in your area.
                </p>
              </div>
            )}

            {pincodeStatus === "notServiceable" && (
              <div className="mt-4 rounded-xl border border-[#f2d7a8] bg-[#fff9ef] px-4 py-3">
                <p className="text-sm font-semibold text-[#8a5a1f] md:text-base">
                  We&apos;re expanding quickly and may reach your area soon.
                </p>
                <p className="mt-1 text-sm text-[#7a5d2f] md:text-base">
                  In the meantime, visit one of our clinics.
                </p>
              </div>
            )}

            {pincodeStatus === "invalid" && (
              <p className="mt-3 text-sm text-red-600">
                Please enter a valid 6-digit pincode.
              </p>
            )}

            {pincodeStatus === "error" && (
              <p className="mt-3 text-sm text-red-600">
                Unable to check availability right now. Please try again.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f1de_0%,#fcf8ee_45%,#ffffff_100%)] py-16 md:py-20">
        <div className="pointer-events-none absolute -left-16 top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(253,199,118,0.28)_0%,rgba(253,199,118,0)_72%)]" />
        <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(82,129,162,0.2)_0%,rgba(82,129,162,0)_75%)]" />

        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Why Pet Parents Prefer Vet-At-Home
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-primary-1/80 md:text-lg">
              The same Dr. Paws expertise, delivered in a way that’s easier for
              both pets and their families.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
            {loveAtHomeReasons.map((reason, index) => (
              <article
                key={reason.title}
                className="relative overflow-hidden rounded-2xl border border-[#e1d5bf] bg-white p-6 shadow-[0_10px_26px_rgba(51,73,95,0.08)] md:p-7"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#fdc776] via-[#f0c474] to-[#5281a2]" />
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4de] text-sm font-semibold text-[#94662e]">
                    {index + 1}
                  </span>
                  <span className="h-[1px] flex-1 bg-[#efe4cf]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold leading-snug text-primary-1">
                  {reason.title}
                </h3>
                <p className="text-base leading-relaxed text-primary-1/80">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#e6d8c1] bg-white/80 px-5 py-4 text-center shadow-[0_10px_24px_rgba(51,73,95,0.08)] md:mt-12 md:px-6 md:py-5">
            <p className="text-base font-medium leading-relaxed text-primary-1 md:text-lg">
              No matter the reason, your pet receives the same trusted Dr. Paws
              expertise — just at home.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf7_0%,#f7f1de_55%,#fffaf0_100%)] py-16 md:py-20">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Our Veterinary Services Available At Home
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 items-start gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
            {servicesAvailableAtHome.map((service, index) => {
              const isExpanded = expandedServices.includes(index)
              const ServiceIcon = service.icon

              return (
                <article
                  key={service.title}
                  className="self-start rounded-2xl border border-[#e1d5bf] bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_100%)] p-5 shadow-[0_8px_24px_rgba(51,73,95,0.08)] md:p-6"
                >
                  <div
                    className={`flex flex-col justify-between ${
                      isExpanded ? "min-h-[132px]" : "h-[190px]"
                    }`}
                  >
                    <div className={isExpanded ? "" : "overflow-hidden"}>
                      <div
                        className={`flex items-center gap-2.5 ${
                          isExpanded ? "" : "h-[56px] overflow-hidden"
                        }`}
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff4de] text-[#94662e]">
                          <ServiceIcon size={20} strokeWidth={2.2} />
                        </span>
                        <h3 className="text-xl font-semibold leading-snug text-primary-1">
                          {service.title}
                        </h3>
                      </div>
                      <p
                        className={`mt-2 text-sm leading-relaxed text-primary-1/80 md:text-base ${
                          isExpanded ? "" : "h-[96px] overflow-hidden"
                        }`}
                      >
                        {service.subtitle}
                      </p>
                    </div>

                    {!isExpanded && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleServiceCard(index)}
                          className="text-sm font-semibold text-[#94662e] transition-colors hover:text-[#7f5524]"
                          aria-expanded={isExpanded}
                          aria-controls={`service-card-details-${index}`}
                        >
                          Read more
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    id={`service-card-details-${index}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "mt-4 max-h-[900px] border-t border-[#ece2cf] pt-4 opacity-100"
                        : "mt-0 max-h-0 border-t-0 pt-0 opacity-0"
                    }`}
                  >
                    <div
                      className={`${isExpanded ? "pointer-events-auto" : "pointer-events-none"}`}
                    >
                      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-primary-1/85 md:text-base">
                        {service.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>

                      <p className="mt-4 text-sm leading-relaxed text-primary-1/80 md:text-base">
                        {service.note}
                      </p>

                      {service.extraNote && (
                        <p className="mt-3 text-sm font-medium leading-relaxed text-primary-1 md:text-base">
                          Note: {service.extraNote}
                        </p>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleServiceCard(index)}
                          className="text-sm font-semibold text-[#94662e] transition-colors hover:text-[#7f5524]"
                          aria-expanded={isExpanded}
                          aria-controls={`service-card-details-${index}`}
                        >
                          Read less
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf0_0%,#f7f1de_58%,#fffdf7_100%)] py-16 md:py-24">
        <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(253,199,118,0.22)_0%,rgba(253,199,118,0)_72%)]" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(82,129,162,0.2)_0%,rgba(82,129,162,0)_74%)]" />

        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.13em] text-[#94662e]">
                Ambulance & Transport Service
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
                Need to Visit the Clinic? We Can Help With That Too.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-1/80 md:text-lg">
                If your pet requires imaging, procedures, or specialized care at
                one of our clinics, our Dr. Paws Ambulance Service can safely
                transport both pets and their parents. Our trained team ensures
                pets travel comfortably and securely between home and clinic.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setIsAmbulanceModalOpen(true)}
                  className="font-open-sans btn rounded-full bg-secondary-1 px-5 py-2 text-xs tracking-wider text-white md:px-10 md:text-base"
                >
                  Book Ambulance Pickup
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl border border-[#e1d5bf] bg-white/80 p-3 shadow-[0_16px_36px_rgba(51,73,95,0.16)] md:p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <img
                  src={ambulanceImage.image}
                  alt={ambulanceImage.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={isAmbulanceModalOpen}
        onOpenChange={setIsAmbulanceModalOpen}
      >
        <DialogContent className="overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none sm:max-w-[560px]">
          <div className="relative rounded-2xl border border-[#d9c9ad] bg-[linear-gradient(165deg,#fffdf7_0%,#f7f1de_52%,#fff8ea_100%)] p-6 shadow-[0_24px_48px_rgba(51,73,95,0.22)] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(253,199,118,0.32)_0%,rgba(253,199,118,0)_70%)]" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(82,129,162,0.22)_0%,rgba(82,129,162,0)_75%)]" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#e5d6bd] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#94662e]">
                <PhoneCall size={14} />
                Ambulance Support
              </div>
              <DialogTitle className="mt-4 text-2xl font-bold leading-tight text-primary-1 md:text-3xl">
                Find out if ambulance pickup is available at your location
              </DialogTitle>
              <DialogDescription className="mt-3 text-sm leading-relaxed text-primary-1/80 md:text-base">
                Our team will quickly verify your area coverage and guide you on
                the next steps for safe pet transport.
              </DialogDescription>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleCopyVetAtHomeNumber}
                  disabled={isCheckingEmergencyContact}
                  className="font-open-sans inline-flex items-center justify-center rounded-full border-0 bg-secondary-1 px-6 py-2 text-sm font-semibold tracking-wide text-white outline-none transition-colors hover:bg-[#94662e] focus:outline-none focus-visible:outline-none focus-visible:ring-0 disabled:opacity-60 disabled:cursor-not-allowed md:px-9 md:text-base"
                >
                  {isCheckingEmergencyContact
                    ? "Loading..."
                    : "Call Vet-At-Home"}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Meet the Veterinarians Who Visit Your Home
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 justify-items-center gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {atHomeDoctors.map((doctor) => (
              <article
                key={doctor.name}
                className="w-full max-w-[360px] rounded-xl border border-primary-3 bg-primary-3 p-5 text-center text-primary-1 shadow-md sm:p-6"
              >
                <div className="mx-auto h-1.5 w-16 rounded-full bg-gradient-to-r from-[#fdc776] via-[#f0c474] to-[#5281a2]" />
                <h3 className="mt-5 text-xl">{doctor.name}</h3>
                <p className="mt-3 text-sm sm:text-base">
                  {doctor.qualification}
                </p>
                <p className="mt-2 text-sm sm:text-base">{doctor.experience}</p>
                <p className="mt-4 text-sm leading-relaxed text-primary-1/80 sm:text-base">
                  {doctor.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf7_0%,#f7f1de_55%,#fffaf0_100%)] py-16 md:py-20">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Trusted by Pet Parents Across Bangalore
            </h2>
          </div>

          <Carousel
            opts={{ align: "start", loop: true }}
            className="mx-auto mt-10 max-w-[1180px] px-0 md:px-12"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.reviewer + testimonial.review}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <article className="flex h-full min-h-[250px] flex-col rounded-2xl border border-[#e1d5bf] bg-white p-6 shadow-[0_10px_26px_rgba(51,73,95,0.08)]">
                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${testimonial.reviewer}-${index}`}
                          size={17}
                          className={
                            index < testimonial.rating
                              ? "fill-[#e8a44a] text-[#e8a44a]"
                              : "text-[#d5c5a7]"
                          }
                        />
                      ))}
                    </div>

                    <p className="flex-1 text-sm leading-relaxed text-primary-1/85 md:text-base">
                      &ldquo;{testimonial.review}&rdquo;
                    </p>

                    <p className="mt-5 text-sm font-semibold text-primary-1 md:text-base">
                      {testimonial.reviewer}
                    </p>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 hidden border-[#d9c9ad] bg-white text-primary-1 hover:bg-[#f7f1de] md:inline-flex" />
            <CarouselNext className="right-0 hidden border-[#d9c9ad] bg-white text-primary-1 hover:bg-[#f7f1de] md:inline-flex" />
          </Carousel>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              FAQs
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-3 md:mt-12">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index

              return (
                <article
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-[#e1d5bf] bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_100%)] shadow-[0_8px_22px_rgba(51,73,95,0.08)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left md:px-6 md:py-5"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span className="text-sm font-semibold leading-relaxed text-primary-1 md:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-[#94662e] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={`faq-panel-${index}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] border-t border-[#ece2cf] opacity-100"
                        : "grid-rows-[0fr] border-t-0 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pt-4 text-sm leading-relaxed text-primary-1/80 md:px-6 md:pb-6 md:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf0_0%,#f7f1de_55%,#fffdf7_100%)] py-16 md:py-20">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl rounded-3xl border border-[#e1d5bf] bg-white/85 px-6 py-10 text-center shadow-[0_14px_34px_rgba(51,73,95,0.12)] md:px-10 md:py-14">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Ready to Book a Vet Visit at Home?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-1/80 md:text-lg">
              Give your pet expert veterinary care - without the stress of
              travel.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {isCheckingHomeVisitFeatureFlag && (
                <div className="animate-pulse h-10 w-40 rounded-full bg-secondary-1/40" />
              )}
              {!isCheckingHomeVisitFeatureFlag && isHomeVisitEnabled && (
                <Link
                  href="/user/book-appointment?home=true"
                  className="font-open-sans btn rounded-full bg-secondary-1 px-5 py-2 text-xs tracking-wider text-white md:px-10 md:text-base"
                >
                  Book At-Home Visit
                </Link>
              )}

              <Link
                href={`https://wa.me/${emergencyWhatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-open-sans btn rounded-full border border-[#5281a2] bg-white px-5 py-2 text-xs tracking-wider text-[#5281a2] transition-colors hover:bg-[#5281a2] hover:text-white md:px-10 md:text-base"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 md:py-20">
        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Have Questions? Get in Touch
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
            <article className="rounded-2xl border border-[#e1d5bf] bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_100%)] p-6 text-center shadow-[0_10px_24px_rgba(51,73,95,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94662e] md:text-sm">
                Support Helpline
              </p>
              <p className="mt-3 text-base font-semibold text-primary-1 md:text-xl">
                {emergencyContactNumber}
              </p>
            </article>

            <article className="rounded-2xl border border-[#e1d5bf] bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_100%)] p-6 text-center shadow-[0_10px_24px_rgba(51,73,95,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94662e] md:text-sm">
                Support Hours
              </p>
              <p className="mt-3 text-base font-semibold text-primary-1 md:text-xl">
                10 AM - 7 PM (Mon-Sun)
              </p>
            </article>

            <article className="rounded-2xl border border-[#e1d5bf] bg-[linear-gradient(180deg,#fffef9_0%,#ffffff_100%)] p-6 text-center shadow-[0_10px_24px_rgba(51,73,95,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#94662e] md:text-sm">
                Email
              </p>
              <p className="mt-3 break-all text-base font-semibold text-primary-1 md:text-xl">
                vet-at-home@drpaws.care
              </p>
            </article>
          </div>
        </div>
      </section>

      <Link
        href={whatsappBookingLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_26px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 md:bottom-8 md:right-8"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </Link>
    </main>
  )
}
