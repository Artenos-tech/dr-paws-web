"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";

const paymentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  nameOnCard: z.string().min(1, "Name on card is required"),
  country: z.string().min(1, "Country is required"),
  acceptTerms: z
    .preprocess((val) => val === "on" || val === true, z.boolean())
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const planTitle = searchParams.get("title");
  const duration = searchParams.get("duration");
  const price = searchParams.get("price");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = (data: PaymentFormData) => {
    try {
      console.log(data);

    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1DE]/[.4]">
      <main className="flex flex-col row-start-2 items-center w-full ">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-28 px-8 md:px-32 lg:px-40">
          {/* Payment Form */}
          <div className="lg:w-3/5">
            <Link
              href="/membership"
              className="flex items-center text-primary-1 my-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back
            </Link>
            <h1 className="text-[32px] font-semibold text-primary-1 mb-6">
              Enter payment details
            </h1>

            <div className="text-sm text-gray-600 mb-8">
              <div className=" text-lg">Sign in as</div>
              <div>unicorn2023@gmail.com</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-medium text-primary-1 ">
                  Your payment details
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      First name
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full p-2 border border-accent rounded-md focus:outline-none focus:ring-2"
                      placeholder="First name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Last name
                    </label>
                    <input
                      {...register("lastName")}
                      className="w-full p-2 border border-accent rounded-md focus:outline-none focus:ring-2 "
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="">
                  <label className="block text-sm text-gray-600 mb-2">
                    Card details
                  </label>
                  <div className="relative">
                    <input
                      {...register("cardNumber")}
                      className="w-full p-2 border border-accent rounded-md focus:outline-none focus:ring-2 "
                      placeholder="1234 1234 1234 1234"
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("expiryDate")}
                      className="w-full p-2 border border-accent rounded-md focus:ring-2 focus:outline-none "
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.expiryDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("cvv")}
                      type="password"
                      className="w-full p-2 border border-accent rounded-md focus:outline-none focus:ring-2 "
                      placeholder="CVV"
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.cvv.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="">
                  <label className="block text-sm text-gray-600 mb-2">
                    Name on card
                  </label>
                  <input
                    {...register("nameOnCard")}
                    className="w-full p-2 border border-accent rounded-md focus:outline-none focus:ring-2 "
                    placeholder="Name on card"
                  />
                  {errors.nameOnCard && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nameOnCard.message}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-600 mb-2">
                    Country or region
                  </label>
                  <input
                    {...register("country")}
                    className="w-full p-2 border border-accent rounded-md focus:outline-none focus:ring-2 "
                    placeholder="India"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <input
                    type="checkbox"
                    {...register("acceptTerms")}
                    value="on"
                    className="mt-1 border-accent"
                  />
                  <label className="text-sm text-gray-600">
                    By clicking on Subscribe you accept Dr. Paw's Terms &
                    Conditions. We will process your personal data in accordance
                    with Design anything's Privacy Notice.
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-fit bg-[#74A7B3] text-white rounded-full px-14 py-2"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white  p-6 lg:pt-[95px] ">
            <h2 className="text-2xl font-semibold text-primary-1 mb-6">
              Summary
            </h2>
            <div className="flex-1 flex flex-col justify-between  h-[85%]">
              <div>
                <div className="mb-4">
                  <div className="text-xl text-gray-600">{planTitle}</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-primary-1 font-semibold">
                      For {duration}
                    </div>
                    <div className="text-xl font-semibold text-primary-1">
                      ₹{price}/yr
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-primary-3 pt-4 flex flex-col gap-2">
                  <div className="flex flex-col gap-4  flex-1">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{price}</span>
                    </div>
                    <div className="flex justify-between font-medium text-primary-1">
                      <span>TOTAL</span>
                      <span>₹{price}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <h4 className="font-medium text-primary-1 mb-3">
                  Renewal Terms
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Billing will be automatically renewed every month</li>
                  <li>• You can cancel renewal anytime</li>
                  <li>
                    • Cancel before Feb 09 to avoid getting billed for the next
                    month
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
