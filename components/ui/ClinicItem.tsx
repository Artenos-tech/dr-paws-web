"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clinic } from "@/model/typeDefinitions";
import UserAuthenticationModal from "./UserAuthenticationModal";

interface ClinicItemProps {
  clinic: Clinic;
  enlargedView: boolean;
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const { image, clinicName, services, id } = clinic;
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const [buttonText, setButtonText] = useState<string>("");

  const handleLoginModalOpen = (val: string) => {
    setLoginModalOpen(true);
    setButtonText(val);
  };

  const onSuccess = () => {
    setLoginModalOpen(false)
  };

  const handleBookVisit = () => {
    router.push(`/clinics/${id}`);
  };
  return (
    <div
      className={`bg-[#FFFCF3] ${
        !enlargedView && "w-full lg:w-[25%] min-h-[270px]"
      } flex flex-col justify-between h-full w-full shadow-md rounded-md`}
    >
      <div onClick={handleBookVisit} className="cursor-pointer">
        <Image
          src={image.src}
          alt={clinicName + " image"}
          className="rounded-t-md"
          layout="responsive"
          width={500}
          height={300}
        />
        <div className="p-2">
          <h1 className="text-primary-1 text-base">{clinicName}</h1>
          <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
            <p>{services}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleLoginModalOpen("Book a Visit")}
        className={`btn bg-secondary-1 rounded-none border-none z text-white w-full rounded-b-md py-3`}
      >
        Book a Visit
      </button>

      <UserAuthenticationModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        // initialMobileNumber="9440705361"
        buttonText={buttonText}
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default ClinicItem;
