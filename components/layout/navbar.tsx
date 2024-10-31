"use client";

import Image from "next/image";
import Profile from "@/public/assets/images/profileThumnail.svg";
import { Menu } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-primary-3 w-full">
      <div className="mx-auto px-8 md:px-32 lg:px-40">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/">
                <Image
                  src="/assets/images/logo/logo.svg"
                  alt="Dr. Paws Logo"
                  width={100}
                  height={30}
                  priority
                />
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-4">
              <div className="relative group">
                <button className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Locations
                </button>
                {/* <div className="hidden absolute z-10 -ml-4 mt-3 transform w-44 px-2 py-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 group-hover:block">
                  <a
                    href="/locations"
                    className="text-primary-1 hover:bg-primary-2 hover:text-white block px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Location 1
                  </a>
                  <a
                    href="/locations"
                    className="text-primary-1 hover:bg-primary-2 hover:text-white block px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Location 2
                  </a>
                  <a
                    href="/locations"
                    className="text-primary-1 hover:bg-primary-2 hover:text-white block px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Location 3
                  </a>
                </div> */}
              </div>
              <a
                href="/services"
                className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Our Services
              </a>
              <a
                href="#"
                className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Our Team
              </a>
              <a
                href="#"
                className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Membership
              </a>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              buttonText="Book a visit"
              buttonBackground="bg-secondary-1"
            />
            <Image src={Profile} alt="User logo" width={40} height={40} />
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-primary-3 inline-flex items-center justify-center p-2 rounded-md text-primary-1 hover:text-white hover:bg-primary-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-3 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-8 pt-2 pb-3 space-y-1 md:px-32 flex flex-col justify-end">
            <a
              href="#"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Locations
            </a>
            <a
              href="/services"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Our Services
            </a>
            <a
              href="#"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Our Team
            </a>
            <a
              href="#"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Membership
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-primary-2">
            <div className="flex items-center px-8 md:px-32 space-x-4">
              <Image src={Profile} alt="User logo" width={40} height={40} />
              <Button
                buttonText="Book a visit"
                buttonBackground="bg-secondary-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
