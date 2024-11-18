import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Button from "./Button";
import { MembershipPlan } from "./MemberCard";
import { useRouter } from "next/navigation";
import UserAuthenticationModal from "./UserAuthenticationModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan;
}

const MemberModal: React.FC<ModalProps> = ({ isOpen, onClose, plan }) => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState({
    duration: "2 Year",
    price: "6,999",
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  const [buttonText, setButtonText] = useState<string>("");

  const handleLoginModalOpen = (val: string) => {
    setLoginModalOpen(true);
    setButtonText(val);
  };

  if (!isOpen) return null;

  const yearlyPlans = [
    {
      duration: "1 Year",
      price: "6,999",
    },
    {
      duration: "2 Year",
      price: "6,999",
    },
    {
      duration: "3 Year",
      price: "5,499",
    },
  ];

  const handleContinue = () => {
    if (!isAuthenticated) {
      handleLoginModalOpen("Become a Member");
      return;
    }
    // Proceed with the payment route
    const params = new URLSearchParams({
      title: plan.title,
      duration: selectedPlan.duration,
      price: selectedPlan.price,
    });
    router.push(`/membership/payment?${params.toString()}`);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setLoginModalOpen(false);
    handleContinue();
  };

  const handlePaymentPlan = (yearPlan: { duration: string; price: string }) => {
    setSelectedPlan(yearPlan);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left Section */}
          <div className="p-8 bg-white rounded-l-2xl">
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
          </div>

          {/* Right Section */}
          <div className="p-8 pt-14 bg-primary-3 rounded-r-2xl flex flex-col">
            <h3 className="font-semibold text-xl text-primary-1 mb-6">
              Choose a payment plan:
            </h3>
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                {yearlyPlans.map((yearPlan, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg p-4 cursor-pointer ${
                      selectedPlan.duration === yearPlan.duration
                        ? "border-2 border-accent"
                        : ""
                    }`}
                    onClick={() => handlePaymentPlan(yearPlan)}
                  >
                    <div className="flex items-center w-full">
                      <div>
                        <span className="text-2xl font-semibold text-primary-1">
                          ₹{yearPlan.price}/Yr{" "}
                        </span>
                        <div className="text-sm text-gray-600">
                          For {yearPlan.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-primary-1 font-bold mb-4">
                Total benefits worth ₹15,000
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex justify-end">
                <div className="">
                  <div onClick={handleContinue}>
                    <Button
                      buttonText="Continue"
                      buttonBackground="bg-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <UserAuthenticationModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={handleLoginSuccess} // Handle login success
        buttonText={buttonText}
      />
    </div>
  );
};

export default MemberModal;
