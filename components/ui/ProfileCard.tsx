"use client";

import { Pencil } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface ProfileCardProps {
  profile: {
    name: string;
    image: StaticImageData;
    contact: string;
    email: string;
    address: string;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  // Destructure the profile data from the single prop
  const { name, image, contact, email, address } = profile;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 mt-16 w-full">
      {/* Profile Image */}
      <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-orange-400 flex-shrink-0">
        <Image src={image} alt={name} fill className="object-cover" priority />
      </div>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Profile Information */}
      <div className="flex-grow space-y-6">
        <div className="flex justify-between items-start gap-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-secondary-1">
            {name}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-sm text-secondary-1 border px-4 py-2 rounded-full border-secondary-1 hover:bg-blue-50"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h2 className="text-gray-500">Contact No</h2>
            <p className="text-lg font-medium text-gray-700">{contact}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-gray-500">Email Id</h2>
            <p className="text-lg font-medium text-gray-700">{email}</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-gray-500">Address</h2>
            <p className="text-lg font-medium text-gray-700">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
