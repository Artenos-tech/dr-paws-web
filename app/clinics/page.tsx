import Image from "next/image";
import DogImage from "@/public/assets/images/clinic/ClinicImage.png";
import ClinicLocationForm from "@/components/ui/ClinicLocationForm";
import ClinicItemList from "@/components/ui/ClinicItemList";

export default function Clinics() {
  return (
    <div className="flex flex-col w-full h-full 3xl:h-screen items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-8 md:gap-20 row-start-2 items-center px-8 md:px-32 lg:px-40">
        {/* cover */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 mt-16">
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
        <div className="container flex flex-col items-center mx-auto py-2">
          <h1 className="text-[28px] font-roca text-center mb-8">
            Our Clinics
          </h1>
          <div>
            <ClinicItemList showStaticCard={true} enlargedView={true} />
          </div>
        </div>

        {/*clinic location form*/}
        <ClinicLocationForm />
      </main>
    </div>
  );
}
