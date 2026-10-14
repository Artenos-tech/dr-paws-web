"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Phone } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import ClinicGallery from "@/components/ui/ClinicGallery"
import ClinicPhotos from "@/components/ui/ClinicPhotos"
import ClinicReviews from "@/components/ui/ClinicReviews"
import ClinicTabBar from "@/components/ui/ClinicTabBar"
import Overview from "@/components/ui/OverView"

import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api.display"
import Loader from "@/components/ui/Loader"
import { Clinic } from "@/model/typeDefinitions"

const ClinicDetails: React.FC = () => {
  const clinicId = useSearchParams().get("id") ?? ""
  const { call: getClinic, loading: loadingClinic } = useAPICall(
    api.getClinicForDisplay,
  )
  const {
    call: getDoctorsForClinic,
    result: doctorsResult,
    loading: loadingDoctors,
  } = useAPICall(api.getDoctorsForClinicForDisplay)
  const [activeTab, setActiveTab] = useState("OVERVIEW")
  const [clinic, setClinic] = useState<Clinic | null>(null)

  useEffect(() => {
    if (!clinicId) return
    const fetchClinic = async () => {
      const clinic = await getClinic({ clinicid: clinicId })
      if (clinic.ok && clinic.value.body.clinic) {
        setClinic(clinic.value.body.clinic)
      }
    }
    fetchClinic()
    getDoctorsForClinic({ clinicid: clinicId })
  }, [clinicId])

  const doctorsList =
    (doctorsResult?.ok && doctorsResult.value.body.doctors) || []

  if (loadingClinic || loadingDoctors || !clinic) {
    return <Loader />
  }

  const tabs = {
    OVERVIEW: {
      label: "Overview",
      component: (
        <Overview
          clinicContact={clinic.contact}
          clinicLocation={clinic.name}
          clinicParking={clinic.parkingInfo}
          clinicDoctors={doctorsList}
          clinicTimings={clinic.timings}
        />
      ),
    },
    PHOTOS: {
      label: "Photos",
      component: <ClinicPhotos gallery={clinic.gallery} />,
    },
    REVIEWS: {
      label: "Reviews",
      component: <ClinicReviews reviews={clinic.reviews} />,
    },
  } as const

  const getTabs = () => {
    const availableTabs: {
      [key: string]: { label: string; component: JSX.Element }
    } = {}
    Object.keys(tabs).forEach((tab) => {
      const typedTab = tab as keyof typeof tabs
      if (typedTab === "PHOTOS" && clinic.gallery.length === 0) {
        return
      }
      if (
        typedTab === "REVIEWS" &&
        (!clinic.reviews || (clinic.reviews && clinic.reviews.length === 0))
      ) {
        return
      }
      availableTabs[typedTab] = tabs[typedTab]
    })
    return availableTabs
  }

  const copyClinicNumber = async () => {
    try {
      await navigator.clipboard.writeText(clinic.contact)
      toast.success("Clinic number copied to clipboard")
    } catch {
      toast.error("Unable to copy clinic number")
    }
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-items-center font-roca pb-20 flex-grow px-8 md:px-32 lg:px-20 xl:px-40">
      <main className="w-full flex flex-col gap-[80px] row-start-2 items-center">
        <ClinicGallery
          clinicId={clinicId}
          name={clinic.name}
          services={clinic.services}
          gallery={clinic.gallery}
        />
        {(clinic.gallery.length > 0 || clinic.reviews.length > 0) && (
          <ClinicTabBar
            tabs={getTabs()}
            activeTabId={activeTab}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === "OVERVIEW" && tabs["OVERVIEW"].component}
        {activeTab === "PHOTOS" && tabs["PHOTOS"].component}
        {activeTab === "REVIEWS" && tabs["REVIEWS"].component}
      </main>
      <button
        type="button"
        onClick={copyClinicNumber}
        aria-label="Copy clinic phone number"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-1 text-white shadow-lg"
      >
        <Phone size={24} />
      </button>
      <Toaster />
    </div>
  )
}

export default function ClinicDetailsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ClinicDetails />
    </Suspense>
  )
}
