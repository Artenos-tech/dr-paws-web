'use client'
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import ProfileImage from "@/public/assets/images/Profile/Profile.png";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z
    .string()
    .length(10, "Contact must be 10 digits")
    .regex(/^\d{10}$/, "Contact must be numeric"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profileData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profileData, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  });

  useEffect(() => {
    reset(profileData);
  }, [profileData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <Image
            src={ProfileImage}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-gray-300 rounded-full p-1"
            onClick={() => {
              alert("Image change functionality not implemented.");
            }}
          >
            ✎
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label>Name</label>
        <input
          {...register("name")}
          className="input rounded-md p-2 border w-full"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Contact No</label>
        <input
          {...register("contact")}
          type="text"
          maxLength={10}
          pattern="\d*"
          className="input rounded-md p-2 border w-full"
        />
        {errors.contact && (
          <span className="text-red-500 text-sm">
            {errors.contact.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Email</label>
        <input
          {...register("email")}
          className="input rounded-md p-2 border w-full"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Address</label>
        <input
          {...register("address")}
          className="input rounded-md p-2 border w-full"
        />
        {errors.address && (
          <span className="text-red-500 text-sm">
            {errors.address.message}
          </span>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={onCancel}
          type="button"
          className="text-gray-500 border border-gray-400 rounded-lg px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProfileForm; 