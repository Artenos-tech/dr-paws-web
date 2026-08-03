"use client"

import Image from "next/image"
import logo from "@/public/assets/images/logo/logo.svg"
import instagram from "@/public/assets/images/Footer/instagram.svg"
import LinkedIn from "@/public/assets/images/Footer/linkedin.svg"
import Link from "next/link"
import ContactInfoModal from "../ui/ContactInfoModal"
import { useState } from "react"
import { clinicLocations } from "@/lib/clinicLocations"

const Footer = () => {
  const [isContactModalOpen, setContactIsModalOpen] = useState(false)

  return (
    <footer className="bg-primary-3 py-10 w-full">
      <div className="mx-auto px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="mb-8">
          <Image src={logo} alt="Dr. Paws Logo" width={100} height={30} />
          <Link
            href="mailto:support@drpaws.care"
            className="block mt-2 text-primary-1 hover:text-primary-2"
          >
            support@drpaws.care
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 pb-8 border-b border-primary-1/20">
          {clinicLocations.map((location) => (
            <div key={location.region}>
              <h6 className="font-sans text-primary-1 font-semibold mb-2">
                {location.region}
              </h6>
              {location.clinics.map((clinic) => (
                <div key={clinic.name} className="mt-1 text-primary-1">
                  <div>{clinic.name}</div>
                  <Link
                    href={`tel:${clinic.phone.replace(/\s+/g, "")}`}
                    className="block text-primary-1 hover:text-primary-2"
                  >
                    {clinic.phone}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Company
            </h6>
            <Link
              href="/team"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Team
            </Link>
            {/* <Link
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Careers
            </Link> */}
          </div>
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Get Care
            </h6>
            <Link
              href="/services"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Services
            </Link>
            <Link
              href="/clinics"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Locations
            </Link>
            <Link
              href="/cancellations"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Cancellations & Refund Policy
            </Link>
            <Link
              href="/terms"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/vet-at-home-terms"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Vet-At-Home T&amp;C
            </Link>
            {/* <Link
                href="/membership"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                Membership
              </Link> */}
            <Link
              href="#"
              onClick={() => setContactIsModalOpen(true)}
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Download App
            </Link>
          </div>
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Social
            </h6>
            <div className="flex gap-2 md:flex-col md:gap-0 items-center md:items-start">
              <Link
                href="https://www.instagram.com/drpawsvet"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                <div className="flex flex-row gap-1">
                  <Image
                    src={instagram}
                    alt="Instagam"
                    width={25}
                    height={25}
                  />
                </div>
              </Link>
              <Link
                href="https://www.linkedin.com/company/dr-paws-veterinary/"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                <div className="flex flex-row gap-1">
                  <Image src={LinkedIn} alt="LinkedIn" width={25} height={25} />
                </div>
              </Link>
              {/* <a
                href="#"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                <div className="flex flex-row gap-1">
                  <Image src={X} alt="" width={25} height={25} />
                </div>
              </a> */}
            </div>
          </div>
        </div>
      </div>
      <ContactInfoModal
        isOpen={isContactModalOpen}
        onRequestClose={() => setContactIsModalOpen(false)}
      />
    </footer>
  )
}

export default Footer
