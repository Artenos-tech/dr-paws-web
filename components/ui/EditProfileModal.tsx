import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ProfileForm from "./ProfileForm";
import BillingForm from "./BillingForm";
import { ProfileData } from "./ProfileCard";
import { BillingFormData } from "./BillingForm";
import { User, useUserContext } from "@/context/UserContext";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (updatedProfile: ProfileData) => void;
  profileData: ProfileData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");
  const [billingData, setBillingData] = useState<BillingFormData | null>(null);

  const { updateUserDetailsHandler, user } = useUserContext();

  const handleProfileUpdate = (updatedProfile: User) => {
    updateUserDetailsHandler(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    onClose();
  };
  const handleBillingSave = (data: BillingFormData) => {
    setBillingData(data);
    localStorage.setItem("billingData", JSON.stringify(data));
    console.log(billingData);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab("profile");
    }
  }, [isOpen]);
  console.log("user2:", user);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Profile Modal"
      className="min-h-[600px] w-[400px] lg:w-[450px] max-w-md mx-auto my-5 p-4 bg-[#F8F4EA] rounded-xl shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{
        content: { maxHeight: "70vh", padding: "1rem", marginTop: "90px" },
      }}
    >
      <div className="relative flex justify-around w-[85%] mx-auto border-b-2 border-gray-300 mb-4 text-gray-700">
        <button
          onClick={() => setActiveTab("profile")}
          className={`relative py-2 transition-colors w-1/2 ${
            activeTab === "profile" ? " font-semibold" : "text-gray-500"
          }`}
        >
          Profile
          {activeTab === "profile" && (
            <span className="absolute bottom-[-2.5px] left-0 right-0 mx-auto w-full h-[3px] bg-secondary-1 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("billing")}
          className={`relative py-2 transition-colors w-1/2 ${
            activeTab === "billing" ? " font-semibold" : "text-gray-500"
          }`}
        >
          Billing Information
          {activeTab === "billing" && (
            <span className="absolute bottom-[-2.5px] left-0 right-0 mx-auto w-full h-[3px] bg-secondary-1 rounded-full"></span>
          )}
        </button>
      </div>

      {activeTab === "profile" ? (
        <ProfileForm
          profileData={profileData}
          onSubmit={handleProfileUpdate}
          onCancel={onClose}
        />
      ) : (
        <BillingForm onSubmit={handleBillingSave} onCancel={onClose} />
      )}
    </Modal>
  );
};

export default EditProfileModal;
