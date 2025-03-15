import { useUserContext } from "@/context/UserContext";
import Image, { StaticImageData } from "next/image";
import React from "react";
import CustomButton from "./CustomButton";
import { useRouter } from "next/navigation";

interface descriptionCardProps {
  index: number;
  description: {
    image: StaticImageData;
    title: string;
    desciption: string;
    button: {
      buttonText: string;
      buttonBackground: string;
      buttonLink?: string;
      buttonClickEvent?: () => void;
    };
  };
  openContactModal?: () => void;
  openLoginModal?: ((val: string) => void) | undefined;
}

const DescriptionCard: React.FC<descriptionCardProps> = ({
  index,
  description,
  openContactModal,
  openLoginModal,
}) => {
  const { image, title, button } = description;
  const { isLoggedIn } = useUserContext();
  const navigate = useRouter();

  const handleBookAVisit = () => {
    return isLoggedIn
      ? navigate.push("/user/book-appointment")
      : openLoginModal && openLoginModal("Book a Visit");
  };

  const handleModalByButtonText = () => {
    if (button.buttonText.includes("Download")) {
      return <CustomButton {...button} buttonClickEvent={openContactModal} />;
    } else if (button.buttonText === "Book a Visit") {
      return <CustomButton {...button} buttonClickEvent={handleBookAVisit} />;
    }
    return (
      <CustomButton
        {...button}
        buttonClickEvent={() => {
          if (openLoginModal) {
            openLoginModal(button.buttonText);
          }
        }}
      />
    );
  };

  return (
    <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center lg:gap-20">
      <div className={`w-full ${index % 2 !== 0 ? "lg:order-2" : ""}`}>
        <Image
          src={image}
          alt={title + " image"}
          className="mx-auto rounded-md"
        />
      </div>
      <div className="w-full text-center lg:text-left text-primary-1 my-3 md:my-8 lg:my-0">
        <h1 className={`text-md md:text-2xl`}>{title}</h1>
        <p className="text-sm md:text-base my-3 md:my-5">
          {description.desciption}
        </p>
        {handleModalByButtonText()}
      </div>
    </div>
  );
};

export default DescriptionCard;
