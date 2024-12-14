"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { useUserContext } from "@/context/UserContext";
import { Clinic } from "@/model/typeDefinitions";

interface ClinicItemProps {
  clinic: Clinic;
  enlargedView: boolean;
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const { image, clinicName, services, id } = clinic;
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const [buttonText, setButtonText] = useState<string>("");
  const { getAuthToken, refresh, initiateLogin } = useUserContext();
  const navigate = useRouter();

  const onSuccess = (toastMessage: string) => {
    if (buttonText === "View Profile" || buttonText === "View Pets") {
      navigate.push("/user/profile");
    }

    if (buttonText === "Book a Visit") handleBookAVisit();
    setLoginModalOpen(false);
    refresh()
    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handleBookAVisit = () => {
    const authToken = getAuthToken();
    console.log(authToken);
    return authToken
      ?  navigate.push("/user/book-appointment")
      : initiateLogin("Book a Visit");
  };

  const goToClinicPage = () => {
    router.push(`/clinics/${id}`);
  };

  return (
    <div
      className={`bg-[#FFFCF3] ${
        !enlargedView && "w-full lg:w-[50%] xl:w-[25%] min-h-[270px]"
      } flex flex-col justify-between h-full w-full shadow-md rounded-md`}
    >
      <div onClick={goToClinicPage} className="cursor-pointer">
        <div className="image-container">
          <Image
            src={image.src}
            alt={clinicName + " image"}
            className="image rounded-t-md"
            layout="fill"
          />
        </div>
        <div className="p-2">
          <h1 className="text-primary-1 text-base">{clinicName}</h1>
          <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
            <p>{services}</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleBookAVisit}
        className={`btn bg-secondary-1 rounded-none border-none z text-white w-full rounded-b-md py-3`}
      >
        Book a Visit
      </button>
      <Toaster />
    </div>
  );
};

export default ClinicItem;
