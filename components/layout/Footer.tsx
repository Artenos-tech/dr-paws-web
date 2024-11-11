import Image from "next/image";
import logo from "@/public/assets/images/logo/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-primary-3 py-10">
      <div className="mx-auto px-8 md:px-32 lg:px-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image src={logo} alt="Dr. Paws Logo" width={100} height={30} />
            <a
              href="mailto:hello@bearhug.co"
              className="block mt-2 text-primary-1 hover:text-primary-2"
            >
              hello@bearhug.co
            </a>
            <a
              href="tel:+919307491737"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              +91 9307491737
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
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Membership
            </a>
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
              Instagram
            </a>
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="block mt-1 text-primary-1 hover:text-primary-2"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
