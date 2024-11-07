import { Doctor } from "@/model/typeDefinitions";
import Modal from "react-modal";
import React from "react";
import Image from "next/image";
import doctorImg from "@/public/assets/images/team/doctorImg.png";
import starMedal from "@/public/assets/images/team/star-medal.png";
import { CiStethoscope, CiLocationOn } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

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
  const { name, experience, specialization, location, aboutVet, tag } = doctor;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-4/5 max-w-[950px] mt-20  mx-auto  p-4 bg-white rounded-xl shadow-lg overflow-y-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{ content: { maxHeight: "80vh", padding: "1rem" } }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center p-5 text-primary-1 relative">
        <button className="absolute top-0 right-0" onClick={onClose}>
          <IoClose />
        </button>
        <div className="space-y-4 md:space-y-8 lg:space-y-12 w-full lg:w-1/2  order-1 lg:order-none">
          <h1 className="text-xl md:text-2xl">{name}</h1>

          <div className="flex flex-col gap-3 md:gap-5">
            <div className="flex items-start gap-1">
              <CiStethoscope size={20} fontWeight={800} className="mt-1" />
              <div className="space-y-1">
                <p>Experience</p>
                <p className="font-semibold text-sm md:text-base">{experience}</p>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <Image
                src={starMedal.src}
                alt="star medal"
                width={20}
                height={20}
                className="mt-1"
              />
              <div className="space-y-1 w-full">
                <p>Specialization</p>
                <p className="font-semibold text-sm md:text-base w-full md:w-11/12 lg:w-3/4 ">{specialization}</p>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <CiLocationOn size={20} fontWeight={800} className="mt-1" />
              <div className="space-y-1">
                <p>Clinics</p>
                <p className="font-semibold text-sm md:text-base">{location}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-8">
              <p className="font-semibold text-base md:text-lg mb-1">About The Vet</p>
              <p className="w-full text-sm md:text-base">{aboutVet}</p>
            </div>
          </div>
        </div>
        <div className="self-center w-full lg:w-1/2">
          <Image
            src={doctorImg}
            alt="doctor with pet"
            width={500}
            height={600}
             className="w-full md:w-[320px] md:mx-auto lg:ml-auto"
          />
          <p className="text-center self-start lg:w-[270px] md:mx-auto mt-6 text-xs md:text-sm">{tag}</p>
        </div>
      </div>
    </Modal>
  );
};

export default DoctorDetailsModal;
