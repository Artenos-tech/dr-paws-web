"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Toaster } from "react-hot-toast"
import { useV3UserContext } from "@/context/V3UserContext"
import V3LoginModal from "@/components/v3/V3LoginModal"
import { CalendarClock, MapPin, Phone, Navigation } from "lucide-react"

interface ClinicInfo {
  id: string
  name: string
  services: string
  image: {
    type: "url" | "ref"
    value: string
  }
  bookable: boolean
  contact: string
  comingSoon: boolean
  address?: string
  city?: string
  gmapsUrl?: string
}

interface ClinicItemProps {
  clinic: ClinicInfo
  enlargedView: boolean
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const {
    image,
    name,
    services,
    id,
    bookable,
    contact,
    comingSoon,
    address,
    city,
    gmapsUrl,
  } = clinic
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState(false)
  const [v3ModalOpen, setV3ModalOpen] = useState(false)
  const [v3PostLoginPath, setV3PostLoginPath] = useState<string | null>(null)
  const { isLoggedIn: isV3LoggedIn, login: v3Login } = useV3UserContext()

  const handleBookAVisit = () => {
    if (!bookable) {
      if (isV3LoggedIn) {
        setModalVisible(true)
      } else {
        setV3PostLoginPath(null)
        setV3ModalOpen(true)
      }
    } else {
      if (isV3LoggedIn) {
        router.push("/v3/book")
      } else {
        setV3PostLoginPath("/v3/book")
        setV3ModalOpen(true)
      }
    }
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const goToClinicPage = () => {
    router.push(`/clinics/details?id=${id}`)
  }

  return (
    <>
      <div
        className={`bg-[#FFFCF3] ${
          !enlargedView && "w-full lg:w-[50%] xl:w-[25%] min-h-[360px]"
        } flex flex-col justify-between h-full w-full shadow-md rounded-md ${
          enlargedView
            ? "overflow-hidden rounded-3xl border-2 border-[#fdc776]/60 transition-all duration-300 hover:-translate-y-1 hover:rotate-[-0.5deg] hover:shadow-xl"
            : ""
        }`}
      >
        <div
          onClick={comingSoon ? undefined : goToClinicPage}
          className={`flex-1 flex flex-col ${comingSoon ? "cursor-default" : "cursor-pointer"}`}
        >
          <div className="image-container relative">
            <Image
              src={
                (image.type === "url" && image.value) ||
                "/assets/images/clinic/ClinicImage.png"
              }
              alt={name + " image"}
              className={`image ${enlargedView ? "transition-transform duration-500 hover:scale-105" : "rounded-t-md"}`}
              layout="fill"
            />
            {comingSoon && (
              <div className="absolute top-3 left-0 bg-[#fdc776] text-[#33495f] text-xs font-bold px-3 py-1 rounded-r-full shadow-md tracking-wide">
                Coming Soon
              </div>
            )}
          </div>
          <div className={`overflow-hidden ${enlargedView ? "p-4" : "p-2"}`}>
            <h1
              className={`text-primary-1 ${enlargedView ? "text-xl" : "text-base"}`}
            >
              {name}
              {enlargedView && !comingSoon ? " 🐾" : ""}
            </h1>
            {comingSoon ? (
              <>
                <div className="border-t border-[#fdc776] my-3" />
                <p className="text-[#33495f] text-xs leading-relaxed opacity-70">
                  A new Dr. Paws clinic, coming to your city! We&apos;re getting
                  everything ready to serve you and your furry friends.
                </p>
              </>
            ) : (
              services && (
                <div className="flex gap-2 text-primary-1 text-xs mt-2">
                  <p>{services}</p>
                </div>
              )
            )}
            {enlargedView && !comingSoon && (address || city) && (
              <div className="mt-3 flex items-start gap-2 text-xs text-primary-1/80">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-secondary-1"
                />
                <p className="leading-relaxed">
                  {address}
                  {address && city && !address.includes(city)
                    ? `, ${city}`
                    : ""}
                  {!address && city}
                </p>
              </div>
            )}
            {enlargedView && !comingSoon && contact && (
              <div className="mt-2 flex items-center gap-2 text-xs text-primary-1/80">
                <Phone size={14} className="shrink-0 text-secondary-1" />
                <span>{contact}</span>
              </div>
            )}
          </div>
        </div>
        {enlargedView && !comingSoon && gmapsUrl && (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-3 mb-3 mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-secondary-1 py-1.5 text-xs font-semibold text-secondary-1 transition-colors hover:bg-secondary-1 hover:text-white"
          >
            <Navigation size={14} /> Get directions
          </a>
        )}
        {comingSoon ? (
          <div className="bg-[#fdc776] text-[#33495f] text-center w-full rounded-b-md py-3 min-h-12 flex items-center justify-center text-sm font-semibold tracking-wide">
            Opening Soon
          </div>
        ) : (
          <button
            onClick={handleBookAVisit}
            className={`btn bg-secondary-1 rounded-none border-none z text-white w-full rounded-b-md py-3 ${enlargedView ? "rounded-b-none" : ""}`}
          >
            Book a Visit
          </button>
        )}
        <Toaster />
      </div>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Booking Unavailable
            </h2>
            <p className="mb-4 text-center">
              {name} is not currently available for online booking.
              <br />
              To schedule an appointment, please contact the clinic directly at
              <span className="font-semibold text-secondary-1"> {contact}</span>
              .
            </p>

            <div className="flex items-center bg-green-100 px-2 py-3 rounded mb-4 gap-2 justify-center">
              <CalendarClock size={24} color="#4CAF50" />
              <span className="text-green-700 text-base font-medium">
                Online booking for this {name} coming soon!
              </span>
            </div>
            <button
              onClick={closeModal}
              className="bg-secondary-1 text-white px-6 py-2 rounded-full block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {v3ModalOpen && (
        <V3LoginModal
          onSuccess={(owner, token) => {
            v3Login(owner, token)
            setV3ModalOpen(false)
            if (v3PostLoginPath !== null) {
              router.push(v3PostLoginPath)
            } else {
              setModalVisible(true)
            }
          }}
          onClose={() => setV3ModalOpen(false)}
        />
      )}
    </>
  )
}

export default ClinicItem
