"use client"

import React, { useEffect, useState } from "react"
import BackButton from "./BackButton"
import {
  CalendarDays,
  CircleCheck,
  CircleX,
  RotateCcw,
  XCircle,
} from "lucide-react"
import { MdOutlineAccessTime } from "react-icons/md"
import { GrLocation } from "react-icons/gr"
import { format, parseISO } from "date-fns"
import AtHomeVisitStatus from "./AtHomeVisitStatus"
import toast from "react-hot-toast"
import { AppointmentDetails, RefundStatus } from "@/model/typeDefinitions"
import Image from "next/image"
import { petImageByType } from "./PetCard"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import ConfirmActionCard from "./ConfirmationCard"
import CancelledBookingCard from "./CancelBookingCard"
import { useAPICall } from "@/hooks/apicall"
import atHomeApiClient from "@/services/api.athome"
import RescheduleAtHomeAppointment from "./RescheduleAtHomeAppointment"
import SupportActions from "./SupportActions"
import { useAPIErrorToastFromResult } from "@/hooks/useAPIErrorToast"

type AtHomeBookingDetailsProps = {
  goBack: (refetch: boolean) => void
  selectedAppointment: AppointmentDetails
  refetchAppointment: () => void
  onPausePolling?: (paused: boolean) => void
}
type ViewState = "DETAILS" | "CONFIRM_ACTION" | "CANCELLED" | "RESCHEDULE"

