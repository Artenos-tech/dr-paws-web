"use client"

import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"
import ContactInfoModal from "@/components/ui/ContactInfoModal"
import CustomButton from "@/components/ui/CustomButton"
// import { useMarketingFeature } from "@/hooks/useMarketingFeature";
import logo from "@/public/assets/images/logo/logo.svg"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import ClipLoader from "react-spinners/ClipLoader"
import { useV3UserContext } from "@/context/V3UserContext"
import V3LoginModal from "@/components/v3/V3LoginModal"

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isContactModalOpen, setContactIsModalOpen] = useState(false)
  const [v3ModalOpen, setV3ModalOpen] = useState(false)
  const [v3PostLoginPath, setV3PostLoginPath] = useState("/v3")
  const navigate = useRouter()
  const pathname = usePathname()
  const isVetAtHomePage = pathname?.includes("/vet-at-home")
  // const isMarketingFeatureEnabled = useMarketingFeature();

  const {
    isLoggedIn: isV3LoggedIn,
    owner: v3Owner,
    login: v3Login,
    logout: v3Logout,
  } = useV3UserContext()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  const handleBookAVisit = () => {
    if (isVetAtHomePage) {
      window.location.href = "tel:9740141212"
      return
    }
    if (isV3LoggedIn) {
      navigate.push("/v3/book")
    } else {
      setV3PostLoginPath("/v3/book")
      setV3ModalOpen(true)
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
                  Call to Book At-Home
                </button>
                <div className="hidden md:block">
                  <CustomButton
                    buttonText="Call to Book At-Home"
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
              {isV3LoggedIn === null ? (
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
              )}
            </div>
            <div className="-mr-2 flex lg:hidden">
              <button
                ref={buttonRef}
                onClick={() => {
                  setIsOpen(!isOpen)
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
              {isV3LoggedIn === null ? (
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
              )}
            </div>
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
