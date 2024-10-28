import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

interface ClinicItemProps {
  clinic: {
    image: StaticImageData;
    clinicName: string;
    branch: string;
    description: string;
  };
  className?: string;
}

const OurClinicsCard: React.FC<ClinicItemProps> = ({ clinic, className }) => {
  const { image, clinicName, branch, description } = clinic;
  return (
    <div
      className={cn(
        "bg-[#fffcf3] shadow-md rounded-md overflow-hidden flex flex-col h-full",
        className
      )}
    >
      <Image
        src={image}
        alt={clinicName + " image"}
        className="w-full h-[240px] object-cover"
      />
      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {clinicName}
        </h3>
        <div className="flex gap-1 text-sm text-gray-600 mb-4">
          <p>{branch}</p>
          <span>|</span>
          <p>{description}</p>
        </div>
      </div>
      <button className="bg-[#5281a2] h-[50px] text-white py-2 mt-auto">
        Book a Visit
      </button>
    </div>
  );
};

export default OurClinicsCard;
