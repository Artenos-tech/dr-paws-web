"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import MembershipDesc from "@/public/assets/images/Membership/MembershipDesc.png"
import DogImage from "@/public/assets/images/pets/dog.png"
import CatImage from "@/public/assets/images/pets/cat.png"
import { MembershipPlan } from "@/components/ui/MemberCard"
import MemberModal from "@/components/ui/MemberModal"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import toast, { Toaster } from "react-hot-toast"
import { ClipLoader } from "react-spinners"
import { Table } from "antd"
import { useUserContext } from "@/context/UserContext"

type Plan = {
  id: number
  name: string
  description: string | null
  price: number
  duration_months: number
  version: number
  species: ("dog" | "cat")[]
  age: "CHILD" | "ADULT" | "SENIOR" | null
  type: "GROOMING" | "MEDICAL" | "COMPREHENSIVE" | null
  published: boolean
  display_order: number
  created_at: string
  updated_at: string
  features: {
    id: number
    name: string
    description: string | null
    type: "DISCOUNT" | "REDEEMABLE"
    value: number | null
  }[]
}

type PetType = "dog" | "cat"
type PetAge = "CHILD" | "ADULT" | "SENIOR"
type MembershipType = "GROOMING" | "MEDICAL"

type ComparisonTable = {
  featureName: string
  [planName: string]: string | number | React.ReactNode
}

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [petType, setPetType] = useState<PetType | null>(null)
  const [petAge, setPetAge] = useState<PetAge | null>(null)
  const [membershipType, setMembershipType] = useState<MembershipType | null>(
    null,
  )
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { initiateLogin, isLoggedIn } = useUserContext()

  const { call: getAllPlans, loading: getAllPlansLoading } = useAPICall(
    api.getAllPlans,
  )

  const MOBULE_MAX_WIDTH = 500

  useEffect(() => {
    setIsMobile(window.innerWidth <= MOBULE_MAX_WIDTH)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBULE_MAX_WIDTH)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const pettype = urlParams.get("pettype")
      const petage = urlParams.get("petage")
      const membershiptype = urlParams.get("membershiptype")
      if (pettype) setPetType(pettype as PetType)
      if (petage) setPetAge(petage as PetAge)
      if (membershiptype) setMembershipType(membershiptype as MembershipType)
    }
  }, [])

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansResp = await getAllPlans({})
        if (plansResp.ok) {
          setPlans(plansResp.value.body.plans)
        } else {
          console.error("Failed to fetch plans:", plansResp.error)
          toast.error(
            "Failed to fetch plans. Please refresh the page to try again.",
          )
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error)
        toast.error("Failed to fetch plans")
      }
    }

    fetchPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedPlans = plans?.sort((a, b) => a.display_order - b.display_order)

  const filteredPlans = sortedPlans?.filter((plan) => {
    const shouldShow =
      petType &&
      (plan.species.includes(petType) || plan.species.length === 0) &&
      petAge &&
      (plan.age === petAge || plan.age === null) &&
      membershipType &&
      (plan.type === membershipType ||
        plan.type === "COMPREHENSIVE" ||
        plan.type === null)
    console.log(plan, shouldShow)
    return shouldShow
  })

  const TickMark = () => (
    <span style={{ color: "green", fontWeight: "bold", fontSize: "20px" }}>
      &#x2713;
    </span>
  )

  const CrossMark = () => <span>-</span>

  const generateComparisonTable = (): ComparisonTable[] => {
    if (!filteredPlans) {
      return []
    }

    const featureTypeOrder = ["REDEEMABLE", "DISCOUNT"]

    const featureGroups: Record<string, string[]> = {}

    filteredPlans.forEach((plan) => {
      plan.features.forEach((feature) => {
        if (!featureGroups[feature.type]) {
          featureGroups[feature.type] = []
        }
        if (!featureGroups[feature.type].includes(feature.name)) {
          featureGroups[feature.type].push(feature.name)
        }
      })
    })

    Object.keys(featureGroups).forEach((type) => {
      featureGroups[type].sort((a, b) => a.localeCompare(b))
    })

    const allFeatureNames = featureTypeOrder.flatMap(
      (type) => featureGroups[type] ?? [],
    )

    const comparisonTable: ComparisonTable[] = allFeatureNames.map(
      (featureName) => {
        const row: ComparisonTable = { featureName }

        filteredPlans.forEach((plan) => {
          const matchingFeature = plan.features.find(
            (f) => f.name === featureName,
          )
          if (matchingFeature) {
            if (matchingFeature.type === "DISCOUNT") {
              row[plan.name] = `${matchingFeature.value ?? <CrossMark />}%`
            } else if (matchingFeature.type === "REDEEMABLE") {
              row[plan.name] =
                matchingFeature.value === 1 ? (
                  <TickMark />
                ) : matchingFeature.value === null ? (
                  "Unlimited"
                ) : (
                  `${matchingFeature.value}`
                )
            }
            // else if (matchingFeature.type === "SESSIONS") {
            //   row[plan.name] =
            //     `${matchingFeature.value ?? <CrossMark />} sessions`
            // }
          } else {
            row[plan.name] = <CrossMark />
          }
        })

        return row
      },
    )

    return comparisonTable
  }

  const columns = [
    {
      title: "Features",
      dataIndex: "featureName",
      key: "featureName",
      width: 300,
      render: (text: string) => <span>{text}</span>,
      fixed: "left" as const,
    },
    ...(filteredPlans || []).map((plan) => ({
      title: (
        <div
          style={{
            height: isMobile ? 150 : 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1 }}>{plan.name}</div>
          <div>&#8377; {plan.price}</div>
          <button
            style={{
              marginTop: 10,
              backgroundColor: "rgb(82, 129, 162)",
              padding: 10,
              borderRadius: 10,
              color: "white",
            }}
            onClick={() => {
              if (isLoggedIn) {
                setSelectedPlan({
                  id: plan.id,
                  title: plan.name,
                  description: plan.description || "",
                  benefits: plan.features.map((feature) => ({
                    text: feature.name,
                  })),
                  isPopular: false,
                  price: plan.price,
                  duration: plan.duration_months.toString(),
                  petType: petType || "dog",
                })
                setIsModalOpen(true)
              } else {
                initiateLogin(
                  "Become a Member",
                  `/membership?pettype=${petType}&petage=${petAge}&membershiptype=${membershipType}`,
                )
              }
            }}
          >
            Buy Now
          </button>
        </div>
      ),
      dataIndex: plan.name,
      key: plan.name,
      align: "center" as const,
      render: (value: string) => (
        <div style={{ minWidth: "100px" }}>{value}</div>
      ),
    })),
  ]

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
              <h1 className="text-3xl mb-4 leading-tight">
                Great value care, whatever your pet needs
              </h1>
              <p className="text-md text-gray-700 px-1">
                Our memberships are designed to provide the convenience,
                security, and value pet-parents of today expect. Explore our
                plans to discover the one that fits your pet&apos;s needs.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-3 w-full text-center my-16 pb-12 md:px-32 lg:px-20 xl:px-40">
          <h1 className="pt-12 pb-8 lg:pb-16 text-3xl">Become A Member</h1>

          {getAllPlansLoading && <ClipLoader color="#33495f" />}
          {!getAllPlansLoading && plans != null && (
            <div>
              {plans.length == 0 && (
                <h3 className="text-xl"> No plans available</h3>
              )}
              {plans.length > 0 && (
                <div className="flex flex-col gap-8 justify-center items-center">
                  <div className="flex flex-col gap-8 justify-center items-center px-8">
                    <div className="flex gap-4 mb-8">
                      <div>
                        <h2 className="text-xl">Is your pet a dog or a cat?</h2>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: "20px",
                            marginTop: "20px",
                          }}
                        >
                          {["dog", "cat"].map((type) => (
                            <div
                              key={type}
                              className={`p-4 border-2 rounded-md cursor-pointer ${
                                petType === type
                                  ? "border-blue-500 bg-blue-100"
                                  : "border-gray-300"
                              }`}
                              onClick={() => {
                                setPetType(type as PetType)
                              }}
                            >
                              <Image
                                alt={type}
                                src={type === "dog" ? DogImage : CatImage}
                                style={{ width: "100px" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {petType && (
                      <div>
                        <h2 className="text-xl">How old is your pet?</h2>
                        <div
                          className="flex gap-4 mb-8"
                          style={{ marginTop: "20px" }}
                        >
                          {["CHILD", "ADULT", "SENIOR"].map((age) => (
                            <div
                              key={age}
                              className={`p-4 border-2 rounded-md cursor-pointer ${
                                petAge === age
                                  ? "border-green-500 bg-green-100"
                                  : "border-gray-300"
                              }`}
                              onClick={() => setPetAge(age as PetAge)}
                            >
                              {age === "CHILD"
                                ? petType === "dog"
                                  ? "Puppy"
                                  : "Kitten"
                                : age.charAt(0).toUpperCase() +
                                  age.slice(1).toLowerCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {petAge && (
                      <div>
                        <h2 className="text-xl">
                          What type of membership are you looking for?
                        </h2>
                        <div
                          className="flex gap-4 mb-8"
                          style={{
                            marginTop: "20px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            gap: "20px",
                          }}
                        >
                          {["MEDICAL", "GROOMING"].map((type) => (
                            <div
                              key={type}
                              className={`p-4 border-2 rounded-md cursor-pointer ${
                                membershipType === type
                                  ? "border-purple-500 bg-purple-100"
                                  : "border-gray-300"
                              }`}
                              onClick={() =>
                                setMembershipType(type as MembershipType)
                              }
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {petType && petAge && membershipType && (
                    <div style={{ width: "100%" }} className="p-2 rounded-lg">
                      <h2 className="text-2xl mb-4">
                        Compare Membership Plans
                      </h2>
                      {filteredPlans && filteredPlans?.length > 0 ? (
                        <Table
                          columns={columns}
                          dataSource={generateComparisonTable()}
                          pagination={false}
                          bordered
                          scroll={isMobile ? { x: true, y: "70vh" } : undefined}
                        />
                      ) : (
                        <p>
                          No membership plans available for the selected
                          filters.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
  )
}

export default Membership
