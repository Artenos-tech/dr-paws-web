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
}

const UserAuthenticationModal: React.FC<authenticationProps> = ({
  isOpen,
  onClose,
  initialMobileNumber,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [userMobileNumber, setUserMobileNumber] = useState<string | undefined>(
    initialMobileNumber
  );

  const handleIncorrectNumber = () => {
    setUserMobileNumber(undefined);
    setIsLogin(true);
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="mt-20 mx-3 px-10 py-5 lg:py-8 bg-white rounded-xl shadow-lg overflow-y-auto z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="flex flex-col justify-center items-center text-primary-1">
        <button
          className="self-end text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
          onClick={onClose}
        >
          <IoClose size={20} />
        </button>
        {userMobileNumber ? (
          <OTPForm
            userMobileNumber={userMobileNumber}
            loginForm={handleIncorrectNumber}
          />
        ) : isLogin ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}

        {userMobileNumber ? (
          <div className="mt-12">
            <p>
              Didn&apos;t receive your code?{" "}
              <span className="font-semibold cursor-pointer">Resend Code</span>
            </p>
          </div>
        ) : (
          <div className="mt-12">
            {isLogin ? (
              <p>
                Don&apos;t have an Account?{" "}
                <span
                  onClick={() => setIsLogin(false)}
                  className="font-semibold cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p>
                Already have an Account?{" "}
                <span
                  onClick={() => setIsLogin(true)}
                  className="font-semibold cursor-pointer"
                >
                  Log In
                </span>
              </p>
            )}
          </div>
        )}

        {/* <div className="mt-12">
          {isLogin ? (
            <p>
              Don&apos;t have an Account?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="font-semibold cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an Account?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="font-semibold cursor-pointer"
              >
                Log In
              </span>
            </p>
          )}
        </div> */}
      </div>
    </Modal>
  );
};

export default UserAuthenticationModal;
