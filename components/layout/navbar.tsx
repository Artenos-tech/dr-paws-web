import logo from "@/app/assets/images/logo/logo.svg";
import Image from "next/image";
import Profile from "@/app/assets/images/profileThumnail.svg";

export default function NavBar() {
  return (
    <div className="navbar bg-primary-3 w-full mx-auto flex justify-between items-center">
      {/* Logo */}
      <div className="mx-auto flex justify-between items-center w-[80%]">
        <div className="flex items-center space-x-4">
          <Image
            src={logo}
            alt="Dr. Paws Logo"
            width={100}
            height={30}
            priority
          />
        </div>

        {/* Center Menu */}
        <div className="navbar-center lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>Locations</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Our Services</a>
            </li>
            <li>
              <a>Our Team</a>
            </li>
            <li>
              <a>Membership</a>
            </li>
          </ul>
        </div>

        {/* Group Button and Profile */}
        <div className="flex items-center space-x-4">
          {/* Button */}
          <a className="btn">Button</a>

          {/* User Logo */}
          <Image src={Profile} alt="User logo" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
