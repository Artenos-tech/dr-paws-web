"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

import ContactInfoModal from "@/components/ui/ContactInfoModal"
import CustomButton from "@/components/ui/CustomButton"
import ServicePageTab from "@/components/ui/ServicePageTab"
import { useUserContext } from "@/context/UserContext"
import { useV3UserContext } from "@/context/V3UserContext"
import { useV3Feature } from "@/hooks/useV3Feature"
import V3LoginModal from "@/components/v3/V3LoginModal"
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ArrowRight, Bone, Loader } from "lucide-react"

const Services = () => {
  const [isContactModalOpen, setContactIsModalOpen] = useState(false)
  const [v3ModalOpen, setV3ModalOpen] = useState(false)
  const { initiateLogin, isLoggedIn } = useUserContext()
  const isV3Enabled = useV3Feature()
  const { isLoggedIn: isV3LoggedIn, login: v3Login } = useV3UserContext()
  const navigate = useRouter()

  const {
    call: getServicesDetails,
    loading: loadingServicesDetails,
    result: servicesDetails,
  } = useAPICall(api.getServicesDetails)

  useEffect(() => {
    getServicesDetails({})
  }, [])
  const handleBookAVisit = () => {
    if (isV3Enabled) {
      if (isV3LoggedIn) {
        navigate.push("/v3/book")
      } else {
        setV3ModalOpen(true)
      }
      return
    }
    return isLoggedIn
      ? navigate.push("/user/book-appointment")
      : initiateLogin("Book a Visit", "/user/book-appointment")
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full flex flex-col lg:gap-8 xl:gap-0 lg:flex-row items-center justify-between xl:space-x-14 xl:items-center space-y-8 xl:space-y-0 mt-[20px] lg:mt-[40px] xl:mt-[80px]">
          <div className="w-full">
            <Image
              src={DescritionImage}
              alt="Clinic image with a dog"
              className="w-full rounded-md"
            />
          </div>
          <div className="w-full  text-center lg:text-left text-primary-1 md:my-4 lg:my-0 mt-4">
            <h1 className={`text-xl md:text-2xl lg:text-3xl xl:text-5xl`}>
              Everything Under One Roof
            </h1>
            <p className="text-xs md:text-sm xl:text-base xl:w-3/4 my-3 md:my-5">
              From consults through to emergency surgeries, we have you covered.
              We also offer grooming, diagnostic tests, imaging, and retail.
            </p>

            <CustomButton
              buttonText="Book a visit"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={handleBookAVisit}
            />
          </div>
        </div>
        <div className="w-full">
          <Link
            href="/nutrition-consult"
            className="flex items-center gap-4 rounded-xl border border-primary-1 bg-primary-3 p-4 md:p-5 text-primary-1 transition-colors hover:bg-primary-2"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-2 text-secondary-1">
              <Bone size={26} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-2">
                <span className="text-base md:text-lg font-semibold">
                  Nutritional Consult
                </span>
                <span className="rounded-full bg-secondary-2 px-2 py-0.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-white">
                  New
                </span>
              </span>
              <span className="block text-xs md:text-sm mt-1">
                Personalized nutrition plans tailored to your pet&apos;s age,
                breed, and health needs.
              </span>
            </span>
            <ArrowRight className="shrink-0" size={20} />
          </Link>
        </div>

        {loadingServicesDetails && <Loader />}
        {servicesDetails?.ok && (
          <div className="w-full">
            <ServicePageTab tabs={servicesDetails.value.body.servicesDetails} />
          </div>
        )}
        <div className="w-[75%] flex flex-col items-center gap-4 md:gap-6 ">
          <p className="text-center text-primary-1 text-sm font-sans italic font-semibold">
            We&apos;ve listed our most commonly requested services, but cater to
            many other needs. If you don&apos;t find what you need please get in
            touch and we&apos;d be happy to help or refer you to someone that
            can
          </p>
          <CustomButton
            buttonText="Get in Touch"
            buttonBackground="bg-secondary-2"
            buttonClickEvent={() => setContactIsModalOpen(true)}
          />
        </div>
      </main>
      <ContactInfoModal
        isOpen={isContactModalOpen}
        onRequestClose={() => setContactIsModalOpen(false)}
      />
      {v3ModalOpen && (
        <V3LoginModal
          onSuccess={(owner, token) => {
            v3Login(owner, token)
            setV3ModalOpen(false)
            navigate.push("/v3/book")
          }}
          onClose={() => setV3ModalOpen(false)}
        />
      )}
      <Toaster />
    </div>
  )
}

export default Services
