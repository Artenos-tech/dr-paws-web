import React from "react";
import Modal from "react-modal";
import ProfileForm from "./ProfileForm";
import { User, useUserContext } from "@/context/UserContext";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import Loader from "./Loader";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
}) => {
  const { updateUserDetailsHandler } = useUserContext();

  const {
    call: updateUser,
    loading,
  } = useAPICall(api.updateUser);

  const handleProfileUpdate = async (updatedProfile: User) => {
    const response = await updateUser({
      user: {
        name: updatedProfile.name,
        email: updatedProfile.email,
        mobile: updatedProfile.mobile,
        current_address: updatedProfile.currentAddress,
        profile_image: updatedProfile.profileImage,
      }
    })
    if (response.ok) {
      updateUserDetailsHandler(updatedProfile);
      onClose();
    }
  };

  if (loading) return <div><Loader /></div>;

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
