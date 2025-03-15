"use client";
import { photos } from "@/model/mockData";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";

interface ClinicPhotosProps {
  clinicId: string;
  gallery: {
    [imageId: string]: {
      imageUrl: string;
      imageOrder: number;
    };
  } | null;
}

function ClinicPhotos({ clinicId, gallery }: ClinicPhotosProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  const clinicImages = gallery
    ? Object.entries(gallery).map(([imageId, image]) => ({
        src: image.imageUrl,
        order: image.imageOrder,
        id: imageId,
      }))
    : photos.find((photoGroup) => photoGroup.id === clinicId)?.photos;

  // Ensure ReactModal can find the root app element for accessibility
  useEffect(() => {
    setIsMounted(true);
    const appElement = document.getElementById("__next");
    if (appElement) {
      ReactModal.setAppElement(appElement);
    } else {
      console.warn("ReactModal: App element with id '__next' not found.");
    }
  }, []);

  const openModal = (imageSrc: string) => {
    setCurrentImage(imageSrc);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentImage("");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full py-[40px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] justify-items-center sm:justify-items-start">
        {clinicImages?.map((photo, index) => (
          <div
            key={index}
            className="w-full max-w-[245px] h-full max-h-[245px] rounded-[5px] overflow-hidden border border-gray-300 shadow-md cursor-pointer"
            onClick={() => openModal(photo.src)}
          >
            <Image
              src={photo.src}
              alt="clinic image"
              width={245}
              height={245}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="modal-box w-11/12 max-w-4xl shadow-none bg-transparent relative outline-none"
        overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        contentLabel="Clinic Photo"
        shouldFocusAfterRender={false}
      >
        <div className="w-full h-[80vh] relative flex items-center justify-center">
          {currentImage && (
            <Image
              src={currentImage}
              alt="clinic image"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
        </div>
      </ReactModal>
    </div>
  );
}

export default ClinicPhotos;
