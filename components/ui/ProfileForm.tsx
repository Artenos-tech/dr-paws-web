"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import ImageEdit from "@/public/assets/images/Profile/ImageEdit.png"
import { FaTrash } from "react-icons/fa6"
import ProfileLogo from "@/public/assets/images/Profile/profileLogo.jpg"
import { User } from "@/context/UserContext"
import { ClipLoader } from "react-spinners"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim()
      return trimmed === "" ? null : trimmed
    }
    return val
  }, z.string().email("Invalid email address").nullable()),
  address1: z
    .string()
    .max(69, "Address line reached max characters")
    .nullable(),
  address2: z
    .string()
    .max(69, "Address line reached max characters")
    .nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  pincode: z.string().nullable(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profileData: User
  onSubmit: (data: User) => void
  onCancel: () => void
  loading: boolean
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  onSubmit,
  onCancel,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  })

  const [image, setImage] = useState<string | null>(
    profileData.profile_image || null,
  )

  useEffect(() => {
    reset(profileData)
    setImage(profileData.profile_image || null)
  }, [profileData, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = (data: ProfileFormData) => {
    onSubmit({
      ...data,
      id: profileData.id,
      profile_image: image === ProfileLogo.src ? null : image,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      role: "USER",
      mobile: profileData.mobile,
    })
  }

  const handleDeleteImage = () => {
    setImage(ProfileLogo.src)
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 flex flex-col mx-auto w-[85%]"
    >
      <div className="flex flex-col items-center mt-2">
        <div className="relative">
          <Image
            src={image || ProfileLogo}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full h-[120px] w-[120px] object-cover"
          />
          <Image
            src={ImageEdit}
            alt="Image Edit"
            className="absolute bottom-0 right-0 "
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute bottom-0 right-0 opacity-0 w-1/2 h-1/2 cursor-pointer"
          />
          {image && image !== ProfileLogo.src && (
            <button
              type="button"
              className="absolute bottom-0 left-0 p-3 bg-red-500 rounded-full z-10"
              onClick={handleDeleteImage}
            >
              <FaTrash size={10} fill="white" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col ">
        <label className="text-sm">Name</label>
        <input
          {...register("name")}
          className="rounded-md p-2 border w-full border-accent"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col ">
        <label className="text-sm">Contact No</label>
        <p>{profileData.mobile}</p>
      </div>
      <div className="flex flex-col ">
        <label className="text-sm">Email</label>
        <input
          {...register("email")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col ">
        <label className="text-sm">Address Line 1</label>
        <textarea
          {...register("address1")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
          maxLength={69}
        />
        {errors.address1 && (
          <span className="text-red-500 text-sm">
            {errors.address1.message}
          </span>
        )}
      </div>
      <div className="flex flex-col ">
        <label className="text-sm">Address Line 2</label>
        <textarea
          {...register("address2")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
          maxLength={69}
        />
        {errors.address2 && (
          <span className="text-red-500 text-sm">
            {errors.address2.message}
          </span>
        )}
      </div>
      <div className="flex flex-col ">
        <label className="text-sm">City</label>
        <input
          {...register("city")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.city && (
          <span className="text-red-500 text-sm">{errors.city.message}</span>
        )}
      </div>
      <div className="flex flex-col ">
        <label className="text-sm">State</label>
        <input
          {...register("state")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.state && (
          <span className="text-red-500 text-sm">{errors.state.message}</span>
        )}
      </div>

      <div className="flex flex-col ">
        <label className="text-sm">Pincode</label>
        <input
          {...register("pincode")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.pincode && (
          <span className="text-red-500 text-sm">{errors.pincode.message}</span>
        )}
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={onCancel}
          type="button"
          className="text-secondary-1 border-2 border-secondary-1 rounded-full px-4 py-2 flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-secondary-1 text-white rounded-full px-4 py-2 flex-1"
        >
          {loading ? <ClipLoader color="white" size={18} /> : `Save`}
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
