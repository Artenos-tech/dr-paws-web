import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

interface otpFormProps {
  userMobileNumber?: string;
  loginForm: () => void;
}

const OTPForm: React.FC<otpFormProps> = ({ userMobileNumber, loginForm }) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl my-3">Verify your Phone Number</h1>
      <p className="text-base text-primary-1">
        Enter the OTP sent to +91 {userMobileNumber}.{" "}
        <span
          className="font-semibold cursor-pointer underline"
          onClick={loginForm}
        >
          Incorrect Number?
        </span>
      </p>

      <form>
        <div className="flex flex-col justify-center items-center my-10 gap-10">
          <div>
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} className="border-2">
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
        <button className="w-3/4 bg-secondary-1 text-white rounded-full py-3 text-sm my-2">
          Verify and Proceed
        </button>
        </div>
      </form>
    </div>
  );
};

export default OTPForm;
