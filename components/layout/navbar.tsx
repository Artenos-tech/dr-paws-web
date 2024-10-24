import Image from "next/image";
import Profile from "@/public/assets/images/profileThumnail.svg";
import { Menu } from "lucide-react";

export default function NavBar() {
  return (
    <div className="bg-primary-3 w-full">
      {/* Parent container with 80% width for inner items and justify-between */}
      <div className="navbar w-[80%] mx-auto flex justify-between">
        {/* Left side (Start) */}
        <div className="navbar-start flex items-center">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <Menu className="h-5 w-5 bg-primary-3" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Locations</a>
                <ul className="p-2">
                  <li>
                    <a>Location 1</a>
                  </li>
                  <li>
                    <a>Location 2</a>
                  </li>
                </ul>
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
          <Image
            src="/assets/images/logo/logo.svg"
            alt="Dr. Paws Logo"
            width={100}
            height={30}
            priority
            className="lg:block"
          />
        </div>

        {/* Center section (only visible on larger screens) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-4">
            <li>
              <details>
                <summary className="cursor-pointer text-primary-1">
                  Locations
                </summary>
                <ul className="p-2 bg-primary-3 text-primary-1">
                  <li>
                    <a>Location 1</a>
                  </li>
                  <li>
                    <a>Location 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a className="text-primary-1">Our Services</a>
            </li>
            <li>
              <a className="text-primary-1">Our Team</a>
            </li>
            <li>
              <a className="text-primary-1">Membership</a>
            </li>
          </ul>
        </div>

        {/* Right side (End) */}
        <div className="navbar-end flex items-center gap-5">
          <a className="btn btn-secondary">Button</a>
          <Image src={Profile} alt="User logo" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}
