"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Modal from "react-modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import OTPForm from "./OTPForm";
import { useAPICall } from "@/hooks/apicall";
import api, { setAuthToken } from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { Pet, useUserContext } from "@/context/UserContext";

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
  onSuccess: (toastMessage: string) => void;
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

  // context
  const { updateUserDetailsHandler, updateUserPetsHandler } = useUserContext();

  // API's
  const { call: signupOTP } = useAPICall(api.signupOTP);
  const { call: signupVerify } = useAPICall(api.signupVerify);
  const { call: loginOTP } = useAPICall(api.loginOTP);
  const { call: loginVerify } = useAPICall(api.loginVerify);

  const handleIncorrectNumber = () => {
    setUserMobileNumber(undefined);
    setIsLogin(true);
  };

  const handleLoginSubmit = async (mobileNumber: string) => {
    const response = await loginOTP({ mobile: mobileNumber, role: "USER" });

    if (response.ok) {
      setUserMobileNumber(mobileNumber);
      toast.success("OTP sent to your mobile number", {
        duration: 3000,
        position: "bottom-right",
      });
    } else {
      const errorMessage =
        response?.error.apiClientErrorType === "ErrorResponseAPIError"
          ? response.error.body.message
          : (response?.error.message as string);

      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  // Sign up OTP
  const handleSignupSubmit = async (data: {
    userName: string;
    mobileNumber: string;
    profilePicture?: string;
  }) => {
    // TO-DO: Add profilePicture to the API call after adding profilePicture in the backend API
    const response = await signupOTP({
      name: data.userName,
      mobile: data.mobileNumber,
      role: "USER",
    });
    if (response?.ok) {
      setUserMobileNumber(data.mobileNumber);
      toast.success("OTP sent to your mobile number", {
        duration: 3000,
        position: "bottom-right",
      });
    } else {
      const errorMessage =
        response?.error.apiClientErrorType === "ErrorResponseAPIError"
          ? response.error.body.message
          : (response?.error.message as string);

      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  const handleOTPVerification = async (otp: string) => {
    if (isLogin) {
      if (userMobileNumber) {
        const response = await loginVerify({
          mobile: userMobileNumber,
          role: "USER",
          otp,
        });
        if (response?.ok) {
          // Storing the token in the localstorage
          setAuthToken(response.value.body.token);
          updateUserDetailsHandler(response.value.body.user);
          const pets = response.value.body.user_pets?.map((pet) => ({
            ...pet,
            gender: pet.gender ?? undefined,
          })) as Partial<Pet>[];

          if (pets) {
            updateUserPetsHandler(pets);
          }
          onSuccess("Logged in");
        } else {
          const errorMessage =
            response?.error.apiClientErrorType === "ErrorResponseAPIError"
              ? response.error.body.message
              : (response?.error.message as string);

          toast.error(errorMessage, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      }
    } else {
      if (userMobileNumber) {
        const response = await signupVerify({
          mobile: userMobileNumber,
          role: "USER",
          otp,
        });
        if (response?.ok) {
          setAuthToken(response.value.body.token);
          updateUserDetailsHandler(response.value.body.user);
          const pets = response.value.body.user_pets?.map((pet) => ({
            ...pet,
            gender: pet.gender ?? undefined,
          })) as Partial<Pet>[];

          if (pets) {
            updateUserPetsHandler(pets);
          }
          onSuccess("signed up");
        } else {
          const errorMessage =
            response?.error.apiClientErrorType === "ErrorResponseAPIError"
              ? response.error.body.message
              : (response?.error.message as string);

          toast.error(errorMessage, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="relative z-[1000] mt-16 mx-3 px-10 py-5 bg-white rounded-xl shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999]"
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
            viewLoginForm={handleIncorrectNumber}
            handleOTPVerification={handleOTPVerification}
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
      <Toaster />
    </Modal>
  );
};

export default UserAuthenticationModal;
