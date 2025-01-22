"use client";

import { useState } from "react";
import api from "@/services/api";
import { useAPICall } from "@/hooks/apicall";
import { load } from '@cashfreepayments/cashfree-js';

interface PaymentProps {
  amount: number;
  disabled?: boolean;
  planId: number;
  petId: number | null;
}

const Payment = ({ amount, disabled , planId, petId }: PaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    call: createOrder,
  } = useAPICall(api.createOrder);
  
  const initializeSDK = async function () {  
    const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as 'sandbox' | 'production';
    if (!cashfreeEnv) {
      throw new Error('Cashfree environment is not set. Cannot proceed with payment');
    } else {        
      const cashfree = await load({
          mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT as 'sandbox' | 'production',
      });
      return cashfree;
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await createOrder({ amount });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      const { paymentSessionId, orderId } = response.value.body.order;
      const cashfree = await initializeSDK();
      console.log("Payment session ID", paymentSessionId);
      console.log("Order ID", orderId);
      console.log("CASHFREE INSTANCE", cashfree);
      console.log(window.location.origin + "/membership/payment/status");
      const result = await cashfree.checkout({
        paymentSessionId,
        returnUrl: window.location.origin + "/membership/payment/status?order_id=" + orderId + "&plan_id=" + planId + "&pet_id=" + petId,
        redirectTarget: "_self",
      });
      console.log("Result", result);
    } catch (err) {
      console.log("Payment error", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handlePayment}
        disabled={disabled || loading}
        className={`font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-accent ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Purchase"}
      </button>

      {error && (
        <div className="mt-4 text-red-500">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default Payment;