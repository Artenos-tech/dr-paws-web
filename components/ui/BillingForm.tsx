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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 w-[85%] mx-auto"
    >
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-sm">First Name</label>
          <input
            {...register("firstName")}
            placeholder="First Name"
            className="input rounded-md p-2 border w-full border-[#74A7B3]"
          />
          {errors.firstName && (
            <span className="text-red-500 text-sm">
              {errors.firstName.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-sm">Last Name</label>
          <input
            {...register("lastName")}
            placeholder="Last Name"
            className="input rounded-md p-2 border w-full border-[#74A7B3]"
          />
          {errors.lastName && (
            <span className="text-red-500 text-sm">
              {errors.lastName.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm">Card Number</label>
        <input
          {...register("cardNumber")}
          type="text"
          maxLength={16}
          pattern="\d*"
          placeholder="1234 1234 1234 1234"
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.cardNumber && (
          <span className="text-red-500 text-sm">
            {errors.cardNumber.message}
          </span>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-sm">Expiration Date</label>
          <input
            {...register("expiry")}
            type="text"
            placeholder="MM/YY"
            className="input rounded-md p-2 border w-full border-[#74A7B3]"
          />
          {errors.expiry && (
            <span className="text-red-500 text-sm">
              {errors.expiry.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <label className="text-sm">CVV</label>
          <input
            {...register("cvv")}
            type="password"
            maxLength={3}
            pattern="\d*"
            placeholder="CVV"
            className="input rounded-md p-2 border w-full border-[#74A7B3]"
          />
          {errors.cvv && (
            <span className="text-red-500 text-sm">{errors.cvv.message}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm">Name on Card</label>
        <input
          {...register("cardName")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.cardName && (
          <span className="text-red-500 text-sm">
            {errors.cardName.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm">Billing Address</label>
        <input
          {...register("billingAddress")}
          className="input rounded-md p-2 border w-full border-[#74A7B3]"
        />
        {errors.billingAddress && (
          <span className="text-red-500 text-sm">
            {errors.billingAddress.message}
          </span>
        )}
      </div>
      <div className="flex gap-4 pt-4">
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
          Save Billing Info
        </button>
      </div>
    </form>
  );
};

export default BillingForm;
