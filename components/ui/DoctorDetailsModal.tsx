import { Doctor } from "@/model/typeDefinitions";
import Modal from "react-modal";
import React from "react";
import Image from "next/image";
import starMedal from "@/public/assets/images/team/star-medal.png";
import { CiStethoscope, CiLocationOn } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useMarketingFeature } from "@/hooks/useMarketingFeature";
import { clinicItems } from "@/model/mockData";

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
  const isMarketingFeatureEnabled = useMarketingFeature();
  const { name, experience, specialization, clinicIds, aboutVet, tag, image } =
    doctor;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-4/5 max-w-[950px] mt-20 mb-5 mx-auto  p-4 bg-white rounded-xl shadow-lg overflow-y-auto z-50 max-h-[80vh] md:max-h-none min-h-[40vh] md:min-h-[70vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{ content: { padding: "1rem" } }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center p-5 text-primary-1 relative">
        <button
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
          onClick={onClose}
        >
          <IoClose />
        </button>
        <div className="space-y-4 md:space-y-8 lg:space-y-12 w-full lg:w-1/2  order-1 lg:order-none">
          <h1 className="text-xl md:text-2xl text-center lg:text-left my-3 lg:my-0">
            {name}
          </h1>

          <div className="flex flex-col md:items-center lg:items-start gap-3 md:gap-5 w-full text-center lg:text-left">
            {!isMarketingFeatureEnabled ? (
              <div className="flex gap-1">
                <CiStethoscope
                  size={20}
                  fontWeight={800}
                  className="mt-1 hidden lg:block"
                />
                <div className="space-y-1 w-full">
                  <p className="flex items-center justify-center lg:justify-start gap-1">
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
            ) : null}
            {!isMarketingFeatureEnabled ? (
              <div className="flex items-start gap-1">
                <Image
                  src={starMedal.src}
                  alt="star medal"
                  width={20}
                  height={20}
                  className="mt-1 hidden lg:block"
                />
                <div className="space-y-1 w-full">
                  <p className="flex items-center justify-center lg:justify-start gap-1">
                    <Image
                      src={starMedal.src}
                      alt="star medal"
                      width={20}
                      height={20}
                      className="mt-1 block lg:hidden"
                    />
                    Specialization
                  </p>
                  <p className="font-semibold text-sm md:text-base">
                    {specialization}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="flex items-start gap-1">
              <CiLocationOn
                size={20}
                fontWeight={800}
                className="mt-1 hidden lg:block"
              />
              <div className="space-y-1 w-full">
                <p className="flex items-center justify-center lg:justify-start gap-1">
                  {" "}
                  <CiLocationOn
                    size={20}
                    fontWeight={800}
                    className="mt-1 block lg:hidden"
                  />{" "}
                  Clinics
                </p>
                <p className="font-semibold text-sm md:text-base">
                  {clinicIds
                    .map(
                      (id) =>
                        clinicItems.find((clinic) => clinic.id === id)
                          ?.clinicName
                    )
                    .join(", ")}
                </p>
              </div>
            </div>
            {!isMarketingFeatureEnabled ? (
              <div className="mt-4 md:mt-8">
                <p className="font-semibold text-base md:text-lg mb-1">
                  About The Vet
                </p>
                <p className="w-full text-sm md:text-base">{aboutVet}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="self-center w-full lg:w-1/2">
          <Image
            src={image}
            alt="doctor with pet"
            width={500}
            height={600}
            className="w-full md:w-[320px] md:mx-auto lg:ml-auto"
          />
          <p className="text-center self-start lg:w-[270px] md:mx-auto mt-6 text-xs md:text-sm">
            {tag}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetailsModal;
