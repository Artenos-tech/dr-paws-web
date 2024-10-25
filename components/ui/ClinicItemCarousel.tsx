import { clinicItems } from "@/model/mockData";
import React from "react";

const ClinicItemCarousel = () => {
  return (
    <div className="md:hidden block">
      <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
        <div className="carousel-item">
          {clinicItems.map((clinic, clinicIndex) => (
            <div
              key={clinicIndex}
              className="carousel-item w-56 flex flex-col mr-5"
            >
              <img
                src={clinic.image.src}
                alt={clinic.clinicName + "image"}
                className="rounded-t-md"
              />
              <div className="p-2">
                <h1 className="text-primary-1 text-base font-semibold">
                  {clinic.clinicName}
                </h1>
                <div className="flex gap-2 text-primary-1 text-xs mt-2 ">
                  <p>{clinic.branch}</p> |<p>{clinic.description}</p>
                </div>
              </div>
              <button className="btn bg-secondary-1 rounded-none border-none text-white w-full rounded-b-md">
                Book a Visit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicItemCarousel;
