import FaqList from "@/components/ui/FaqList";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewData } from "@/model/mockData";
import DescriptionCardList from "@/components/ui/DescriptionCardList";
import BannerList from "@/components/ui/BannerList";
import ClinicItemList from "@/components/ui/ClinicItemList";
import Services from "@/components/ui/Services";
import Image from "next/image";
import GreenBackground from "@/public/assets/images/reviewImages/greenBackground.svg";
import Lady from "@/public/assets/images/reviewImages/Girl.png";
import YellowAndDocWithDog from "@/public/assets/images/petValues/YellowAndDocWithDog.svg";
import TickMark from "@/public/assets/images/petValues/TickMark.svg";

export default function Home() {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-banner bg-cover bg-center bg-no-repeat h-96 w-full md:h-[500px] lg:h-[600px] min-h-[300px]">
          <div className="flex flex-col items-center md:items-start gap-0 w-full md:w-full  lg:w-1/2 mx-auto mt-6 md:ml-32 md:mt-10 lg:gap-4 lg:mt-12 lg:ml-40 text-center md:text-left">
            <div>
              <h1 className="text-[32px] md:text-[40px] lg:text-[56px]  leading-tight md:leading-snug lg:leading-none text-white">
                Veterinary Care
              </h1>
              <h1 className="text-[32px] md:text-[40px] lg:text-[56px] leading-tight md:leading-snug lg:leading-none text-white">
                {" "}
                re-imagined
              </h1>
              <h1 className="text-primary-3 text-[32px] md:text-[40px] lg:text-[56px] leading-tight md:leading-snug lg:leading-none">
                by pet lovers
              </h1>
            </div>
            <p className="text-white w-full md:w-[80%] lg:w-[70%] text-[14px] md:text-[16px] lg:text-[18px] px-10 md:px-0">
              Book a visit to one of our clinics right now. Which friend will we
              meet?
            </p>
            <div className="flex justify-center md:justify-start">
              <BannerList />
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="mt-4 mb-16 text-center text-primary-1 text-xl md:text-4xl px-8">
              Veterinary care, redesigned to be better
            </h1>
            <DescriptionCardList />
          </div>
          <div className="mx-auto mt-12 lg:mt-32">
            <h1 className="mx-auto text-center text-xl md:text-4xl">
              Check out the places
            </h1>
            <h1 className="mx-auto text-center text-xl md:text-4xl">
              we call home
            </h1>
            <div className="mx-auto pt-5 px-8 md:px-32 lg:px-40">
              <ClinicItemList showStaticCard={false} enlargedView={false} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-20 md:mt-32 px-8 md:px-32 lg:scroll-px-40">
            <div className="mx-auto text-center mb-14">
              <h1 className="mx-auto text-xl md:text-4xl px-1 md:px-20 mb-6">
                Whatever your pet needs, we&apos;re there
              </h1>
              <p>
                Discover our most commonly requested services. For anything not
                listed, please get in touch with your local clinic
              </p>
            </div>
          </div>
          <Services />

          <div className="w-full mt-20 md:mt-32">
            <h1 className="text-xl md:text-4xl text-center text-primary-1">
              Reviews
            </h1>
            <div className="flex justify-center items-center mt-10 md:mt-20">
              <div className="relative flex flex-col items-center justify-center custom:flex-row border-yellow-500">
                {/* Container for Green Background and Lady Image */}
                <div className="relative w-[250px] h-[280px] md:w-[300px] md:h-[336px] lg:w-[376px] lg:h-[421px]">
                  {/* Green Background */}
                  <Image
                    src={GreenBackground}
                    alt="Background Shape"
                    layout="fill"
                    objectFit="cover"
                  />
                  {/* Lady Image */}
                  <div className="absolute bottom-0 left-0 w-[220px] h-[250px] md:w-[264px] md:h-[300px] lg:w-[348px] lg:h-[357px]">
                    <Image
                      src={Lady}
                      alt="Girl with Cat"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                {/* Review Cards */}
                <div className="flex flex-col mt-4 custom:mt-0 custom:flex-none">
                  {/* ReviewCard 1 */}
                  <ReviewCard
                    name={reviewData.name}
                    review={reviewData.review}
                    className="w-[290px] md:w-[330px] custom:min-w-[410px] custom:absolute custom:-top-14 custom:-right-[92%]"
                  />
                  {/* ReviewCard 2 */}
                  <ReviewCard
                    name={reviewData.name}
                    review={reviewData.review}
                    className="w-[290px] md:w-[330px] custom:min-w-[405px] custom:absolute custom:-bottom-14 custom:-right-[80%]"
                  />
                  {/* ReviewCard 3 */}
                  <ReviewCard
                    name={reviewData.name}
                    review={reviewData.review}
                    className="w-[290px] md:w-[330px] custom:min-w-[365px] custom:absolute custom:top-[15%] custom:-left-[90%]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-[75%] mx-auto mt-20 md:mt-40 flex flex-col gap-8">
            <h1 className="text-xl md:text-4xl text-center">
              Our vets bring the magic to Dr. Paws
            </h1>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <Image src={YellowAndDocWithDog} alt="Yellow" />
              </div>
              <div className="p-10 flex flex-col gap-6 w-full lg:w-1/2">
                <div className="">
                  <div className="flex w-full gap-[18px]">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                    <h1 className="text-[15px] sm:text-[20px]">
                      Animals first. Always.
                    </h1>
                  </div>
                  <p className=" text-[14px] ml-[58px]">
                    Unlike other clinics, we evaluate our vets based on customer
                    satisfaction over revenue. This ensures we never
                    over-medicate or suggest unnecessary treatments.
                  </p>
                </div>
                <div className="">
                  <div className="flex w-full gap-[18px]">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                    <h1 className="text-[15px] sm:text-[20px]">
                      Highly qualified, trained on the latest methods
                    </h1>
                  </div>
                  <p className=" text-[14px] ml-[58px]">
                    We only hire vets from the best veterinary schools, and make
                    sure they are supported to attend courses and learn new
                    techniques across the world
                  </p>
                </div>
                <div className="">
                  <div className="flex w-full gap-[18px]">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                    <h1 className="text-[15px] sm:text-[20px]">
                      Your best friend is our best friend
                    </h1>
                  </div>
                  <p className=" text-[14px] ml-[58px]">
                    All our vets are passionate about animals, and love being
                    around them. Rest assured your animal will feel comfortable
                    and at home with us
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto text-center my-20 flex flex-col px-8 md:px-32 lg:px-40">
            <h1 className="text-xl md:text-4xl mb-8">Still have questions?</h1>
            <p className=" md:text-xl">
              If your question is still not answered, please get in touch and
              we&apos;d be happy to help
            </p>
          </div>

          <FaqList />
        </div>
      </main>
    </div>
  );
}
