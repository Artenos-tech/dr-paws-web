import React, { useState } from "react";
import defaultUserProfile from "@/public/assets/images/Profile/profileLogo.jpg";
import editIcon from "@/public/assets/images/Profile/ImageEdit.png";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  userName: z.string().trim().min(1, "Provide name."),
  mobileNumber: z
    .string()
    .length(10, "Mobile number must be 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only numbers"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (data: {
    userName: string;
    mobileNumber: string;
    profilePicture: string | null;
  }) => void;
  loading: boolean;
  errMsg: string;
}

const SignupForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  loading,
  errMsg,
}) => {
  const [userProfileImage, setUserPofileImage] = useState<string>(
    defaultUserProfile.src
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { userName: "", mobileNumber: "" },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUserPofileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const signUpSubmitHandler = (data: SignUpFormData) => {
    const isDefaultImage = userProfileImage.includes("/_next/static/media/")
      ? null
      : userProfileImage;

    onSubmit({ ...data, profilePicture: isDefaultImage });
  };

  return (
    <div className="text-center">
      <h1 className="text-lg md:text-xl lg:text-2xl my-3">
        Let&apos;s get started by creating <br /> your account.
      </h1>
      <p className="text-xs md:text-sm lg:text-base text-primary-1">
        Add your phone number. We&apos;ll send you a <br /> verification code.
      </p>

      <form onSubmit={handleSubmit(signUpSubmitHandler)} className="my-6">
        <div className="relative flex flex-col w-[40%] sm:w-[35%] md:w-[35%] mb-6 mx-auto">
          <div>
            <Image
              src={userProfileImage}
              alt="user-profile"
              width={150}
              height={150}
              className="rounded-full w-[150px] bg-white border-1 "
            />
            {typeof userProfileImage === "string" &&
              !userProfileImage.includes("/_next/static/media/") && (
                <button
                  type="button"
                  className="absolute bottom-0 left-0 p-2.5 bg-red-500 rounded-full z-10"
                  onClick={() => {
                    setUserPofileImage(defaultUserProfile.src);
                  }}
                >
                  <FaTrash size={8} fill="white" />
                </button>
              )}

            <Image
              src={editIcon}
              alt="edit icon"
              className="absolute bottom-0 right-0 w-7 "
            />
          </div>

          <div className="px-5">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer px-5"
              aria-label="Upload pet profile image"
            />
          </div>
        </div>

        <div className="inputGroup">
          <input
            type="text"
            {...register("userName")}
            required
            autoComplete="off"
          />
          <label htmlFor="name">Name</label>
          {errors.userName && (
            <p className="text-red-500 text-left text-xs mt-1">
              {errors.userName.message}
            </p>
          )}
        </div>
        <div className="inputGroup">
          <input
            type="text"
            {...register("mobileNumber")}
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
          {loading ? "Loading..." : "Send OTP"}
        </button>
        {errMsg && (
          <p className="text-red-500 text-center text-xs mt-1">{errMsg}</p>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
