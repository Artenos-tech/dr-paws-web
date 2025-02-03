"use client";

import Image from "next/image";
import React from "react";
import OutlineButton from "./OutlineButton";
import { User } from "@/context/UserContext";
import defaultProfileImage from "@/public/assets/images/Profile/profileLogo.jpg";

interface ProfileCardProps {
  profile: User;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {
  const {
    name,
    profile_image,
    mobile,
    email,
    address1,
    address2,
    city,
    state,
    country,
    pincode,
  } = profile;

  function formAddressStr(
    address1: string | null,
    address2: string | null,
    city: string | null,
    state: string | null,
    country: string | null,
    pincode: string | null
  ) {
    const address = [address1, address2, city, state, country, pincode];
    const addressStr = address
      .filter((addr) => addr !== null && addr.trim() !== "")
      .join(", ");
    return addressStr;
  }

  return (
    <div className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 mt-8 lg:mt-16">
      <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-orange-400 flex-shrink-0">
        <Image
          src={profile_image || defaultProfileImage}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex-grow space-y-4 lg:space-y-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-9">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-secondary-1 break-words">
            {name}
          </h1>
          <OutlineButton
            outlineBtnText="Edit Profile"
            outlineBtnLink={onEdit}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-6">
          <div className="space-y-1 lg:space-y-2 lg:col-span-2">
            <h2 className="text-sm lg:text-base text-gray-500">Contact No</h2>
            <p className="text-base lg:text-lg font-medium text-gray-700 break-words">
              {mobile}
            </p>
          </div>
          <div className="space-y-1 lg:space-y-2 lg:col-span-3">
            <h2 className="text-sm lg:text-base text-gray-500">Email Id</h2>
            <p className="text-base lg:text-lg font-medium text-gray-700 break-all">
              {email}
            </p>
          </div>
          <div className="space-y-1 lg:space-y-2 lg:col-span-2">
            <h2 className="text-sm lg:text-base text-gray-500">Address</h2>
            <p className="text-base lg:text-lg font-medium text-gray-700 break-words">
              {formAddressStr(
                address1,
                address2,
                city,
                state,
                country,
                pincode
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
