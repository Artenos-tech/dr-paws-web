"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const planTitle = searchParams.get("title");
  const duration = searchParams.get("duration");
  const price = searchParams.get("price");

  return (
    <div className="min-h-screen bg-[#faf6f1] p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/membership" className="flex items-center text-primary-1 mb-8">
          <ArrowLeft className="mr-2" size={20} />
          Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-semibold text-primary-1 mb-6">Enter payment details</h1>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-sm text-gray-600 mb-6">
                <div>Saju Jose</div>
                <div>sajujose@gmail.com</div>
              </div>

              <div className="space-y-4">
                <h2 className="font-medium text-primary-1">Your payment details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">First name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Last name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Card details</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="1234 1234 1234 1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">MM/YY</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">CVV</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="CVV"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name on card</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Name on card"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country or region</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="India"
                  />
                </div>

                <div className="flex items-start gap-2 mt-4">
                  <input type="checkbox" className="mt-1" />
                  <label className="text-sm text-gray-600">
                    By clicking on Subscribe you accept Dr. Paws's Terms & Conditions. We will process your personal data in accordance with Google's Privacy Policy.
                  </label>
                </div>

                <div>
                  <Button buttonText="Subscribe" buttonBackground="bg-accent" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold text-primary-1 mb-6">Summary</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-primary-1">{planTitle}</h3>
                  <p className="text-sm text-gray-600">For {duration}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{price}</span>
                  </div>
                  <div className="flex justify-between font-medium text-primary-1 mt-2">
                    <span>TOTAL</span>
                    <span>₹{price}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-primary-1 mb-2">Payment Terms:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Billing will be automatically renewed every month</li>
                    <li>• You can cancel anytime</li>
                    <li>• Cancel before the 01st to avoid getting billed for the next month</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;