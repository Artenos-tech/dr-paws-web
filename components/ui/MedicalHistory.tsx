"use client"

import { useEffect, useState, useMemo } from "react"
import { Download, Eye, XCircle } from "lucide-react"
import { ClipLoader } from "react-spinners"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { format } from "date-fns"
import { Button, Modal, Tooltip } from "antd"

interface MedicalHistoryProps {
  petId: string
}

const ITEMS_PER_PAGE = 5

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ petId }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showReportPdfModal, setShowReportPdfModal] = useState(false)
  const [reportBlobUrl, setReportBlobUrl] = useState<string | null>(null)
  const [reportBlob, setReportBlob] = useState<Blob | null>(null)
  const [reportType, setReportType] = useState<
    "pdf" | "image" | "docx" | "other" | null
  >(null)

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

  const getFileType = async (
    blob: Blob,
  ): Promise<{
    type: "pdf" | "image" | "docx" | "other"
    mimeType: string
  }> => {
    const buffer = await blob.arrayBuffer()
    const bytes = new Uint8Array(buffer.slice(0, 8))

    // PDF signature
    if (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46
    ) {
      return { type: "pdf", mimeType: "application/pdf" }
    }

    // PNG signature
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return { type: "image", mimeType: "image/png" }
    }

    // JPEG signature
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { type: "image", mimeType: "image/jpeg" }
    }

    // GIF signature
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38
    ) {
      return { type: "image", mimeType: "image/gif" }
    }

    // WebP signature
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { type: "image", mimeType: "image/webp" }
    }

    // DOCX/ZIP signature
    if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
      return {
        type: "docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }
    }

    return { type: "other", mimeType: "application/octet-stream" }
  }

  const handlePreview = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const { type, mimeType } = await getFileType(blob)
      const correctedBlob = new Blob([blob], { type: mimeType })
      const blobUrl = URL.createObjectURL(correctedBlob)
      setReportBlob(correctedBlob)
      setReportBlobUrl(blobUrl)
      setReportType(type)
      setShowReportPdfModal(true)
    } catch (err) {
      console.error("Failed to preview file:", err)
    }
  }

  const handleDownload = () => {
    if (!reportBlob) return
    const url = URL.createObjectURL(reportBlob)
    const link = document.createElement("a")
    link.href = url
    let ext = "bin"
    switch (reportType) {
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
    link.download = `attachment.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
                            <p className="text-sm truncate text-gray-800 font-medium">
                              {decodeURIComponent(attachment.name)}
                            </p>
                            {attachment.fileId ? (
                              <Tooltip title="View Report">
                                <Button
                                  type="text"
                                  shape="circle"
                                  size="small"
                                  icon={<Eye size={16} />}
                                  onClick={() =>
                                    handlePreview(attachment.fileId)
                                  }
                                />
                              </Tooltip>
                            ) : (
                              <span className="text-gray-500 italic text-sm">
                                Unavailable
                              </span>
                            )}
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
                    onCancel={() => setShowReportPdfModal(false)}
                    footer={null}
                    width="90vw"
                    centered
                    destroyOnClose
                    title="Report"
                    closeIcon={<XCircle />}
                    bodyStyle={{ padding: 0, height: "80vh" }}
                  >
                    {reportBlobUrl && reportType === "pdf" ? (
                      <iframe
                        src={reportBlobUrl}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                      />
                    ) : reportBlobUrl && reportType === "image" ? (
                      <div className="relative w-full h-full bg-black flex justify-center items-center">
                        <img
                          src={reportBlobUrl}
                          alt="Attachment"
                          className="max-h-full max-w-full object-contain"
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
                              onClick={handleDownload}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center space-y-4">
                        <p className="text-lg text-gray-700">
                          Preview not available for this file type.
                        </p>
                        <Button
                          type="primary"
                          size="large"
                          icon={<Download />}
                          style={{
                            backgroundColor: "#5281a2",
                            borderColor: "#5281a2",
                          }}
                          onClick={handleDownload}
                        >
                          Download File
                        </Button>
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
