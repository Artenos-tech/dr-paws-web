import React from "react";
import { Open_Sans } from "next/font/google";

type buttonProps = {
  buttonText: string;
  buttonBackground: string;
  buttonLink?: string;
};

const Button: React.FC<buttonProps> = ({ buttonText, buttonBackground }) => {
  return (
    <button
      className={`font-open-sans btn rounded-full px-10 py-2 text-white tracking-wider ${buttonBackground} `}
    >
      {buttonText}
    </button>
  );
};

export default Button;
