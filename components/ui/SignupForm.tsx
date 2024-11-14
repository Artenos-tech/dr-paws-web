"use client";

import React, { useState } from "react";
import defaultUserProfile from "@/public/assets/images/defaultUserProfile.png";
import editIcon from "@/public/assets/images/Profile/ImageEdit.png";
import Image, { StaticImageData } from "next/image";
import { FaTrash } from "react-icons/fa6";

const SignupForm = () => {
  const [userProfile, setUserPofile] = useState<string>(defaultUserProfile.src);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUserPofile(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl my-3">
        Let's get started by creating your account.
      </h1>
      <p className="text-base text-primary-1">
        Add your phone number. We'll send you a verification code.
      </p>

      <form className="mt-10">
        <div className="relative flex flex-col w-[60%] md:w-[28%] mx-auto">
          <Image
            src={userProfile || defaultUserProfile.src}
            alt="user-profile"
            width={130}
            height={130}
            className="rounded-full w-[130px] h-[130px] bg-white border-1 "
          />
          {typeof userProfile === "string" &&
            !userProfile.includes("/_next/static/media/") && (
              <button
                type="button"
                className="absolute bottom-0 left-0 p-3 bg-red-500 rounded-full z-10"
                onClick={() => setUserPofile(defaultUserProfile.src)}
              >
                <FaTrash size={10} fill="white" />
              </button>
            )}

          <Image
            src={editIcon}
            alt="edit icon"
            className="absolute bottom-0 right-0 "
          />
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

        {/* Don't add any styles to input and label, check css in global.css */}
        <div className="inputGroup">
          <input type="text" required autoComplete="off" />
          <label htmlFor="name">Name</label>
        </div>
        <div className="inputGroup">
          <input type="text" required autoComplete="off" />
          <label htmlFor="mobileNumber">Mobile Number</label>
        </div>
        <button className="w-full bg-secondary-1 text-white rounded-full py-3 text-sm my-2">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
