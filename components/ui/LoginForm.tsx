import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";

const loginSchema = z.object({
  mobileNumber: z
    .string()
    .length(10, "Mobile number must be 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only numbers"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (mobileNumber: string) => void;
  buttonText?: string;
  loading: boolean;
  errMsg: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  buttonText,
  loading,
  errMsg,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobileNumber: "" },
  });

  const loginSubmitHandler = (data: LoginFormData) => {
    onSubmit(data.mobileNumber);
  };

  return (
    <div className="text-center">
      <h1 className="text-lg md:text-2xl my-3">
        Log in {buttonText ? "to " + buttonText.toLowerCase() : ""}
      </h1>
      <p className="text-xs md:text-base text-primary-1">
        Add your phone number. We&apos;ll send you a <br /> verification code.
      </p>

      <form onSubmit={handleSubmit(loginSubmitHandler)} className="my-10">
        <div className="inputGroup">
          <input
            type="text"
            {...register("mobileNumber")}
            id="mobileNumber"
            required
            autoComplete="off"
            autoFocus
          />
          <label htmlFor="mobileNumber">Mobile Number</label>
          {errors.mobileNumber && (
            <p className="text-red-500 text-left text-xs mt-1">
              {errors.mobileNumber.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-secondary-1 text-white rounded-full py-3 text-xs md:text-sm my-2"
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Send OTP"}
        </button>
        {errMsg && (
          <p className="text-red-500 text-center text-xs mt-1">
            {errMsg === "User not found"
              ? "User not found, Please create an account"
              : errMsg}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
