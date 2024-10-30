import React from "react";
import Image, { StaticImageData } from "next/image";
import { CiLocationOn } from "react-icons/ci";

interface DoctorCardProps {
  doctor: {
    name: string;
    description: string;
    experience: string;
    location: string;
    image: StaticImageData;
  };
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { name, description, experience, location, image } = doctor;

  return (
    <div className="rounded-xl border border-primary-3 shadow-md bg-primary-3 text-primary-1 p-4 sm:p-6 w-full max-w-sm flex flex-col items-center text-center space-y-4">
      <Image
        src={image}
        alt={name}
        width={100}
        height={100}
        className="rounded-full object-cover w-[100px] h-[100px]"
      />
      <h2 className="text-lg sm:text-xl">{name}</h2>
      <p className="text-sm sm:text-base">{description}</p>
      <p className="text-sm sm:text-base">{experience}</p>
      <div className="flex items-center space-x-2 text-primary-1">
        <CiLocationOn size={20} />
        <span className="text-sm sm:text-base">{location}</span>
      </div>
      <button className="mt-4 py-2 px-4 rounded-lg bg-accent text-white text-sm hover:bg-secondary-1">
        View Profile
      </button>
    </div>
  );
};

export default DoctorCard;
