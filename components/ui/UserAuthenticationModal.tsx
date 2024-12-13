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
  onSuccess: (toastMessage: string) => void;
  buttonText?: string;
  bookingFlow?: boolean;
}

const UserAuthenticationModal: React.FC<authenticationProps> = ({
  isOpen,
  onClose,
  onSuccess,
  buttonText,
  bookingFlow = false,
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [userMobileNumber, setUserMobileNumber] = useState<string | undefined>(
    undefined
  );

  const [userName, setUserName] = useState<string>("");
  const [profileImage, setUserPofileImage] = useState<string | null>(null);

  const [loginErr, setLoginErr] = useState("");
  const [signupErr, setSignupErr] = useState("");
  const [otpErr, setOtpErr] = useState("");

  // context
  const { updateUserDetailsHandler, updateUserPetsHandler, user } =
    useUserContext();

  // API's
  const { call: signupOTP, loading: signupOTPLoading } = useAPICall(
    api.signupOTP
  );
  const { call: signupVerify, loading: signupVerifyLoading } = useAPICall(
    api.signupVerify
  );
  const { call: loginOTP, loading: loginOTPLoading } = useAPICall(api.loginOTP);
  const { call: loginVerify, loading: loginVerifyLoading } = useAPICall(
    api.loginVerify
  );

  const { call: signupCancel } = useAPICall(api.signupCancel);

  useEffect(() => {
    if (user) {
      setUserMobileNumber(user.mobile);
    }
  }, [user]);

  const handleIncorrectNumber = () => {
    setUserMobileNumber(undefined);
    setLoginErr("");
    setIsLogin(true);
  };

  const handleLoginSubmit = async (mobileNumber: string) => {
    setOtpErr("");
    const response = await loginOTP({ mobile: mobileNumber, role: "USER" });

    if (response.ok) {
      setUserMobileNumber(mobileNumber);
      toast.success("OTP sent to your mobile number", {
        duration: 3000,
        position: "bottom-right",
      });
      setLoginErr("");
    } else {
      const errorMessage =
        response?.error.apiClientErrorType === "ErrorResponseAPIError"
          ? response.error.body.message
          : (response?.error.message as string);

      setLoginErr(errorMessage);

      toast.error("Something went wrong. Please try again.", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  // Sign up OTP
  const handleSignupSubmit = async (data: {
    userName: string;
    mobileNumber: string;
    profilePicture: string | null;
  }) => {
    setOtpErr("");
    // Updating state variables for resending OTP
    setUserName(data.userName);
    setUserPofileImage(data.profilePicture);
    const response = await signupOTP({
      name: data.userName,
      mobile: data.mobileNumber,
      role: "USER",
      profile_image: data.profilePicture || null,
    });
    if (response?.ok) {
      setUserMobileNumber(data.mobileNumber);
      toast.success("OTP sent to your mobile number", {
        duration: 3000,
        position: "bottom-right",
      });
      setSignupErr("");
    } else {
      const errorMessage =
        response?.error.apiClientErrorType === "ErrorResponseAPIError"
          ? response.error.body.message
          : (response?.error.message as string);

      setSignupErr(errorMessage);

      toast.error("Something went wrong. Please try again.", {
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
          const user = response.value.body.user;
          updateUserDetailsHandler({
            ...user,
            currentAddress: user.current_address,
            profileImage: user.profile_image,
          });
          const pets = response.value.body.pets?.map((pet) => ({
            ...pet,
            profileImage: pet.profile_image,
            gender: pet.gender ?? undefined,
          })) as Partial<Pet>[];

          setOtpErr("");

          if (pets) {
            updateUserPetsHandler(pets);
          }
          onSuccess("logged in");
        } else {
          const errorMessage =
            response?.error.apiClientErrorType === "ErrorResponseAPIError"
              ? response.error.body.message
              : (response?.error.message as string);
          setOtpErr(
            errorMessage === "Invalid mobile number or OTP"
              ? "Invalid OTP"
              : errorMessage
          );

          toast.error("Something went wrong. Please try again.", {
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
          const user = response.value.body.user;
          updateUserDetailsHandler({
            ...user,
            currentAddress: user.current_address,
            profileImage: user.profile_image,
          });
          const pets = response.value.body.pets?.map((pet) => ({
            ...pet,
            profileImage: pet.profile_image,
            gender: pet.gender ?? undefined,
          })) as Partial<Pet>[];

          if (pets) {
            updateUserPetsHandler(pets);
          }
          setOtpErr("");
          onSuccess("signed up");
        } else {
          const errorMessage =
            response?.error.apiClientErrorType === "ErrorResponseAPIError"
              ? response.error.body.message
              : (response?.error.message as string);
          setOtpErr(
            errorMessage === "Invalid mobile number or OTP"
              ? "Invalid OTP"
              : errorMessage
          );

          toast.error("Something went wrong. Please try again.", {
            duration: 3000,
            position: "bottom-right",
          });
        }
      }
    }
  };

  const handleResendOTP = async () => {
    setOtpErr("");
    if (userMobileNumber) {
      const response = isLogin
        ? await loginOTP({ mobile: userMobileNumber, role: "USER" })
        : await signupOTP({
            mobile: userMobileNumber,
            role: "USER",
            name: userName,
            profile_image: profileImage,
          });

      if (response.ok) {
        toast.success("OTP resent to your mobile number", {
          duration: 3000,
          position: "bottom-right",
        });
        setLoginErr("");
        setSignupErr("");
      } else {
        const errorMessage =
          response?.error.apiClientErrorType === "ErrorResponseAPIError"
            ? response.error.body.message
            : (response?.error.message as string);
        if (isLogin) {
          console.log(errorMessage);
          setOtpErr(errorMessage);
        } else {
          setOtpErr(errorMessage);
        }
        toast.error("Something went wrong. Please try again.", {
          duration: 3000,
          position: "bottom-right",
        });
      }
    }
  };

  const handleCloseOnRequest = async () => {
    if (userMobileNumber) {
      await signupCancel({ mobile: userMobileNumber, role: "USER" });
    }
    setIsLogin(true);
    onClose();
    setOtpErr("");
    setLoginErr("");
    setSignupErr("");
    setUserMobileNumber(undefined);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseOnRequest}
      className="relative z-[1000] mt-16 mx-3 px-10 py-5 bg-white rounded-xl shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[999]"
    >
      <button
        className="text-gray-500 absolute right-2 top-2 hover:text-gray-700 transition-colors"
        aria-label="Close modal"
        onClick={handleCloseOnRequest}
      >
        <IoClose size={20} />
      </button>
      <div className="flex flex-col justify-center items-center text-primary-1">
        {userMobileNumber ? (
          <OTPForm
            userMobileNumber={userMobileNumber}
            viewLoginForm={handleIncorrectNumber}
            handleOTPVerification={handleOTPVerification}
            loading={signupVerifyLoading || loginVerifyLoading}
            resendOTPHandler={handleResendOTP}
            errMsg={otpErr}
            bookingFlow={bookingFlow}
          />
        ) : isLogin ? (
          <LoginForm
            onSubmit={handleLoginSubmit}
            buttonText={buttonText}
            loading={loginOTPLoading}
            errMsg={loginErr}
          />
        ) : (
          <SignupForm
            onSubmit={handleSignupSubmit}
            loading={signupOTPLoading}
            errMsg={signupErr}
          />
        )}

        {userMobileNumber ? null : (
          <div className="mt-4">
            {isLogin ? (
              <p className="text-sm md:text-base">
                Don&apos;t have an Account?{" "}
                <span
                  onClick={() => {
                    setSignupErr("")
                    setLoginErr("");
                    setIsLogin(false)
                  }}
                  className="font-semibold cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            ) : (
              <p className="text-sm md:text-base">
                Already have an Account?{" "}
                <span
                  onClick={() => {
                    setLoginErr("");
                    setSignupErr("");
                    setIsLogin(true);
                  }}
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
