"use client";

import { photos } from "@/model/mockData";
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";
import { Clinic } from "@/model/typeDefinitions";
import CustomButton from "./CustomButton";
import UserAuthenticationModal from "./UserAuthenticationModal";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface ClinicGalleryProps {
  clinic: Clinic;
}

function ClinicGallery({ clinic }: ClinicGalleryProps) {
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const clinicImages = photos.find((clinicInfo) => clinicInfo.id === clinic.id);
  const limitedGalleryItems = clinicImages
    ? clinicImages.photos.slice(0, 7)
    : [];
  const [isMounted, setIsMounted] = useState(false);

  const [buttonText, setButtonText] = useState<string>("");
  const { getAuthToken, refresh } = useUserContext();
  const navigate = useRouter();

  const handleLoginModalOpen = (val: string) => {
    if (getAuthToken()) {
      navigate.push("/");
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
      position: "bottom-right",
    });
  };

  useEffect(() => {
    setIsMounted(true);
    const appElement = document.getElementById("__next");
    if (appElement) {
      ReactModal.setAppElement(appElement);
    } else {
      console.warn("ReactModal: App element with id '__next' not found.");
    }
  }, []);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleBookAVisit = () => {
    const authToken = getAuthToken();
    console.log(authToken);
    return authToken
      ?  navigate.push("/user/book-appointment")
      : handleLoginModalOpen("Book a Visit");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="gallery-container grid grid-cols-3 gap-4 max-h-[75vh] relative overflow-y-auto">
        {limitedGalleryItems.map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={
              index === limitedGalleryItems.length - 1
                ? () => openModal(0)
                : () => openModal(index)
            }
          >
            <img
              src={image.src}
              alt="gallery image"
              className={`w-full h-full object-cover ${
                index === limitedGalleryItems.length - 1 ? "opacity-60" : ""
              }`}
              loading="lazy"
            />
            {index === limitedGalleryItems.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center !text-gray-600 font-bold text-xl">
                View Gallery
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between mt-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-4xl">{clinic.clinicName}</h1>
        </div>
        <div>
          <CustomButton
            buttonText="Book a visit"
            buttonBackground="bg-secondary-1"
            buttonClickEvent={handleBookAVisit}
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-primary-1">{clinic.services}</p>
      </div>
      {/* Modal */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="modal-box w-11/12 max-w-4xl shadow-none bg-transparent relative outline-none"
        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Gallery Modal"
        shouldFocusAfterRender={false}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            className="text-white text-2xl"
            onClick={closeModal}
            aria-label="Close Modal"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Image Navigation */}
        <div className="flex justify-between items-center gap-2">
          {/* Previous Button */}
          <button
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? limitedGalleryItems.length - 1 : prev - 1
              )
            }
            aria-label="Previous Image"
          >
            <IoIosArrowBack size={24} />
          </button>

          {/* Current Image */}
          <div className="w-full">
            <img
              src={limitedGalleryItems[currentIndex].src}
              alt="gallery image"
              className="overflow-hidden w-full h-[80vh] object-contain"
              loading="lazy"
            />
          </div>

          {/* Next Button */}
          <button
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === limitedGalleryItems.length - 1 ? 0 : prev + 1
              )
            }
            aria-label="Next Image"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </ReactModal>

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
}

export default ClinicGallery;
