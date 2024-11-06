"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import ProfileImage from "@/public/assets/images/Profile/Profile.png";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: {
    name: string;
    contact: string;
    image: string;
    email: string;
    address: string;
  }) => void;
  profileData: {
    name: string;
    contact: string;
    image: string;
    email: string;
    address: string;
  };
}

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contact: z.string().min(1, "Contact is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

const billingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiration date (MM/YY)"),
  cvv: z.string().length(3, "CVV must be 3 digits"),
  cardName: z.string().min(1, "Name on card is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type BillingFormData = z.infer<typeof billingSchema>;

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profileData,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  });

  const {
    register: registerBilling,
    handleSubmit: handleBillingSubmit,
    formState: { errors: billingErrors },
  } = useForm<BillingFormData>({ resolver: zodResolver(billingSchema) });

  useEffect(() => {
    if (isOpen) {
      reset(profileData);
    }
  }, [profileData, reset, isOpen]);

  const onProfileSubmit = (data: ProfileFormData) => {
    const updatedProfile = {
      ...data,
      image: profileData.image,
    };
    onSave(updatedProfile);
    onClose();
  };

  const onBillingSubmit = (data: BillingFormData) => {
    console.log("Billing Data:", data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Profile Modal"
      className="w-full max-w-md mx-auto my-20 p-4 bg-[#F8F4EA] rounded-xl shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      style={{ content: { maxHeight: "80vh", padding: "1rem" } }}
    >
      <div className="flex justify-around w-full border-b pb-3 text-gray-700 mb-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-6 py-2 ${activeTab === "profile" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`px-6 py-2 ${activeTab === "billing" ? "border-b-2 border-blue-500 font-semibold" : ""}`}
        >
          Billing Information
        </button>
      </div>

      {activeTab === "profile" ? (
        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <Image
                src={ProfileImage}
                alt="Profile"
                width={64}
                height={64}
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

          <div className="flex flex-col gap-4">
            <label>Name</label>
            <input {...register("name")} className="input rounded-md p-2 border w-full" />
            {profileErrors.name && (
              <span className="text-red-500 text-sm">{profileErrors.name.message}</span>
            )}
          </div>
          <div>
            <label>Contact No</label>
            <input {...register("contact")} className="input rounded-md p-2 border w-full" />
            {profileErrors.contact && (
              <span className="text-red-500 text-sm">{profileErrors.contact.message}</span>
            )}
          </div>
          <div>
            <label>Email</label>
            <input {...register("email")} className="input rounded-md p-2 border w-full" />
            {profileErrors.email && (
              <span className="text-red-500 text-sm">{profileErrors.email.message}</span>
            )}
          </div>
          <div>
            <label>Address</label>
            <input {...register("address")} className="input rounded-md p-2 border w-full" />
            {profileErrors.address && (
              <span className="text-red-500 text-sm">{profileErrors.address.message}</span>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={onClose} type="button" className="text-gray-500 border border-gray-400 rounded-lg px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">
              Save
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleBillingSubmit(onBillingSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <div>
              <label>First Name</label>
              <input {...registerBilling("firstName")} className="input rounded-md p-2 border w-full" />
              {billingErrors.firstName && (
                <span className="text-red-500 text-sm">{billingErrors.firstName.message}</span>
              )}
            </div>
            <div>
              <label>Last Name</label>
              <input {...registerBilling("lastName")} className="input rounded-md p-2 border w-full" />
              {billingErrors.lastName && (
                <span className="text-red-500 text-sm">{billingErrors.lastName.message}</span>
              )}
            </div>
          </div>
          <div>
            <label>Card Number</label>
            <input {...registerBilling("cardNumber")} className="input rounded-md p-2 border w-full" />
            {billingErrors.cardNumber && (
              <span className="text-red-500 text-sm">{billingErrors.cardNumber.message}</span>
            )}
          </div>
          <div className="flex gap-4">
            <div>
              <label>Expiration Date</label>
              <input {...registerBilling("expiry")} className="input rounded-md p-2 border w-full" />
              {billingErrors.expiry && (
                <span className="text-red-500 text-sm">{billingErrors.expiry.message}</span>
              )}
            </div>
            <div>
              <label>CVV</label>
              <input {...registerBilling("cvv")} className="input rounded-md p-2 border w-full" />
              {billingErrors.cvv && (
                <span className="text-red-500 text-sm">{billingErrors.cvv.message}</span>
              )}
            </div>
          </div>
          <div>
            <label>Name on Card</label>
            <input {...registerBilling("cardName")} className="input rounded-md p-2 border w-full" />
            {billingErrors.cardName && (
              <span className="text-red-500 text-sm">{billingErrors.cardName.message}</span>
            )}
          </div>
          <div>
            <label>Billing Address</label>
            <input {...registerBilling("billingAddress")} className="input rounded-md p-2 border w-full" />
            {billingErrors.billingAddress && (
              <span className="text-red-500 text-sm">{billingErrors.billingAddress.message}</span>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={onClose} type="button" className="text-gray-500 border border-gray-400 rounded-lg px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2">
              Save Billing Info
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditProfileModal;
