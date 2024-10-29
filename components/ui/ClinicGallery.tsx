"use client";
import { photos } from "@/model/mockData"; // photos is array of images
import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";

function ClinicGallery() {
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [currentIndex, setCurrentIndex] = useState(0); // Current image index
  const limitedGalleryItems = photos.slice(0, 7);

  // Open modal and set the current index
  const openModal = (index:number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div className="gallery-container">
        {limitedGalleryItems.map((image, index) => (
          <div
            key={index}
            className={`relative bg-black ${
              index === limitedGalleryItems.length - 1 ? "cursor-pointer" : ""
            }`}
            onClick={
              index === limitedGalleryItems.length - 1
                ? () => openModal(0) // Open modal starting from the first image
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
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl shadow-none bg-transparent">
            <div className="modal-action">
              <button className="text-white text-2xl" onClick={closeModal}>
                <IoMdClose />
              </button>
            </div>

            <div className="flex justify-between items-center gap-2">
              <button
                className="btn btn-circle"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? photos.length - 1 : prev - 1
                  )
                }
              >
                <IoIosArrowBack />
              </button>

              <div className="carousel w-full">
                {photos.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-item w-full ${
                      currentIndex === index ? "block" : "hidden"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={"gallery image"}
                      className="overflow-hidden w-full h-[80%]"
                    />
                  </div>
                ))}
              </div>

              <button
                className="btn btn-circle"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === photos.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClinicGallery;
