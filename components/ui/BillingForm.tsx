import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const billingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiration date (MM/YY)"),
  cvv: z.string().length(3, "CVV must be 3 digits"),
  cardName: z.string().min(1, "Name on card is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
});

type BillingFormData = z.infer<typeof billingSchema>;

interface BillingFormProps {
  onSubmit: (data: BillingFormData) => void;
  onCancel: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardName: "",
      billingAddress: "",
    },
  });

  useEffect(() => {
    reset({
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardName: "",
      billingAddress: "",
    });
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <label>First Name</label>
          <input
            {...register("firstName")}
            className="input rounded-md p-2 border w-full"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label>Last Name</label>
          <input
            {...register("lastName")}
            className="input rounded-md p-2 border w-full"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label>Card Number</label>
        <input
          {...register("cardNumber")}
          type="text"
          maxLength={16}
          pattern="\d*"
          className="input rounded-md p-2 border w-full"
        />
        {errors.cardNumber && (
          <span className="text-red-500 text-sm">
            {errors.cardNumber.message}
          </span>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <label>Expiration Date (MM/YY)</label>
          <input
            {...register("expiry")}
            type="text"
            placeholder="MM/YY"
            className="input rounded-md p-2 border w-full"
          />
          {errors.expiry && (
            <span className="text-red-500 text-sm">
              {errors.expiry.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label>CVV</label>
          <input
            {...register("cvv")}
            type="password"
            maxLength={3}
            pattern="\d*"
            className="input rounded-md p-2 border w-full"
          />
          {errors.cvv && (
            <span className="text-red-500 text-sm">
              {errors.cvv.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label>Name on Card</label>
        <input
          {...register("cardName")}
          className="input rounded-md p-2 border w-full"
        />
        {errors.cardName && (
          <span className="text-red-500 text-sm">
            {errors.cardName.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label>Billing Address</label>
        <input
          {...register("billingAddress")}
          className="input rounded-md p-2 border w-full"
        />
        {errors.billingAddress && (
          <span className="text-red-500 text-sm">
            {errors.billingAddress.message}
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
          Save Billing Info
        </button>
      </div>
    </form>
  );
};

export default BillingForm;