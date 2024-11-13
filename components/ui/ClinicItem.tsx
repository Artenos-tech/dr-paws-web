"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Clinic } from "@/model/typeDefinitions";

interface ClinicItemProps {
  clinic: Clinic;
  enlargedView: boolean
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const { image, clinicName, services, id } = clinic;
  const router = useRouter();

  const handleBookVisit = () => {
    router.push(`/clinics/${id}`);
  };
  return (
    <div
      className={`bg-[#FFFCF3] ${!enlargedView && "w-full lg:w-[25%] min-h-[265px]"} flex flex-col justify-between h-full w-full shadow-md rounded-md`}
      onClick={handleBookVisit}
    >
      <div><img
        src={image.src}
        alt={clinicName + "image"}
        className="rounded-t-md"
      />
      <div className="p-2">
        <h1 className="text-primary-1 text-base">{clinicName}</h1>
        <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
          <p>{services}</p>
        </div></div>
      
      </div>
      <button
        onClick={handleBookVisit}
        className={`btn bg-secondary-1 rounded-none border-none text-white w-full rounded-b-md py-3`}
      >
        Book a Visit
      </button>
    </div>
  );
};

export default ClinicItem;
