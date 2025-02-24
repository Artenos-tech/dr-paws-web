"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import MembershipDesc from "@/public/assets/images/Membership/MembershipDesc.png";
import MemberCard, { MembershipPlan } from "@/components/ui/MemberCard";
import MemberModal from "@/components/ui/MemberModal";
import { membershipData } from "@/model/mockData";
import { useAPICall } from '@/hooks/apicall';
import api from '@/services/api';
import toast, { Toaster } from "react-hot-toast";
import {z} from 'zod';
import { ClipLoader } from "react-spinners";
import { Table, Button } from 'antd';

const planSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().min(0),
  duration_months: z.number().min(1),
  version: z.number(),
  species: z.array(z.enum(['dog', 'cat'])).min(1),
  age: z.enum(['CHILD', 'ADULT', 'SENIOR']).nullable(),
  type: z.enum(['GROOMING', 'MEDICAL', 'COMPREHENSIVE']).nullable(),
  published: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  features: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    type: z.enum(['DISCOUNT', 'SESSIONS', 'VACCINATIONS']),
    value: z.number().nullable(),
  }))
});

type Plan = z.infer<typeof planSchema>;

type PetType = "dog" | "cat";
type PetAge = "CHILD" | "ADULT" | "SENIOR";
type MembershipType = "GROOMING" | "MEDICAL";

