import { useV3UserContext } from "@/context/V3UserContext"
import V3LoginModal from "@/components/v3/V3LoginModal"
import Image, { StaticImageData } from "next/image"
import React, { useState } from "react"
import CustomButton from "./CustomButton"
import { useRouter } from "next/navigation"

interface descriptionCardProps {
  index: number
  description: {
    image: StaticImageData
    title: string
    desciption: string
    button: {
      buttonText: string
      buttonBackground: string
      buttonLink?: string
      buttonClickEvent?: () => void
    }
  }
  openContactModal?: () => void
}

const DescriptionCard: React.FC<descriptionCardProps> = ({
  index,
  description,
  openContactModal,
}) => {
  const { image, title, button } = description
  const [v3ModalOpen, setV3ModalOpen] = useState(false)
  const { isLoggedIn: isV3LoggedIn, login: v3Login } = useV3UserContext()
  const navigate = useRouter()

  const handleBookAVisit = () => {
    if (isV3LoggedIn) {
      navigate.push("/v3/book")
    } else {
      setV3ModalOpen(true)
    }
  }

  const handleModalByButtonText = () => {
    if (button.buttonText.includes("Download")) {
      return <CustomButton {...button} buttonClickEvent={openContactModal} />
    } else if (button.buttonText === "Book a Visit") {
      return <CustomButton {...button} buttonClickEvent={handleBookAVisit} />
    }
    return <CustomButton {...button} buttonClickEvent={handleBookAVisit} />
  }

  return (
    <>
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
      <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center lg:gap-20">
        <div className={`w-full ${index % 2 !== 0 ? "lg:order-2" : ""}`}>
          <Image
            src={image}
            alt={title + " image"}
            sizes="(min-width: 1024px) 42vw, 100vw"
            quality={85}
            className="mx-auto rounded-md"
          />
        </div>
        <div className="w-full text-center lg:text-left text-primary-1 my-3 md:my-8 lg:my-0">
          <h1 className={`text-md md:text-2xl`}>{title}</h1>
          <p className="text-sm md:text-base my-3 md:my-5">
            {description.desciption}
          </p>
          {handleModalByButtonText()}
        </div>
      </div>
    </>
  )
}

export default DescriptionCard
