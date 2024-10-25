import Image from "next/image";
import logo from "@/public/assets/images/logo/logo.svg";

const Footer = () => {
  return (
    <footer className="footer bg-primary-3 p-10 w-full">
      <nav className="ml-24">
        <Image src={logo} alt="Dr. Paws Logo" width={100} height={30} />
        <a className="link link-hover">hello@bearhug.co</a>
        <a className="link link-hover">+91 9307491737</a>
      </nav>

      <nav>
        <h6 className="text-primary-1 font-semibold">Company</h6>
        <a className="link link-hover">Team</a>
        <a className="link link-hover">Careers</a>
      </nav>
      <nav>
        <h6 className="text-primary-1 font-semibold">Get Care</h6>
        <a className="link link-hover">Services</a>
        <a className="link link-hover">Locations</a>
        <a className="link link-hover">Membership</a>
        <a className="link link-hover">Download App</a>
      </nav>
      <nav>
        <h6 className="text-primary-1 font-semibold">Social</h6>
        <a className="link link-hover">Instagram</a>
        <a className="link link-hover">LinkedIn</a>
        <a className="link link-hover">Twitter</a>
      </nav>
    </footer>
  );
};

export default Footer;