type ComparisonTable = {
  featureName: string;
  [planName: string]: string | number;
}

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petType, setPetType] = useState<PetType | null>(null);
  const [petAge, setPetAge] = useState<PetAge | null>(null);
  const [membershipType, setMembershipType] = useState<MembershipType | null>(null);
  const [plans, setPlans] = useState<Plan[] | null>(null);

  const {call: getAllPlans, loading: getAllPlansLoading} = useAPICall(api.getAllPlans);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansResp = await getAllPlans({});
        if(plansResp.ok){
          setPlans(plansResp.value.body.plans);
        }else{
          toast.error('Failed to fetch plans. Please refresh the page to try again.');
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        toast.error('Failed to fetch plans');
      }
    };

    fetchPlans();
  }, []);

  const filteredPlans = plans?.filter(plan => {      
    if (!petType || !petAge || !membershipType) {
      return false;
    }
    const speciesMatches = petType && plan.species.includes(petType);
    if (membershipType === "GROOMING") {
      return (
        (speciesMatches && plan.type === "GROOMING") ||
        (speciesMatches && plan.type === "COMPREHENSIVE")
      );
    }
    if (membershipType === "MEDICAL") {
      return (
        (speciesMatches &&
            plan.age === petAge &&
            plan.type === "MEDICAL") ||
        (speciesMatches && plan.type === "COMPREHENSIVE")
      );
    }
    return false;
  });

  const generateComparisonTable = (): ComparisonTable[] => {
    if (!filteredPlans) {
        return [];
    }

    const featureTypeOrder = ['VACCINATIONS', 'SESSIONS', 'DISCOUNT'];

    const featureGroups: Record<string, string[]> = {};

    filteredPlans.forEach(plan => {
        plan.features.forEach((feature: any) => {
            if (!featureGroups[feature.type]) {
                featureGroups[feature.type] = [];
            }
            if (!featureGroups[feature.type].includes(feature.name)) {
                featureGroups[feature.type].push(feature.name);
            }
        });
    });

    Object.keys(featureGroups).forEach(type => {
        featureGroups[type].sort((a, b) => a.localeCompare(b));
    });

    const allFeatureNames = featureTypeOrder.flatMap(type => featureGroups[type] ?? []);

    const comparisonTable: ComparisonTable[] = allFeatureNames.map(featureName => {
        const row: ComparisonTable = { featureName };

        filteredPlans.forEach(plan => {
            const matchingFeature = plan.features.find((f: any) => f.name === featureName);
            if (matchingFeature) {
                if (matchingFeature.type === 'DISCOUNT') {
                    row[plan.name] = `${matchingFeature.value ?? 'X'}%`;
                } else if (matchingFeature.type === 'VACCINATIONS') {
                    row[plan.name] = matchingFeature.value === 1 ? '✓' : `${matchingFeature.value}`;
                } else if (matchingFeature.type === 'SESSIONS') {
                    row[plan.name] = `${matchingFeature.value ?? 'X'} sessions`;
                }
            } else {
                row[plan.name] = 'X';
            }
        });

        return row;
    });

    return comparisonTable;
  };

  const planNames = filteredPlans ? filteredPlans.map(plan => plan.name) : [];
  const columns = [
      {
          title: 'Features',
          dataIndex: 'featureName',
          key: 'featureName',
          width: 300,
          render: (text: string) => <span className="">{text}</span>
      },
      ...planNames.map(planName => ({
          title: <div className="text-center"><Button type="primary">Buy now</Button></div>,
          dataIndex: planName,
          key: planName,
          align: 'center' as 'center',
          render: (value: string) => <span className="">{value}</span>
      }))
  ];

  return (
    <div className="w-full h-full items-center justify-items-center font-roca">
      <main className="flex flex-col row-start-2 items-center w-full ">
        <div className="w-full flex flex-col px-8 md:px-32 lg:px-20 xl:px-40 md:gap-8 lg:flex-row items-center justify-center space-y-8 lg:space-y-0 mt-20">
          <div className="flex-shrink-0 w-full lg:w-auto xl:w-1/2 ">
            <Image
              src={MembershipDesc}
              alt="Clinic image with a dog"
              width={510}
              height={340}
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
          <div className="flex items-center justify-center w-full lg:items-start lg:justify-center xl:w-full">
            <div className="text-center lg:text-left w-full lg:w-[377px] h-auto xl:w-3/4">
              <h1 className="text-3xl lg:text-[48px] mb-4 leading-tight">
                Great value care, whatever your pet needs
              </h1>
              <p className="text-sm lg:text-[14px] text-gray-700 px-1 xl:text-xl">
                Our memberships are designed to provide the convenience,
                security, and value pet-parents of today expect. Explore our
                plans to discover the one that fits your pet&apos;s needs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-3 w-full text-center text-3xl my-16 pb-12 px-8 md:px-32 lg:px-20 xl:px-40">
          <h1 className="pt-12 pb-8 lg:pb-16">Become A Member</h1>
        
          {getAllPlansLoading && <ClipLoader color="#33495f" />}
          {!getAllPlansLoading && plans != null &&  
            <div>
              {plans.length == 0 && <h3 className="text-xl"> No plans available</h3>}
              {plans.length > 0 && (
                <div className="flex flex-col gap-8 justify-center items-center">
                  <div className="flex gap-4 mb-8">
                    {['dog', 'cat'].map((type) => (
                      <div
                        key={type}
                        className={`p-4 border-2 rounded-md cursor-pointer ${
                          petType === type ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                        }`}
                          onClick={() => {
                            setPetType(type as PetType);
                          }}
                        >
                        {type}
                      </div>
                    ))}
                  </div>
                  {petType && (
                      <div className="flex gap-4 mb-8">
                        {['CHILD', 'ADULT', 'SENIOR'].map((age) => (
                          <div
                            key={age}
                            className={`p-4 border-2 rounded-md cursor-pointer ${
                              petAge === age ? 'border-green-500 bg-green-100' : 'border-gray-300'
                            }`}
                            onClick={() => setPetAge(age as PetAge)}
                          >
                            {age}
                          </div>
                        ))}
                      </div>
                    )}
                    {petAge && (
                      <div className="flex gap-4 mb-8">
                        {['MEDICAL', 'GROOMING'].map((type) => (
                          <div
                            key={type}
                            className={`p-4 border-2 rounded-md cursor-pointer ${
                              membershipType === type ? 'border-purple-500 bg-purple-100' : 'border-gray-300'
                            }`}
                            onClick={() => setMembershipType(type as MembershipType)}
                          >
                            {type}
                          </div>
                        ))}
                      </div>
                    )}

                    {petType && petAge && membershipType && (
                      <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-2xl mb-4">Compare Membership Plans</h2>
                        <div className="text-sm">
                          {filteredPlans && filteredPlans?.length > 0 ? (
                             <Table
                              columns={columns}
                              dataSource={generateComparisonTable()}
                              pagination={false}
                              bordered
                              className="comparison-table"
                            />
                          ) : (
                            <p>No membership plans available for the selected filters.</p>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>}
        </div>
      </main>

      {selectedPlan && (
        <MemberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}
      <Toaster />
    </div>
  );
};

export default Membership;
