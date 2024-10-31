"use client";
import React from "react";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleBookVisit = () => {
    router.push(`/clinics/${clinicName}`);
  };
  return (
    <>
      <div
        className={`bg-[#FFFCF3] w-54 shadow-md rounded-md `}
        onClick={handleBookVisit}
      >
        <img
          src={image.src}
          alt={clinicName + "image"}
          className="rounded-t-md"
        />
        <div className="p-2">
          <h1 className="text-primary-1 text-base">{clinicName}</h1>
          <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
            <p>{branch}</p> |<p>{description}</p>
          </div>
        </div>
        <button
          onClick={handleBookVisit}
          className="btn bg-secondary-1 rounded-none border-none text-white w-full rounded-b-md py-3"
        >
          Book a Visit
        </button>
      </div>
    </>
  );
};

export default ClinicItem;
