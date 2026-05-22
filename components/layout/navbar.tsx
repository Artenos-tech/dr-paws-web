"use client"

import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"
import ContactInfoModal from "@/components/ui/ContactInfoModal"
import CustomButton from "@/components/ui/CustomButton"
import { useUserContext } from "@/context/UserContext"
import { useAPICall } from "@/hooks/apicall"
// import { useMarketingFeature } from "@/hooks/useMarketingFeature";
import logo from "@/public/assets/images/logo/logo.svg"
import Profile from "@/public/assets/images/profileThumnail.svg"
import api, { clearAuthToken } from "@/services/api"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import { useHomeVisitFeature } from "@/hooks/useHomeVisitFeature"
import { useV3Feature } from "@/hooks/useV3Feature"
import { useV3UserContext } from "@/context/V3UserContext"
import V3LoginModal from "@/components/v3/V3LoginModal"

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isContactModalOpen, setContactIsModalOpen] = useState(false)
  const [v3ModalOpen, setV3ModalOpen] = useState(false)
  const [v3PostLoginPath, setV3PostLoginPath] = useState("/v3")
  const navigate = useRouter()
  const pathname = usePathname()
  const isVetAtHomePage = pathname?.includes("/vet-at-home")
  // const isMarketingFeatureEnabled = useMarketingFeature();

  const { refresh, initiateLogin, isLoggedIn } = useUserContext()
  const { isFeatureEnabled: isHomeVisitEnabled } = useHomeVisitFeature()
  const isV3Enabled = useV3Feature()
  const {
    isLoggedIn: isV3LoggedIn,
    owner: v3Owner,
    login: v3Login,
    logout: v3Logout,
  } = useV3UserContext()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLButtonElement>(null)

  const { call: logout } = useAPICall(api.logout)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click was outside of dropdown and button
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  const handleLogout = async () => {
    await logout({})
    clearAuthToken()
    navigate.push("/")
    refresh()
  }

  const handleBookAVisit = () => {
    if (isV3Enabled) {
      const v3Destination =
        isVetAtHomePage && isHomeVisitEnabled
          ? "/v3/book/home-visit"
          : "/v3/book"
      if (isV3LoggedIn) {
        navigate.push(v3Destination)
      } else {
        setV3PostLoginPath(v3Destination)
        setV3ModalOpen(true)
      }
      return
    }
    const destination =
      pathname?.includes("/vet-at-home") && isHomeVisitEnabled
        ? "/user/book-appointment?home=true"
        : "/user/book-appointment"
    if (isLoggedIn) {
      navigate.push(destination)
    } else {
      initiateLogin("Book a Visit", destination)
    }
  }

  return (
    <div className="fixed left-0 top-0 z-30 bg-primary-3 w-full drop-shadow-lg">
      <div
        className={`mx-auto ${
          isVetAtHomePage ? "px-4 sm:px-6 md:px-32" : "px-8 md:px-32"
        } lg:px-20 xl:px-40`}
      >
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
                <Link
                  href="/vet-at-home"
                  className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Vet-At-Home
                </Link>
                <Link
                  href="/blogs"
                  className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Blogs
                </Link>
                {/* <Link
                  href="/membership"
                  className="text-primary-1 hover:bg-primary-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Membership
                </Link> */}
              </div>
            </div>
          </div>
          <div
            className={`flex items-center text-xs justify-end ${
              isVetAtHomePage ? "gap-2 md:gap-4" : "gap-4"
            }`}
          >
            {isVetAtHomePage ? (
              <>
                <button
                  type="button"
                  onClick={handleBookAVisit}
                  className="font-open-sans btn rounded-full bg-secondary-1 px-2.5 py-2 text-[10px] tracking-[0.04em] text-white whitespace-nowrap sm:px-3 sm:text-[11px] md:hidden"
                >
                  Book an At-Home Visit
                </button>
                <div className="hidden md:block">
                  <CustomButton
                    buttonText="Book an At-Home Visit"
                    buttonBackground="bg-secondary-1"
                    buttonClickEvent={handleBookAVisit}
                  />
                </div>
              </>
            ) : (
              <CustomButton
                buttonText="Book a visit"
                buttonBackground="bg-secondary-1"
                buttonClickEvent={handleBookAVisit}
              />
            )}
            <div className="hidden lg:flex items-center space-x-4 text-xs">
              {isV3Enabled === null ? (
                <div
                  aria-busy="true"
                  aria-label="Checking sign-in status"
                  className="flex items-center gap-1.5 rounded-full bg-primary-2/10 px-3 py-1.5 text-primary-1 border border-primary-2/20"
                >
                  <ClipLoader color="#33495f" size={12} />
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </div>
              ) : isV3Enabled ? (
                isV3LoggedIn === null ? (
                  <div
                    aria-busy="true"
                    aria-label="Checking sign-in status"
                    className="flex items-center gap-1.5 rounded-full bg-primary-2/10 px-3 py-1.5 text-primary-1 border border-primary-2/20"
                  >
                    <ClipLoader color="#33495f" size={12} />
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </div>
                ) : isV3LoggedIn ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="outline-none">
                      <div className="flex items-center gap-1.5 cursor-pointer rounded-full bg-primary-2/10 px-3 py-1.5 text-primary-1 hover:bg-primary-2/20 transition-colors border border-primary-2/20">
                        <span className="text-xs font-medium">
                          {v3Owner?.firstName}
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-60" />
                      </div>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="bg-[#f7f1de] shadow-lg rounded-lg w-44 p-3 flex flex-col gap-1 z-50"
                        align="end"
                        sideOffset={8}
                      >
                        <DropdownMenu.Item asChild>
                          <div
                            onClick={() => navigate.push("/v3")}
                            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none text-sm"
                          >
                            Home
                          </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <div
                            onClick={() => navigate.push("/v3/appointments")}
                            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none text-sm"
                          >
                            My Appointments
                          </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <div
                            onClick={() => navigate.push("/v3/medical-history")}
                            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none text-sm"
                          >
                            Medical History
                          </div>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <div
                            onClick={() => navigate.push("/v3/invoices")}
                            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none text-sm"
                          >
                            Invoices
                          </div>
                        </DropdownMenu.Item>
                        <div className="border-t border-gray-300 my-1" />
                        <DropdownMenu.Item asChild>
                          <div
                            onClick={v3Logout}
                            className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none text-sm"
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
                    onClick={() => setV3ModalOpen(true)}
                    className="text-primary-1 text-sm tracking-wider"
                  >
                    Login
                  </button>
                )
              ) : isLoggedIn ? (
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
                          onClick={() => navigate.push("/user/profile")}
                          className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                        >
                          Profile
                        </div>
                      </DropdownMenu.Item>
                      {/* <DropdownMenu.Item asChild>
                        <div
                          onClick={() => navigate.push("/user/profile")}
                          className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                        >
                          My Pets
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
                      <DropdownMenu.Item asChild>
                        <div
                          onClick={() => navigate.push("/user/my-address-book")}
                          className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                        >
                          My Address Book
                        </div>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <div
                          onClick={() => navigate.push("/user/reports")}
                          className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                        >
                          Medical History
                        </div>
                      </DropdownMenu.Item>
                      {/* <div className="border-t border-gray-300 my-2" /> */}
                      {/* {!isMarketingFeatureEnabled ? ( */}
                      {/* <DropdownMenu.Item asChild>
                        <div
                          onClick={() =>
                            navigate.push("/user/my-subscriptions")
                          }
                          className="text-secondary-1 flex justify-between items-center hover:text-primary-1 cursor-pointer outline-none"
                        >
                          My Memberships
                        </div>
                      </DropdownMenu.Item> */}
                      {/* ) : null} */}
                      {/* <div className="border-t border-gray-300 my-2" /> */}
                      <DropdownMenu.Item asChild>
                        <div
                          onClick={() => navigate.push("/user/invoices")}
                          className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none"
                        >
                          My Invoices
                        </div>
                      </DropdownMenu.Item>
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
                  onClick={() =>
                    initiateLogin("book appointments", "/user/profile")
                  }
                  className="text-primary-1 text-sm tracking-wider"
                >
                  Login
                </button>
              )}
            </div>
            <div className="-mr-2 flex lg:hidden">
              <button
                ref={buttonRef}
                onClick={() => {
                  setIsOpen(!isOpen)
                  setIsProfileOpen(false)
                }}
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
      </div>

      {isOpen && (
        <div ref={dropdownRef} className="lg:hidden" id="mobile-menu">
          <div className="px-8 pt-2 pb-3 space-y-1 md:px-32 flex flex-col justify-end">
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
            <Link
              onClick={() => setIsOpen(false)}
              href="/vet-at-home"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Vet-At-Home
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/blogs"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Blogs
            </Link>
            {/* <Link
              onClick={() => setIsOpen(false)}
              href="/membership"
              className="text-primary-1 hover:bg-primary-2 hover:text-white block py-2 px-2 rounded-md text-base font-medium"
            >
              Membership
            </Link> */}
          </div>
          <div className="pt-4 pb-3 border-t border-primary-2">
            <div className="flex items-center px-8 md:px-32 space-x-4">
              {isV3Enabled === null ? (
                <div
                  aria-busy="true"
                  aria-label="Checking sign-in status"
                  className="flex items-center h-5"
                >
                  <ClipLoader color="#33495f" size={14} />
                </div>
              ) : isV3Enabled ? (
                isV3LoggedIn === null ? (
                  <div
                    aria-busy="true"
                    aria-label="Checking sign-in status"
                    className="flex items-center h-5"
                  >
                    <ClipLoader color="#33495f" size={14} />
                  </div>
                ) : isV3LoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-primary-1 text-sm font-medium">
                      {v3Owner?.firstName}
                    </span>
                    <div className="flex flex-col gap-1 pl-1">
                      {[
                        { label: "Home", href: "/v3" },
                        { label: "My Appointments", href: "/v3/appointments" },
                        {
                          label: "Medical History",
                          href: "/v3/medical-history",
                        },
                        { label: "Invoices", href: "/v3/invoices" },
                      ].map(({ label, href }) => (
                        <button
                          key={href}
                          type="button"
                          onClick={() => {
                            setIsOpen(false)
                            navigate.push(href)
                          }}
                          className="text-primary-1 hover:text-secondary-1 text-sm text-left"
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={v3Logout}
                        className="text-primary-1 hover:text-secondary-1 text-sm text-left"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setV3ModalOpen(true)}
                    className="text-primary-1 text-sm tracking-wider"
                  >
                    Login
                  </button>
                )
              ) : isLoggedIn ? (
                <button
                  type="button"
                  ref={profileButtonRef}
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen)
                  }}
                >
                  <Image
                    src={Profile}
                    alt="User logo"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    initiateLogin("book appointments", "/user/book-appointment")
                  }
                  className="text-primary-1 text-sm tracking-wider"
                >
                  Login
                </button>
              )}
            </div>
            {isProfileOpen && (
              <div
                ref={profileDropdownRef}
                className="bg-[#f7f1de] text-left rounded-lg w-[100vh] lg:hidden px-4 pt-4 md:pl-[136px] pl-10 space-y-2 z-10 list-none"
                // align="center"
                // sideOffset={0}
              >
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/profile")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    Profile
                  </button>
                </li>
                {/* <li>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/profile")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer outline-none "
                  >
                    My Pets
                  </button>
                </li> */}
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/my-appointments")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    My Appointments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/my-address-book")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    My Address Book
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/reports")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    Medical History
                  </button>
                </li>
                {/* <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/my-subscriptions")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    My Memberships
                  </button> */}
                {/* </li> */}
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate.push("/user/invoices")
                    }}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    My Invoices
                  </button>
                </li>

                {/* <button
                        onClick={() => {
                          setIsOpen(false);
                          setContactIsModalOpen(true);
                        }}
                        className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                      >
                        Account Settings
                      </button> */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-primary-1 hover:text-secondary-1 cursor-pointer"
                  >
                    Log Out
                  </button>
                </li>
              </div>
            )}
          </div>
        </div>
      )}
      <ContactInfoModal
        isOpen={isContactModalOpen}
        onRequestClose={() => setContactIsModalOpen(false)}
      />

      {v3ModalOpen && (
        <V3LoginModal
          onSuccess={(owner, token) => {
            v3Login(owner, token)
            setV3ModalOpen(false)
            navigate.push(v3PostLoginPath)
          }}
          onClose={() => {
            setV3ModalOpen(false)
            setV3PostLoginPath("/v3")
          }}
        />
      )}

      <Toaster />
    </div>
  )
}
