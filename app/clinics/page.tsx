import Image from "next/image";
import DogImage from "@/public/assets/images/clinic/ClinicImage.png";
import { clinicItems } from "@/model/mockData";
import OurClinicsCard from "@/components/ui/OurClinicsCard";
import ClinicLocationForm from "@/components/ui/ClinicLocationForm";

export default function Clinics() {
  const limitedClinicItems = clinicItems.slice(0, 5);
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-[73%]">
        {/* cover */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center p-1 lg:space-x-8 space-y-8 lg:space-y-0 mt-16">
          <div className="flex-shrink-0 w-full lg:w-auto">
            <Image
              src={DogImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-center">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto">
              <h2 className="text-3xl lg:text-[48px] font-light mb-4 leading-tight">
                Come And Visit Us At Our Place!
              </h2>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1">
                We are opening our homely Dr. Paws clinics across neighbourhoods
                all over the country. If we're not near you right now, we hope
                to be very soon!
              </p>
            </div>
          </div>
        </div>

        {/* our clinics */}
        <div className="container flex flex-col items-center mx-auto py-2">
          <h2 className="text-[28px] font-light font-roca text-center mb-8">
            Our Clinics
          </h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-items-stretch">
            {limitedClinicItems.map((clinic, index) => (
              <OurClinicsCard
                key={index}
                clinic={clinic}
                className="w-full h-auto"
              />
            ))}

            {/* Static card */}
            <div className="bg-gray-100 shadow-md rounded-md p-8 flex items-center justify-center text-center w-full">
              <div>
                <div className="text-4xl mb-4">
                  <span className="inline-block text-gray-600">💡</span>
                </div>
                <p className="font-bold text-xl mb-2">
                  Where Should The Next Dr. Paws Clinic Be?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*clinic location form*/}
        <ClinicLocationForm />
      </main>
    </div>
  );
}
