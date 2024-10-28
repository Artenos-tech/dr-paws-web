import Image from "next/image";
import DogImage from "@/public/assets/images/clinic/ClinicImage.png";
import { clinicItems } from "@/model/mockData";
import OurClinicsCard from "@/components/ui/OurClinicsCard";
import ClinicLocationForm from "@/components/ui/ClinicLocationForm";

export default function Clinic() {
  const limitedClinicItems = clinicItems.slice(0, 5);
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-[70%]">
        {/* cover */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center p-1 lg:space-x-8 space-y-8 lg:space-y-0 mt-[80px]">
          <div className="flex-shrink-0">
            <Image
              src={DogImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-end">
            <div className="text-center lg:text-left w-[450px] h-[170px]">
              <h2 className="text-3xl font-bold mb-4">
                Come And Visit Us At Our Place!
              </h2>
              <p className="text-lg text-gray-700">
                We are opening our homely Dr. Paws clinics across neighbourhoods
                all over the country. If we're not near you right now, we hope
                to be very soon!
              </p>
            </div>
          </div>
        </div>
        {/* our clinics */}
        <div className="container flex flex-col items-center mx-auto py-2">
          <h2 className="text-[28px] font-[400] font-roca text-center mb-8">
            Our Clinics
          </h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full sm:justify-items-center">
            {limitedClinicItems.map((clinic, index) => (
              <OurClinicsCard
                key={index}
                clinic={clinic}
                className="sm:w-[280px] md:w-[300px] lg:w-[330px] h-auto"
              />
            ))}

            {/* Static card */}
            <div className="bg-gray-100 shadow-md rounded-md p-8 flex items-center justify-center text-center sm:w-[280px] md:w-[300px] lg:w-[330px]">
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
        <ClinicLocationForm/>
      </main>
    </div>
  );
}
