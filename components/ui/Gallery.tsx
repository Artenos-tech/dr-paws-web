"use client";

import React, { useState } from "react";
import Image from "next/image";
import gridImg1 from "@/public/assets/images/gridImages/gridImg1.png";
import gridImg2 from "@/public/assets/images/gridImages/gridImg2.png";
import gridImg3 from "@/public/assets/images/gridImages/gridImg3.jpg";
import gridImg4 from "@/public/assets/images/gridImages/gridImg4.png";
import gridImg5 from "@/public/assets/images/gridImages/gridImg5.png";
import gridImg6 from "@/public/assets/images/gridImages/gridImg6.png";
import gridImg7 from "@/public/assets/images/gridImages/gridImg7.png";
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from "react-icons/io";

const images = [
  { src: gridImg1.src, alt: "Gallery Image 1" },
  { src: gridImg2.src, alt: "Gallery Image 2" },
  { src: gridImg3.src, alt: "Gallery Image 3" },
  { src: gridImg4.src, alt: "Gallery Image 4" },
  { src: gridImg5.src, alt: "Gallery Image 5" },
  { src: gridImg6.src, alt: "Gallery Image 6" },
  { src: gridImg7.src, alt: "Gallery Image 7" },
];

const Gallery = () => {
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [currentIndex, setCurrentIndex] = useState(0); // Track clicked image

  // Open modal and set the clicked image index
  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {/* Gallery grid */}
      <div className="flex items-center justify-center w-full h-full gap-1">
        <div className="flex flex-col justify-center w-1/2 gap-1">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            className="w-full cursor-pointer"
            onClick={() => openModal(0)}
          />
          <div className="flex w-1/2 gap-1">
            <Image
              src={images[3].src}
              alt={images[3].alt}
              className="w-full cursor-pointer"
              onClick={() => openModal(3)}
            />
            <Image
              src={images[4].src}
              alt={images[4].alt}
              className="w-[98%] mt-[1px] cursor-pointer"
              onClick={() => openModal(4)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-1/2 h-full gap-1">
          <div className="flex items-start justify-start w-full h-2/5 gap-1">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              className="w-2/5 h-full cursor-pointer"
              onClick={() => openModal(1)}
            />
            <Image
              src={images[2].src}
              alt={images[2].alt}
              className="w-3/5 h-full cursor-pointer"
              onClick={() => openModal(2)}
            />
          </div>

          <div className="flex items-center justify-center w-full h-2/5 gap-1 ml-1">
            <Image
              src={images[5].src}
              alt={images[5].alt}
              className=" w-3/5 h-full cursor-pointer"
              onClick={() => openModal(5)}
            />
            <Image
              src={images[6].src}
              alt={images[6].alt}
              className="w-2/5 object-cover h-full cursor-pointer"
              onClick={() => openModal(6)}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="modal modal-open ">
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
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
              >
                <IoIosArrowBack />
              </button>

              <div className="carousel w-full">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-item w-full ${
                      currentIndex === index ? "block" : "hidden"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      layout="responsive"
                      width={700}
                      height={475}
                      className="overflow-hidden w-full h-[80%]"
                    />
                  </div>
                ))}
              </div>
              <button
                className="btn btn-circle"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
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
};

export default Gallery;
