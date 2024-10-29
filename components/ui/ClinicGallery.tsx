"use client";
import { photos } from "@/model/mockData"; // photos is array of images
import React from "react";

function ClinicGallery() {
  const limitedGalleryItems = photos.slice(0, 7);

  return (
    <div className="gallery-container">
      {limitedGalleryItems.map((image, index) => (
        <div
          key={index}
          className={`relative bg-black ${
            index === limitedGalleryItems.length - 1 ? "cursor-pointer" : ""
          }`}
          onClick={
            index === limitedGalleryItems.length - 1
              ? () => alert("View Gallery Clicked")
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
  );
}

export default ClinicGallery;
