"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarClock,
  ClipboardList,
  HeartPulse,
  MapPin,
  PawPrint,
  Star,
  Stethoscope,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function VetAtHomePage() {
  const [expandedServices, setExpandedServices] = useState<number[]>([])
  const [activeAmbulanceSlide, setActiveAmbulanceSlide] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

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

  const ambulanceSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1800&q=80",
      alt: "Pet ambulance parked outside a clinic",
    },
    {
      image:
        "https://images.pexels.com/photos/28123777/pexels-photo-28123777.jpeg?cs=srgb&dl=pexels-mikhail-nilov-28123777.jpg&fm=jpg",
      alt: "Medical team loading equipment at an ambulance",
    },
    {
      image:
        "https://images.pexels.com/photos/17206211/pexels-photo-17206211.jpeg?cs=srgb&dl=pexels-robertkso-17206211.jpg&fm=jpg",
      alt: "Pet transport setup with secure travel crate",
    },
    {
      image:
        "https://images.pexels.com/photos/6519861/pexels-photo-6519861.jpeg?cs=srgb&dl=pexels-rdne-6519861.jpg&fm=jpg",
      alt: "Emergency response team with ambulance",
    },
  ]

  const atHomeDoctors = [
    {
      name: "Dr. Anchima Manohar",
      qualification: "BVSc & AH",
      experience: "8+ years of experience",
      bio: "Specializes in preventive care and internal medicine, with a focus on calm and low-stress home consultations for pets.",
      image: "/assets/images/clinic/doctorFemale.webp",
    },
    {
      name: "Dr. Abhiram S.",
      qualification: "BVSc & AH, MVSc",
      experience: "7+ years of experience",
      bio: "Experienced in vaccination planning, diagnostics, and long-term treatment support for pets requiring regular medical follow-up.",
      image: "/assets/images/clinic/doctorMale.webp",
    },
    {
      name: "Dr. Jonin Singh Laishangbam",
      qualification: "BVSc & AH",
      experience: "6+ years of experience",
      bio: "Provides compassionate home-visit care with strong expertise in senior pet monitoring, recovery support, and chronic care management.",
      image: "/assets/images/clinic/doctorMale.webp",
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

  const faqs = [
    {
      question: "How do I book an at-home vet appointment?",
      answer:
        "You can book directly through our website or app. Alternatively, call or WhatsApp our Vet-At-Home helpline at +91 9740141212 between 10 AM and 7 PM.",
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

  const whatsappBookingLink =
    "https://wa.me/919740141212?text=Hello%2C%20I%27d%20like%20to%20book%20a%20Vet-At-Home%20appointment."

  const toggleServiceCard = (index: number) => {
    setExpandedServices((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    )
  }

  const showPrevAmbulanceSlide = () => {
    setActiveAmbulanceSlide((prev) =>
      prev === 0 ? ambulanceSlides.length - 1 : prev - 1,
    )
  }

  const showNextAmbulanceSlide = () => {
    setActiveAmbulanceSlide((prev) =>
      prev === ambulanceSlides.length - 1 ? 0 : prev + 1,
    )
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index))
  }

  useEffect(() => {
    const autoSlideTimer = window.setInterval(() => {
      setActiveAmbulanceSlide((prev) =>
        prev === ambulanceSlides.length - 1 ? 0 : prev + 1,
      )
    }, 4500)

    return () => {
      window.clearInterval(autoSlideTimer)
    }
  }, [ambulanceSlides.length])

  return (
    <main className="w-full pb-20 md:pb-0">
      {/* <div className="fixed right-6 top-24 z-40 hidden md:block">
        <Link
          href="/user/book-appointment"
          className="font-open-sans btn rounded-full bg-secondary-1 px-6 py-2 text-sm tracking-wide text-white shadow-[0_10px_24px_rgba(51,73,95,0.2)]"
        >
          Book At-Home Visit
        </Link>
      </div> */}

      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1644675272883-0c4d582528d8?auto=format&fit=crop&fm=jpg&q=80&w=2400"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 z-[1] bg-black/40" />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center px-[clamp(2rem,10vw,10rem)] py-[clamp(2rem,5vw,5rem)]">
          <div className="max-w-[580px]">
            {/* Amber accent line */}
            <span className="mb-7 block h-[2px] w-16 bg-gradient-to-r from-[#e8a44a] to-[#f0c474]" />

            {/* Eyebrow */}
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#e8a44a]">
              Premium At-Home Veterinary Care
            </p>

            {/* Headline */}
            <h1 className="mb-7 text-[clamp(2.5rem,5.5vw,4.6rem)] font-black leading-[1.07] tracking-[-0.02em] text-[#faf6f0]">
              Dr. Paws Expertise.
              <br />
              Now At Your <em className="italic text-[#f0c474]">Doorstep.</em>
            </h1>

            {/* Body copy */}
            <p className="mb-9 max-w-[500px] text-[clamp(0.95rem,1.5vw,1.08rem)] font-light leading-[1.78] text-white">
              Professional veterinary care delivered right to your home.
              <br />
              Skip the travel, avoid the stress, and let your pet receive expert
              care where they feel most comfortable.
            </p>

            {/* Trust badges */}
            <div className="mb-12 flex flex-col gap-3">
              {[
                "Trusted by 17,000+ pet parents",
                "5.0\u2605 rated veterinary clinics",
                "Experienced veterinary doctors",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-[11px] text-[0.88rem] font-normal text-white"
                >
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(232,164,74,0.55)] bg-[rgba(232,164,74,0.2)] text-[#e8a44a]">
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

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-[14px]">
              <Link
                href="/user/book-appointment"
                className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-secondary-1"
              >
                Book an At-Home Visit
              </Link>

              <Link
                href="https://wa.me/919606994627"
                target="_blank"
                rel="noopener noreferrer"
                className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base border border-white bg-transparent hover:bg-white/10"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="absolute bottom-[clamp(3rem,8vh,5rem)] right-[clamp(2rem,6vw,6rem)] z-10 hidden flex-col gap-3 min-[769px]:flex">
          {[
            { num: "17k+", label: "Happy Pet Parents" },
            { num: "5.0\u2605", label: "Average Rating" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="min-w-40 rounded-[6px] border border-[rgba(232,164,74,0.25)] bg-[rgba(10,7,5,0.45)] px-6 py-[18px]"
            >
              <div className="mb-1 text-[1.85rem] font-bold leading-none text-[#f0c474]">
                {num}
              </div>
              <div className="text-[0.72rem] font-normal uppercase tracking-[0.08em] text-[rgba(250,246,240,0.7)]">
                {label}
              </div>
            </div>
          ))}
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
                className="group relative overflow-hidden rounded-2xl border border-[#e1d5bf] bg-white p-6 shadow-[0_10px_26px_rgba(51,73,95,0.08)] transition-all duration-250 hover:-translate-y-0.5 hover:border-[#c9baa0] hover:shadow-[0_16px_34px_rgba(51,73,95,0.14)] md:p-7"
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
                <Link
                  href="/user/book-appointment"
                  className="font-open-sans btn rounded-full bg-secondary-1 px-5 py-2 text-xs tracking-wider text-white md:px-10 md:text-base"
                >
                  Book Ambulance Pickup
                </Link>
              </div>
            </div>

            <div className="relative rounded-3xl border border-[#e1d5bf] bg-white/80 p-3 shadow-[0_16px_36px_rgba(51,73,95,0.16)] md:p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                {ambulanceSlides.map((slide, index) => (
                  <figure
                    key={slide.image}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      index === activeAmbulanceSlide
                        ? "z-10 scale-100 opacity-100"
                        : "z-0 scale-[1.03] opacity-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                  </figure>
                ))}

                <button
                  type="button"
                  onClick={showPrevAmbulanceSlide}
                  className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:h-11 md:w-11"
                  aria-label="Show previous ambulance image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={showNextAmbulanceSlide}
                  className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50 md:h-11 md:w-11"
                  aria-label="Show next ambulance image"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                  {ambulanceSlides.map((slide, index) => (
                    <button
                      key={slide.image}
                      type="button"
                      onClick={() => setActiveAmbulanceSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeAmbulanceSlide
                          ? "w-6 bg-white"
                          : "w-2.5 bg-white/55 hover:bg-white/80"
                      }`}
                      aria-label={`Go to ambulance image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="mx-auto h-[120px] w-[120px] rounded-full object-cover"
                />
                <h3 className="mt-4 text-xl">{doctor.name}</h3>
                <p className="mt-2 text-sm sm:text-base">
                  {doctor.qualification}
                </p>
                <p className="mt-1 text-sm sm:text-base">{doctor.experience}</p>
                <p className="mt-3 text-sm leading-relaxed text-primary-1/80 sm:text-base">
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
                      "{testimonial.review}"
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
              <Link
                href="/user/book-appointment"
                className="font-open-sans btn rounded-full bg-secondary-1 px-5 py-2 text-xs tracking-wider text-white md:px-10 md:text-base"
              >
                Book At-Home Visit
              </Link>

              <Link
                href="https://wa.me/919606994627"
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
                +91 9740141212
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
