"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import teamImg from "@/public/assets/images/team/teamImg.png"
import DoctorCard from "@/components/ui/DoctorCard"
import { DoctorBase } from "@/model/typeDefinitions"
import { useAPICall } from "@/hooks/apicall"
import { useInView } from "@/hooks/useInView"
import api from "@/services/api.display"
import Loader from "@/components/ui/Loader"

type ClinicSummary = { id: string; name: string }

// Each clinic's vets are requested only when that section scrolls into view.
const ClinicTeam = ({ clinic }: { clinic: ClinicSummary }) => {
  const [ref, inView] = useInView<HTMLDivElement>()
  const { call: getDoctors, loading } = useAPICall(
    api.getDoctorsForClinicForDisplay,
  )
  const [doctors, setDoctors] = useState<DoctorBase[] | null>(null)

  useEffect(() => {
    if (!inView) return
    getDoctors({ clinicid: clinic.id }).then((res) => {
      setDoctors(res.ok ? res.value.body.doctors : [])
    })
  }, [inView, clinic.id])

  if (doctors !== null && doctors.length === 0) return null

  return (
    <section ref={ref} className="w-full min-h-[80px]">
      <h2 className="text-lg md:text-2xl text-center">{clinic.name}</h2>
      {loading && <Loader />}
      <div className="flex justify-center items-center flex-wrap gap-8 lg:gap-14 my-10">
        {(doctors ?? []).map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  )
}

const TeamPage = () => {
  const [listRef, listInView] = useInView<HTMLDivElement>()
  const { call: getClinics, loading: loadingClinics } = useAPICall(
    api.getClinicsForDisplay,
  )
  const [clinics, setClinics] = useState<ClinicSummary[]>([])

  useEffect(() => {
    if (!listInView) return
    getClinics({}).then((res) => {
      if (res.ok) {
        setClinics(
          res.value.body.clinics
            .filter((c) => !c.comingSoon)
            .map((c) => ({ id: c.id, name: c.name })),
        )
      }
    })
  }, [listInView])

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

        <div ref={listRef} className="w-full min-h-[120px]">
          <h1 className="text-xl md:text-4xl font-normal text-center">
            Our Team
          </h1>
          {loadingClinics && <Loader />}
          <div className="flex flex-col gap-12 mt-10">
            {clinics.map((clinic) => (
              <ClinicTeam key={clinic.id} clinic={clinic} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeamPage
