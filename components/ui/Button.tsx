"use client";

import React from "react";
import { useRouter } from "next/navigation";

type buttonProps = {
  buttonText: string;
  buttonBackground: string;
  buttonLink?: string;
  buttonClickHandler?: () => void;
};

const Button: React.FC<buttonProps> = ({
  buttonText,
  buttonBackground,
  buttonLink,
  buttonClickHandler,
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        if (buttonLink) {
          router.push(buttonLink);
        } else if (buttonClickHandler) {
          buttonClickHandler();
        } else {
          return;
        }
      }}
      className={`font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base ${buttonBackground} `}
    >
      {buttonText}
    </button>
  );
};

export default Button;
