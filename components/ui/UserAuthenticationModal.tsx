"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OTPForm from "./OTPForm";

interface authenticationProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Optional user mobile number.
   * If the user is already logged in, we don’t need to send this prop since the
   * user's mobile number will be retrieved automatically.
   * We’ll first check if the user is logged in before requiring this prop.
   */
  initialMobileNumber?: string;
  onSuccess?: () => void;
  buttonText?: string;
}

const UserAuthenticationModal: React.FC<authenticationProps> = ({
  isOpen,
  onClose,
  initialMobileNumber,
  onSuccess,
  buttonText,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [userMobileNumber, setUserMobileNumber] = useState<string | undefined>(
    initialMobileNumber
  );
  const [userName, setUserName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );

  const handleIncorrectNumber = () => {
    setUserMobileNumber(undefined);
    setIsLogin(true);
  };

  const handleLoginSubmit = (mobileNumber: string) => {
    setUserMobileNumber(mobileNumber);
  };

  const handleSignupSubmit = (data: {
    userName: string;
    mobileNumber: string;
    profilePicture?: string;
  }) => {
    setUserMobileNumber(data.mobileNumber);
    setProfilePicture(data.profilePicture);
    setUserName(data.userName);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="mt-16 mx-3 px-10 py-5 bg-white relative rounded-xl shadow-lg overflow-y-auto z-[50]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      <button
        className="text-gray-500 absolute right-2 top-2 hover:text-gray-700 transition-colors"
        aria-label="Close modal"
        onClick={onClose}
      >
        <IoClose size={20} />
      </button>
      <div className="flex flex-col justify-center items-center text-primary-1">
        {userMobileNumber ? (
          <OTPForm
            userMobileNumber={userMobileNumber}
            loginForm={handleIncorrectNumber}
            onSuccess={onSuccess}
          />
        ) : isLogin ? (
          <LoginForm onSubmit={handleLoginSubmit} buttonText={buttonText} />
        ) : (
          <SignupForm onSubmit={handleSignupSubmit} />
        )}

        {userMobileNumber ? (
          <div>
            <p className="text-sm md:text-base">
              Didn&apos;t receive your code?{" "}
              <span className="font-semibold cursor-pointer">Resend Code</span>
            </p>
          </div>
        ) : (
          <div className="mt-4">
            {isLogin ? (
              <p className="text-sm md:text-base">
                Don&apos;t have an Account?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="font-semibold cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p className="text-sm md:text-base">
                Already have an Account?{" "}
                <span
                  onClick={() => setIsLogin(true)}
                  className="font-semibold cursor-pointer text-sm md:text-base"
                >
                  Log In
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserAuthenticationModal;
