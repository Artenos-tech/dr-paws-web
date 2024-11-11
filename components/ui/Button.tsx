"use client";

import React from "react";
import { useRouter } from "next/navigation";

type buttonProps = {
  buttonText: string;
  buttonBackground: string;
  buttonLink?: string;
};

const Button: React.FC<buttonProps> = ({
  buttonText,
  buttonBackground,
  buttonLink,
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => (buttonLink ? router.push(buttonLink) : null)}
      className={`font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base ${buttonBackground} `}
    >
      {buttonText}
    </button>
  );
};

export default Button;
