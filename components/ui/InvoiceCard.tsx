"use client"

import { Card, Button, Tooltip } from "antd"
import { ChevronDown, ChevronUp, Eye, Download } from "lucide-react"
import { useState } from "react"

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
  date: string
  billAmount: number
  totalTaxAmount: number
  status: string
  billingLineItems: LineItem[]
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoiceId,
  date,
  billAmount,
  totalTaxAmount,
  status,
  billingLineItems,
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleViewPDF = (invoiceId: string) => {
    console.log("Viewing PDF for invoice: ", invoiceId)
    // window.open(`/api/invoices/${invoiceId}/pdf`, "_blank")
  }

  const handleDownloadPDF = async (invoiceId: string) => {
    console.log("Donwloading PDF for invoice: ", invoiceId)
    // const link = document.createElement("a")
    // link.href = `/api/invoices/${invoiceId}/pdf?download=true`
    // link.download = `invoice-${invoiceId}.pdf`
    // link.click()
  }

  return (
    <Card className="w-full bg-primary-3 mb-3 md:mb-4 shadow-md">
      {/* HEADER INFO */}
      <div
        onClick={() => {
          if (!!billingLineItems?.length) setExpanded(!expanded)
        }}
        aria-expanded={expanded}
        className="w-full flex flex-wrap lg:flex-nowrap justify-between items-stretch cursor-pointer"
      >
        {/* Invoice No */}
        <Card.Grid
          hoverable={false}
          style={gridStyle}
          className="basis-full sm:basis-1/2 lg:basis-1/5"
        >
          <p className="text-xs md:text-sm">Invoice No</p>
          <p className="text-base md:text-lg font-medium break-all">
            {invoiceId}
          </p>
        </Card.Grid>

        {/* Issue Date */}
        <Card.Grid
          hoverable={false}
          style={gridStyle}
          className="basis-full sm:basis-1/2 lg:basis-1/5"
        >
          <p className="text-xs md:text-sm">Issue Date</p>
          <p className="text-base md:text-lg font-medium">{date}</p>
        </Card.Grid>

        {/* Bill Amount */}
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

        {/* Total Tax */}
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

        {/* Status */}
        <Card.Grid
          hoverable={false}
          style={gridStyle}
          className="basis-full lg:basis-1/5 content-center"
        >
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 w-full text-center">
            {/* 🔹 Status Label + Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 justify-center">
              <p className="text-xs md:text-sm hidden sm:inline">Status</p>
              <span
                className={`text-xs px-2 py-1 rounded w-fit ${
                  status === "PAID"
                    ? "bg-green-600 text-white"
                    : status === "UNPAID"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                }`}
              >
                {status}
              </span>
            </div>

            {/* 🔹 Action Icons */}
            <div className="flex gap-2 justify-center items-center flex-wrap">
              <Tooltip title="View Invoice">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<Eye size={16} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewPDF(invoiceId)
                  }}
                />
              </Tooltip>

              <Tooltip title="Download PDF">
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={<Download size={16} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownloadPDF(invoiceId)
                  }}
                />
              </Tooltip>

              {billingLineItems.length > 0 && (
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
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpanded(!expanded)
                    }}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </Card.Grid>
      </div>

      {/* EXPANDED CONTENT */}
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

      {/* Action Buttons
      <div className="flex flex-wrap gap-2 justify-end mt-4 px-2 sm:px-4 md:px-6">
        <Button
          type="primary"
          onClick={() => handleViewPDF(invoiceId)}
          className="text-xs md:text-sm"
        >
          View PDF
        </Button>
        <Button
          type="default"
          onClick={() => handleDownloadPDF(invoiceId)}
          className="text-xs md:text-sm"
        >
          Download PDF
        </Button>
      </div> */}
    </Card>
  )
}

export default InvoiceCard
