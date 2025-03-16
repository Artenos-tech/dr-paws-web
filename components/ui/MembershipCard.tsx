import Image, { StaticImageData } from "next/image"
import { FaPlus } from "react-icons/fa6"
import React from "react"
import RenewBtn from "./RenewBtn"

type membershipDataProps = {
  membershipData: {
    planName: string
    planLogo: StaticImageData
    pet: {
      name: string
      image: StaticImageData
    }
    benefits: string[]
    planInfo: {
      expiresOn: string
      nextPaymentOn: string
    }
  }
  index: number
}

const MembershipCard: React.FC<membershipDataProps> = ({
  membershipData,
  index,
}) => {
  const { planName, planLogo, planInfo, pet, benefits } = membershipData

  const bgClasses = [
    "bg-primary-1",
    "bg-secondary-1",
    "bg-secondary-2",
    "bg-accent",
  ]

  // Determine which background class to apply based on the index
  const backgroundClass = bgClasses[index % bgClasses.length] // Cycle through classes
  return (
    <div className="w-full text-sm my-5">
      <div
        className={` ${backgroundClass} text-white flex items-center justify-between px-4 py-3 rounded-t-lg`}
      >
        <div className="flex gap-2 items-center w-full">
          <Image src={planLogo} alt={planName} />
          <p className="font-roca text-lg">{planName}</p>
          <span>
            <FaPlus className="text-primary-2" />
          </span>
        </div>
        <RenewBtn renewText="Renew Plan" />
      </div>

      <div className="bg-primary-3 text-primary-1 flex justify-between p-5 rounded-b-lg">
        <div className="flex flex-col items-center gap-3">
          <Image
            src={pet.image}
            alt={pet.name}
            className="rounded-full w-32 h-32 object-cover object-top"
          />
          <h1 className="text-secondary-1 font-semibold text-lg">{pet.name}</h1>
        </div>

        <div>
          <h3 className="text-secondary-1">Includes:</h3>
          <ul className="grid grid-cols-2 gap-x-2 list-disc list-inside leading-loose">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="leading-loose">
          <div>
            <h3 className="text-secondary-1">Expires on:</h3>
            <p className="font-semibold">{planInfo.expiresOn}</p>
          </div>

          <div>
            <h3 className="text-secondary-1">Next Payment on:</h3>
            <p className="font-semibold">{planInfo.nextPaymentOn}</p>
          </div>

          <button className="border-none text-secondary-1 underline">
            Cancel renewal
          </button>
        </div>
      </div>
    </div>
  )
}

export default MembershipCard
