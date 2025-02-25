import { Doctor } from "@/model/typeDefinitions";
import Modal from "react-modal";
import React from "react";
import Image from "next/image";
import starMedal from "@/public/assets/images/team/star-medal.png";
import { CiStethoscope, CiLocationOn } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { doctorImagesMap } from "@/model/mockData";
import defaultVetImg from "@/public/assets/images/clinic/doctorFemale.webp";  

interface doctorDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

const DoctorDetailsModal: React.FC<doctorDetailsProps> = ({
  isOpen,
  onClose,
  doctor,
}) => {
  const {
    displayName,
    experience,
    specialization,
    availableToDisplayAt,
    about,
    passionateAbout,
    imageUrl,
    spiritAnimal,
    qualification,
    favPetName,
  } = doctor;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-3/4 max-w-[950px] mt-20 mb-5 mx-auto bg-white rounded-xl shadow-lg overflow-y-auto z-50 h-[60vh] md:h-[400px] lg:h-[600px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{ content: { padding: "1rem" } }}
    >
      <div className="px-5 pb-5 text-primary-1 flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row justify-between items-center relative">
          <button
            className="absolute top-0 right-0 text-gray-500 z-10 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
            onClick={onClose}
          >
            <IoClose />
          </button>
          <div className="space-y-4 w-full lg:w-1/2 order-1 lg:order-none mt-5 lg:mt-0">
            <h1 className="text-xl md:text-2xl text-center lg:text-left my-3 lg:my-0">
              {displayName}
            </h1>

            <div className="flex flex-col md:items-center lg:items-start gap-3 md:gap-5 w-full text-center lg:text-left">
              <div className="flex gap-1">
                <CiStethoscope
                  size={20}
                  fontWeight={800}
                  className="mt-1 hidden lg:block"
                />
                <div className="space-y-1 w-full">
                  <p className="flex items-center text-sm justify-center lg:justify-start gap-1">
                    {" "}
                    <CiStethoscope
                      size={20}
                      fontWeight={800}
                      className="mt-1 block lg:hidden"
                    />
                    Experience
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {experience}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <Image
                  src={starMedal.src}
                  alt="star medal"
                  width={20}
                  height={20}
                  className="mt-1 hidden lg:block"
                />
                <div className="space-y-1 w-full">
                  <p className="flex items-center text-sm justify-center lg:justify-start gap-1">
                    <Image
                      src={starMedal.src}
                      alt="star medal"
                      width={20}
                      height={20}
                      className="mt-1 block lg:hidden"
                    />
                    Specialisation
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {specialization}
                  </p>
                </div>
              </div>
              {/* ) : null} */}
              <div className="flex items-start gap-1">
                <CiLocationOn
                  size={20}
                  fontWeight={800}
                  className="mt-1 hidden lg:block"
                />
                <div className="space-y-1 w-full">
                  <p className="flex items-center text-sm justify-center lg:justify-start gap-1">
                    {" "}
                    <CiLocationOn
                      size={20}
                      fontWeight={800}
                      className="mt-1 block lg:hidden"
                    />{" "}
                    Available at Clinics
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {availableToDisplayAt
                      .map((availableClinic) =>(availableClinic.name)).join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <svg
                  version="1.1"
                  viewBox="0 0 1024 1024"
                  width="22"
                  height="22"
                  fill="#33495f"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hidden lg:block"
                >
                  <path
                    transform="translate(194,50)"
                    d="m0 0h461l23 1 18 4 15 8 9 7 7 7 9 14 7 19v91l-4 6-7 4-9 1-10-5-3-5-2-8-1-74-3-12-6-10-10-7-11-4-10-1h-473l-13 1-9 3-11 9-6 9-3 10-1 23v635l2 17 5 10 5 7 10 6 12 3 175 1h98l216-1 15-4 8-6 6-8 7-10 5-3h12l6 3 4 5 2 10-4 10-8 12-5 5-10 9-15 8-15 4-7 1-358 1-1 3v39l3 16 6 10 1 3 4 2 8 5 12 3h489l12-3 8-6 8-9 3-5 2-10v-667l-4-13-7-10-12-7-7-2-8-1-24-1-8-7-3-9 2-10 7-6 4-2 7-1h13l17 2 16 5 11 6 12 11 7 8 7 12 4 12 2 11v670l-3 15-5 14-9 13-7 7-12 9-11 5-15 4-8 1h-490l-16-3-12-5-11-7-13-12-7-11-8-21-1-10v-49h-98l-14-3-13-5-10-7-12-11-6-8-7-14-3-11-2-17v-652l2-17 5-16 6-11 9-10 5-5 7-6 15-7 16-4z"
                  />
                  <path
                    transform="translate(637,202)"
                    d="m0 0 15 1 13 4 11 7 9 7 16 16 9 6 5 1 30 1 16 2 11 5 12 8 7 8 9 14 4 13 1 36 2 9 4 6 9 10 12 13 8 11 6 15 1 3v21l-3 11-8 15-24 26-5 8-2 11-1 33-5 14-6 11-9 10-6 5-12 6-9 3-5 1h-8l12 29 12 31 13 32 19 48 10 26v9l-4 7-6 5-2 1h-13l-89-11-10-4-5-4-28-38-12-17h-3l-2 5-8 10-13 18-14 19-6 7-13 4-88 11h-11l-8-5-4-4-2-9 4-13 50-125 12-31-14-2-12-5-10-6-10-9-6-9-6-15-2-12-1-33-3-8-11-13-14-14-7-11-6-16-1-7v-10l3-12 6-14 7-9 8-8 8-10h2l2-4 4-5 2-7 1-31 2-13 5-14 7-10 8-8 14-9 8-3 12-2 35-1 8-3 12-11 6-7h2v-2l17-12 8-4 8-2zm-3 36-10 4-8 7-14 14-7 6-12 6-12 3-42 2-8 4-6 7-4 10-1 31-2 12-5 14-6 9-11 12-12 13-5 8-1 3v12l5 10 5 6h2l2 4 13 14 7 10 5 11 2 7 1 10v25l2 10 6 9 6 5 8 2 31 1 21 5 14 7 17 17 4 5 7 5 10 3h9l10-4 10-9 3-3v-2l4-2 9-9 10-6 11-4 14-3 33-1 7-3 8-6 4-7 1-5 1-33 3-14 8-16 9-10 10-11v-2h2l8-10 2-6v-10l-3-8-6-8-9-10-11-11-6-10-6-16-1-8-1-33-4-10-5-6-10-5-8-1h-21l-18-2-13-5-14-10-16-17-10-6-3-1zm-62 338-4 8-6 16-19 48-11 28-16 40-2 4v3l14-1 46-6 3-3 13-18 22-30 14-19 6-5 3-1h10l8 5 10 13 12 17 28 38 3 3 54 7h6l-3-9-23-58-17-43-13-33-2-3-4 1-8 6v2h-2v2h-2l-7 8-12 10-12 6-13 3h-18l-13-3-16-10-11-10-7-8-10-8z"
                  />
                  <path
                    transform="translate(625,292)"
                    d="m0 0h30l13 2 18 6 17 9 11 8 12 11 9 11 7 11 8 17 6 20 2 13v18l-3 18-7 21-8 16-10 13-9 10-17 13-19 10-19 6-14 2h-25l-14-2-21-7-18-10-14-12-13-13-9-14-7-14-7-22-3-21 1-12 3-18 6-18 10-20 9-11 11-12 11-9 19-11 21-7zm6 34-16 3-16 7-11 8-13 12-7 11-7 16-3 11-2 18 3 18 6 16 6 11 13 15 11 8 10 6 15 5 7 1h26l16-4 14-7 10-7 5-4 9-11 6-9 5-12 4-14 1-8v-13l-3-16-6-16-6-11-11-12-13-10-14-7-13-4-7-1z"
                  />
                </svg>
                <div className="space-y-1 w-full">
                  <p className="flex items-center text-sm justify-center lg:justify-start gap-1">
                    <svg
                      version="1.1"
                      viewBox="0 0 1024 1024"
                      width="18"
                      height="18"
                      fill="#33495f"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-1 block lg:hidden"
                    >
                      <path
                        transform="translate(194,50)"
                        d="m0 0h461l23 1 18 4 15 8 9 7 7 7 9 14 7 19v91l-4 6-7 4-9 1-10-5-3-5-2-8-1-74-3-12-6-10-10-7-11-4-10-1h-473l-13 1-9 3-11 9-6 9-3 10-1 23v635l2 17 5 10 5 7 10 6 12 3 175 1h98l216-1 15-4 8-6 6-8 7-10 5-3h12l6 3 4 5 2 10-4 10-8 12-5 5-10 9-15 8-15 4-7 1-358 1-1 3v39l3 16 6 10 1 3 4 2 8 5 12 3h489l12-3 8-6 8-9 3-5 2-10v-667l-4-13-7-10-12-7-7-2-8-1-24-1-8-7-3-9 2-10 7-6 4-2 7-1h13l17 2 16 5 11 6 12 11 7 8 7 12 4 12 2 11v670l-3 15-5 14-9 13-7 7-12 9-11 5-15 4-8 1h-490l-16-3-12-5-11-7-13-12-7-11-8-21-1-10v-49h-98l-14-3-13-5-10-7-12-11-6-8-7-14-3-11-2-17v-652l2-17 5-16 6-11 9-10 5-5 7-6 15-7 16-4z"
                      />
                      <path
                        transform="translate(637,202)"
                        d="m0 0 15 1 13 4 11 7 9 7 16 16 9 6 5 1 30 1 16 2 11 5 12 8 7 8 9 14 4 13 1 36 2 9 4 6 9 10 12 13 8 11 6 15 1 3v21l-3 11-8 15-24 26-5 8-2 11-1 33-5 14-6 11-9 10-6 5-12 6-9 3-5 1h-8l12 29 12 31 13 32 19 48 10 26v9l-4 7-6 5-2 1h-13l-89-11-10-4-5-4-28-38-12-17h-3l-2 5-8 10-13 18-14 19-6 7-13 4-88 11h-11l-8-5-4-4-2-9 4-13 50-125 12-31-14-2-12-5-10-6-10-9-6-9-6-15-2-12-1-33-3-8-11-13-14-14-7-11-6-16-1-7v-10l3-12 6-14 7-9 8-8 8-10h2l2-4 4-5 2-7 1-31 2-13 5-14 7-10 8-8 14-9 8-3 12-2 35-1 8-3 12-11 6-7h2v-2l17-12 8-4 8-2zm-3 36-10 4-8 7-14 14-7 6-12 6-12 3-42 2-8 4-6 7-4 10-1 31-2 12-5 14-6 9-11 12-12 13-5 8-1 3v12l5 10 5 6h2l2 4 13 14 7 10 5 11 2 7 1 10v25l2 10 6 9 6 5 8 2 31 1 21 5 14 7 17 17 4 5 7 5 10 3h9l10-4 10-9 3-3v-2l4-2 9-9 10-6 11-4 14-3 33-1 7-3 8-6 4-7 1-5 1-33 3-14 8-16 9-10 10-11v-2h2l8-10 2-6v-10l-3-8-6-8-9-10-11-11-6-10-6-16-1-8-1-33-4-10-5-6-10-5-8-1h-21l-18-2-13-5-14-10-16-17-10-6-3-1zm-62 338-4 8-6 16-19 48-11 28-16 40-2 4v3l14-1 46-6 3-3 13-18 22-30 14-19 6-5 3-1h10l8 5 10 13 12 17 28 38 3 3 54 7h6l-3-9-23-58-17-43-13-33-2-3-4 1-8 6v2h-2v2h-2l-7 8-12 10-12 6-13 3h-18l-13-3-16-10-11-10-7-8-10-8z"
                      />
                      <path
                        transform="translate(625,292)"
                        d="m0 0h30l13 2 18 6 17 9 11 8 12 11 9 11 7 11 8 17 6 20 2 13v18l-3 18-7 21-8 16-10 13-9 10-17 13-19 10-19 6-14 2h-25l-14-2-21-7-18-10-14-12-13-13-9-14-7-14-7-22-3-21 1-12 3-18 6-18 10-20 9-11 11-12 11-9 19-11 21-7zm6 34-16 3-16 7-11 8-13 12-7 11-7 16-3 11-2 18 3 18 6 16 6 11 13 15 11 8 10 6 15 5 7 1h26l16-4 14-7 10-7 5-4 9-11 6-9 5-12 4-14 1-8v-13l-3-16-6-16-6-11-11-12-13-10-14-7-13-4-7-1z"
                      />
                    </svg>
                    Qualifications
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {qualification}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-1">
                <svg
                  version="1.1"
                  viewBox="0 0 1024 1024"
                  width="22"
                  height="22"
                  fill="#33495f"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hidden lg:block"
                >
                  <path
                    transform="translate(214)"
                    d="m0 0h591l24 7 17 8 13 9 11 9 7 7 10 13 9 16 6 15 4 16 1 7v862l-4 17-6 12-8 10-8 7-14 7-5 2h-25l-17-6-15-8-19-12-48-30-19-12-21-13-24-15-19-12-21-13-24-15-19-12-21-13-24-15-19-12-13-8-6 1-22 14-24 15-21 13-24 15-19 12-21 13-144 90-18 11-16 8-11 4h-26l-16-7-10-8-8-9-8-16-3-13-1-13v-843l3-21 6-19 10-19 8-11 11-12 10-9 15-10 15-7 19-6zm19 61-15 3-15 8-9 8-6 8-7 14-2 8-1 12v839l6-2 22-14 21-13 19-12 96-60 19-12 26-16 38-24 26-16 22-14 21-13 12-5h11l11 4 23 14 22 14 21 13 24 15 19 12 21 13 24 15 19 12 21 13 24 15 19 12 21 13 48 30 10 6h1l1-797-1-54-3-10-6-12-9-11-13-9-12-5-12-2z"
                  />
                  <path
                    transform="translate(408,262)"
                    d="m0 0h26l16 3 17 6 15 8 12 9 12 11 5 5 4-2 13-13 12-9 12-7 15-6 16-4 7-1h26l17 3 16 6 15 8 12 9 10 9 7 7 11 15 8 15 6 18 3 20v13l-2 18-5 17-8 17-9 13-11 12-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-4 4h-2v2h-2v2h-2l-2 4-11 8-8 3h-13l-9-4-8-7-158-158-11-15-10-21-5-19-1-7v-24l4-20 5-14 9-17 11-14 15-15 17-12 15-7 12-4zm3 62-12 4-10 6-11 10-7 10-5 13-1 6v15l4 13 7 12 135 135 4-2 131-131 7-10 4-10 2-10v-11l-4-16-6-10-9-10-11-8-12-5-5-1h-18l-13 4-11 7-10 9v2h-2v2h-2v2h-2v2h-2l-7 8-5 4-4 4v2l-4 2-8 5-7 2h-11l-10-4-8-7h-2l-2-4h-2l-2-4-20-20-10-8-12-6-8-2z"
                  />
                  <path transform="translate(809)" d="m0 0 2 1z" />
                  <path transform="translate(158,1023)" d="m0 0" />
                </svg>
                <div className="space-y-1 w-full">
                  <p className="flex items-center text-sm justify-center lg:justify-start gap-1">
                    <svg
                      version="1.1"
                      viewBox="0 0 1024 1024"
                      width="18"
                      height="18"
                      fill="#33495f"
                      xmlns="http://www.w3.org/2000/svg"
                      className="block lg:hidden"
                    >
                      <path
                        transform="translate(214)"
                        d="m0 0h591l24 7 17 8 13 9 11 9 7 7 10 13 9 16 6 15 4 16 1 7v862l-4 17-6 12-8 10-8 7-14 7-5 2h-25l-17-6-15-8-19-12-48-30-19-12-21-13-24-15-19-12-21-13-24-15-19-12-21-13-24-15-19-12-13-8-6 1-22 14-24 15-21 13-24 15-19 12-21 13-144 90-18 11-16 8-11 4h-26l-16-7-10-8-8-9-8-16-3-13-1-13v-843l3-21 6-19 10-19 8-11 11-12 10-9 15-10 15-7 19-6zm19 61-15 3-15 8-9 8-6 8-7 14-2 8-1 12v839l6-2 22-14 21-13 19-12 96-60 19-12 26-16 38-24 26-16 22-14 21-13 12-5h11l11 4 23 14 22 14 21 13 24 15 19 12 21 13 24 15 19 12 21 13 24 15 19 12 21 13 48 30 10 6h1l1-797-1-54-3-10-6-12-9-11-13-9-12-5-12-2z"
                      />
                      <path
                        transform="translate(408,262)"
                        d="m0 0h26l16 3 17 6 15 8 12 9 12 11 5 5 4-2 13-13 12-9 12-7 15-6 16-4 7-1h26l17 3 16 6 15 8 12 9 10 9 7 7 11 15 8 15 6 18 3 20v13l-2 18-5 17-8 17-9 13-11 12-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-7 6-5 6-4 4h-2v2h-2v2h-2l-2 4-11 8-8 3h-13l-9-4-8-7-158-158-11-15-10-21-5-19-1-7v-24l4-20 5-14 9-17 11-14 15-15 17-12 15-7 12-4zm3 62-12 4-10 6-11 10-7 10-5 13-1 6v15l4 13 7 12 135 135 4-2 131-131 7-10 4-10 2-10v-11l-4-16-6-10-9-10-11-8-12-5-5-1h-18l-13 4-11 7-10 9v2h-2v2h-2v2h-2v2h-2l-7 8-5 4-4 4v2l-4 2-8 5-7 2h-11l-10-4-8-7h-2l-2-4h-2l-2-4-20-20-10-8-12-6-8-2z"
                      />
                      <path transform="translate(809)" d="m0 0 2 1z" />
                      <path transform="translate(158,1023)" d="m0 0" />
                    </svg>
                    My Favourite Pet Name Is...
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {favPetName}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="self-center flex flex-col justify-center items-center gap-3 w-full lg:w-1/2 h-full lg:h-[450px] ">
            <Image
              src={
                imageUrl.type === "ref" 
                  ? doctorImagesMap[imageUrl.value]
                  : imageUrl.value === "unknown" 
                    ? defaultVetImg
                    : imageUrl.value
              }
              alt="doctor with pet"
              width={200}
              height={100}
              className="lg:w-auto self-center mt-5 h-full lg:h-[420px] "
            />
            <p className="text-center lg:text-left block lg:hidden self-start w-full lg:w-[350px] md:mx-auto text-xs md:text-sm z-10 ">
              {passionateAbout}
            </p>
          </div>
        </div>
        <div className={`space-y-4 mt-5 `}>
          <div className={`flex justify-between items-start gap-5 w-full `}>
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <p className="font-semibold text-base md:text-lg mb-1">
                What&apos;s My Spirit Animal and Why?
              </p>
              <p className="w-full text-sm md:text-base">{spiritAnimal}</p>
            </div>
            <p className="text-center lg:text-left hidden lg:block self-start w-full lg:w-1/2 md:mx-auto text-xs md:text-sm z-10 ">
              {passionateAbout}
            </p>
          </div>
          <div className={`text-center lg:text-left`}>
            <p className="font-semibold text-base md:text-lg mb-1">
              About The Vet
            </p>
            <p className="w-full text-sm md:text-base">{about}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetailsModal;
