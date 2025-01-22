"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAPICall } from "@/hooks/apicall";
import api from "@/services/api";
import { Pet } from "@/context/UserContext";
import { petImageByType } from "@/components/ui/PetCard";
import { format } from "date-fns";
import Loader from "@/components/ui/Loader";
import CustomButton from "@/components/ui/CustomButton";

export interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  plan: {
    id: number;
    name: string;
  };
  pet: {
    id: number;
    name: string;
  };
}

const benefits = [
  { text: "50% discount on Vet Consultations" },
  { text: "20% discount on Grooming Sessions" },
  {
    text: "Full Puppy Vaccination Programme Included (DHPPi 9-in-1, Rabies, Kennel Cough) - Worth ₹6,860",
  },
  { text: "10% off on all Retail products" },
  { text: "10% off on all Pharmacy products" },
  { text: "15% off on in-house Diagnostic Tests" },
  { text: "10% off on external Diagnostic Tests" },
  { text: "10% off on Imaging (X-rays, Ultrasound)" },
  { text: "10% off on Physiotherapy" },
  { text: "10% off on Elective Surgeries" },
  { text: "5% off on Non-Elective Surgeries" },
];

const Page = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { call: getPetsAPI ,loading: PetLoading} = useAPICall(api.getPets);
  const { call: getSubscriptionsAPI, loading: SubsLoading } = useAPICall(api.getSubscriptions);

  const fetchPets = async () => {
    const response = await getPetsAPI({});
    if (response.ok) {
      const fetchedPets = response.value.body.pets.map((pet) => ({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        dob: pet.dob,
        gender: pet.gender,
        weight: pet.weight,
        profileImage: pet.profile_image,
        vetPortId: pet.vetport_id,
      }));
      setPets(fetchedPets);
    }
  };

  const fetchSubscriptions = async () => {
    const response = await getSubscriptionsAPI({});
    if (response.ok) {
      const fetchedSubscriptions = response.value.body.subscriptions;
      setSubscriptions(fetchedSubscriptions);
    }
  };

  useEffect(() => {
    fetchPets();
    fetchSubscriptions();
  }, []);


  if (PetLoading || SubsLoading) {
    return (
        <Loader />
    );
  }


  if (!subscriptions.length) {
    return (
      <div className="flex flex-col w-full h-full lg:h-screen items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <h1 className="text-3xl m-4 lg:m-12">Your Memberships</h1>
        <h1 className="text-secondary-1 text-lg text-center">You don&apos;t have any memberships yet.</h1>
        <h1 className="text-secondary-1 text-md text-center mb-4">Join our membership program to enjoy exclusive benefits and discounts for your pet&apos;s health and wellness.</h1>
        <CustomButton buttonBackground="bg-accent" buttonText="Join Membership" buttonLink="/membership"/>
      </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full  items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <h1 className="text-3xl m-4 lg:m-12">Your Memberships</h1>
        <div className="flex flex-col gap-6 lg:w-full">
          {subscriptions.map((subscription) => {
            const matchedPet = pets.find(
              (pet) => pet.vetPortId === subscription.pet.id
            );
            const petImage =
              (matchedPet && matchedPet.profileImage) ||
              petImageByType[matchedPet?.type?.toLowerCase() || "other"]?.src;

            return (
              <div key={subscription.id} className="flex flex-col w-full">
                <div className=" bg-secondary-1 py-2 rounded-t-lg">
                  <h3 className="text-lg px-8  font-semibold text-white">
                    {subscription.plan.name}
                  </h3>
                </div>
                <div className="bg-[#F7F1DE] rounded-b-lg p-6 shadow-sm border border-[#e2d5c3]">
                  <div className="flex flex-col lg:flex-row  lg:gap-8">
                    {/* Image and Name Section */}
                    <div className="flex flex-col items-center justify-center mb-6 lg:mb-0">
                      <div className="relative w-32 h-32 mb-4">
                        <Image
                          src={petImage}
                          alt={`${subscription.pet.name}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full border-4 border-white shadow-md"
                        />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {subscription.pet.name}
                      </h2>
                    </div>

                    {/* Includes Section */}
                    <div className="flex-1 mb-6 lg:mb-0">
                      <h4 className="text-gray-600 text-lg mb-2">
                        Includes:
                      </h4>
                      <div className="lg:columns-2 lg:gap-8">
                        <ul className="space-y-2 text-sm text-gray-700">
                          {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start break-inside-avoid">
                              <span className="mr-2">•</span>
                              {benefit.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="flex lg:flex-col justify-between items-center lg:justify-start lg:gap-4 lg:min-w-[200px]">
                    <div className=" text-gray-600">
                        <p>Start Date:</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {format(
                            new Date(subscription.start_date),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                      <div className=" text-gray-600">
                        <p>End Date:</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {format(
                            new Date(subscription.end_date),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Page;
