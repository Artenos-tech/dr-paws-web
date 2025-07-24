"use client"

import { useEffect, useState, useMemo } from "react"
import { Download, Eye, XCircle } from "lucide-react"
import { ClipLoader } from "react-spinners"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { format } from "date-fns"
import { Button, Modal, Tooltip } from "antd"
import Image from "next/image"

interface MedicalHistoryProps {
  petId: string
}

interface AttachmentInfo {
  name: string
  fileId: string
  mimeType: string
  fileType: "pdf" | "image" | "docx" | "other"
  blobUrl: string | null
}

const ITEMS_PER_PAGE = 5

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ petId }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showReportPdfModal, setShowReportPdfModal] = useState(false)
  const [currentAttachment, setCurrentAttachment] =
    useState<AttachmentInfo | null>(null)

  const {
    call: getMedicalHistoryForPet,
    result: medicalHistoryResult,
    loading: historyLoading,
  } = useAPICall(api.getMedicalHistoryForPet)

  useEffect(() => {
    getMedicalHistoryForPet({ pet_id: petId })
  }, [petId])

  const medicalHistory =
    (medicalHistoryResult?.ok &&
      medicalHistoryResult.value.body.medical_history) ||
    []

  const filteredAndSortedHistory = useMemo(() => {
    return [...medicalHistory]
      .filter((entry) => {
        return (
          entry.bookingId ||
          entry.bookingDate ||
          (entry.attachments && entry.attachments.length > 0) ||
          (entry.soapNotes && entry.soapNotes.length > 0) ||
          (entry.notes && entry.notes.trim() !== "") ||
          (entry.groomingBookings && entry.groomingBookings.length > 0) ||
          (entry.resortServiceBookings &&
            entry.resortServiceBookings.length > 0)
        )
      })
      .sort((a, b) => {
        const dateA = new Date(a.bookingDate || "").getTime()
        const dateB = new Date(b.bookingDate || "").getTime()
        return dateB - dateA
      })
  }, [medicalHistory])

  const totalPages = Math.ceil(filteredAndSortedHistory.length / ITEMS_PER_PAGE)
  const paginatedEntries = filteredAndSortedHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const formatReadableDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return "th"
      switch (n % 10) {
        case 1:
          return "st"
        case 2:
          return "nd"
        case 3:
          return "rd"
        default:
          return "th"
      }
    }
    return `${day}${getOrdinal(day)} ${format(date, "MMMM yyyy")}`
  }

  const handlePreview = async (
    attachment: AttachmentInfo,
    previewable: boolean,
  ) => {
    if (!previewable) {
      // Not previewable, trigger download instead
      handleDownload(attachment)
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

  const handleDownload = async (attachment: AttachmentInfo) => {
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

  return (
    <div className="w-full">
      {historyLoading ? (
        <div className="flex justify-center">
          <ClipLoader color="#33495f" />
        </div>
      ) : (
        <div className="space-y-8">
          {medicalHistory.length === 0 ? (
            <p className="text-gray-500">No medical history found.</p>
          ) : (
            paginatedEntries.map((entry, index) => {
              const attachments = entry.attachments || []
              const soapNotes = entry.soapNotes || []

              return (
                <div
                  key={index}
                  className="border border-gray-200 p-4 rounded-lg shadow-sm"
                >
                  <h4 className="text-md font-bold text-primary-1 mb-2">
                    Visit to {entry.clinicName} on{" "}
                    {formatReadableDate(entry.bookingDate as string)}
                  </h4>

                  {/* Attachments */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold mb-2">
                      Diagnostic Reports, Scans, and X-rays
                    </h5>
                    {attachments.length > 0 ? (
                      <div
                        className={
                          attachments.length === 1
                            ? "flex flex-col gap-4"
                            : attachments.length === 2
                              ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        }
                      >
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="bg-primary-3 p-4 rounded-md w-full flex justify-between items-center gap-2"
                          >
                            <div className="flex flex-col flex-1 min-w-0">
                              <p className="text-sm truncate text-gray-800 font-medium">
                                {decodeURIComponent(attachment.name)}
                              </p>
                              <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                {!attachment.previewable && (
                                  <span className="text-orange-600">
                                    Download only
                                  </span>
                                )}
                              </div>
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
                                      handlePreview(
                                        {
                                          name: attachment.name,
                                          fileId: attachment.fileId,
                                          fileType: attachment.fileType,
                                          mimeType: attachment.mimeType,
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
                                    handleDownload(
                                      currentAttachment
                                        ? currentAttachment
                                        : {
                                            name: attachment.name,
                                            fileId: attachment.fileId,
                                            fileType: attachment.fileType,
                                            mimeType: attachment.mimeType,
                                            blobUrl: null,
                                          },
                                    )
                                  }
                                />
                              </Tooltip>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No reports found.</p>
                    )}
                  </div>

                  {/* SOAP Notes */}
                  <div>
                    <h5 className="text-sm font-semibold mb-2">
                      Prescriptions
                    </h5>
                    {soapNotes.length > 0 ? (
                      <ul className="space-y-3">
                        {soapNotes.map((note) => (
                          <li
                            key={note.id}
                            className="bg-primary-3 p-3 rounded-md"
                          >
                            <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
                              {note.subjective && (
                                <li>
                                  <strong>Subjective:</strong> {note.subjective}
                                </li>
                              )}
                              {note.objective && (
                                <li>
                                  <strong>Objective:</strong> {note.objective}
                                </li>
                              )}
                              {note.assessment && (
                                <li>
                                  <strong>Assessment:</strong> {note.assessment}
                                </li>
                              )}
                              {note.plan && (
                                <li>
                                  <strong>Plan:</strong> {note.plan}
                                </li>
                              )}
                              {note.memo && (
                                <li>
                                  <strong>Memo:</strong> {note.memo}
                                </li>
                              )}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No prescriptions found.</p>
                    )}
                  </div>

                  {/* Report Modal */}
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
                                  handleDownload(currentAttachment)
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
                </div>
              )
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md mr-2 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md ml-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MedicalHistory
