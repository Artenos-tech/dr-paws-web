"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clinic } from "@/model/typeDefinitions";
import UserAuthenticationModal from "./UserAuthenticationModal";
import { useUserContext } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";

interface ClinicItemProps {
  clinic: Clinic;
  enlargedView: boolean;
}

const ClinicItem: React.FC<ClinicItemProps> = ({ clinic, enlargedView }) => {
  const { image, clinicName, services, id } = clinic;
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const [buttonText, setButtonText] = useState<string>("");
  const { getAuthToken, refresh } = useUserContext();
  const navigate = useRouter();

  const handleLoginModalOpen = (val: string) => {
    const authToken = getAuthToken();
    if (authToken) {
      router.push("/");
      return;
    }
    setLoginModalOpen(true);
    setButtonText(val);
  };

  const onSuccess = (toastMessage: string) => {
    setLoginModalOpen(false);
    refresh()
    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
    });
  };

  const handleBookAVisit = () => {
    const authToken = getAuthToken();
    console.log(authToken);
    return authToken
      ?  navigate.push("/user/book-appointment")
      : handleLoginModalOpen("Book a Visit");
  };

  const handleBookVisit = () => {
    router.push(`/clinics/${id}`);
  };
  return (
    <div
      className={`bg-[#FFFCF3] ${
        !enlargedView && "w-full lg:w-[50%] xl:w-[25%] min-h-[270px]"
      } flex flex-col justify-between h-full w-full shadow-md rounded-md`}
    >
      <div onClick={handleBookVisit} className="cursor-pointer">
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

      <UserAuthenticationModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        // initialMobileNumber="9440705361"
        buttonText={buttonText}
        onSuccess={onSuccess}
      />
      <Toaster />
    </div>
  );
};

export default ClinicItem;
