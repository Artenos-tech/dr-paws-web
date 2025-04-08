"use client"
import React, { useEffect } from "react"
import Image from "next/image"
import teamImg from "@/public/assets/images/team/teamImg.png"
// import { doctors } from "@/model/mockData";
import DoctorCard from "@/components/ui/DoctorCard"
import { DoctorBase } from "@/model/typeDefinitions"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { doctors } from "@/model/mockData"
import Loader from "@/components/ui/Loader"

const TeamPage = () => {
  const { call: getDoctorsForDisplay, loading: loadingDoctors } = useAPICall(
    api.getDoctorsForDisplay,
  )
  const [doctorsList, setDoctors] = React.useState<DoctorBase[]>([])
  useEffect(() => {
    const fetchDoctors = async () => {
      const docsResult = await getDoctorsForDisplay({})
      if (docsResult.ok && docsResult.value.body.doctors) {
        setDoctors(docsResult.value.body.doctors)
      } else {
        setDoctors(doctors)
      }
    }
    fetchDoctors()
  }, [])
  // const doctorsList = doctorsResult && doctorsResult.ok && doctorsResult.value.body.doctors || doctors;
  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20">
      <main className="flex flex-col gap-[50px] row-start-2 items-center w-full px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full lg:my-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full gap-2 md:gap-8 lg:gap-14">
            <div className="w-full ">
              <Image src={teamImg} alt="Clinic image with a dog" />
            </div>
            <div className="w-full  text-center lg:text-left text-primary-1 md:my-4 lg:my-0 mt-4">
              <h1 className={`text-xl md:text-2xl lg:text-3xl xl:text-5xl`}>
                Meet our very own Superheroes
              </h1>
              <p className="text-xs md:text-sm xl:text-base xl:w-3/4 my-3 md:my-5">
                Our clinical team is comprised of experienced vets, with a broad
                range of specialisations, with additional special training to
                create a new kind of veterinary experience. We love animals and
                find joy everyday helping our four legged friends stay happy &
                healthy.
              </p>
            </div>
          </div>
        </div>

        {loadingDoctors ? (
          <Loader />
        ) : (
          <div className="w-full">
            <h1 className="text-xl md:text-4xl font-normal text-center">
              Our Team
            </h1>

            <div className="flex justify-center items-center flex-wrap gap-8 lg:gap-14 my-10">
              {doctorsList.map((doctor: DoctorBase, index: number) => (
                <div key={index}>
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default TeamPage
