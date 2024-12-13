"use client";

import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { ClipLoader } from "react-spinners";

interface otpFormProps {
  userMobileNumber?: string;
  viewLoginForm: () => void;
  handleOTPVerification: (otp: string) => void;
  loading: boolean;
  resendOTPHandler: () => void;
  errMsg: string;
  bookingFlow?: boolean;
}

const OTPForm: React.FC<otpFormProps> = ({
  userMobileNumber,
  viewLoginForm,
  handleOTPVerification,
  loading,
  resendOTPHandler,
  errMsg,
  bookingFlow,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (otp.length === 4) {
      handleOTPVerification(otp);
      setErr("");
    } else {
      setErr("Please enter valid 4-digit OTP");
    }
  };
  return (
    <div className="text-center w-full">
      <h1 className="text-lg md:text-2xl my-3">Verify your Phone Number</h1>
      <p className="text-xs md:text-base text-primary-1">
        {bookingFlow
          ? `To book a visit, please enter the OTP sent to +91 ${userMobileNumber}.`
          : `Enter the OTP sent to +91 ${userMobileNumber}.`}
      </p>
      <span
        className="cursor-pointer text-xs md:text-base border-b border-primary-1"
        onClick={viewLoginForm}
      >
        Incorrect Number?
      </span>

      <form>
        <div className="flex flex-col justify-center items-center my-10 gap-10">
          <div>
            <InputOTP
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              className="border-2"
              onChange={(value) => setOtp(value)}
              value={otp}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="rounded-full border-secondary-1 mr-3"
                />
                <InputOTPSlot
                  index={1}
                  className="rounded-full border-secondary-1 mr-3"
                />
                <InputOTPSlot
                  index={2}
                  className="rounded-full border-secondary-1 mr-3"
                />
                <InputOTPSlot
                  index={3}
                  className="rounded-full border-secondary-1 mr-3"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {(err || errMsg) && (
            <p className="text-xs text-red-500 w-3/4 text-center">
              {err || errMsg}
            </p>
          )}

          <button
            type="button"
            className="w-full bg-secondary-1 text-white rounded-full py-3 text-xs md:text-sm my-2"
            onClick={handleVerify}
          >
            {loading ? (
              <ClipLoader size={20} color="white" />
            ) : bookingFlow ? (
              "Verify and Book"
            ) : (
              "Verify and Proceed"
            )}
          </button>
        </div>

        <div className="flex justify-center items-center gap-1 text-xs sm:text-sm md:text-base">
          <p>Didn&apos;t receive your code? </p>
          <button
            type="button"
            className="font-semibold cursor-pointer"
            onClick={() => {
              setOtp("");
              setErr("");
              resendOTPHandler();
            }}
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPForm;
