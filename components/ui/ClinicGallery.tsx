"use client";
import { photos } from "@/model/mockData"; // photos is an array of images
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";

function ClinicGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const limitedGalleryItems = photos.slice(0, 7);

  // Ensure setAppElement is called only on the client side after the DOM is ready
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        ReactModal.setAppElement(appElement);
      } else {
        console.warn("ReactModal: App element with id '__next' not found.");
      }
    }
  }, []);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div className="gallery-container grid grid-cols-3 gap-4">
        {limitedGalleryItems.map((image, index) => (
          <div
            key={index}
            className={`relative bg-black ${
              index === limitedGalleryItems.length - 1 ? "cursor-pointer" : ""
            }`}
            onClick={
              index === limitedGalleryItems.length - 1
                ? () => openModal(0)
                : undefined
            }
          >
            <img
              src={image.src}
              alt="gallery image"
              className={`w-full h-full object-cover ${
                index === limitedGalleryItems.length - 1 ? "opacity-60" : ""
              }`}
            />
            {index === limitedGalleryItems.length - 1 && (
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                View Gallery
              </span>
            )}
          </div>
        ))}
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
                prev === 0 ? photos.length - 1 : prev - 1
              )
            }
            aria-label="Previous Image"
          >
            <IoIosArrowBack size={24} />
          </button>

          {/* Current Image */}
          <div className="w-full">
            <img
              src={photos[currentIndex].src}
              alt="gallery image"
              className="overflow-hidden w-full h-[80vh] object-contain"
            />
          </div>

          {/* Next Button */}
          <button
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === photos.length - 1 ? 0 : prev + 1
              )
            }
            aria-label="Next Image"
          >
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </ReactModal>
    </div>
  );
}

export default ClinicGallery;
