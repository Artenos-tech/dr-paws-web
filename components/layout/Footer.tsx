"use client";

import Image from "next/image";
import logo from "@/public/assets/images/logo/logo.svg";
import instagram from "@/public/assets/images/Footer/instagram.svg";
import LinkedIn from "@/public/assets/images/Footer/linkedin.svg";
// import X from "@/public/assets/images/Footer/twitterx.svg";
import Link from "next/link";
import ContactInfoModal from "../ui/ContactInfoModal";
import { useState } from "react";
import { useMarketingFeature } from "@/hooks/useMarketingFeature";

const Footer = () => {
  const isMarketingFeatureEnabled = useMarketingFeature();
  const [isContactModalOpen, setContactIsModalOpen] = useState(false);
  return (
    <footer className="bg-primary-3 py-10">
      <div className="mx-auto px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image src={logo} alt="Dr. Paws Logo" width={100} height={30} />
            <a
              href="mailto:hello@drpaws.care"
              className="block mt-2 text-primary-1 hover:text-primary-2"
            >
              hello@drpaws.care
            </a>
            <div className="block mt-1 text-primary-1">
              <div>Indiranagar Clinic</div>
              <div>+91 9606994627</div>
            </div>
            <div className="block mt-1 text-primary-1">
              <div>RMV Clinic</div>
              <div>+91 7204996899</div>
            </div>
          </div>
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Company
            </h6>
            <a
              href="/team"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Team
            </a>
            {!isMarketingFeatureEnabled ? (
              <a
                href="#"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                Careers
              </a>
            ) : null}
          </div>
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Get Care
            </h6>
            <a
              href="/services"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Services
            </a>
            {!isMarketingFeatureEnabled ? (
              <a
                href="#"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                Locations
              </a>
            ) : null}
            {!isMarketingFeatureEnabled ? (
              <Link
                href="/membership"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                Membership
              </Link>
            ) : null}
            <a
              href="#"
              onClick={() => setContactIsModalOpen(true)}
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Download App
            </a>
          </div>
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Social
            </h6>
            <div className="flex gap-2 md:flex-col md:gap-0 items-center md:items-start">
              <a
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
              </a>
              <a
                href="https://www.linkedin.com/company/dr-paws-veterinary/"
                className="block mt-1 text-primary-1 hover:text-primary-2"
              >
                <div className="flex flex-row gap-1">
                  <Image src={LinkedIn} alt="LinkedIn" width={25} height={25} />
                </div>
              </a>
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
  );
};

export default Footer;
