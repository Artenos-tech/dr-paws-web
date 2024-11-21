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
  profileData: ProfileData;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
}) => {
  const { updateUserDetailsHandler, user } = useUserContext();

  const handleProfileUpdate = (updatedProfile: User) => {
    updateUserDetailsHandler(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    onClose();
  };

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
      <div className="relative flex justify-around w-[85%] mx-auto border-b-2 border-secondary-1 mb-4 text-gray-700">
        <h1 className={`relative py-2 transition-colors font-semibold  `}>
          Profile
        </h1>
      </div>

      <ProfileForm
        profileData={profileData}
        onSubmit={handleProfileUpdate}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditProfileModal;
