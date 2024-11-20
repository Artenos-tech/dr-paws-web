"use client";
import Image from "next/image";
import DescritionImage from "@/public/assets/images/ServicesPage/DescriptionImage.png";
import ServicePageTab from "@/components/ui/ServicePageTab";
import { ServiceTabsData } from "@/model/mockData";
import Button from "@/components/ui/Button";
import { useState } from "react";
import ContactInfoModal from "@/components/ui/ContactInfoModal";
import UserAuthenticationModal from "@/components/ui/UserAuthenticationModal";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const Services = () => {
  const [isContactModalOpen, setContactIsModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("");
  const { user } = useUserContext();
  const navigate = useRouter();

  const handleLoginModalOpen = (val: string) => {
    if (user?.id) {
      navigate.push("/");
      return;
    }
    setLoginModalOpen(true);
    setButtonText(val);
  };

  const onSuccess = () => {
    setLoginModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[80px] row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full flex flex-col xl:flex-row items-center justify-between xl:space-x-14 xl:items-center space-y-8 xl:space-y-0 mt-[80px]">
          <div className="flex-shrink-0">
            <Image
              src={DescritionImage}
              alt="Clinic image with a dog"
              className="w-full rounded-md"
            />
          </div>
          <div className="w-full  text-center lg:text-left text-primary-1 md:my-4 lg:my-0 mt-4">
            <h1 className={`text-xl md:text-2xl lg:text-3xl xl:text-5xl`}>
              Everything Under One Roof
            </h1>
            <p className="text-xs md:text-sm xl:text-base xl:w-3/4 my-3 md:my-5">
              From consults through to emergency surgeries, we have you covered.
              We also offer grooming, diagnostic tests, imaging, and retail.
            </p>

            <Button
              buttonText="Book a visit"
              buttonBackground="bg-secondary-1"
              buttonClickEvent={() => handleLoginModalOpen("Book a Visit")}
            />
          </div>
        </div>

        <div className="w-full">
          <ServicePageTab tabs={ServiceTabsData} />
        </div>
        <div className="w-[75%] flex flex-col items-center gap-4 md:gap-6 ">
          <p className="text-center text-primary-1 text-sm font-sans italic font-semibold">
            We&apos;ve listed our most commonly requested services, but cater to
            many other needs. If you don&apos;t find what you need please get in
            touch and we&apos;d be happy to help or refer you to someone that
            can
          </p>
          <Button
            buttonText="Get in Touch"
            buttonBackground="bg-secondary-2"
            buttonClickEvent={() => setContactIsModalOpen(true)}
          />
        </div>
      </main>
      <ContactInfoModal
        isOpen={isContactModalOpen}
        onRequestClose={() => setContactIsModalOpen(false)}
      />
      <UserAuthenticationModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        // initialMobileNumber="9440705361"
        buttonText={buttonText}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default Services;
