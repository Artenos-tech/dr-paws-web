"use client"

import Image from "next/image"
import DogImage from "@/public/assets/images/clinic/ClinicImage.png"
import ClinicLocationForm from "@/components/ui/ClinicLocationForm"
import ClinicItemList from "@/components/ui/ClinicItemList"
import { useMarketingFeature } from "@/hooks/useMarketingFeature"

export default function Clinics() {
  const isMarketingFeatureEnabled = useMarketingFeature()
  return (
    <div className="flex flex-col w-full h-full 3xl:h-screen items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-8 md:gap-20 row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        {/* cover */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 mt-16">
          <div className="w-full flex-1">
            <Image
              src={DogImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex flex-1 items-center justify-center w-full lg:items-start lg:justify-center">
            <div className="text-center lg:text-left w-full h-auto">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight">
                Come And Visit Us At Our Place!
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1">
                We are opening our homely Dr. Paws clinics across neighbourhoods
                all over the country. If we&apos;re not near you right now, we
                hope to be very soon!
              </p>
            </div>
          </div>
        </div>

        {/* our clinics */}
        <div className="flex flex-col items-center mx-auto w-full rounded-[2.5rem] bg-primary-3/60 px-4 py-10 md:px-10">
          <h1 className="text-[28px] font-roca text-center">Our Clinics 🐾</h1>
          <p className="mb-8 mt-2 text-center text-sm text-gray-600">
            Pop in for a visit — tails wag and treats are waiting.
          </p>
          <ClinicItemList showStaticCard={true} enlargedView={true} />
        </div>

        {/*clinic location form*/}
        {!isMarketingFeatureEnabled && <ClinicLocationForm />}
      </main>
    </div>
  )
}
