import React from "react";
import { Open_Sans } from "next/font/google";

type buttonProps = {
  buttonText: string;
  buttonBackground: string;
  buttonLink?: string;
};

const openSans = Open_Sans({ subsets: ["latin"], weight: ["700"] });

const Button: React.FC<buttonProps> = ({ buttonText, buttonBackground }) => {
  return (
    <button
      className={`${buttonBackground} ${openSans}  btn rounded-full px-10 text-white tracking-wider`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
