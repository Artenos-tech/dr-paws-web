import Image from "next/image";
import Link from "next/link";
import React from "react";
import Modal from "react-modal";

// Define styles for react-modal
// Modal.setAppElement('#__next'); // Required for accessibility in Next.js

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
      className="fixed mx-auto w-[95%] sm:w-fit inset-0 bg-primary-3 p-5 lg:p-6 my-12 rounded-lg shadow-lg  outline-none border-2"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div className="flex justify-center mb-6">
        <Image
          src="/assets/images/logo/logo.svg"
          alt="Dr. Paws Logo"
          className="h-12"
          width={200}
          height={200}
        />
      </div>

      <div className="md:flex justify-center hidden  mb-6">
        <Image
          src="/assets/images/dog-cat.png"
          alt="Pets"
          className="h-24"
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
            <Link href="tel:+9606994627" className="text-blue-500">
              📞 9606994627
            </Link>
            <Link href="https://wa.me/9606994627" className="text-green-500">
              📱 9606994627
            </Link>
            <Link href="https://goo.gl/maps/xyz" className="text-blue-500">
              📍 Google Maps Link
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
            <Link href="tel:+7204996899" className="text-blue-500">
              📞 7204996899
            </Link>
            <Link
              href="https://api.whatsapp.com/send/?phone=919606994627&text=Hi%2C+I+would+like+to+book+an+appointment+for+my+pet.&type=phone_number&app_absent=0"
              className="text-green-500"
            >
              📱 7204996899
            </Link>
            <Link href="https://goo.gl/maps/xyz" className="text-blue-500">
              📍 Google Maps Link
            </Link>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onRequestClose}
        className="w-full mt-4 bg-secondary-1 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Close
      </button>
    </Modal>
  );
};

export default ContactInfoModal;
