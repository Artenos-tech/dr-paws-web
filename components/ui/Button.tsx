"use client";

import React from "react";
import { useRouter } from "next/navigation";

type ButtonProps = {
  buttonText: string;
  buttonBackground: string;
  buttonLink?: string;
  buttonClickEvent?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  buttonText,
  buttonBackground,
  buttonLink,
  buttonClickEvent,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (buttonLink) {
      router.push(buttonLink);
    } else if (buttonClickEvent) {
      buttonClickEvent();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base ${buttonBackground}`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
