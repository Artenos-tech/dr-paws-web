import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ProfileForm from "./ProfileForm";
import BillingForm from "./BillingForm";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: {
    name: string;
    contact: string;
    image: string;
    email: string;
    address: string;
  }) => void;
  profileData: {
    name: string;
    contact: string;
    image: string;
    email: string;
    address: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profileData,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");

  const handleProfileSave = (data: {
    name: string;
    contact: string;
    email: string;
    address: string;
    image: string;
  }) => {
    const updatedProfile = { ...data };
    onSave(updatedProfile);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab("profile");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Profile Modal"
      className="max-w-md mx-auto my-20 p-4 bg-[#F8F4EA] rounded-xl shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{ content: { maxHeight: "80vh", padding: "1rem" } }}
    >
      <div className="flex justify-around w-full border-b pb-3 text-gray-700 mb-4">
        <button onClick={() => setActiveTab("profile")} className={`px-6 py-2 ${activeTab === "profile" ? "border-b-2 border-blue-500 font-semibold" : ""}`}>
          Profile
        </button>
        <button onClick={() => setActiveTab("billing")} className={`px-6 py-2 ${activeTab === "billing" ? "border-b-2 border-blue-500 font-semibold" : ""}`}>
          Billing Information
        </button>
      </div>

      {activeTab === "profile" ? (
        <ProfileForm profileData={profileData} onSubmit={handleProfileSave} onCancel={onClose} />
      ) : (
        <BillingForm onSubmit={(data) => console.log("Billing Data:", data)} onCancel={onClose} />
      )}
    </Modal>
  );
};

export default EditProfileModal;
