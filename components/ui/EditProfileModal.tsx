import React from "react";
import Modal from "react-modal";
import ProfileForm from "./ProfileForm";
import { ProfileData } from "./ProfileCard";
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
  const { updateUserDetailsHandler } = useUserContext();

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
      className="min-h-[550px] w-11/12 md:w-[400px] max-w-md mx-auto my-5 p-4 bg-[#F8F4EA] rounded-xl shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{
        content: { maxHeight: "70vh", padding: "1rem", marginTop: "90px" },
      }}
    >

      <ProfileForm
        profileData={profileData}
        onSubmit={handleProfileUpdate}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditProfileModal;
