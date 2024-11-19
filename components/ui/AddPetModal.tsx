"use client";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import "react-dropdown/style.css";

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  type: z.string().min(1, "Pet type is required"),
});

type PetFormData = z.infer<typeof petSchema>;

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => void;
}

export default function AddPetModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPetModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
  });

  const handleFormSubmit = (data: PetFormData) => {
    onSubmit(data);
    toast.success("Added pet successfully", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-sm transform overflow-hidden rounded-lg bg-primary-3 p-6 shadow-xl transition-all">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl text-primary-1 mb-6">Add a pet</h2>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name")}
                placeholder="Pet's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <select
                {...register("type")}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Type of Pet</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Hamster">Hamster</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full focus:outline-none  focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-secondary-1 text-white rounded-full  focus:outline-none  focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
