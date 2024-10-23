import React from "react";
import { Open_Sans } from "next/font/google";

type buttonProps = {
  text: string;
  background: string;
  rounded?: boolean;
};

const openSans = Open_Sans({ subsets: ["latin"], weight: ["700"] });

const Button: React.FC<buttonProps> = ({ text, background, rounded }) => {
  return (
    <button
      className={`${background} ${openSans} ${
        rounded ? "rounded-none rounded-b-md w-full" : "rounded-full"
      } btn px-10 text-white tracking-wider`}
    >
      {text}
    </button>
  );
};

export default Button;
