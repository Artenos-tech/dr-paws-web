import FaqList from "@/components/ui/FaqList";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewData } from "@/model/mockData";
import ClinicItemCarousel from "@/components/ui/ClinicItemCarousel";
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
          <div className="flex flex-col items-center md:items-start gap-5 w-full md:w-2/3 lg:w-1/3 mx-auto mt-6 md:ml-40 md:mt-10 lg:mt-12 lg:ml-40 text-center md:text-left">
            <h1 className="text-[32px] md:text-[48px] lg:text-[64px] leading-tight md:leading-snug lg:leading-none text-white">
              Veterinary Care re-imagined
              <p className="text-primary-3 text-[24px] md:text-[32px]">
                by pet lovers
              </p>
            </h1>
            <p className="text-white w-full md:w-[80%] lg:w-[70%] text-[14px] md:text-[16px] lg:text-[18px] px-2">
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
            <h1 className="mt-4 mb-16 text-center text-primary-1 text-2xl w-[80%] sm:w-full">
              Veterinary care, redesigned to be better
            </h1>
            <DescriptionCardList />
          </div>
          <div className="w-[90%] mx-auto sm:w-[70%]">
            <h1 className="w-[90%] mx-auto text-center mt-12 text-2xl sm:w-[30%]">
              Check out the places we call home
            </h1>
            <ClinicItemList />
          </div>

          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-[80%] mx-auto text-center mt-20 mb-10 sm:w-[40%]">
              <h1 className="w-[100%] mx-auto text-2xl sm:w-[50%]">
                Whatever your pet needs, we&apos;re there
              </h1>
              <p>
                Discover our most commonly requested services. For anything not
                listed, please get in touch with your local clinic
              </p>
            </div>
          </div>
          <Services />

          <div className="w-full my-20">
            <h1 className="text-2xl text-center text-primary-1">Reviews</h1>
            <div className="flex justify-center items-center my-20">
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

          <div className="w-[75%] mx-auto mt-40 flex flex-col gap-8">
            <h1 className="text-[28px] text-center">
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

          <div className="w-[75%] mx-auto text-center my-20 sm:w-[50%] md:[45%] lg:[40%]">
            <h1 className="text-2xl">Still have questions?</h1>
            <p className="text-[20px]">
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
