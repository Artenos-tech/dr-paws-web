"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Toaster } from "react-hot-toast"
import { useUserContext } from "@/context/UserContext"
import { CalendarClock } from "lucide-react"

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
}

interface ClinicItemProps {
  clinic: ClinicInfo
  enlargedView: boolean
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const { image, name, services, id, bookable, contact } = clinic
  const router = useRouter()

  const { initiateLogin, isLoggedIn } = useUserContext()
  const [modalVisible, setModalVisible] = useState(false)

  const handleBookAVisit = () => {
    if (!bookable) {
      if (isLoggedIn) {
        setModalVisible(true)
      } else {
        initiateLogin("Book a Visit", "/user/book-appointment")
      }
      return
    }
    const bookingPath = `/user/book-appointment?clinicId=${id}`
    return isLoggedIn
      ? router.push(bookingPath)
      : initiateLogin("Book a Visit", bookingPath)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const goToClinicPage = () => {
    router.push(`/clinics/${id}`)
  }

  return (
    <>
      <div
        className={`bg-[#FFFCF3] ${
          !enlargedView && "w-full lg:w-[50%] xl:w-[25%] min-h-[360px]"
        } flex flex-col justify-between h-full w-full shadow-md rounded-md`}
      >
        <div onClick={goToClinicPage} className="cursor-pointer">
          <div className="image-container">
            <Image
              src={
                (image.type === "url" && image.value) ||
                "/assets/images/clinic/clinicThumbnail.svg"
              }
              alt={name + " image"}
              className="image rounded-t-md"
              layout="fill"
            />
          </div>
          <div className="p-2">
            <h1 className="text-primary-1 text-base">{name}</h1>
            <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
              <p>{services}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleBookAVisit}
          className={`btn bg-secondary-1 rounded-none border-none z text-white w-full rounded-b-md py-3`}
        >
          Book a Visit
        </button>
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
    </>
  )
}

export default ClinicItem
