import React from "react";
import Button from "./Button";
import { StaticImageData } from "next/image";

interface ClinicItemProps {
  clinic: {
    image: StaticImageData;
    clinicName: string;
    branch: string;
    description: string;
  };
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic }) => {
  const { image, clinicName, branch, description } = clinic;
  return (
    <>
      <div
        className={`bg-tint w-56 shadow-md rounded-md md:block hidden`}
      >
        <img
          src={image.src}
          alt={clinicName + "image"}
          className="rounded-t-md"
        />
        <div className="p-2">
          <h1 className="text-primary-1 text-base font-semibold">
            {clinicName}
          </h1>
          <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
            <p>{branch}</p> |<p>{description}</p>
          </div>
        </div>
        <button className="btn bg-secondary-1 rounded-none border-none text-white w-full rounded-b-md">
          Book a Visit
        </button>
      </div>
    </>
  );
};

export default ClinicItem;
