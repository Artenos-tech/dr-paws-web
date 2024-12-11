import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { MembershipPlan } from "./MemberCard";
import { useRouter } from "next/navigation";
import UserAuthenticationModal from "./UserAuthenticationModal";
import Modal from "react-modal";
import { useUserContext } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";
// import CustomButton from "./CustomButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
}

const MemberModal: React.FC<ModalProps> = ({ isOpen, onClose, plan }) => {
  const router = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  const [buttonText, setButtonText] = useState<string>("");
  const { getAuthToken, refresh } = useUserContext();

  // Proceed with the payment route
  const params = new URLSearchParams({
    title: plan.title,
    duration: plan.duration,
    price: plan.price,
  });

  const handleLoginModalOpen = (val: string) => {
    const authToken = getAuthToken();
    if (authToken) {
      if (val === "Become a Member") {
        router.push(`/membership/payment?${params.toString()}`);
        return;
      }
    }
    setLoginModalOpen(true);
    setButtonText(val);
  };

  if (!isOpen) return null;

  // const yearlyPlans = [
  //   {
  //     duration: "1 Year",
  //     price: "6,999",
  //   },
  //   {
  //     duration: "2 Year",
  //     price: "6,999",
  //   },
  //   {
  //     duration: "3 Year",
  //     price: "5,499",
  //   },
  // ];

  const handleContinue = () => {
    if (!isAuthenticated) {
      handleLoginModalOpen("Become a Member");
      return;
    }

    router.push(`/membership/payment?${params.toString()}`);
  };

  const onSuccess = (toastMessage: string) => {
    setIsAuthenticated(true);
    setLoginModalOpen(false);
    refresh();
    toast.success(`Successfully ${toastMessage}`, {
      duration: 3000,
      position: "bottom-right",
    });
    handleContinue();
  };

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

      {/* Login Modal */}
      <UserAuthenticationModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={onSuccess} // Handle login success
        buttonText={buttonText}
      />
      <Toaster />
    </Modal>
  );
};

export default MemberModal;
