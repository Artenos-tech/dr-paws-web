import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  mobileNumber: z
    .string()
    .length(10, "Mobile number must be 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only numbers"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (mobileNumber: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobileNumber: "" },
  });

  const loginSubmitHandler = (data: LoginFormData) => {
    console.log(data);
    onSubmit(data.mobileNumber);
  };

  return (
    <div className="text-center">
      <h1 className="text-lg md:text-2xl my-3">Log in to book a visit</h1>
      <p className="text-xs md:text-base text-primary-1">
        Add your phone number. We'll send you a <br /> verification code.
      </p>

      <form onSubmit={handleSubmit(loginSubmitHandler)} className="my-10">
        <div className="inputGroup">
          <input
            type="text"
            {...register("mobileNumber")}
            id="mobileNumber"
            required
            autoComplete="off"
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
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
