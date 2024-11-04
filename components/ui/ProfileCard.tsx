"use client";

import { Pencil } from "lucide-react";
import Image from "next/image";
import ProfileImage from "@/public/assets/images/Profile/Profile.png";

const ProfileData = {
  name: "John Doe",
  contact: "0937948568",
  image: ProfileImage,
  email: "jondoe@gmail.com",
  address: "Andheri West, Mumbai",
};

interface ProfileCardProps {
  name: string;
  image: string;
  contact: string;
  email: string;
  address: string;
}

export default function ProfileCard({
  name,
  image,
  contact,
  email,
  address,
}: ProfileCardProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 p-16">
      {/* Profile Image */}
      <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-orange-400 flex-shrink-0">
        <Image
          src={ProfileData.image}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Profile Information */}
      <div className="flex-grow space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl md:text-4xl font-semibold text-secondary-1">
            {ProfileData.name}
          </h1>
          <button className="flex items-center gap-2 text-secondary-1 border-secondary-1 hover:bg-blue-50">
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h2 className="text-gray-500">Contact No</h2>
            <p className="text-lg font-medium text-gray-700">
              {ProfileData.contact}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-gray-500">Email Id</h2>
            <p className="text-lg font-medium text-gray-700">
              {ProfileData.email}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-gray-500">Address</h2>
            <p className="text-lg font-medium text-gray-700">
              {ProfileData.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
