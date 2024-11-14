import Image from "next/image";
import logo from "@/public/assets/images/logo/logo.svg";
import instagram from "@/public/assets/images/Footer/instagram.svg";
import LinkedIn from "@/public/assets/images/Footer/linkedin.svg";
import X from "@/public/assets/images/Footer/twitterx.svg";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary-3 py-10">
      <div className="mx-auto px-8 md:px-32 lg:px-28 xl:px-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image src={logo} alt="Dr. Paws Logo" width={100} height={30} />
            <a
              href="mailto:hello@drpaws.care"
              className="block mt-2 text-primary-1 hover:text-primary-2"
            >
              hello@drpaws.care
            </a>
            <a
              href="tel+919606994627"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              <div>Indiranagar Clinic</div>
              <div>+91 9606994627</div>
            </a>
            <a
              href="tel:+917204996899"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              <div>RMV Clinic</div>
              <div>+91 7204996899</div>
            </a>
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
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Careers
            </a>
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
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Locations
            </a>
            <Link
              href="/membership"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Membership
            </Link>
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Download App
            </a>
          </div>
          <div>
            <h6 className="font-sans text-primary-1 font-semibold mb-2">
              Social
            </h6>
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              <div className="flex flex-row gap-1">
                <Image src={instagram} alt="Instagam" width={25} height={25} />
              </div>
            </a>
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              <div className="flex flex-row gap-1">
                <Image src={LinkedIn} alt="LinkedIn" width={25} height={25} />
              </div>
            </a>
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              <div className="flex flex-row gap-1">
                <Image src={X} alt="" width={25} height={25} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
