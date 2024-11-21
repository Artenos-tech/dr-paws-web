import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface otpFormProps {
  userMobileNumber?: string;
  viewLoginForm: () => void;
  handleOTPVerification: (otp: string) => void;
}

const OTPForm: React.FC<otpFormProps> = ({
  userMobileNumber,
  viewLoginForm,
  handleOTPVerification,
}) => {
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (otp.length === 4) {
      handleOTPVerification(otp);
    } else {
      setErr("Please enter a valid 4-digit OTP.");
    }
  };
  return (
    <div className="text-center">
      <h1 className="text-lg md:text-2xl my-3">Verify your Phone Number</h1>
      <p className="text-xs md:text-base text-primary-1">
        Enter the OTP sent to +91 {userMobileNumber}.
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
              // TO-DO: Later OTP length should be 4
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              className="border-2"
              onChange={(value) => setOtp(value)}
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
          {err && <p className="text-xs text-red-500 text-left">{err}</p>}
          <button
            type="button"
            className="w-[95%] md:w-full bg-secondary-1 text-white rounded-full py-3 text-xs md:text-sm my-2"
            onClick={handleVerify}
          >
            Verify and Proceed
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPForm;
