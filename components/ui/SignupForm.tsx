import React, { useState } from "react";
import defaultUserProfile from "@/public/assets/images/Profile/profileLogo.jpg";
import editIcon from "@/public/assets/images/Profile/ImageEdit.png";
import Image from "next/image";
import { FaTrash } from "react-icons/fa6";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";

const signUpSchema = z.object({
  userName: z.string().trim().min(1, "Provide your full name."),
  mobileNumber: z
    .string()
    .length(10, "Mobile number must be 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only numbers"),
  address1: z
    .string()
    .trim()
    .min(1, "Provide address details like house number, building name."),
  address2: z
    .string()
    .trim()
    .min(1, "Provide address details like street name, locality."),
  city: z.string().trim().min(1, "Provide city name."),
  pincode: z
    .string()
    .trim()
    .min(1, "Provide pincode.")
    .max(6, "Pincode must be 6 digits"),
  state: z.string().trim().min(1, "Provide state name."),

  profilePicture: z.string().nullable().optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (data: {
    userName: string;
    mobileNumber: string;
    profilePicture: string | null;
    address1: string;
    address2: string;
    city: string;
    pincode: string;
    state: string;
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
    defaultUserProfile.src,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: "",
      mobileNumber: "",
      address1: "",
      address2: "",
      city: "",
      pincode: "",
      state: "",
    },
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

      <form
        onSubmit={handleSubmit(signUpSubmitHandler, (errors) => {
          console.log("Form validation errors:", errors);
        })}
        className="my-6"
      >
        <div className="relative flex flex-col w-[40%] sm:w-[35%] md:w-[35%] mb-6 mx-auto">
          <div>
            <Image
              src={userProfileImage}
              alt="user-profile"
              width={150}
              height={150}
              className="rounded-full w-[150px] bg-white border-1 object-cover"
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
          <label htmlFor="userName">Full Name</label>
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
        <div className="inputGroup">
          <input
            type="text"
            {...register("address1")}
            required
            autoComplete="off"
          />
          <label htmlFor="address1">Address Line 1</label>
          {errors.address1 && (
            <p className="text-red-500 text-left text-xs mt-1">
              {errors.address1.message}
            </p>
          )}
        </div>
        <div className="inputGroup">
          <input
            type="text"
            {...register("address2")}
            required
            autoComplete="off"
          />
          <label htmlFor="address2">Address Line 2</label>
          {errors.address2 && (
            <p className="text-red-500 text-left text-xs mt-1">
              {errors.address2.message}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <div className="inputGroup">
            <input
              type="text"
              {...register("city")}
              required
              autoComplete="off"
            />
            <label htmlFor="city">City</label>
            {errors.city && (
              <p className="text-red-500 text-left text-xs mt-1">
                {errors.city.message}
              </p>
            )}
          </div>
          <div className="inputGroup">
            <input
              type="text"
              {...register("pincode")}
              required
              autoComplete="off"
            />
            <label htmlFor="pincode">Pincode</label>
            {errors.pincode && (
              <p className="text-red-500 text-left text-xs mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>
        <div className="inputGroup">
          <input
            type="text"
            {...register("state")}
            required
            autoComplete="off"
          />
          <label htmlFor="state">State</label>
          {errors.state && (
            <p className="text-red-500 text-left text-xs mt-1">
              {errors.state.message}
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
          <p className="text-red-500 text-center text-xs mt-1">{errMsg}</p>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