const APPOINTMENT_CANCEL_WINDOW_HOURS = 24
const AtHomeBookingDetails = ({
  selectedAppointment,
  goBack,
  refetchAppointment,
  onPausePolling,
}: AtHomeBookingDetailsProps) => {
  const [view, setView] = useState<ViewState>("DETAILS")
  const [confirmationType, setConfirmationType] = useState<
    "CANCEL" | "RESCHEDULE" | null
  >(null)
  const [refundStatus, setRefundStatus] = useState<RefundStatus>()
  const { call: cancelAppointment, result: cancelAppointmentResult } =
    useAPICall(atHomeApiClient.cancelAppointmentV2)
  const parsedDate = parseISO(selectedAppointment.booking_date)

  useEffect(() => {
    if (selectedAppointment.refund) {
      setRefundStatus(selectedAppointment.refund.status)
    }
  }, [])

  useEffect(() => {
    onPausePolling?.(view !== "DETAILS")
  }, [view, onPausePolling])

  const getSlotStartDateTime = () => {
    // booking_date is stored as UTC midnight IST (e.g. March 3 IST midnight =
    // "2026-03-02T18:30:00.000Z"). getUTCDate() would return 2 (March 2) instead
    // of 3. Add the IST offset first to recover the correct IST calendar date,
    // then subtract it again after combining with appt_start (also IST).
    const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000
    const bookingDateIST = new Date(
      parseISO(selectedAppointment.booking_date).getTime() + IST_OFFSET_MS,
    )
    const [hours, minutes] = selectedAppointment.appt_start
      .split(":")
      .map(Number)
    return new Date(
      Date.UTC(
        bookingDateIST.getUTCFullYear(),
        bookingDateIST.getUTCMonth(),
        bookingDateIST.getUTCDate(),
        hours,
        minutes,
      ) - IST_OFFSET_MS,
    )
  }

  const canShowCancelActions =
    !!selectedAppointment.visit_status &&
    !["VET_REACHED", "CANCELLED", "VISIT_STARTED", "VISIT_FINISHED"].includes(
      selectedAppointment.visit_status,
    )

  const isDelayed = selectedAppointment.visit_status === "VET_DELAYED"

  const isOutsideCancellationWindow = () => {
    const slotStart = getSlotStartDateTime()
    const now = new Date()
    const diffInMs = slotStart.getTime() - now.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return diffInHours >= APPOINTMENT_CANCEL_WINDOW_HOURS
  }

  const isFreeCancellation = () => {
    if (isDelayed) return true

    return isOutsideCancellationWindow()
  }
  const canReschedule = isDelayed || isOutsideCancellationWindow()

  const fullAddress = [
    selectedAppointment?.address?.address_line1,
    selectedAppointment?.address?.address_line2,
  ]
    .filter(Boolean)
    .join(", ")

  const isVisitFinished = selectedAppointment.visit_status === "VISIT_FINISHED"

  const getCardStyles = (category: string) => {
    switch (category) {
      case "CANCELLED":
        return {
          bg: "bg-[#F1F1F1]",
          text: "text-[#909090]",
        }
      case "COMPLETED":
        return {
          bg: "bg-[#f7f1de]",
          text: "text-[#909090]",
        }
      default:
        return {
          bg: "bg-[#FFFCF3]",
          text: "text-primary-1",
        }
    }
  }

  const { bg, text } = getCardStyles(selectedAppointment.category)

  const copyHelpline = () => {
    if (!selectedAppointment.helpline_no) return
    navigator.clipboard.writeText(selectedAppointment.helpline_no)
    toast.success(
      `Helpline number ${selectedAppointment.helpline_no} copied to clipboard`,
    )
  }

  const isConfirmed = selectedAppointment.visit_status === "VET_CONFIRMED"
  const isCompleted = selectedAppointment.visit_status === "VISIT_FINISHED"
  const isCancelled = selectedAppointment.visit_status === "CANCELLED"

  let appointmentText = ""

  if (isCancelled) {
    appointmentText = `${selectedAppointment.pet_name} was scheduled for a Home Visit.`
  } else if (isVisitFinished) {
    appointmentText = `${selectedAppointment.pet_name} had a Home Visit with ${selectedAppointment.vet_name}.`
  } else if (isConfirmed) {
    appointmentText = selectedAppointment.vet_name
      ? `${selectedAppointment.pet_name} is scheduled for a Home Visit with ${selectedAppointment.vet_name}.`
      : `${selectedAppointment.pet_name} is scheduled for a Home Visit`
  } else {
    appointmentText =
      selectedAppointment.visit_status === "UNCONFIRMED"
        ? `${selectedAppointment.pet_name} is scheduled for a Home Visit.`
        : `${selectedAppointment.pet_name} is scheduled for a Home Visit with ${selectedAppointment.vet_name}.`
  }

  const defaultPetImageByType =
    petImageByType[selectedAppointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  const petImage =
    selectedAppointment.pet_profile_image || defaultPetImageByType
  const vetImage = selectedAppointment?.vet_image || defaultVetImage

  const openConfirmationView = (action: "CANCEL" | "RESCHEDULE") => {
    setConfirmationType(action)
    setView("CONFIRM_ACTION")
  }
  const cancelConfirmationView = () => {
    setView("DETAILS")
  }
  const proceedConfirmationView = async () => {
    if (confirmationType === "CANCEL") {
      await handleCancelAppointment()
      await refetchAppointment()
      setView("CANCELLED")
    } else {
      if (!canReschedule) {
        setView("DETAILS")
        return
      }
      setView("RESCHEDULE")
    }
  }

  const handleCancelAppointment = async () => {
    await cancelAppointment({
      appointment_id: selectedAppointment.id,
      clinic_id: selectedAppointment.clinic_id,
      sub_booking_id: selectedAppointment.sub_booking_id,
    })
  }

  useEffect(() => {
    if (cancelAppointmentResult?.ok) {
      const status =
        cancelAppointmentResult.value.body.data.appointment.refund?.status
      setRefundStatus(status)
    }
  }, [cancelAppointmentResult])
  useAPIErrorToastFromResult(cancelAppointmentResult, {
    fallbackMessage: "Failed to cancel appointment",
  })

  const handleNavigation = () => {
    if (view === "CONFIRM_ACTION" || view === "RESCHEDULE") {
      setView("DETAILS")
      setConfirmationType(null)
      return
    }
    goBack(true)
  }
  const HeaderIcon = isCancelled
    ? CircleX
    : isCompleted
      ? CircleCheck
      : CalendarDays
  const getExtraMessage = () => {
    if (!isFreeCancellation()) {
      return "This cancellation does not qualify for a refund under our 24-hour cancellation policy. No refund will be issued for this booking."
    }
    const refundAmount = selectedAppointment.total_billing_amount
    const reason = isDelayed
      ? "because your vet has been delayed"
      : "under our 24-hour cancellation policy"
    return `This cancellation qualifies for a full refund ${reason}. A refund of ₹${refundAmount} will be processed and sent back to your original payment method.`
  }
  return (
    <div className="w-full">
      <BackButton navigateBack={handleNavigation} />
      {view === "CONFIRM_ACTION" && (
        <ConfirmActionCard
          onCancel={cancelConfirmationView}
          onConfirm={proceedConfirmationView}
          extraMessage={getExtraMessage()}
          extraMessageVariant={isFreeCancellation() ? "info" : "warning"}
          confirmationType={confirmationType}
        />
      )}
      {view === "CANCELLED" && (
        <CancelledBookingCard
          refundStatus={refundStatus}
          refundAmount={selectedAppointment.refund?.amount}
          appointment={selectedAppointment}
          onDone={() => goBack(true)}
        />
      )}
      {view === "RESCHEDULE" && (
        <RescheduleAtHomeAppointment
          appointmentId={selectedAppointment.id}
          subBookingId={selectedAppointment.sub_booking_id}
        />
      )}
      {view === "DETAILS" && (
        <div className="flex flex-col items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-primary-1">
              {selectedAppointment.visit_status === "VISIT_STARTED"
                ? "Home Visit Started"
                : isCancelled
                  ? "Home Visit Cancelled"
                  : isVisitFinished
                    ? "Home Visit Finished"
                    : "Home Visit Scheduled"}
            </h1>
            <HeaderIcon
              size={40}
              fill="#5281a2"
              stroke="white"
              strokeWidth={2}
            />
          </div>

          <div
            className={`${bg} ${text}  w-full  sm:w-full   md:w-full lg:w-4/5  xl:w-3/4  2xl:w-2/3  shadow-md rounded-lg  px-6 py-4 md:py-12 md:px-24 space-y-5`}
          >
            <p className="text-lg font-semibold mt-4 text-center">
              {appointmentText}
            </p>
            <div className="flex justify-center my-4 relative">
              {
                <>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
                    <Image
                      src={petImage}
                      alt={`${selectedAppointment.pet_name}'s profile`}
                      layout="fill"
                      objectFit="cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                  {selectedAppointment.visit_status !== "UNCONFIRMED" &&
                    selectedAppointment.visit_status !== "CANCELLED" && (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                        <Image
                          src={vetImage}
                          alt={`Dr. ${selectedAppointment.vet_name}'s profile`}
                          objectFit="cover"
                          sizes="80px"
                          width={80}
                          height={80}
                        />
                      </div>
                    )}
                </>
              }
            </div>

            {isVisitFinished && (
              <>
                <div className="space-y-1">
                  <p className="text-xl font-medium">
                    {`Hope everything was to ${selectedAppointment.pet_name}'s satisfaction!`}
                  </p>
                  <p className="text-base text-gray-600">
                    Please feel free to call us about issues or feedback.
                  </p>
                </div>
                <SupportActions
                  isVisitFinished
                  onCallUs={copyHelpline}
                  onSOS={() => {}}
                />

                <AtHomeVisitStatus
                  visitStatus={selectedAppointment.visit_status}
                  selectedAppointment={selectedAppointment}
                />
              </>
            )}

            <div
              className={`flex items-center gap-3 ${isCancelled && "line-through"} `}
            >
              <CalendarDays className="text-secondary-1" />
              <span className="text-base font-medium">
                {format(parsedDate, "EEE, dd MMM")}
              </span>
            </div>

            <div
              className={`flex items-center gap-3 ${isCancelled && "line-through"} `}
            >
              <MdOutlineAccessTime className="text-secondary-1 text-xl" />
              <span className="text-base font-medium">
                {selectedAppointment.appt_start} –{" "}
                {selectedAppointment.appt_end}
              </span>
            </div>

            <div className="flex gap-3">
              <div className="w-6 flex justify-center">
                <GrLocation className="text-secondary-1 text-xl mt-1" />
              </div>

              <div className={`flex flex-col ${isCancelled && "line-through"}`}>
                <span className="font-medium">
                  {selectedAppointment.address?.tag}
                </span>
                <span className="text-base leading-relaxed">{fullAddress}</span>
              </div>
            </div>

            {!isVisitFinished && !isCancelled && (
              <AtHomeVisitStatus
                visitStatus={selectedAppointment.visit_status}
                selectedAppointment={selectedAppointment}
              />
            )}

            {selectedAppointment.refund &&
              selectedAppointment.refund.status !== "NOT_APPLICABLE" && (
                <div className="border border-gray-300 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-primary-1">Refund Details</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
                        selectedAppointment.refund.status === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : selectedAppointment.refund.status === "FAILED" ||
                              selectedAppointment.refund.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : selectedAppointment.refund.status === "PROCESSED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedAppointment.refund.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  {(selectedAppointment.refund.status === "PENDING" ||
                    selectedAppointment.refund.status === "REQUESTED" ||
                    selectedAppointment.refund.status === "APPROVED") && (
                    <p className="text-sm text-gray-500">
                      A full refund of ₹{selectedAppointment.refund.amount} will
                      be processed and sent back to your original payment
                      method. It may take 5-7 business days to reflect in your
                      account.
                    </p>
                  )}
                  {selectedAppointment.refund.status === "SUCCESS" && (
                    <p className="text-sm text-gray-500">
                      Your refund of ₹{selectedAppointment.refund.amount} has
                      been successfully processed.
                    </p>
                  )}
                  {selectedAppointment.refund.status === "FAILED" && (
                    <p className="text-sm text-gray-500">
                      Refund processing of ₹{selectedAppointment.refund.amount}{" "}
                      failed. Please contact support for assistance.
                    </p>
                  )}
                </div>
              )}

            {(!isVisitFinished || canShowCancelActions) && (
              <div className="pt-4 border-t space-y-4">
                {!isVisitFinished && (
                  <SupportActions onCallUs={copyHelpline} onSOS={() => {}} />
                )}

                {canShowCancelActions && (
                  <div className="border border-red-300 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="font-semibold text-red-700">
                        Reschedule & Cancel
                      </p>

                      {isDelayed ? (
                        <p className="text-sm text-gray-600">
                          Free cancellation and rescheduling available because
                          your vet has been delayed.
                        </p>
                      ) : isFreeCancellation() ? (
                        <p className="text-sm text-gray-600">
                          Free cancellation and rescheduling available up to 24
                          hours before the appointment.
                        </p>
                      ) : (
                        <p className="text-sm text-red-600">
                          Cancellation within 24 hours of the appointment will
                          incur a 100% cancellation fee. Rescheduling is not
                          available within this window.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:justify-between gap-3">
                      <button
                        disabled={!canReschedule}
                        onClick={() => openConfirmationView("RESCHEDULE")}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-secondary-1 text-secondary-1 transition ${
                          canReschedule
                            ? "hover:bg-secondary-1 hover:text-white"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <RotateCcw size={16} />
                        Reschedule
                      </button>

                      <button
                        onClick={() => openConfirmationView("CANCEL")}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        <XCircle size={16} />
                        {isFreeCancellation()
                          ? "Cancel for free"
                          : "Cancel with 100% fee"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AtHomeBookingDetails
