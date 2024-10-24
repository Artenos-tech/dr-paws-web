import Image from "next/image";
import Profile from "@/public/assets/images/profileThumnail.svg";
import { Menu } from "lucide-react";

export default function NavBar() {
  return (
    <div className="navbar bg-primary-3 w-full">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <Menu className="h-5 w-5 bg-primary-3" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
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
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-4">
          <li>
            <details>
              <summary className="cursor-pointer text-primary-1">
                Parent
              </summary>
              <ul className="p-2 bg-primary-3 text-primary-1">
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
            <a className="text-primary-1">Item 1</a>
          </li>
          <li>
            <a className="text-primary-1">Item 2</a>
          </li>
          <li>
            <a className="text-primary-1">Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-secondary">Button</a>
      </div>
    </div>
  );
}
