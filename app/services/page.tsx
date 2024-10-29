import Image from "next/image";
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png";
import Button from "@/components/ui/Button";
import ServicePageTab from "@/components/ui/ServicePageTab";

const Services = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-[70%]">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center p-1 lg:space-x-8 space-y-8 lg:space-y-0 mt-[80px]">
          <div className="flex-shrink-0">
            <Image
              src={DescritionImage}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-end">
            <div className="text-center items-center  lg:text-left w-[450px] h-[170px] flex flex-col gap-4">
              <h2 className="text-3xl font-bold ">
                Come And Visit Us At Our Place!
              </h2>
              <p className="text-lg text-gray-700">
                We are opening our homely Dr. Paws clinics across neighbourhoods
                all over the country. If we're not near you right now, we hope
                to be very soon!
              </p>
              <div className="w-fit">
                <Button
                  buttonText="Book a Visit"
                  buttonBackground="secondary-1"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
        </div>
      </main>
    </div>
  );
};

export default Services;
