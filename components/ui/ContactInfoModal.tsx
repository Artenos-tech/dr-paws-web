import Image from "next/image";
import Link from "next/link";
import React from "react";
import Modal from "react-modal";

import whatsapp from "@/public/assets/images/ContactInfo/whatsappIcon.svg";
import Call from "@/public/assets/images/ContactInfo/telephone-icon.svg";
import Map from "@/public/assets/images/ContactInfo/location-icon.svg";
import { Construction } from "lucide-react";

interface ContactInfoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed mx-auto w-[93%] h-fit sm:h-fit sm:w-fit inset-0 bg-primary-3 p-5 lg:p-6 my-12 rounded-lg shadow-lg  outline-none border-2"
      overlayClassName="fixed inset-0 bg-black z-[999] bg-opacity-50 flex justify-center items-center"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "47%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div className="flex justify-center  mb-6">
        <Image
          src="/assets/images/dog-cat.png"
          alt="Pets"
          className="hidden sm:block h-24"
          width={100}
          height={100}
        />
      </div>

      <p className="text-center text-gray-700 mb-4">
        To book an appointment please call or WhatsApp the following numbers:
      </p>
      <div className="flex flex-col gap-2">
        <div className="">
          <h3 className="font-semibold text-lg mb-1">Dr. Paws Indiranagar</h3>
          <p className="text-sm text-gray-600">
            Open 7 days a week, 9am to 8pm
          </p>
          <div className="flex flex-col md:flex-row items-start lg:items-center gap-2 mt-1">
            <Link href="tel:+9606994627" className="text-blue-600">
              <button className="flex flex-row items-center justify-center gap-1">
                <Image src={Call} alt="whats app" width={16} height={16} />
                <span>9606994627</span>
              </button>
            </Link>
            <Link
              href="https://wa.me/https://api.whatsapp.com/send/?phone=919606994627&text=Hi%2C+I+would+like+to+book+an+appointment+for+my+pet.&type=phone_number&app_absent=0"
              className="text-blue-600"
            >
              <button className="flex flex-row items-center justify-center gap-1">
                <Image src={whatsapp} alt="whats app" width={14} height={14} />
                <span>9606994627</span>
              </button>
            </Link>
            <Link
              href="https://www.google.com/maps/place/Dr.+Paws+-+Veterinarian+in+Indiranagar,+Bengaluru+%7C+Vet+Consultation,+Pet+Vaccination,+Pet+Grooming,+Pet+Surgery+%7C+Pet+Clinic/@12.9655265,77.6378598,19z/data=!4m6!3m5!1s0x3bae150fe803f393:0x5820ed9ef42478d3!8m2!3d12.9655253!4d77.6385461!16s%2Fg%2F11vxxyv2zc?entry=ttu&g_ep=EgoyMDI0MTExMC4wIKXMDSoASAFQAw%3D%3D"
              className="text-blue-600"
            >
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Map} alt="whats app" width={14} height={14} />
                <span>Google Maps Link</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="">
          <h3 className="font-semibold text-lg mb-1">
            Dr. Paws RMV (Dollars Colony)
          </h3>
          <p className="text-sm text-gray-600">
            Open 7 days a week, 9am to 8pm
          </p>
          <div className="flex flex-col md:flex-row items-start lg:items-center gap-2 mt-1">
            <Link href="tel:+7204996899" className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Call} alt="whats app" width={16} height={16} />
                <span>7204996899</span>
              </div>
            </Link>
            <Link
              href="https://api.whatsapp.com/send/?phone=917204996899&text=Hi%2C+I+would+like+to+book+an+appointment+for+my+pet.&type=phone_number&app_absent=0"
              className="text-blue-600"
            >
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={whatsapp} alt="whats app" width={14} height={14} />
                <span>7204996899</span>
              </div>
            </Link>
            <Link
              href="https://www.google.com/maps/place/Dr.+Paws+-+Veterinarian+in+RMV+(Dollars+Colony)+%7C+Vet+Consultation,+Pet+Vaccination,+Pet+Grooming,+Pet+Surgery+%7C+Pet+Clinic/@13.0434014,77.570594,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae174f82ebbe2f:0xc9a13342ab7933ac!8m2!3d13.0434014!4d77.570594!16s%2Fg%2F11w8ffwb9b?entry=ttu&g_ep=EgoyMDI0MTExMC4wIKXMDSoASAFQAw%3D%3D"
              className="text-blue-600"
            >
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Map} alt="whats app" width={14} height={14} />
                <span>Google Maps Link</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Construction />
            <p className="italic font-semibold my-2 text-gray-600">
              Mobile app coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onRequestClose}
        className=" w-full mt-4 bg-secondary-1 text-white py-2 rounded-full"
      >
        Close
      </button>
    </Modal>
  );
};

export default ContactInfoModal;
