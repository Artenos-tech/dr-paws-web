"use client";

import { useState } from "react";
import Image from "next/image";
import Profile from "@/public/assets/images/profileThumnail.svg";
import { Menu } from "lucide-react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdChevronRight } from "react-icons/md";
import logo from "@/public/assets/images/logo/logo.svg";
import ContactInfoModal from "../ui/ContactInfoModal";
import UserAuthenticationModal from "../ui/UserAuthenticationModal";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";
import api, { clearAuthToken } from "@/services/api";
import { useAPICall } from "@/hooks/apicall";
import CustomButton from "../ui/CustomButton";
import { useMarketingFeature } from "@/hooks/useMarketingFeature";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  // const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isContactModalOpen, setContactIsModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const navigate = useRouter();
  const isMarketingFeatureEnabled = useMarketingFeature();

  const [buttonText, setButtonText] = useState<string>("");

  const { getAuthToken, refresh, user } = useUserContext();

  // API
  const { call: logout } = useAPICall(api.logout);

  const handleLogout = async () => {
    if (user) {
      await logout({ id: user.id });
    }
    clearAuthToken();
    navigate.push("/");
    refresh();
    window.location.reload();
  };

  const handleLoginModalOpen = (text: string) => {
    const authToken = getAuthToken();
    if (authToken) {
      if (text === "View Profile" || text === "View Pets") {
        navigate.push("/user/profile");
        return;
      }
      navigate.push("/");
      return;
    }
    setLoginModalOpen(true);
    setButtonText(text);
  };

  const onSuccess = (toastMessage: string) => {
    if (buttonText === "View Profile" || buttonText === "View Pets") {
      navigate.push("/user/profile");
    }

    if (buttonText === "Book a Visit") handleBookAVisit();

    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
    });
    refresh();
    setLoginModalOpen(false);
  };

  const handleBookAVisit = () => {
    const authToken = getAuthToken();
    return authToken
      ? navigate.push("/user/book-appointment")
      : handleLoginModalOpen("Book a Visit");
  };

  return (
    <div className="fixed left-0 top-0 z-30 bg-primary-3 w-full drop-shadow-lg">
      <div className="mx-auto px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-9">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src={logo}
                  alt="Dr. Paws Logo"
                  width={100}
                  height={30}
                  priority
                />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4 gap-3">
                {/* <div className="relative group">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="outline-none">
                      <p className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Locations
                      </p>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-[#f7f1de] shadow-lg rounded-lg w-48 p-4 flex flex-col gap-2"
                        align="start"
                        sideOffset={5}
                      >
                        {clinicItems.map((clinic) => (
                          <DropdownMenu.Item
                            asChild
                            key={clinic.id}
                            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                          >
                            <Link href={`/clinics/${clinic.id}`}>
                              {clinic.clinicName}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                        <DropdownMenu.Arrow className="fill-current text-[#f7f1de]" />
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div> */}
                <Link
                  href="/clinics"
                  className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Locations
                </Link>
                <Link
                  href="/services"
                  className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Our Services
                </Link>
                <Link
                  href="/team"
                  className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Our Team
                </Link>
                {!isMarketingFeatureEnabled ? (
                  <Link
                    href="/membership"
                    className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Membership
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4 text-xs">
            <CustomButton
              buttonText="Book a visit"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={handleBookAVisit}
            />
            {getAuthToken() ? (
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
                    <DropdownMenu.Item asChild>
                      <div
                        onClick={() => handleLoginModalOpen("View Profile")}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                      >
                        Profile
                      </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <div
                        onClick={() => handleLoginModalOpen("View Pets")}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                      >
                        My Pets
                      </div>
                    </DropdownMenu.Item>

                    {/* <DropdownMenu.Item asChild>
                      <div
                        onClick={() => setContactIsModalOpen(true)}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                      >
                        Medical History
                      </div>
                    </DropdownMenu.Item> */}
                    <DropdownMenu.Item asChild>
                      <div
                        onClick={() => navigate.push("/user/my-appointments")}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                      >
                        My Appointments
                      </div>
                    </DropdownMenu.Item>
                    {/* <div className="border-t border-gray-300 my-2" /> */}
                    {!isMarketingFeatureEnabled ? (
                      <DropdownMenu.Item asChild>
                        <div
                          onClick={() => navigate.push("/membership")}
                          className="text-secondary-1 flex justify-between items-center hover:text-primary-1 cursor-pointer outline-none"
                        >
                          Become a Member <MdChevronRight />
                        </div>
                      </DropdownMenu.Item>
                    ) : null}
                    {/* <div className="border-t border-gray-300 my-2" /> */}

                    {/* <DropdownMenu.Item asChild>
                      <div
                        onClick={() => setContactIsModalOpen(true)}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                      >
                        Account Settings
                      </div>
                    </DropdownMenu.Item> */}
                    <DropdownMenu.Item asChild>
                      <div
                        onClick={handleLogout}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                      >
                        Logout
                      </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Arrow className="fill-current text-[#f7f1de]" />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <button
                type="button"
                onClick={() => handleLoginModalOpen("View Profile")}
                className="text-primary-1 text-sm tracking-wider"
              >
                Login
              </button>
            )}
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
            {/* <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="text-primary-1 hover:bg-primary-2 hover:text-white block text-left py-1 px-2 rounded-md text-base font-medium"
            >
              Locations
            </button>
            <div className="pl-8 flex flex-col text-primary-1">
              {isLocationOpen && (
                <div>
                  {clinicItems.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="my-3 text-sm"
                      onClick={() => {
                        setIsOpen(false);
                        setIsLocationOpen(false);
                      }}
                    >
                      <Link href={`/clinics/${clinic.id}`}>
                        {clinic.clinicName}
                      </Link>
                      <div className="border-t border-primary-2 my-2 w-full" />
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            <Link
              onClick={() => setIsOpen(false)}
              href="/clinics"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Locations
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/services"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Our Services
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/team"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Our Team
            </Link>
            {!isMarketingFeatureEnabled ? (
              <Link
                onClick={() => setIsOpen(false)}
                href="/membership"
                className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
              >
                Membership
              </Link>
            ) : null}
          </div>
          <div className="pt-4 pb-3 border-t border-primary-2">
            <div className="flex items-center px-8 md:px-32 space-x-4">
              {getAuthToken() ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
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
                      className="bg-[#f7f1de] shadow-lg rounded-lg w-[100vh] lg:hidden p-4 md:pl-[136px]  space-y-2 pl-10"
                      align="center"
                      sideOffset={0}
                    >
                      <DropdownMenu.Item
                        onClick={() => {
                          setIsOpen(false);
                          handleLoginModalOpen("View Profile");
                        }}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                      >
                        Profile
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onClick={() => {
                          setIsOpen(false);
                          handleLoginModalOpen("View Pets");
                        }}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none "
                      >
                        My Pets
                      </DropdownMenu.Item>
                      {/* <DropdownMenu.Item
                        onClick={() => {
                          setIsOpen(false);
                          setContactIsModalOpen(true);
                        }}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                      >
                        Medical History
                      </DropdownMenu.Item> */}
                      <DropdownMenu.Item
                        onClick={() => {
                          setIsOpen(false);
                          navigate.push("/user/my-appointments");
                        }}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                      >
                        My Appointments
                      </DropdownMenu.Item>

                      {!isMarketingFeatureEnabled ? (
                        <>
                          <div className="border-t border-gray-300 my-2" />
                          <DropdownMenu.Item
                            onClick={() => {
                              setIsOpen(false);
                              navigate.push("/membership");
                            }}
                            className="text-secondary-1 flex justify-between items-center hover:text-primary-1 cursor-pointer"
                          >
                            Become a Member <MdChevronRight />
                          </DropdownMenu.Item>
                          <div className="border-t border-gray-300 my-2" />
                        </>
                      ) : null}

                      {/* <DropdownMenu.Item
                        onClick={() => {
                          setIsOpen(false);
                          setContactIsModalOpen(true);
                        }}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                      >
                        Account Settings
                      </DropdownMenu.Item> */}
                      <DropdownMenu.Item
                        onClick={handleLogout}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                      >
                        Log Out
                      </DropdownMenu.Item>
                      <DropdownMenu.Arrow className="fill-current text-[#f7f1de]" />
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <button
                  type="button"
                  onClick={() => handleLoginModalOpen("View Profile")}
                  className="text-primary-1 text-sm tracking-wider"
                >
                  Login
                </button>
              )}
              <div onClick={() => setIsOpen(false)}>
                <CustomButton
                  buttonText="Book a visit"
                  buttonBackground="bg-secondary-1"
                  buttonClickEvent={
                    getAuthToken()
                      ? () => handleLoginModalOpen("Book a Visit")
                      : () => navigate.push("/user/book-appointment")
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <ContactInfoModal
        isOpen={isContactModalOpen}
        onRequestClose={() => setContactIsModalOpen(false)}
      />

      <UserAuthenticationModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        // initialMobileNumber="9440705361"
        buttonText={buttonText}
        onSuccess={onSuccess}
      />

      <Toaster />
    </div>
  );
}
