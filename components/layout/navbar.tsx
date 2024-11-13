"use client";

import { useState } from "react";
import Image from "next/image";
import Profile from "@/public/assets/images/profileThumnail.svg";
import { Menu } from "lucide-react";
import Button from "../ui/Button";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdChevronRight } from "react-icons/md";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-0 top-0 z-50 bg-primary-3 w-full">
      <div className="mx-auto px-8 md:px-32 lg:px-40">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/assets/images/logo/logo.svg"
                  alt="Dr. Paws Logo"
                  width={100}
                  height={30}
                  priority
                />
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-4">
              <div className="relative group">
                <button className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Locations
                </button>
              </div>
              <Link
                href="/services"
                className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Our Services
              </Link>
              <a
                href="/team"
                className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Our Team
              </a>
              <Link
                href="/membership"
                className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Membership
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4 text-xs">
            <Button
              buttonText="Book a visit"
              buttonBackground="bg-secondary-1"
            />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="outline-none">
                <Image
                  src={Profile}
                  alt="User logo"
                  width={40}
                  height={40}
                  className="cursor-pointer outline-none"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="bg-[#f7f1de] shadow-lg rounded-lg w-48 p-4 flex flex-col gap-1"
                  align="start"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    asChild
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    <Link href="/user/profile" className="">
                      Profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    asChild
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none "
                  >
                    <Link href="/user/profile" className="">
                      My Pets
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none">
                    Medical History
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none">
                    My Appointments
                  </DropdownMenu.Item>
                  <div className="border-t border-gray-300 my-2" />
                  <DropdownMenu.Item className="text-secondary-1 flex justify-between items-center hover:text-primary-1 cursor-pointer outline-none">
                    Become a Member <MdChevronRight />
                  </DropdownMenu.Item>
                  <div className="border-t border-gray-300 my-2" />
                  <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none">
                    Billing Information
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none">
                    Account Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none">
                    Log Out
                  </DropdownMenu.Item>
                  <DropdownMenu.Arrow className="fill-current text-[#f7f1de]" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
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
              href="/team"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Our Team
            </a>
            <Link
            onClick={() => setIsOpen(false)}
              href="/membership"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Membership
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-primary-2 ">
            <div className="flex items-center px-8 md:px-32 space-x-4">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Image
                    src={Profile}
                    alt="User logo"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="bg-[#f7f1de] shadow-lg rounded-lg w-[100vh] lg:hidden p-4 md:pl-[136px]  flex flex-col gap-1 pl-10"
                    align="center"
                    sideOffset={0}
                  >
                    <DropdownMenu.Item
                      onClick={() => setIsOpen(false)}
                      className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                    >
                      <Link href="/user/profile" className="">
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={() => setIsOpen(false)}
                      asChild
                      className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none "
                    >
                      <Link href="/user/profile" className="">
                        My Pets
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
                      Medical History
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
                      My Appointments
                    </DropdownMenu.Item>
                    <div className="border-t border-gray-300 my-2" />
                    <DropdownMenu.Item className="text-secondary-1 flex justify-between items-center hover:text-primary-1 cursor-pointer">
                      Become a Member <MdChevronRight />
                    </DropdownMenu.Item>
                    <div className="border-t border-gray-300 my-2" />
                    <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
                      Billing Information
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
                      Account Settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="text-primary-1 hover:text-secondary-1 cursor-pointer">
                      Log Out
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow className="fill-current text-[#f7f1de]" />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
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
