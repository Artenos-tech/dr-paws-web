"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  pincode: z.string().regex(/^\d{5,6}$/, "Please enter a valid pincode"),
  whatsappConsent: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ClinicLocationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      pincode: "",
      whatsappConsent: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      toast.success("Successfully submitted. Our team will get back to you.");
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f7f1de] rounded-md  shadow-lg overflow-hidden">
      <div className="text-center py-8 px-6 space-y-2">
        <h1 className="text-[24px] font-roca text-400">
          Tell us where you&apos;d like a new clinic so we know where to
          prioritise
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              {...register("firstName")}
              placeholder="First Name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#95a781] focus:border-transparent bg-white"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register("lastName")}
              placeholder="Last Name"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#95a781] focus:border-transparent bg-white"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              {...register("contactNumber")}
              placeholder="Contact Number"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#95a781] focus:border-transparent bg-white"
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-500 font-roca">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register("pincode")}
              placeholder="Pincode"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#95a781] focus:border-transparent bg-white"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-500">
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-row items-center space-x-3">
          <input
            type="checkbox"
            {...register("whatsappConsent")}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#95a781] focus:ring-[#95a781]"
          />
          <label className="text-sm text-neutral-700">
            Ticking this box means we have your consent to chat on WhatsApp
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[210px] h-[50px] px-[9px] py-[6px]  bg-[#9fa983] hover:bg-[#7c8c6a] text-white rounded-[25px] transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <span>Submit</span>
            </>
          )}
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
