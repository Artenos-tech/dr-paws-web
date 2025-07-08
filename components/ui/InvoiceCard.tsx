"use client"

import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { Card, Button, Tooltip, Modal } from "antd"
import { Eye, Download, XCircle } from "lucide-react"
import { useCallback, useState } from "react"
import { ClipLoader } from "react-spinners"

const gridStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  color: "#5281a2",
  backgroundColor: "#f9fafb",
  padding: "0.5rem",
}

const gridStyleDark: React.CSSProperties = {
  ...gridStyle,
  backgroundColor: "#33495f",
  color: "white",
}

interface Tax {
  taxName: string
  taxAmount: number
  taxPercentage: number
}

interface LineItem {
  name: string
  amount: number
  taxes: Tax[]
}

interface InvoiceCardProps {
  invoiceId: string
  invoiceNo: string
  date: string
  billAmount: number
  totalTaxAmount: number
  status: string
  billingLineItems: LineItem[]
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoiceId,
  invoiceNo,
  date,
  billAmount,
  totalTaxAmount,
  status,
  billingLineItems,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [loadingView, setLoadingView] = useState(false)
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const { call: getInvoiceById } = useAPICall(api.getInvoice)

  const fetchInvoiceById = useCallback(async (invoiceid: string) => {
    try {
      const resp = await getInvoiceById({ invoiceid })
      if (resp.ok) {
        return resp.value.body.invoicePdf
      }
    } catch (e) {
      console.error("Failed to fetch invoice PDF", e)
      return null
    }
  }, [])

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

  return (
    <>
      <Card className="w-full bg-primary-3 mb-3 md:mb-4 shadow-md">
        <div
          onClick={() => {
            if (!!billingLineItems?.length) setExpanded(!expanded)
          }}
          aria-expanded={expanded}
          className="w-full flex flex-wrap lg:flex-nowrap justify-between items-stretch cursor-pointer"
        >
          <Card.Grid
            hoverable={false}
            style={gridStyle}
            className="basis-full sm:basis-1/2 lg:basis-1/5"
          >
            <p className="text-xs md:text-sm">Invoice No</p>
            <p className="text-base md:text-lg font-medium break-all">
              {invoiceNo}
            </p>
          </Card.Grid>

          <Card.Grid
            hoverable={false}
            style={gridStyle}
            className="basis-full sm:basis-1/2 lg:basis-1/5"
          >
            <p className="text-xs md:text-sm">Issue Date</p>
            <p className="text-base md:text-lg font-medium">{date}</p>
          </Card.Grid>

          <Card.Grid
            hoverable={false}
            style={gridStyleDark}
            className="basis-full sm:basis-1/2 lg:basis-1/5"
          >
            <p className="text-xs md:text-sm">Bill Amount (₹)</p>
            <p className="text-base md:text-lg font-medium">
              ₹{billAmount.toFixed(2)}
            </p>
          </Card.Grid>

          <Card.Grid
            hoverable={false}
            style={gridStyle}
            className="basis-full sm:basis-1/2 lg:basis-1/5"
          >
            <p className="text-xs md:text-sm">Total Tax (₹)</p>
            <p className="text-base md:text-lg font-medium">
              ₹{totalTaxAmount.toFixed(2)}
            </p>
          </Card.Grid>

          <Card.Grid
            hoverable={false}
            style={gridStyle}
            className="basis-full lg:basis-1/5 content-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 w-full text-center">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center">
                <p className="text-xs md:text-sm hidden sm:inline">Status</p>
                <span
                  className={`text-xs px-2 py-1 rounded w-fit ${
                    status === "PAID"
                      ? "bg-green-600 text-white"
                      : status === "UNPAID"
                        ? "bg-red-600 text-white"
                        : status === "OVERPAID"
                          ? "bg-blue-600 text-white"
                          : status === "PARTIALLY_PAID"
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-600 text-white"
                  }`}
                >
                  {status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex gap-2 justify-center items-center flex-wrap">
                <Tooltip title="View Invoice">
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={loadingView ? <ClipLoader /> : <Eye size={16} />}
                    onClick={() => handleViewPDF(invoiceId)}
                  />
                </Tooltip>

                <Tooltip title="Download PDF">
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={
                      loadingDownload ? <ClipLoader /> : <Download size={16} />
                    }
                    onClick={() => {
                      handleDownloadPDF(invoiceId)
                    }}
                  />
                </Tooltip>

                {/* {billingLineItems.length > 0 && (
                  <Tooltip title={expanded ? "Collapse" : "Expand"}>
                    <Button
                      type="text"
                      shape="circle"
                      size="small"
                      icon={
                        expanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      }
                      onClick={() => {
                        setExpanded(!expanded)
                      }}
                    />
                  </Tooltip>
                )} */}
              </div>
            </div>
          </Card.Grid>
        </div>

        {!!billingLineItems?.length && expanded && (
          <div className="mt-4 px-2 sm:px-4 md:px-6 py-2 transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-4">
              {billingLineItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="border p-3 rounded bg-white shadow-sm"
                >
                  {/* Line Item Name and Amount */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm font-medium mb-2">
                    <span className="text-gray-900">{item.name}</span>
                    <span className="text-gray-800">
                      ₹{item.amount.toFixed(2)}
                    </span>
                  </div>

                  {/* Taxes Section */}
                  {item.taxes.length > 0 && (
                    <div className="mt-2 text-xs text-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {item.taxes.map((tax, i) => (
                          <div
                            key={`${tax.taxName}-${i}`}
                            className="flex flex-col border p-2 rounded bg-gray-50"
                          >
                            <span className="font-semibold">{tax.taxName}</span>
                            <span>Rate: {tax.taxPercentage}%</span>
                            <span>Amount: ₹{tax.taxAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
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
        title={`Invoice #${invoiceNo}`}
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
    </>
  )
}

export default InvoiceCard
