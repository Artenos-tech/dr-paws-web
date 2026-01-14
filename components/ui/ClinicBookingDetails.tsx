"use client"

import React, { useState, useCallback, useEffect } from "react"
import BackButton from "./BackButton"
import { MdOutlineAccessTime } from "react-icons/md"
import { GrLocation } from "react-icons/gr"
import { HiOutlineCalendar } from "react-icons/hi"
import Image from "next/image"
import defaultVetImage from "@/public/assets/images/clinic/doctorFemale.webp"
import { petImageByType } from "./PetCard"
import {
  CalendarDays,
  CircleCheck,
  Eye,
  Download,
  XCircle,
  CircleX,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { Tooltip, Modal, Button } from "antd"
import CustomButton from "./CustomButton"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { ClipLoader } from "react-spinners"
import toast from "react-hot-toast"
import { AttachmentInfo } from "./MedicalHistory"
import RescheduleAppointment from "@/components/ui/RescheduleAppointment"
import { AppointmentDetails } from "@/model/typeDefinitions"
import ConfirmconfirmationTypeCard from "./CancelConfirmationCard"
import ConfirmationCard from "./CancelConfirmationCard"
import CancelledBookingCard from "./CancelBookingCard"

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
  goBack: (refetch: boolean) => void
  selectedAppointment: AppointmentDetails
}

