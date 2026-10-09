"use client"

import React, { useEffect, useState } from "react"
import { Link2, Check } from "lucide-react"
import { MARKETING_OFFERS } from "@/lib/marketingOffers"

export default function TermsPageContent() {
  const [activeHash, setActiveHash] = useState<string>("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "")
    if (currentHash) {
      setActiveHash(currentHash)
      setTimeout(() => {
        const el = document.getElementById(currentHash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      setActiveHash(hash)
      if (hash) {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const copyDirectLink = (offerId: string) => {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}${window.location.pathname}#${offerId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(offerId)
      setTimeout(() => setCopiedId(null), 2500)
    })
  }

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-primary-1">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <div className="w-full bg-[#fcfaf7] min-h-screen text-primary-1 font-secondary pb-24">
      {/* Page Title Header */}
      <header className="bg-[#f7f1de] border-b border-[#ebdcb9] py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-primary text-primary-1 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-base sm:text-lg text-primary-1/80 max-w-2xl">
            Review Dr. Paws General Terms & Conditions and current Marketing Offer terms.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Sticky Quick Navigation */}
        <nav
          aria-label="Table of Contents"
          className="sticky top-20 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-primary-1/10 p-3.5 sm:p-4 shadow-sm mb-10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-1/60">
              Quick Navigation
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="#general-terms"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeHash === "general-terms" || !activeHash
                  ? "bg-primary-1 text-white shadow-sm"
                  : "bg-[#f7f1de] text-primary-1 hover:bg-[#ebdcb9]"
              }`}
            >
              General Terms & Conditions
            </a>
            <a
              href="#marketing-offers"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeHash === "marketing-offers"
                  ? "bg-primary-1 text-white shadow-sm"
                  : "bg-[#f7f1de] text-primary-1 hover:bg-[#ebdcb9]"
              }`}
            >
              Marketing Offers
            </a>
          </div>
        </nav>

        {/* SECTION A: General Terms and Conditions */}
        <section
          id="general-terms"
          className="scroll-mt-36 bg-white rounded-3xl border border-primary-1/10 p-6 sm:p-10 shadow-sm mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-primary text-primary-1 pb-4 border-b border-primary-1/10">
            Dr. Paws: General Terms & Conditions
          </h2>

          <div className="mt-6 text-sm sm:text-base leading-relaxed text-primary-1/90 space-y-6">
            <p>
              These Terms &amp; Conditions apply to services availed through Dr.
              Paws clinics, hospitals, Vet At Home services, grooming services and
              other Dr. Paws service channels.
            </p>
            <p>
              By booking or availing a service with Dr. Paws, you agree to the
              following:
            </p>

            {/* 1. Appointments & Availability */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                1. Appointments &amp; Availability
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All appointments are subject to doctor, groomer, service and
                  clinic availability.
                </li>
                <li>
                  Appointment times are approximate and may be delayed due to
                  emergencies or cases requiring urgent medical attention.
                </li>
                <li>
                  Certain services, procedures or specialists may only be
                  available at selected Dr. Paws locations.
                </li>
              </ul>
            </div>

            {/* 2. Cancellations & Rescheduling */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                2. Cancellations &amp; Rescheduling
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Please inform us as early as possible if you need to cancel or
                  reschedule an appointment.
                </li>
                <li>
                  Repeated no-shows or last-minute cancellations may affect future
                  booking availability.
                </li>
                <li>
                  Certain appointments, procedures or home visits may require an
                  advance payment or booking fee.
                </li>
                <li>
                  If a patient arrives more than 15 minutes late without prior
                  intimation to the clinic, Dr. Paws reserves the right to
                  reschedule or cancel the appointment, subject to availability.
                </li>
              </ul>
            </div>

            {/* 3. Veterinary Consultation & Treatment */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                3. Veterinary Consultation &amp; Treatment
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Treatment recommendations are based on the veterinarian&apos;s
                  clinical assessment of the pet at the time of consultation.
                </li>
                <li>
                  Additional diagnostics, medicines, procedures or referrals may
                  be recommended where clinically necessary.
                </li>
                <li>
                  Treatment plans and estimated costs may change depending on test
                  results, the pet&apos;s response to treatment or changes in the
                  pet&apos;s condition.
                </li>
                <li>
                  No medical treatment or procedure can guarantee a specific
                  clinical outcome.
                </li>
              </ul>
            </div>

            {/* 4. Consent for Procedures */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                4. Consent for Procedures
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Certain procedures, diagnostics, sedation, anesthesia,
                  hospitalisation or surgery may require additional consent from
                  the pet parent.
                </li>
                <li>
                  In an emergency, the veterinary team may recommend immediate
                  intervention in the pet&apos;s best medical interest and will
                  attempt to contact the pet parent wherever reasonably possible.
                </li>
              </ul>
            </div>

            {/* 5. Pricing & Payments */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                5. Pricing &amp; Payments
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Prices may vary depending on the service, clinic, pet size,
                  condition, medicines, consumables or additional treatment
                  required.
                </li>
                <li>
                  Estimates provided before treatment are indicative unless
                  otherwise stated.
                </li>
                <li>
                  Any additional services or treatments required will be
                  communicated wherever reasonably possible before being
                  performed.
                </li>
                <li>
                  Payment is due as per the billing terms communicated by the
                  clinic or service team.
                </li>
              </ul>
            </div>

            {/* 6. Grooming Services */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                6. Grooming Services
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Grooming services are subject to the pet&apos;s coat condition,
                  skin condition, temperament and ability to safely undergo
                  grooming.
                </li>
                <li>
                  Additional charges may apply for services such as de-matting,
                  tick/flea treatment or other special handling requirements.
                </li>
                <li>
                  Dr. Paws may modify, pause or decline a grooming service if
                  continuing could compromise the safety or welfare of the pet or
                  grooming team.
                </li>
                <li>
                  Specific grooming offers may have additional Terms &amp;
                  Conditions.
                </li>
                <li>
                  In cases of heavy matting, the de-matting process may cause
                  temporary redness, skin irritation or mild rashes due to
                  friction and the condition of the coat and skin.
                </li>
                <li>
                  If a pet is not picked up within 30 minutes of the grooming
                  service being completed, additional boarding or holding charges
                  may apply.
                </li>
              </ul>
            </div>

            {/* 7. Vet At Home Services */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                7. Vet At Home Services
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Vet At Home services are subject to serviceability,
                  veterinarian availability and the nature of the pet&apos;s
                  condition.
                </li>
                <li>
                  Some conditions may require examination, diagnostics,
                  hospitalization or treatment at a Dr. Paws clinic or hospital.
                </li>
                <li>
                  Home consultations are not a substitute for emergency hospital
                  care where urgent intervention is required.
                </li>
              </ul>
            </div>

            {/* 8. Emergencies */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                8. Emergencies
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Emergency cases are prioritized based on medical urgency.
                </li>
                <li>Waiting times may therefore vary.</li>
                <li>
                  Where specialized or advanced care is required, Dr. Paws may
                  recommend referral or transfer to another facility.
                </li>
              </ul>
            </div>

            {/* 9. Medicines, Products & Prescriptions */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                9. Medicines, Products &amp; Prescriptions
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Medicines and veterinary products should be used only as advised
                  by the treating veterinarian.
                </li>
                <li>
                  Prescription medicines may require a valid veterinary
                  consultation before dispensing.
                </li>
                <li>
                  Product availability may vary across clinics and service
                  locations.
                </li>
              </ul>
            </div>

            {/* 10. Offers & Discounts */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                10. Offers &amp; Discounts
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Promotional offers are subject to their respective eligibility
                  criteria, validity periods and specific Terms &amp; Conditions.
                </li>
                <li>
                  Unless specifically stated, offers cannot be combined with
                  other discounts, coupons or promotions.
                </li>
                <li>
                  Dr. Paws reserves the right to modify or withdraw promotional
                  offers, subject to applicable law.
                </li>
              </ul>
            </div>

            {/* 11. Pet Parent Responsibilities */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                11. Pet Parent Responsibilities
              </h3>
              <p className="mb-2">
                Pet parents are responsible for providing accurate and complete
                information regarding the pet, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 mb-3">
                <li>medical history;</li>
                <li>ongoing medications;</li>
                <li>known allergies;</li>
                <li>previous reactions to medicines or anesthesia;</li>
                <li>behavioural concerns or aggression;</li>
                <li>infectious diseases or parasite concerns; and</li>
                <li>
                  any other information relevant to the pet&apos;s treatment or
                  handling.
                </li>
              </ul>
              <p>
                Pets should be appropriately restrained using a leash, carrier or
                other suitable method while visiting Dr. Paws facilities.
              </p>
            </div>

            {/* 12. Safety & Behaviour */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                12. Safety &amp; Behaviour
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Dr. Paws may use appropriate restraint methods where necessary
                  for safe examination, treatment or grooming.
                </li>
                <li>
                  Services may be stopped or modified if a pet displays behaviour
                  that poses a significant risk to itself, other animals, staff or
                  pet parents.
                </li>
                <li>
                  Sedation, where medically appropriate, will only be undertaken
                  following veterinary assessment and consent.
                </li>
              </ul>
            </div>

            {/* 13. Hospitalization & Personal Belongings */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                13. Hospitalization &amp; Personal Belongings
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Pet parents should avoid leaving unnecessary personal
                  belongings with hospitalised pets.
                </li>
                <li>
                  Dr. Paws cannot guarantee against loss or damage of items such
                  as collars, leashes, bedding, toys or clothing left with the
                  pet.
                </li>
              </ul>
            </div>

            {/* 14. Records & Communication */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                14. Records &amp; Communication
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Dr. Paws may maintain medical records, prescriptions, diagnostic
                  results, treatment notes, invoices and appointment records
                  relating to your pet.
                </li>
                <li>
                  Contact information provided by the pet parent may be used for
                  appointment updates, treatment communication, follow-ups and
                  other service-related communication.
                </li>
                <li>
                  Promotional communication will be handled in accordance with
                  applicable consent and communication preferences.
                </li>
              </ul>
            </div>

            {/* 15. Photography & Media */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                15. Photography &amp; Media
              </h3>
              <p>
                Photos or videos of pets will not be used for marketing or
                promotional purposes without appropriate permission from the pet
                parent, except where otherwise permitted by applicable law.
              </p>
            </div>

            {/* 16. Service-Specific Terms */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                16. Service-Specific Terms
              </h3>
              <p>
                Certain services, packages, memberships, promotions, procedures
                or campaigns may have additional Terms &amp; Conditions. Where
                applicable, those specific terms will apply together with these
                General Terms &amp; Conditions.
              </p>
            </div>

            {/* 17. Changes to These Terms */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                17. Changes to These Terms
              </h3>
              <p>
                Dr. Paws may update these Terms &amp; Conditions periodically to
                reflect changes in services, operational requirements or
                applicable regulations. The latest version published on the Dr.
                Paws website will apply.
              </p>
            </div>

            {/* 18. Contact */}
            <div className="pt-4 border-t border-primary-1/10">
              <h3 className="text-lg sm:text-xl font-primary text-primary-1 mb-2">
                18. Contact
              </h3>
              <p>
                For questions regarding a booking, bill, service or these Terms
                &amp; Conditions, please contact the relevant Dr. Paws clinic or
                our customer support team.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION B: Marketing Offer Terms and Conditions */}
        <section id="marketing-offers" className="scroll-mt-36">
          <h2 className="text-2xl sm:text-3xl font-primary text-primary-1 mb-8">
            Marketing Offer Terms &amp; Conditions
          </h2>

          {/* Individual Offer Cards */}
          <div className="space-y-8">
            {MARKETING_OFFERS.map((offer) => {
              const isTargeted = activeHash === offer.id
              const isCopied = copiedId === offer.id

              return (
                <article
                  key={offer.id}
                  id={offer.id}
                  className={`scroll-mt-36 bg-white rounded-3xl border transition-all duration-300 p-6 sm:p-8 shadow-sm ${
                    isTargeted
                      ? "border-[#fdc776] ring-4 ring-[#fdc776]/30 shadow-md"
                      : "border-primary-1/10 hover:border-primary-1/25"
                  }`}
                >
                  {/* Offer Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-primary-1/10">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-primary text-primary-1">
                        {offer.title}
                      </h3>
                      <span className="text-xs text-primary-1/50 font-mono">
                        #{offer.id}
                      </span>
                    </div>

                    {/* Direct Link Action */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => copyDirectLink(offer.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isCopied
                            ? "bg-green-50 border-green-300 text-green-700 shadow-sm"
                            : "bg-[#fcfaf7] border-primary-1/15 text-primary-1 hover:bg-[#f7f1de]"
                        }`}
                        title="Copy direct link to this offer's terms"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3.5 h-3.5 text-primary-1/70" />
                            Direct Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Offer Points List */}
                  <div className="mt-6">
                    <ul className="list-disc pl-5 space-y-2.5 text-sm sm:text-base leading-relaxed text-primary-1/85">
                      {offer.points.map((point, idx) => (
                        <li key={idx}>{renderFormattedText(point)}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
