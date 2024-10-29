import React from "react";

type renewProps = {
  renewText: string;
  renewLink?: string;
};

const RenewBtn: React.FC<renewProps> = ({ renewText }) => {
  return (
    <button className="btn border-2 tracking-wider border-primary-2 text-white bg-transparent rounded-full">
      {renewText}
    </button>
  );
};

export default RenewBtn;