const ClinicBookingDetails = ({
  selectedAppointment,
  goBack,
}: BookingDetailsProps) => {
  const [loadingInvoiceView, setLoadingInvoiceView] = useState(false)
  const [loadingInvoiceDownload, setLoadingInvoiceDownload] = useState(false)
  const [showInvoicePdfModal, setShowInvoicePdfModal] = useState(false)
  const [invoicePdfUrl, setPdfUrl] = useState<string | null>(null)
  const [showReportPdfModal, setShowReportPdfModal] = useState(false)
  const [currentAttachment, setCurrentAttachment] =
    useState<AttachmentInfo | null>(null)
  const [currentView, setCurrentView] = useState<
    | "default"
    | "cancelConfirm"
    | "reschedule"
    | "cancelled"
    | "rescheduleConfirm"
  >("default")
  const [attachmentsPage, setAttachmentsPage] = useState(1)
  const [soapNotesPage, setSoapNotesPage] = useState(1)

  const { call: cancelAppointment, loading: cancelAppointmentLoading } =
    useAPICall(api.cancelAppointment)
  const {
    call: getMedicalReports,
    loading: loadingMedicalReports,
    result: medicalReportsResult,
  } = useAPICall(api.getAppointmentMedicalReports)
  const { call: getInvoiceById } = useAPICall(api.getInvoice)

  useEffect(() => {
    if (selectedAppointment?.id) {
      getMedicalReports({ appointment_id: selectedAppointment.id })
    }
  }, [selectedAppointment.id])

  const handleCancelClick = () => {
    setCurrentView("cancelConfirm")
  }

  const handleRescheduleClick = () => {
    setCurrentView("rescheduleConfirm")
  }

  const resetView = () => {
    setCurrentView("default")
  }

  const cancelBooking = async () => {
    try {
      const resp = await cancelAppointment({
        appointmentid: selectedAppointment.id,
        clinic_id: selectedAppointment.clinic_id,
        sub_booking_id: selectedAppointment.sub_booking_id,
      })
      if (!resp.ok) {
        console.error("Error cancelling appointment", resp)
        toast.error(
          "We couldn't cancel your appointment. Please try again later.",
        )
        return
      }
      setCurrentView("cancelled")
    } catch (error) {
      console.error("Error cancelling appointment", error)
      toast.error(
        "We couldn't cancel your appointment. Please try again later.",
      )
    }
  }

  const rescheduleBooking = async () => {
    setCurrentView("reschedule")
  }

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

  const handleViewInvoicePDF = async (invoiceId: string) => {
    setLoadingInvoiceView(true)
    const base64str = await fetchInvoiceById(invoiceId)
    setLoadingInvoiceView(false)
    if (!base64str) return
    const byteCharacters = atob(base64str)
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0))
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "application/pdf" })

    const blobUrl = URL.createObjectURL(blob)
    setPdfUrl(blobUrl)
    setShowInvoicePdfModal(true)
  }

  const handleDownloadInvoicePDF = async (invoiceId: string) => {
    setLoadingInvoiceDownload(true)
    const base64 = await fetchInvoiceById(invoiceId)
    setLoadingInvoiceDownload(false)
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

  const handleReportPreview = async (
    attachment: AttachmentInfo,
    previewable: boolean,
  ) => {
    if (!previewable) {
      // Not previewable, trigger download instead
      handleReportDownload(attachment)
      return
    }
    try {
      const { fileId, mimeType, fileType, name } = attachment
      const response = await fetch(fileId)
      const blob = await response.blob()
      const correctedBlob = new Blob([blob], { type: mimeType })
      const blobUrl = URL.createObjectURL(correctedBlob)
      setShowReportPdfModal(true)
      setCurrentAttachment({
        name,
        mimeType,
        fileId,
        fileType,
        blobUrl,
      })
    } catch (err) {
      console.error("Failed to preview file:", err)
    }
  }

  const handleReportDownload = async (attachment: AttachmentInfo) => {
    try {
      const response = await fetch(attachment.fileId)
      const blob = await response.blob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      let ext = "bin"
      switch (attachment.fileType) {
        case "pdf":
          ext = "pdf"
          break
        case "image":
          ext = "jpg"
          break
        case "docx":
          ext = "docx"
          break
        default:
          ext = "bin"
      }
      link.download = `${attachment.name}.${ext}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const attachmentsPerPage = 8
  const soapNotesPerPage = 4

  const medicalReports =
    medicalReportsResult?.ok && medicalReportsResult.value.body.medical_reports

  const defaultPetImageByType =
    petImageByType[selectedAppointment.pet_type?.toLowerCase() || "other"] ||
    petImageByType.other

  const isUpcoming = selectedAppointment.category === "UPCOMING"
  const isCompleted = selectedAppointment.category === "COMPLETED"
  const isCancelled = selectedAppointment.category === "CANCELLED"

  const headerTitle = isCancelled
    ? "Booking Cancelled"
    : isCompleted
      ? "Booking Completed"
      : "Your Booking"

  const HeaderIcon = isCancelled
    ? CircleX
    : isCompleted
      ? CircleCheck
      : CalendarDays

  const bannerClasses = isCancelled
    ? "bg-[#F1F1F1] text-[#909090]"
    : isCompleted
      ? "bg-[#f7f1de] text-[#909090]"
      : "bg-[#FFFCF3] text-primary-1"

  const parsedDate = parseISO(selectedAppointment.booking_date)
  const petImage =
    //uncomment below line to use actual pet image
    // selectedAppointment.pet_profile_image ||
    defaultPetImageByType
  const vetImage =
    //uncomment below line to use actual vet image
    //   selectedAppointment?.vet_image ||
    defaultVetImage

  return (
    <div className="w-full">
      {currentView !== "reschedule" && (
        <>
          <BackButton navigateBack={() => goBack(false)} />

          {currentView === "default" && (
            <div className="flex flex-col justify-center gap-4 items-center">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl flex items-center gap-4">
                  {headerTitle}
                </h1>
                <HeaderIcon
                  size={40}
                  fill="#5281a2"
                  stroke="white"
                  strokeWidth={2}
                />
              </div>
              <div
                className={`p-4 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center ${bannerClasses}`}
              >
                <p className="text-lg font-semibold mt-4 text-center">
                  {isCancelled
                    ? selectedAppointment.appt_type === "GROOMING"
                      ? `${selectedAppointment.pet_name} was scheduled for a ${selectedAppointment.appt_type} session`
                      : `${selectedAppointment.pet_name} was scheduled with ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`
                    : isCompleted
                      ? selectedAppointment.appt_type === "GROOMING"
                        ? `${selectedAppointment.pet_name} had a ${selectedAppointment.appt_type} session`
                        : `${selectedAppointment.pet_name} visited ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`
                      : selectedAppointment.appt_type === "GROOMING"
                        ? `${selectedAppointment.pet_name} is scheduled for a ${selectedAppointment.appt_type} session`
                        : `${selectedAppointment.pet_name} is scheduled for a ${selectedAppointment.appt_type} with ${selectedAppointment.vet_name}`}
                </p>
                <div className="flex items-center my-4 relative">
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
                      {selectedAppointment.appt_type !== "GROOMING" && (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
                          <Image
                            src={vetImage}
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
                  <p
                    className={`flex items-center gap-2 ${isCancelled ? "line-through" : ""}`}
                  >
                    <span className="text-secondary-1">
                      <GrLocation />
                    </span>{" "}
                    {selectedAppointment.clinic_location}
                  </p>
                  <p
                    className={`flex items-center gap-2 ${isCancelled ? "line-through" : ""}`}
                  >
                    <span className="text-secondary-1">
                      <HiOutlineCalendar />
                    </span>
                    {format(parsedDate, "EEEE dd MMMM, yyyy")}
                  </p>
                  <p
                    className={`flex items-center gap-2 ${isCancelled ? "line-through" : ""}`}
                  >
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
                {isUpcoming && (
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
                )}
              </div>
              {/* Invoice Details Section */}
              {selectedAppointment.invoice_id && (
                <div className="w-full md:w-4/5 lg:w-[50%] border-t border-gray-200 pt-6 mt-6 text-primary-1 px-6 sm:px-0">
                  <h2 className="text-xl text-center font-semibold text-[--primary-1] mb-4">
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
                            ₹
                            {selectedAppointment.total_billing_amount.toFixed(
                              2,
                            )}
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
                                  loadingInvoiceView ? (
                                    <ClipLoader />
                                  ) : (
                                    <Eye size={16} />
                                  )
                                }
                                onClick={() => {
                                  if (!selectedAppointment.invoice_id) return
                                  handleViewInvoicePDF(
                                    selectedAppointment.invoice_id,
                                  )
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Download PDF">
                              <Button
                                type="text"
                                shape="circle"
                                size="small"
                                icon={
                                  loadingInvoiceDownload ? (
                                    <ClipLoader />
                                  ) : (
                                    <Download size={16} />
                                  )
                                }
                                onClick={() => {
                                  if (!selectedAppointment.invoice_id) return
                                  handleDownloadInvoicePDF(
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
              )}
              {/* Medical Reports Section */}
              {selectedAppointment.category === "COMPLETED" && (
                <div className="w-full md:w-4/5 lg:w-[50%] mt-10">
                  <h2 className="text-xl font-semibold text-center mb-6 text-primary-1">
                    Medical Reports
                  </h2>

                  {loadingMedicalReports ? (
                    <div className="flex justify-center items-center h-32">
                      <ClipLoader color="#33495f" />
                    </div>
                  ) : (
                    <>
                      {/* Diagnostic Reports */}
                      <div className="mb-10">
                        <h3 className="text-lg font-semibold mb-3">
                          Diagnostic Reports, Scans, and X-rays
                        </h3>
                        {medicalReports &&
                        medicalReports?.attachments?.length ? (
                          <>
                            <div
                              className={`grid gap-4 ${
                                medicalReports.attachments.length === 1
                                  ? "grid-cols-1"
                                  : medicalReports.attachments.length === 2
                                    ? "sm:grid-cols-2"
                                    : medicalReports.attachments.length === 3
                                      ? "sm:grid-cols-2 md:grid-cols-3"
                                      : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                              }`}
                            >
                              {medicalReports.attachments
                                .slice(
                                  (attachmentsPage - 1) * attachmentsPerPage,
                                  attachmentsPage * attachmentsPerPage,
                                )
                                .map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="bg-primary-3 p-4 rounded-md shadow hover:shadow-md flex flex-col justify-between"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <Tooltip title={attachment.name}>
                                        <span className="truncate font-medium text-primary-1 max-w-[70%]">
                                          {decodeURIComponent(attachment.name)}
                                        </span>
                                      </Tooltip>
                                      <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                        {!attachment.previewable && (
                                          <span className="text-orange-600">
                                            Download only
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex gap-2 items-center">
                                        {attachment.previewable ? (
                                          <Tooltip title="Preview">
                                            <Button
                                              type="text"
                                              shape="circle"
                                              size="small"
                                              icon={<Eye size={16} />}
                                              onClick={() =>
                                                handleReportPreview(
                                                  {
                                                    name: attachment.name,
                                                    fileId: attachment.fileId,
                                                    fileType:
                                                      attachment.fileType,
                                                    mimeType:
                                                      attachment.mimeType,
                                                    blobUrl: null,
                                                  },
                                                  attachment.previewable,
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        ) : (
                                          <Tooltip title="Preview not available">
                                            <Button
                                              type="text"
                                              shape="circle"
                                              size="small"
                                              icon={<Eye size={16} />}
                                              disabled
                                              className="opacity-30"
                                            />
                                          </Tooltip>
                                        )}

                                        <Tooltip title="Download">
                                          <Button
                                            type="text"
                                            shape="circle"
                                            size="small"
                                            icon={<Download size={16} />}
                                            onClick={() =>
                                              handleReportDownload(
                                                currentAttachment
                                                  ? currentAttachment
                                                  : {
                                                      name: attachment.name,
                                                      fileId: attachment.fileId,
                                                      fileType:
                                                        attachment.fileType,
                                                      mimeType:
                                                        attachment.mimeType,
                                                      blobUrl: null,
                                                    },
                                              )
                                            }
                                          />
                                        </Tooltip>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {medicalReports.attachments.length >
                              attachmentsPerPage && (
                              <div className="flex justify-center mt-4 gap-4">
                                <button
                                  onClick={() =>
                                    setAttachmentsPage((p) => p - 1)
                                  }
                                  disabled={attachmentsPage === 1}
                                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
                                >
                                  Prev
                                </button>
                                <button
                                  onClick={() =>
                                    setAttachmentsPage((p) => p + 1)
                                  }
                                  disabled={
                                    attachmentsPage >=
                                    Math.ceil(
                                      medicalReports.attachments.length /
                                        attachmentsPerPage,
                                    )
                                  }
                                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
                                >
                                  Next
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 italic text-center">
                            No diagnostic reports found.
                          </p>
                        )}
                      </div>

                      {/* SOAP Notes */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Prescriptions
                        </h3>
                        {medicalReports && medicalReports?.soapNotes?.length ? (
                          <>
                            <ul className="space-y-4">
                              {medicalReports.soapNotes
                                .slice(
                                  (soapNotesPage - 1) * soapNotesPerPage,
                                  soapNotesPage * soapNotesPerPage,
                                )
                                .map((note) => (
                                  <li
                                    key={note.id}
                                    className="bg-primary-3 p-4 rounded-md shadow text-primary-1 space-y-1"
                                  >
                                    {note.subjective && (
                                      <p>
                                        <strong>Subjective:</strong>{" "}
                                        {note.subjective}
                                      </p>
                                    )}
                                    {note.objective && (
                                      <p>
                                        <strong>Objective:</strong>{" "}
                                        {note.objective}
                                      </p>
                                    )}
                                    {note.assessment && (
                                      <p>
                                        <strong>Assessment:</strong>{" "}
                                        {note.assessment}
                                      </p>
                                    )}
                                    {note.plan && (
                                      <p>
                                        <strong>Plan:</strong> {note.plan}
                                      </p>
                                    )}
                                    {note.memo && (
                                      <p>
                                        <strong>Memo:</strong> {note.memo}
                                      </p>
                                    )}
                                  </li>
                                ))}
                            </ul>

                            {/* Pagination */}
                            {medicalReports.soapNotes.length >
                              soapNotesPerPage && (
                              <div className="flex justify-center mt-4 gap-4">
                                <button
                                  onClick={() => setSoapNotesPage((p) => p - 1)}
                                  disabled={soapNotesPage === 1}
                                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
                                >
                                  Prev
                                </button>
                                <button
                                  onClick={() => setSoapNotesPage((p) => p + 1)}
                                  disabled={
                                    soapNotesPage >=
                                    Math.ceil(
                                      medicalReports.soapNotes.length /
                                        soapNotesPerPage,
                                    )
                                  }
                                  className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
                                >
                                  Next
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500 italic text-center">
                            No prescriptions found.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Report Viewer */}
              <Modal
                open={showReportPdfModal}
                onCancel={() => {
                  setShowReportPdfModal(false)
                  setCurrentAttachment(null)
                }}
                footer={null}
                width="90vw"
                centered
                destroyOnClose
                title="Report"
                closeIcon={<XCircle />}
                bodyStyle={{ padding: 0, height: "80vh" }}
              >
                {currentAttachment &&
                  currentAttachment.blobUrl &&
                  currentAttachment.fileType === "pdf" && (
                    <iframe
                      src={currentAttachment.blobUrl}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                      title="PDF Preview"
                    />
                  )}
                {currentAttachment &&
                  currentAttachment.blobUrl &&
                  currentAttachment.fileType === "image" && (
                    <div className="relative w-full h-full bg-black flex justify-center items-center">
                      <Image
                        src={currentAttachment.blobUrl}
                        alt={currentAttachment.name}
                        className="max-h-full max-w-full object-contain"
                        layout="fill"
                        objectFit="contain"
                      />
                      <div className="absolute top-4 right-4 z-10">
                        <Tooltip title="Download">
                          <Button
                            style={{
                              backgroundColor: "#5281a2",
                              borderColor: "#5281a2",
                            }}
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={<Download size={18} />}
                            onClick={() =>
                              handleReportDownload(currentAttachment)
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                  )}
                {currentAttachment &&
                  currentAttachment.blobUrl &&
                  currentAttachment.fileType === "docx" && (
                    <div className="relative w-full h-full flex justify-center items-center">
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                          currentAttachment.fileId,
                        )}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                      />
                    </div>
                  )}
              </Modal>

              {/* Invoice Viewer */}
              <Modal
                open={showInvoicePdfModal}
                onCancel={() => {
                  setShowInvoicePdfModal(false)
                  if (invoicePdfUrl) URL.revokeObjectURL(invoicePdfUrl)
                }}
                footer={null}
                width="90vw"
                centered
                destroyOnClose
                title={`Invoice #${selectedAppointment.invoice_id}`}
                closeIcon={<XCircle />}
                bodyStyle={{ padding: 0, height: "80vh" }}
              >
                {invoicePdfUrl && (
                  <iframe
                    src={invoicePdfUrl}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Invoice PDF"
                  />
                )}
              </Modal>
            </div>
          )}
          {currentView === "cancelConfirm" && (
            <ConfirmationCard
              loading={cancelAppointmentLoading}
              onConfirm={cancelBooking}
              onCancel={resetView}
              confirmationType="CANCEL"
            />
            // <div className="flex flex-col justify-center items-center gap-4">
            //   <h1 className="text-3xl">Cancel Booking</h1>
            //   <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-6 items-center bg-[#FFFCF3] rounded-lg">
            //     <h1 className="text-center text-2xl font-semibold font-sans">
            //       Are you sure you want to cancel this booking?
            //     </h1>
            //     {/* <p>
            //       Please select a reason for cancelling. You will receive a
            //       Whatsapp notification confirming the cancellation for this
            //       booking.
            //     </p>
            //     <div className="space-y-3">
            //       {cancelReasons.map((reason, index) => (
            //         <div className="flex items-start gap-2" key={index}>
            //           <input
            //             type="radio"
            //             id={`reason${index}`}
            //             name="cancelReason"
            //             value={reason}
            //             onChange={() => setCancelReason(reason)}
            //             className="mt-1.5"
            //           />
            //           <label htmlFor={`reason${index}`} className="">
            //             {reason}
            //           </label>
            //         </div>
            //       ))}
            //     </div>
            //     {showCancelValidationMessage && !cancelReason && (
            //       <p className="text-red-500 text-sm">
            //         Please select a reason to proceed.
            //       </p>
            //     )} */}
            //     <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
            //       <button
            //         onClick={resetView}
            //         className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
            //       >
            //         No
            //       </button>
            //       <button
            //         onClick={() => cancelBooking()}
            //         className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
            //       >
            //         {cancelAppointmentLoading ? (
            //           <ClipLoader color="#33495f" size={18} />
            //         ) : (
            //           `Yes`
            //         )}
            //       </button>
            //     </div>
            //   </div>
            // </div>
          )}
          {currentView === "cancelled" && (
            <CancelledBookingCard
              appointment={selectedAppointment}
              onDone={() => goBack(true)}
            />
            // <div className="flex flex-col justify-center gap-4 items-center">
            //   <div className="flex items-center gap-2">
            //     <h1 className="text-2xl sm:text-3xl flex items-center gap-4">
            //       Booking Cancelled
            //     </h1>
            //     <CircleX
            //       size={40}
            //       fill="#5281a2"
            //       stroke="white"
            //       strokeWidth={2}
            //     />
            //   </div>
            //   <div
            //     className={`p-4 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-2 items-center bg-primary-3`}
            //   >
            //     <p className="text-lg font-semibold mt-4 text-center">
            //       {selectedAppointment.appt_type === "GROOMING"
            //         ? `${selectedAppointment.pet_name} was scheduled for a ${selectedAppointment.appt_type} session`
            //         : `${selectedAppointment.pet_name} was scheduled with ${selectedAppointment.vet_name} for a ${selectedAppointment.appt_type}`}
            //     </p>
            //     <div className="flex items-center my-4 relative">
            //       {
            //         <>
            //           <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white p-3 flex justify-center items-center">
            //             <Image
            //               src={
            //                 selectedAppointment.pet_profile_image ||
            //                 defaultPetImageByType
            //               }
            //               alt={`${selectedAppointment.pet_name}'s profile`}
            //               layout="fill"
            //               objectFit="cover"
            //               sizes="128px"
            //               priority
            //             />
            //           </div>
            //           {selectedAppointment.appt_type !== "GROOMING" && (
            //             <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white -ml-8 border-4 border-white flex justify-center items-center">
            //               <Image
            //                 src={
            //                   selectedAppointment.vet_image || defaultVetImage
            //                 }
            //                 alt={`Dr. ${selectedAppointment.vet_name}'s profile`}
            //                 layout="fill"
            //                 objectFit="contain"
            //                 sizes="128px"
            //               />
            //             </div>
            //           )}
            //         </>
            //       }
            //     </div>
            //     <div className="my-4 space-y-3">
            //       <p className="flex items-center gap-2 line-through">
            //         <span className="text-secondary-1">
            //           <GrLocation />
            //         </span>{" "}
            //         {selectedAppointment.clinic_location}
            //       </p>
            //       <p className="flex items-center gap-2 line-through">
            //         <span className="text-secondary-1">
            //           <HiOutlineCalendar />
            //         </span>
            //         {format(parsedDate, "EEEE dd MMMM, yyyy")}
            //       </p>
            //       <p className="flex items-center gap-2 line-through">
            //         <span className="text-secondary-1">
            //           <MdOutlineAccessTime />
            //         </span>
            //         {selectedAppointment.appt_start}
            //         {" - "}
            //         {selectedAppointment.appt_end}
            //       </p>
            //     </div>
            //     <div className="flex items-center">
            //       <CustomButton
            //         buttonText="Done"
            //         buttonBackground="bg-secondary-1"
            //         buttonClickEvent={() => goBack(true)}
            //       />
            //     </div>
            //   </div>
            // </div>
          )}
          {currentView === "rescheduleConfirm" && (
            <ConfirmationCard
              onConfirm={rescheduleBooking}
              onCancel={resetView}
              confirmationType="RESCHEDULE"
            />
            // <div className="flex flex-col justify-center items-center gap-4">
            //   <h1 className="text-3xl">Reschedule Booking</h1>
            //   <div className="py-6 px-6 md:py-8 md:px-12 text-primary-1 w-11/12 md:w-4/5 lg:w-[50%] shadow-md my-5 flex flex-col gap-8 items-center bg-[#FFFCF3] rounded-lg">
            //     <h1 className="text-center text-2xl font-semibold font-sans">
            //       Are you sure you want to reschedule this booking?
            //     </h1>
            //     <p>
            //       You will receive a Whatsapp notification confirming the
            //       rescheduled booking
            //     </p>
            //     {/* <div className="space-y-3">
            //       {rescheduleReasons.map((reason, index) => (
            //         <div className="flex items-start gap-2" key={index}>
            //           <input
            //             type="radio"
            //             id={`rescheduleReason${index}`}
            //             name="rescheduleReason"
            //             value={reason}
            //             onChange={() => setRescheduleReason(reason)}
            //             className="mt-1.5"
            //           />
            //           <label htmlFor={`rescheduleReason${index}`} className="">
            //             {reason}
            //           </label>
            //         </div>
            //       ))}
            //     </div>
            //     {showRescheduleValidationMessage && !rescheduleReason && (
            //       <p className="text-red-500 text-sm">
            //         Please select a reason to proceed.
            //       </p>
            //     )} */}
            //     <div className="flex items-center justify-center w-full md:w-[85%] gap-4 md:mt-4">
            //       <button
            //         onClick={resetView}
            //         className="w-full py-3 bg-gray-300 rounded-full text-sm text-white bg-secondary-1"
            //       >
            //         No
            //       </button>
            //       <button
            //         onClick={rescheduleBooking}
            //         className="w-full py-3 border-2 border-secondary-1 rounded-full text-sm"
            //       >
            //         Yes
            //       </button>
            //     </div>
            //   </div>
            // </div>
          )}
        </>
      )}

      {currentView === "reschedule" && (
        <RescheduleAppointment
          existingAppointment={selectedAppointment}
          onBack={() => goBack(false)}
          onDone={() => goBack(true)}
          onError={() => {
            goBack(false)
          }}
        />
      )}
    </div>
  )
}

export default ClinicBookingDetails
