"use client";

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
import { useState } from "react";
import UserAuthenticationModal from "@/components/ui/UserAuthenticationModal";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("");
  const navigate = useRouter();

  const { getAuthToken, refresh } = useUserContext();

  const handleLoginModalOpen = (text: string) => {
    const authToken = getAuthToken();
    if (authToken) {
      if (text === "Become a member") {
        navigate.push("/membership");
        return;
      } else if (text === "Book a Visit") {
        navigate.push("/book-appointment");
        return;
      }
      navigate.push("/");
      return;
    }
    setLoginModalOpen(true);
    setButtonText(text);
  };

  const onSuccess = (toastMessage: string) => {
    console.log(buttonText);
    if (buttonText === "Become a member") {
      navigate.push("/membership");
    }
    if (buttonText === "Book a Visit") {
      navigate.push("/book-appointment");
    }
    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
      position: "bottom-right",
    });
    refresh()
    setLoginModalOpen(false);
  };

  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="w-full flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-banner bg-cover bg-top bg-no-repeat h-96 w-full md:h-[500px] lg:h-[600px] min-h-[300px]">
          <div className="flex flex-col items-center md:items-start gap-0 w-full md:w-full  lg:w-1/2 mx-auto mt-6 md:ml-32 md:mt-10 lg:gap-4 lg:mt-12 lg:ml-40 text-center md:text-left">
            <div>
              <p className="text-[12px] md:text-[16px] lg:text-[18px] font-openSans tracking-[0.29em] font-bold leading-tight md:leading-snug lg:leading-none text-primary-1">
                INDIA&apos;S FRIENDLIEST VET CLINICS
              </p>
              <h1 className="lg:w-full text-[28px] md:w-[80%] md:text-[40px] lg:text-[60px] text-primary-1 leading-tight md:leading-snug lg:leading-none">
                Where pets bring <br />their people.
              </h1>
            </div>
            <p className="text-primary-1 w-full md:w-[80%] lg:w-[70%] text-[12px] md:text-[14px] lg:text-[16px] px-10 md:px-0 mt-2 font-openSans tracking-wider font-semibold">
              WHO BRINGS YOU HERE TODAY?
            </p>
            <div className="flex justify-center md:justify-start">
              <BannerList openLoginModal={handleLoginModalOpen} />
            </div>
          </div>
        </div>

        <div className="w-full px-8 md:px-32 lg:px-20 xl:px-40">
          <div className="flex flex-col items-center justify-center">
            <h1 className="mt-4 mb-16 text-center text-primary-1 text-xl md:text-4xl px-8">
              Veterinary care, redesigned to be better
            </h1>
            <DescriptionCardList openLoginModal={handleLoginModalOpen} />
          </div>
          <div className="mx-auto mt-12 lg:mt-32">
            <h1 className="mx-auto text-center text-xl md:text-4xl">
              Check out the places
            </h1>
            <h1 className="mx-auto text-center text-xl md:text-4xl mb-4 md:mb-10">
              we call home
            </h1>
            <div className="mx-auto pt-5 w-full">
              <ClinicItemList showStaticCard={false} enlargedView={false} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-20 md:mt-32 lg:scroll-px-40">
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
              See What Our Customers Are Saying About Us
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
                    name={reviewData[0].name}
                    review={reviewData[0].review}
                    className="w-[290px] md:w-[330px] custom:min-w-[410px] custom:absolute custom:-top-14 custom:-right-[92%]"
                  />
                  {/* ReviewCard 2 */}
                  <ReviewCard
                    name={reviewData[1].name}
                    review={reviewData[1].review}
                    className="w-[290px] md:w-[330px] custom:min-w-[410px] custom:absolute custom:-bottom-18 custom:-right-[85%]"
                  />
                  {/* ReviewCard 3 */}
                  <ReviewCard
                    name={reviewData[2].name}
                    review={reviewData[2].review}
                    className="w-[290px] md:w-[330px] custom:min-w-[410px] custom:absolute custom:top-[5%] custom:-left-[90%]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-20 md:mt-40 flex flex-col gap-8">
            <h1 className="text-xl md:text-4xl text-center">
              Our Medical Teams Bring The Magic to Dr. Paws
            </h1>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <Image src={YellowAndDocWithDog} alt="Yellow" />
              </div>
              <div className="p-5 lg:p-10 flex flex-col gap-6 w-full lg:w-1/2">
                <div className="flex flex-col gap-2">
                  <div className="flex w-full gap-[18px]">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                    <h1 className="text-[15px] sm:text-[20px]">
                      Doing What&apos;s Right. Always
                    </h1>
                  </div>
                  <p className=" text-[14px] ml-0 lg:ml-[58px] text-start">
                    Unlike other clinics, our teams are evaluated on customer
                    satisfaction over revenue. This ensures we never
                    over-medicate or suggest unnecessary treatments.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex w-full gap-[18px]">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                    <h1 className="text-[15px] sm:text-[20px]">
                      Highly Qualified & Up-to-Date
                    </h1>
                  </div>
                  <p className=" text-[14px] ml-0 lg:ml-[58px] text-start">
                    We have a highly selective hiring process, with vets &
                    technicians coming from the best schools & practices. Once
                    on the team, we ensure they attend conferences and courses
                    to learn new skills, and stay up-to-date
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex w-full gap-[18px]">
                    <Image
                      src={TickMark}
                      className="w-[38px]"
                      alt="tick mark"
                    />
                    <h1 className="text-[15px] sm:text-[20px]">
                      Treating Animals, Like They&apos;re Our Own
                    </h1>
                  </div>
                  <p className=" text-[14px] ml-0 lg:ml-[58px] text-start">
                    We focus on bedside manner, pet psychology and handling in
                    every team member&apos;s training. Your pet will feel at
                    ease with us
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto text-center my-20 flex flex-col">
            <h1 className="text-xl md:text-4xl mb-8">Still have questions?</h1>
            <p className=" md:text-xl">
              If your question is still not answered, please get in touch and
              we&apos;d be happy to help
            </p>
          </div>

          <FaqList />

          <UserAuthenticationModal
            isOpen={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            buttonText={buttonText}
            onSuccess={onSuccess}
          />
        </div>
      </main>
      <Toaster />
    </div>
  );
}
