import FaqList from "@/components/ui/FaqList";
import ReviewCard from "@/components/ui/ReviewCard";
import { reviewData } from "@/model/mockData";
import BannerCard from "@/components/ui/BannerCard";
import ClinicItem from "@/components/ui/ClinicItem";
import ClinicItemCarousel from "@/components/ui/ClinicItemCarousel";
import DescriptionCardList from "@/components/ui/DescriptionCardList";
import { bannerItems, clinicItems } from "@/model/mockData";
import BannerList from "@/components/ui/BannerList";
import ClinicItemList from "@/components/ui/ClinicItemList";
import Services from "@/components/ui/Services";
import Image from "next/image";
import GreenBackground from "@/public/assets/images/reviewImages/greenBackground.svg";
import Lady from "@/public/assets/images/reviewImages/Girl.png";
import Yellow from "@/public/assets/images/petValues/Yellow.svg";
import DocWithDog from "@/public/assets/images/petValues/DocWithDog.png";
import YellowAndDocWithDog from "@/public/assets/images/petValues/YellowAndDocWithDog.svg"

import TickMark from "@/public/assets/images/petValues/TickMark.svg";

export default function Home() {
  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-banner bg-cover bg-center bg-no-repeat h-96 w-full md:h-[500px] lg:h-[600px] min-h-[300px]">
          <div className="flex flex-col flex-start gap-5 w-1/3 ml-40 mt-12">
            <h1 className="text-[64px] leading-none  text-white">
              Veterinary Care re-imagined{" "}
              <p className="text-primary-3">by pet lovers</p>
            </h1>
            <p className="text-white w-[70%]">
              Book a visit to one of our clinics right now. Which friend will we
              meet?
            </p>
            <div className="flex ">
              <BannerList />
            </div>
          </div>
        </div>
        <div className="w-full">
          <h1 className="mt-4 mb-16 text-center text-primary-1 text-2xl">
            Veterinary care, redesigned to be better
          </h1>
          <DescriptionCardList />
          <div className="w-[70%] mx-auto">
            <h1 className="w-[30%] mx-auto text-center mt-12 text-2xl">
              Check out the places we call home
            </h1>
            <ClinicItemList />
          </div>
          {/* this is component will show clinic card in carousel */}
          <ClinicItemCarousel />
          <div className="w-[40%] mx-auto text-center mt-20 mb-10">
            <h1 className="w-[50%] mx-auto text-2xl">
              Whatever your pet needs, we're there
            </h1>
            <p>
              Discover our most commonly requested services. For anything not
              listed, please get in touch with your local clinic
            </p>
          </div>
          <Services />

          <div className="my-20">
            <h1 className="text-2xl text-center text-primary-1">Review</h1>
            <div className="flex justify-center items-center my-20">
              <div className="relative flex items-center justify-center border-yellow-500">
                <div className="relative w-[376px] h-[421px]">
                  <Image
                    src={GreenBackground}
                    alt="Background Shape"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="absolute w-[348px] h-[357px] -left-0 bottom-0 ">
                  <Image
                    src={Lady}
                    alt="Girl with Cat"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <ReviewCard
                  name={reviewData.name}
                  review={reviewData.review}
                  className="min-w-[410px] absolute -top-14 -right-[92%]"
                />
                <ReviewCard
                  name={reviewData.name}
                  review={reviewData.review}
                  className="min-w-[405px] absolute -bottom-14 -right-[80%]"
                />
                <ReviewCard
                  name={reviewData.name}
                  review={reviewData.review}
                  className="min-w-[365px] absolute top-[15%] -left-[90%]"
                />
              </div>
            </div>
          </div>
          <div className="w-[75%] mx-auto mt-40 flex flex-col gap-8">
            <h1 className="text-[28px] text-center">
              Our vets bring the magic to Dr. Paws
            </h1>
            <div className="flex flex-row gap-2">
              <div className=" w-[520px] ">
                <div className="flex justify-end">
                  <Image src={YellowAndDocWithDog} alt="Yellow" />
                </div>
              </div>
              <div className="p-10 flex flex-col gap-6 w-[512px]">
                <div className="w-full flex flex-row">
                  <div className="w-1/3">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-[20px]">Animals first. Always.</h1>
                    <p className="text-[14px]">
                      Unlike other clinics, we evaluate our vets based on
                      customer satisfaction over revenue. This ensure we never
                      over-medicate or suggest unnecessary treatments.
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-row">
                  <div className="w-1/3">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-[20px]">
                      Highly qualified, trained on the latest methods
                    </h1>
                    <p className="text-[14px]">
                      We only hire vets from the best veterinary schools, and
                      make sure they are supported to attend courses and learn
                      new techniques across the world
                    </p>
                  </div>
                </div>
                <div className="w-full flex flex-row">
                  <div className="w-1/3">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-[20px]">
                      Your best friend is our best friend
                    </h1>
                    <p className="text-[14px]">
                      All our vets are passionate about animals, and love being
                      around them. Rest assured your animal will feel
                      comfortable and at home with us
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[40%] mx-auto text-center my-20">
            <h1 className="text-2xl">Still have questions?</h1>
            <p className="text-[20px]">If your question is still not answered, please get in touch and we'd be happy to help</p>
          </div>

          <FaqList />
        </div>
      </main>
    </div>
  );
}
