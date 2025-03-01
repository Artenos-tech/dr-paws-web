import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Toaster } from "react-hot-toast";
import Modal from "react-modal";

import { MembershipPlan } from "./MemberCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
}

const MemberModal: React.FC<ModalProps> = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex relative z-[999] items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[899]"
    >
      <div className="relative bg-white rounded-2xl w-11/12 md:w-3/5 max-h-[92vh] overflow-y-auto lg:overflow-y-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="h-full w-full">
          <div className="p-5 bg-white rounded-2xl">
            <div className="w-20 h-20 relative mb-2">
              <Image
                src={plan.icon}
                alt={`${plan.title} icon`}
                fill
                className="object-contain"
              />
            </div>
            <div className="border-b-2 border-primary-3">
              <h2 className="text-2xl font-semibold text-primary-1 mb-2">
                {plan.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-primary-1 mb-1 mt-4">
                Includes:
              </h3>
              <ul className="space-y-2">
                {plan.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-primary-1 text-sm"
                  >
                    <span className="">•</span>
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex mt-3 gap-2">
              <h3 className="font-semibold text-xl text-primary-1">
                {plan.price}
              </h3>
              {/* <div onClick={handleContinue}>
                <CustomButton
                  buttonText="Continue"
                  buttonBackground="bg-accent"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </Modal>
  );
};

export default MemberModal;
