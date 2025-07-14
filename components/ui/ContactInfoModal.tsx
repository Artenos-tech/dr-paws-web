import Image from "next/image"
import Link from "next/link"
import React from "react"
import Modal from "react-modal"

import whatsapp from "@/public/assets/images/ContactInfo/whatsappIcon.svg"
import Call from "@/public/assets/images/ContactInfo/telephone-icon.svg"
import Map from "@/public/assets/images/ContactInfo/location-icon.svg"

interface ContactInfoModalProps {
  isOpen: boolean
  onRequestClose: () => void
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
          <p className="text-sm text-gray-600">Open 24/7</p>
          <div className="flex md:flex-row items-start lg:items-center gap-2 mt-1">
            <div className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Call} alt="whats app" width={16} height={16} />
                <span>9606994627</span>
              </div>
            </div>
            <div className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={whatsapp} alt="whats app" width={14} height={14} />
                <span>9606994627</span>
              </div>
            </div>
            <Link
              href="https://maps.app.goo.gl/pJ1pXF8ud82urwFb6"
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
          <p className="text-sm text-gray-600">Open 24/7</p>
          <div className="flex md:flex-row items-start lg:items-center gap-2 mt-1">
            <div className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Call} alt="whats app" width={16} height={16} />
                <span>7204996899</span>
              </div>
            </div>
            <div className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={whatsapp} alt="whats app" width={14} height={14} />
                <span>7204996899</span>
              </div>
            </div>
            <Link
              href="https://maps.app.goo.gl/qMGkH4oztRoqxMSBA"
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
          <h3 className="font-semibold text-lg mb-1">Dr. Paws HSR Layout</h3>
          <p className="text-sm text-gray-600">Open 24/7</p>
          <div className="flex md:flex-row items-start lg:items-center gap-2 mt-1">
            <div className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Call} alt="whats app" width={16} height={16} />
                <span>7204996902</span>
              </div>
            </div>
            <div className="text-blue-600">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={whatsapp} alt="whats app" width={14} height={14} />
                <span>7204996902</span>
              </div>
            </div>
            <Link
              href="https://maps.app.goo.gl/5GLvX4ss994wwotT8"
              className="text-blue-600"
            >
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={Map} alt="whats app" width={14} height={14} />
                <span>Google Maps Link</span>
              </div>
            </Link>
          </div>
          {/* <div className="flex items-center gap-2">
            <Construction />
            <p className="italic font-semibold my-2 text-gray-600">
              Mobile app coming soon
            </p>
          </div> */}
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
  )
}

export default ContactInfoModal
