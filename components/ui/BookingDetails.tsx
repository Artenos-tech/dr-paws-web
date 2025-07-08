"use client"

import { AppointmentType } from "@/model/typeDefinitions"
import React, { useState, useCallback } from "react"
import BackButton from "./BackButton"
import { MdOutlineAccessTime } from "react-icons/md"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import Image from "next/image"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { petImageByType } from "./PetCard"
import { CalendarDays, CircleCheck, Eye, Download, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Tooltip, Modal, Button } from "antd"
// import CustomButton from "./CustomButton"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"
// import RescheduleAppointment from "@/components/ui/RescheduleAppointment"

// export const cancelReasons = [
//   "Another commitment has come up",
//   "I'm sick / unwell",
//   "I have to travel out of the city",
//   "My pet doesn't need the treatment anymore",
//   "I've visited / will visit another clinic",
//   "Other",
// ]

// export const rescheduleReasons = [
//   "Another commitment has come up",
//   "I'm sick / unwell",
//   "I have to travel out of the city",
//   "My pet needs the treatment later",
// ]

type BookingDetailsProps = {
  selectedAppointment: AppointmentType
  goBack: (refetch: boolean) => void
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  selectedAppointment,
  goBack,
}) => {
  const [loadingView, setLoadingView] = useState(false)
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  // const [currentView, setCurrentView] = useState<
  //   | "default"
  //   | "cancelConfirm"
  //   | "reschedule"
  //   | "cancelled"
  //   | "rescheduleConfirm"
  // >("default")
  // const [cancelReason, setCancelReason] = useState<string>("")
  // const [rescheduleReason, setRescheduleReason] = useState<string>("")
  // const [showCancelValidationMessage, setShowCancelValidationMessage] =
  //   useState<boolean>(false)
  // const [showRescheduleValidationMessage, setShowRescheduleValidationMessage] =
  //   useState<boolean>(false)
  const defaultPetImageByType =
    petImageByType[selectedAppointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other
  // const { call: cancelAppointment, loading: cancelAppointmentLoading } =
  //   useAPICall(api.cancelAppointment)

  // const handleCancelClick = () => {
  //   setCurrentView("cancelConfirm")
  // }

  // const handleRescheduleClick = () => {
  //   setCurrentView("rescheduleConfirm")
  // }

  // const resetView = () => {
  //   setCancelReason("")
  //   setShowCancelValidationMessage(false)
  //   setRescheduleReason("")
  //   setShowRescheduleValidationMessage(false)
  //   setCurrentView("default")
  // }

  // const cancelBooking = async () => {
  //   if (!cancelReason) {
  //     setShowCancelValidationMessage(true)
  //     return
  //   }
  //   // console.log("selectedAppointment", selectedAppointment);
  //   try {
  //     const resp = await cancelAppointment({
  //       appointmentid: selectedAppointment.id,
  //       clinic_id: selectedAppointment.clinic_id,
  //       vet_id: selectedAppointment.vet_vetport_id,
  //       pet_id: selectedAppointment.pet_vetport_id,
  //       pet_name: selectedAppointment.pet_name,
  //       appt_start: selectedAppointment.appt_start,
  //       appt_end: selectedAppointment.appt_end,
  //       appt_type_id: selectedAppointment.appt_type_id,
  //       reason: cancelReason,
  //     })
  //     if (!resp.ok) {
  //       console.error("Error cancelling appointment", resp)
  //       toast.error(
  //         "We couldn't cancel your appointment. Please try again later.",
  //       )
  //       return
  //     }
  //     setCurrentView("cancelled")
  //   } catch (error) {
  //     console.error("Error cancelling appointment", error)
  //     toast.error(
  //       "We couldn't cancel your appointment. Please try again later.",
  //     )
  //   }
  // }

  // const rescheduleBooking = async () => {
  //   if (!rescheduleReason) {
  //     setShowRescheduleValidationMessage(true)
  //     return
  //   }

  //   setCurrentView("reschedule")
  // }

  const { call: getInvoiceById } = useAPICall(api.getInvoice)

  const fetchInvoiceById = useCallback(
    async (invoiceid: string) => {
      try {
        const resp = await getInvoiceById({ invoiceid })
        if (resp.ok) {
          return resp.value.body.invoicePdf
        }
      } catch (e) {
        console.error("Failed to fetch invoice PDF", e)
        return null
      }
    },
    [selectedAppointment],
  )

  const handleViewPDF = async (invoiceId: string) => {
    setLoadingView(true)
    const base64str = await fetchInvoiceById(invoiceId)
    setLoadingView(false)
    if (!base64str) return
    const byteCharacters = atob(base64str)
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "application/pdf" })

    const blobUrl = URL.createObjectURL(blob)
    setPdfUrl(blobUrl)
    setShowPdfModal(true)
  }

  const handleDownloadPDF = async (invoiceId: string) => {
    setLoadingDownload(true)
    const base64 = await fetchInvoiceById(invoiceId)
    setLoadingDownload(false)
    if (!base64) return

    const byteCharacters = atob(base64)
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "application/pdf" })

    const blobUrl = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = blobUrl
    link.download = `invoice-${invoiceId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)
  }

  const currentView = "default" as
    | "default"
    | "cancelConfirm"
    | "reschedule"
    | "cancelled"
    | "rescheduleConfirm"
  const parsedDate = parseISO(selectedAppointment.booking_date)

  return (
    <div className="w-full px-4 py-8">
      {currentView !== "reschedule" && (
        <>
          <BackButton navigateBack={() => goBack(false)} />

          {currentView === "default" && (
            <div className="flex flex-col justify-center gap-4 items-center">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl flex items-center gap-4">
                  {/* {selectedAppointment.category === "CANCELLED"
                    ? "Booking Cancelled"
                    : "Your Booking"} */}
                  {selectedAppointment.category === "COMPLETED"
                    ? "Booking Completed"
                    : "Your Booking"}
                </h1>
                {/* {selectedAppointment.category === "CANCELLED" && (
                  <CircleX
                    size={40}
                    fill="#5281a2"
                    stroke="white"
                    strokeWidth={2}
                  />
                )} */}
                {selectedAppointment.category === "COMPLETED" ? (
                  <CircleCheck
                    size={40}
                    fill="#5281a2"
                    stroke="white"
                    strokeWidth={2}
                  />
                ) : (
                  <CalendarDays
                    size={40}
                    fill="#5281a2"
                    stroke="white"
                    strokeWidth={2}
                  />
                )}
              </div>
              <div
                className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center ${
                  selectedAppointment.category === "COMPLETED"
                    ? "bg-[#F1F1F1] text-[#909090]"
                    : "bg-[#FFFCF3]"
                }`}
              >
                <p className="text-lg font-semibold mt-4 text-center">
                  {selectedAppointment.category === "COMPLETED"
                    ? selectedAppointment.appt_type === "Grooming"
                      ? `${selectedAppointment.pet_name} had a ${selectedAppointment.appt_type} session`
                      : `${selectedAppointment.pet_name} visited ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`
                    : selectedAppointment.appt_type !== "Grooming"
                      ? `${selectedAppointment.pet_name} is scheduled for a ${selectedAppointment.appt_type} with ${selectedAppointment.vet_name}`
                      : `${selectedAppointment.pet_name} is scheduled for a ${selectedAppointment.appt_type} session`}
                </p>
                <div className="flex items-center my-4 relative">
                  {
                    <>
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
                        <Image
                          src={
                            selectedAppointment.pet_profile_image ||
                            defaultPetImageByType
                          }
                          alt={`${selectedAppointment.pet_name}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          sizes="128px"
                          priority
                        />
                      </div>
                      {selectedAppointment.appt_type !== "Grooming" && (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                          <Image
                            src={
                              selectedAppointment.vet_image || defaultVetImage
                            }
                            alt={`${selectedAppointment.vet_name}'s profile`}
                            layout="fill"
                            objectFit="contain"
                            sizes="128px"
                          />
                        </div>
                      )}
                    </>
                  }
                </div>
                <div className="my-4 space-y-3">
                  <p className={`flex items-center gap-2`}>
                    <span className="text-secondary-1">
                      <GrLocation />
                    </span>{" "}
                    {selectedAppointment.clinic_location}
                  </p>
                  <p className={`flex items-center gap-2`}>
                    <span className="text-secondary-1">
                      <HiOutlineCalendar />
                    </span>
                    {format(parsedDate, "EEEE dd MMMM, yyyy")}
                  </p>
                  <p className={`flex items-center gap-2`}>
                    <span className="text-secondary-1">
                      <MdOutlineAccessTime />
                    </span>

                    {selectedAppointment.appt_start}
                    {" - "}
                    {selectedAppointment.appt_end}
                  </p>
                  {selectedAppointment.coupon_code && (
                    <p className={`flex items-center gap-2 text-secondary-1`}>
                      <span>Coupon Code applied: </span>
                      <b>{selectedAppointment.coupon_code}</b>
                    </p>
                  )}
                </div>
                {/* {selectedAppointment.category === "UPCOMING" && (
                  <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6">
                      <button
                        onClick={handleCancelClick}
                        className="w-full sm:w-auto sm:min-w-[150px] py-3 px-4 sm:px-6 border-2 border-secondary-1 rounded-full text-sm sm:text-base font-bold text-secondary-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRescheduleClick}
                        className="w-full sm:w-auto sm:min-w-[150px] py-3 px-4 sm:px-6 border-2 border-secondary-1 rounded-full text-sm sm:text-base font-bold text-secondary-1"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                )} */}
              </div>
              {/* Invoice Details Section */}
              <div className="w-full md:w-4/5 lg:w-[50%] border-t border-gray-200 pt-6 mt-6 text-primary-1 px-6 sm:px-0">
                <h2 className="text-xl font-semibold text-[--primary-1] mb-4">
                  Invoice Details
                </h2>
                <div className="bg-[#FFFCF3] p-6 rounded-md shadow-sm">
                  {selectedAppointment.payment_status === "NO_BILL" ? (
                    <p className="text-gray-500 italic">
                      No bill was generated for this appointment.
                    </p>
                  ) : (
                    <div className="min-w-[600px]">
                      {/* Header Row */}
                      <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-[--primary-3] text-[--primary-1] font-semibold text-sm rounded-t-md">
                        <div>Invoice ID</div>
                        <div>Total Amount</div>
                        <div>Total Tax</div>
                        <div>Status</div>
                        <div className="text-right pr-2">Actions</div>
                      </div>

                      {/* Data Row */}
                      <div className="grid grid-cols-5 gap-4 px-4 py-3 items-center bg-white text-sm text-[--primary-1] border border-t-0 border-gray-200 rounded-b-md">
                        <Tooltip title={selectedAppointment.invoice_id}>
                          <div className="truncate">
                            {selectedAppointment.invoice_id || "—"}
                          </div>
                        </Tooltip>
                        <div>
                          ₹{selectedAppointment.total_billing_amount.toFixed(2)}
                        </div>
                        <div>
                          ₹{selectedAppointment.total_tax_amount.toFixed(2)}
                        </div>
                        <div
                          className={
                            selectedAppointment.payment_status === "PAID"
                              ? "text-green-600 font-medium"
                              : selectedAppointment.payment_status ===
                                  "PARTIALLY_PAID"
                                ? "text-yellow-600 font-medium"
                                : selectedAppointment.payment_status ===
                                    "OVERPAID"
                                  ? "text-blue-600 font-medium"
                                  : "text-red-600 font-medium"
                          }
                        >
                          {selectedAppointment.payment_status.replaceAll(
                            "_",
                            " ",
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-3 pr-2">
                          <Tooltip title="View Invoice">
                            <Button
                              type="text"
                              shape="circle"
                              size="small"
                              icon={
                                loadingView ? <ClipLoader /> : <Eye size={16} />
                              }
                              onClick={() =>
                                handleViewPDF(selectedAppointment.invoice_id)
                              }
                            />
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <Button
                              type="text"
                              shape="circle"
                              size="small"
                              icon={
                                loadingDownload ? (
                                  <ClipLoader />
                                ) : (
                                  <Download size={16} />
                                )
                              }
                              onClick={() => {
                                handleDownloadPDF(
                                  selectedAppointment.invoice_id,
                                )
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Invoice Viewer */}
              <Modal
                open={showPdfModal}
                onCancel={() => {
                  setShowPdfModal(false)
                  if (pdfUrl) URL.revokeObjectURL(pdfUrl)
                }}
                footer={null}
                width="90vw"
                centered
                destroyOnClose
                title={`Invoice #${selectedAppointment.invoice_id}`}
                closeIcon={<XCircle />}
                bodyStyle={{ padding: 0, height: "80vh" }} // remove padding, fix height
              >
                {pdfUrl && (
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Invoice PDF"
                  />
                )}
              </Modal>
            </div>
          )}
          {/* {currentView === "cancelConfirm" && (
            <div className="flex flex-col justify-center items-center gap-4">
              <h1 className="text-3xl">Cancel Booking</h1>
              <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-6 items-center bg-[#FFFCF3] rounded-lg">
                <h1 className="text-center text-2xl font-semibold font-sans">
                  Are you sure you want to cancel this booking?
                </h1>
                <p>
                  Please select a reason for cancelling. You will receive a
                  Whatsapp notification confirming the cancellation for this
                  booking.
                </p>
                <div className="space-y-3">
                  {cancelReasons.map((reason, index) => (
                    <div className="flex items-start gap-2" key={index}>
                      <input
                        type="radio"
                        id={`reason${index}`}
                        name="cancelReason"
                        value={reason}
                        onChange={() => setCancelReason(reason)}
                        className="mt-1.5"
                      />
                      <label htmlFor={`reason${index}`} className="">
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>
                {showCancelValidationMessage && !cancelReason && (
                  <p className="text-red-500 text-sm">
                    Please select a reason to proceed.
                  </p>
                )}
                <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
                  <button
                    onClick={resetView}
                    className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
                  >
                    No
                  </button>
                  <button
                    onClick={() => cancelBooking()}
                    className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
                  >
                    {cancelAppointmentLoading ? (
                      <ClipLoader color="#33495f" size={18} />
                    ) : (
                      `Yes`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {currentView === "cancelled" && (
            <div className="flex flex-col justify-center gap-4 items-center">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl flex items-center gap-4">
                  Booking Cancelled
                </h1>
                <CircleX
                  size={40}
                  fill="#5281a2"
                  stroke="white"
                  strokeWidth={2}
                />
              </div>
              <div
                className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center bg-primary-3`}
              >
                <p className="text-lg font-semibold mt-4 text-center">
                  {selectedAppointment.appt_type === "Grooming"
                    ? `${selectedAppointment.pet_name} was scheduled for a ${selectedAppointment.appt_type} session`
                    : `${selectedAppointment.pet_name} was scheduled with ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`}
                </p>
                <div className="flex items-center my-4 relative">
                  {
                    <>
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
                        <Image
                          src={
                            selectedAppointment.pet_profile_image ||
                            defaultPetImageByType
                          }
                          alt={`${selectedAppointment.pet_name}'s profile`}
                          layout="fill"
                          objectFit="cover"
                          sizes="128px"
                          priority
                        />
                      </div>
                      {selectedAppointment.appt_type !== "Grooming" && (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                          <Image
                            src={
                              selectedAppointment.vet_image.type === "url"
                                ? selectedAppointment.vet_image.value
                                : doctorImagesMap[
                                    selectedAppointment.vet_image.value
                                  ] || defaultVetImage
                            }
                            alt={`Dr. ${selectedAppointment.vet_name}'s profile`}
                            layout="fill"
                            objectFit="contain"
                            sizes="128px"
                          />
                        </div>
                      )}
                    </>
                  }
                </div>
                <div className="my-4 space-y-3">
                  <p className="flex items-center gap-2 line-through">
                    <span className="text-secondary-1">
                      <GrLocation />
                    </span>{" "}
                    {selectedAppointment.clinic_location}
                  </p>
                  <p className="flex items-center gap-2 line-through">
                    <span className="text-secondary-1">
                      <HiOutlineCalendar />
                    </span>
                    {new Date(
                      selectedAppointment.appt_start,
                    ).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="flex items-center gap-2 line-through">
                    <span className="text-secondary-1">
                      <MdOutlineAccessTime />
                    </span>
                    {new Date(
                      selectedAppointment.appt_start,
                    ).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(selectedAppointment.appt_end).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div className="flex items-center">
                  <CustomButton
                    buttonText="Done"
                    buttonBackground="bg-secondary-1"
                    buttonClickEvent={() => goBack(true)}
                  />
                </div>
              </div>
            </div>
          )}
          {currentView === "rescheduleConfirm" && (
            <div className="flex flex-col justify-center items-center gap-4">
              <h1 className="text-3xl">Reschedule Booking</h1>
              <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-8 items-center bg-[#FFFCF3] rounded-lg">
                <h1 className="text-center text-2xl font-semibold font-sans">
                  Are you sure you want to reschedule this booking?
                </h1>
                <p>
                  You will receive a Whatsapp notification confirming the
                  rescheduled booking
                </p>
                <div className="space-y-3">
                  {rescheduleReasons.map((reason, index) => (
                    <div className="flex items-start gap-2" key={index}>
                      <input
                        type="radio"
                        id={`rescheduleReason${index}`}
                        name="rescheduleReason"
                        value={reason}
                        onChange={() => setRescheduleReason(reason)}
                        className="mt-1.5"
                      />
                      <label htmlFor={`rescheduleReason${index}`} className="">
                        {reason}
                      </label>
                    </div>
                  ))}
                </div>
                {showRescheduleValidationMessage && !rescheduleReason && (
                  <p className="text-red-500 text-sm">
                    Please select a reason to proceed.
                  </p>
                )}
                <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
                  <button
                    onClick={resetView}
                    className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
                  >
                    No
                  </button>
                  <button
                    onClick={rescheduleBooking}
                    className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )} */}
        </>
      )}

      {/* {currentView === "reschedule" && (
        <RescheduleAppointment
          existingAppointment={selectedAppointment}
          onBack={() => goBack(false)}
          onDone={() => goBack(true)}
        />
      )} */}
    </div>
  )
}

export default BookingDetails
