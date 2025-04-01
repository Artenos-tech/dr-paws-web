"use client"

import type React from "react"

import {
  Card,
  Table,
  DatePicker,
  Button,
  Select,
  InputNumber,
  Space,
} from "antd"
import dayjs from "dayjs"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { ChevronDown, ChevronUp, FileDown, X } from "lucide-react"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import type {
  Column,
  Content,
  ContentText,
  TDocumentDefinitions,
  TableCell,
} from "pdfmake/interfaces"
import logo from "@/public/assets/images/logo/logo.svg"

pdfMake.vfs = pdfFonts.vfs

const { Option } = Select
const { RangePicker } = DatePicker

const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
  color: "#5281a2",
}

interface Invoice {
  id: number
  invoiceno: number
  createdon: string
  clinicname: string
  cliniccontact: string
  clinicaddress: string
  clinicgst?: string
  username: string
  usercontact: string
  useraddress: string
  amount: number
  invoiceline: {
    planitem?: string
    planitemid: number
    quantity: number
    cliniccost: number
    tax: number
    discount: number
    total: number
  }[]
}

interface LineItemTable {
  description: string
  quantity: number
  tax: string
  unitPrice: string
  discount: string
  amount: string
}

interface FilterState {
  dateRange: [Date | null, Date | null]
  clinicName: string | null
  amountRange: [number | null, number | null]
}

type SortField = "createdon" | "invoiceno" | "amount" | "clinicname"
type SortOrder = "asc" | "desc"

const Invoices = () => {
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(
    null,
  )
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)

  const [filters, setFilters] = useState<FilterState>({
    dateRange: [null, null],
    clinicName: null,
    amountRange: [null, null],
  })

  const [sortConfig, setSortConfig] = useState<{
    field: SortField
    order: SortOrder
  }>({
    field: "createdon",
    order: "desc", // Default to newest first
  })

  const {
    call: getAllInvoices,
    result: invoicesResult,
    loading: loadingInvoices,
  } = useAPICall(api.getInvoices)

  useEffect(() => {
    getAllInvoices({})
  }, [])

  const toggleTableExpansion = (invoiceId: number) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId)
  }

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string],
  ) => {
    console.log("dates", dates)
    const [startDateStr, endDateStr] = dateStrings

    const startDate = startDateStr ? new Date(startDateStr) : null
    let endDate = endDateStr ? new Date(endDateStr) : null

    if (endDate) {
      endDate = new Date(endDate.setHours(23, 59, 59, 999))
    }

    setFilters({
      ...filters,
      dateRange: [startDate, endDate],
    })
    setCurrentPage(1)
  }

  const handleClinicFilterChange = (value: string | null) => {
    setFilters({
      ...filters,
      clinicName: value,
    })
    setCurrentPage(1)
  }

  const handleAmountMinChange = (value: number | null) => {
    setFilters({
      ...filters,
      amountRange: [value, filters.amountRange[1]],
    })
    setCurrentPage(1)
  }

  const handleAmountMaxChange = (value: number | null) => {
    setFilters({
      ...filters,
      amountRange: [filters.amountRange[0], value],
    })
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-") as [SortField, SortOrder]
    setSortConfig({ field, order })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      dateRange: [null, null],
      clinicName: null,
      amountRange: [null, null],
    })
    setCurrentPage(1)
  }

  const filterInvoices = (invoices: Invoice[]) => {
    return invoices.filter((invoice) => {
      if (filters.dateRange[0] || filters.dateRange[1]) {
        const invoiceDate = dayjs(invoice.createdon, "DD-MM-YYYY").toDate()
        const afterStartDate = filters.dateRange[0]
          ? invoiceDate >= filters.dateRange[0]
          : true
        const beforeEndDate = filters.dateRange[1]
          ? invoiceDate <= filters.dateRange[1]
          : true

        if (!(afterStartDate && beforeEndDate)) {
          return false
        }
      }

      if (filters.clinicName && invoice.clinicname !== filters.clinicName) {
        return false
      }

      if (filters.amountRange[0] && invoice.amount < filters.amountRange[0]) {
        return false
      }

      if (filters.amountRange[1] && invoice.amount > filters.amountRange[1]) {
        return false
      }

      return true
    })
  }

  const sortInvoices = (invoices: Invoice[]) => {
    return [...invoices].sort((a, b) => {
      switch (sortConfig.field) {
        case "createdon":
          const dateA = dayjs(a.createdon, "DD-MM-YYYY").toDate().getTime()
          const dateB = dayjs(b.createdon, "DD-MM-YYYY").toDate().getTime()
          return sortConfig.order === "asc" ? dateA - dateB : dateB - dateA

        case "invoiceno":
          return sortConfig.order === "asc"
            ? a.invoiceno - b.invoiceno
            : b.invoiceno - a.invoiceno

        case "amount":
          return sortConfig.order === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount

        case "clinicname":
          return sortConfig.order === "asc"
            ? a.clinicname.localeCompare(b.clinicname)
            : b.clinicname.localeCompare(a.clinicname)

        default:
          return 0
      }
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setExpandedInvoiceId(null)
  }

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 500,
    },
    {
      title: "Unit Price (₹)",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Amount (₹)",
      dataIndex: "amount",
      key: "amount",
    },
  ]

  const getInvoiceLines = (
    invoiceLines: {
      planitem?: string
      planitemid: number
      quantity: number
      cliniccost: number
      discount: number
      tax: number
      total: number
    }[],
  ) => {
    return invoiceLines.map((line) => {
      return {
        description: line.planitem || line.planitemid.toString(),
        quantity: line.quantity,
        unitPrice: `₹${line.cliniccost}`,
        discount: `₹${line.discount}`,
        tax: `₹${line.tax}`,
        amount: `₹${line.total}`,
      }
    })
  }

  /* Workaround to convert the image to a pdfMake supported format 
  Reference - https://github.com/bpampuch/pdfmake/blob/master/examples/images.js */
  const convertToSupportedFormat = async (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 300
        canvas.height = 100
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0, 300, 100)
          const pngDataURL = canvas.toDataURL("image/png")
          resolve(pngDataURL)
        }
      }

      img.onerror = reject
    })
  }

  const generatePDF = async (invoice: Invoice) => {
    const logoPNGDataUrl = await convertToSupportedFormat(logo.src)
    const logoContent: Content = {
      image: logoPNGDataUrl,
      alignment: "center",
      width: 150,
      margin: [0, 0, 0, 10],
    }
    const titleContent: ContentText = {
      text: "INVOICE",
      style: "title",
      alignment: "center",
    }
    const invoiceDetailsGstContentStack: Content =
      (invoice.clinicgst && [
        {
          text: "GSTIN",
          style: "headerLabel",
          margin: [0, 0, 0, 5],
        },
        {
          text: invoice.clinicgst,
          style: "entityName",
        },
      ]) ||
      []

    const invoiceDetailsContent: Content = {
      columns: [
        {
          stack: invoiceDetailsGstContentStack.concat([
            {
              text: `Invoice No`,
              style: "headerLabel",
              margin: [0, 0, 0, 5],
            },
            {
              text: `${invoice.invoiceno}`,
              style: "entityName",
            },
            {
              text: `Issue Date`,
              style: "headerLabel",
              margin: [0, 0, 0, 5],
            },
            {
              text: `${invoice.createdon}`,
              style: "entityName",
            },
          ]),
        },
      ],
      columnGap: 0,
    }

    const headerColumns: Column[] = [
      {
        stack: [
          { text: "Billed From", style: "headerLabel" },
          { text: invoice.clinicname, style: "entityName" },
          { text: invoice.clinicaddress, style: "entityAddress" },
          { text: `+91 ${invoice.cliniccontact}`, style: "entityContact" },
        ],
      },
      {
        stack: [
          { text: "Billed To", style: "headerLabel" },
          { text: invoice.username, style: "entityName" },
          { text: invoice.useraddress, style: "entityAddress" },
          { text: `+91 ${invoice.usercontact}`, style: "entityContact" },
        ],
      },
    ]

    const tableContent: Content = {
      table: {
        headerRows: 1,
        widths: ["*", "auto", "auto", "auto", "auto"],
        body: [
          [
            { text: "Description", alignment: "left" },
            { text: "Quantity", alignment: "right" },
            { text: "Unit Price", alignment: "right" },
            { text: "Discount", alignment: "right" },
            { text: "Amount", alignment: "right" },
          ],
          ...invoice.invoiceline.map((item): TableCell[] => [
            item.planitem ?? item.planitemid.toString(),
            { text: item.quantity.toString(), alignment: "right" },
            { text: `₹${item.cliniccost.toFixed(2)}`, alignment: "right" },
            { text: `₹${item.discount.toFixed(2)}`, alignment: "right" },
            { text: `₹${item.total.toFixed(2)}`, alignment: "right" },
          ]),
          [
            { text: "Total", colSpan: 4, style: "totalRow", alignment: "left" },
            {},
            {},
            {},
            {
              text: `₹${invoice.amount.toFixed(2)}`,
              style: "totalRow",
              alignment: "right",
            },
          ],
        ],
      },
      layout: "lightHorizontalLines",
    }

    const footerContent: Content = {
      text: [
        "For any questions or assistance, please contact our clinic at ",
        { text: `+91 ${invoice.cliniccontact}`, bold: true },
        " or email us at ",
        { text: "admin@drpaws.care", bold: true },
      ],
      alignment: "center",
      margin: [0, 20, 0, 0],
      style: "footer",
    }

    const documentStyles = {
      title: {
        fontSize: 24,
        bold: true,
        color: "#33495f",
        margin: [0, 0, 0, 20] as [number, number, number, number],
      },
      headerLabel: {
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 5] as [number, number, number, number],
      },
      entityName: {
        fontSize: 11,
        bold: true,
      },
      entityAddress: {
        fontSize: 10,
      },
      entityContact: {
        fontSize: 10,
      },
      entityGST: {
        fontSize: 10,
      },
      invoiceDetailsLarge: {
        fontSize: 16,
        bold: true,
        color: "#33495f",
      },
      totalRow: {
        bold: true,
        fillColor: "#f0f0f0",
      },
      footer: {
        fontSize: 10,
        color: "#666",
      },
    }

    const docDefinition: TDocumentDefinitions = {
      content: [
        logoContent,
        titleContent,
        invoiceDetailsContent,
        { columns: headerColumns, margin: [0, 20, 0, 20] },
        tableContent,
        footerContent,
      ],
      styles: documentStyles,
      defaultStyle: {
        fontSize: 10,
      },
    }

    pdfMake.createPdf(docDefinition).open()
  }

  const allInvoices =
    (invoicesResult?.ok && invoicesResult.value.body.invoices) || []

  const uniqueClinicNames = Array.from(
    new Set(allInvoices.map((invoice) => invoice.clinicname)),
  )

  const filteredInvoices = sortInvoices(filterInvoices(allInvoices))

  const isFiltering =
    filters.dateRange[0] !== null ||
    filters.dateRange[1] !== null ||
    filters.clinicName !== null ||
    filters.amountRange[0] !== null ||
    filters.amountRange[1] !== null

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl m-4 lg:m-12">Your Invoices</h1>
        </div>

        {/* Filters and Sorting Section */}
        <div className="w-full bg-gray-50 p-4 rounded-lg mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            {isFiltering && (
              <Button
                type="default"
                onClick={clearAllFilters}
                icon={<X size={16} />}
                className="text-gray-600"
              >
                Clear All Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date Range
              </label>
              <RangePicker
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={["Start date", "End date"]}
                allowClear
                className="w-full"
                value={
                  filters.dateRange[0] || filters.dateRange[1]
                    ? [
                        filters.dateRange[0]
                          ? dayjs(filters.dateRange[0])
                          : null,
                        filters.dateRange[1]
                          ? dayjs(filters.dateRange[1])
                          : null,
                      ]
                    : null
                }
              />
            </div>

            {/* Clinic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinic
              </label>
              <Select
                allowClear
                placeholder="Select clinic"
                onChange={handleClinicFilterChange}
                className="w-full"
                value={filters.clinicName}
              >
                {uniqueClinicNames.map((clinic) => (
                  <Option key={clinic} value={clinic}>
                    {clinic}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Range (₹)
              </label>
              <Space className="w-full">
                <InputNumber
                  placeholder="Min"
                  onChange={handleAmountMinChange}
                  min={0}
                  className="w-full"
                  value={filters.amountRange[0]}
                />
                <span>-</span>
                <InputNumber
                  placeholder="Max"
                  onChange={handleAmountMaxChange}
                  min={filters.amountRange[0] || 0}
                  className="w-full"
                  value={filters.amountRange[1]}
                />
              </Space>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <Select
                defaultValue="createdon-desc"
                onChange={handleSortChange}
                className="w-full"
                value={`${sortConfig.field}-${sortConfig.order}`}
              >
                <Option value="createdon-desc">Date (Newest First)</Option>
                <Option value="createdon-asc">Date (Oldest First)</Option>
                <Option value="invoiceno-desc">Invoice # (High to Low)</Option>
                <Option value="invoiceno-asc">Invoice # (Low to High)</Option>
                <Option value="amount-desc">Amount (High to Low)</Option>
                <Option value="amount-asc">Amount (Low to High)</Option>
                <Option value="clinicname-asc">Clinic Name (A-Z)</Option>
                <Option value="clinicname-desc">Clinic Name (Z-A)</Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:w-full items-center">
          {loadingInvoices && <ClipLoader color="#33495f" />}
          {!loadingInvoices && invoicesResult !== null && (
            <div className="w-full text-center">
              {filteredInvoices.length === 0 && (
                <div className="py-8">
                  <h3 className="text-xl mb-2">No invoices found</h3>
                  {isFiltering && (
                    <p className="text-gray-500">
                      Try adjusting your filters or{" "}
                      <button
                        onClick={clearAllFilters}
                        className="text-blue-500 underline"
                      >
                        clear all filters
                      </button>
                    </p>
                  )}
                </div>
              )}
              {filteredInvoices.length > 0 && (
                <>
                  <div className="mb-4 text-left text-sm text-gray-500">
                    Showing{" "}
                    {Math.min(
                      pageSize,
                      filteredInvoices.length - (currentPage - 1) * pageSize,
                    )}{" "}
                    of {filteredInvoices.length} invoices
                  </div>

                  {filteredInvoices
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((invoice) => {
                      return (
                        <Card
                          key={invoice.id}
                          className="w-full bg-primary-3 mb-4 shadow-md"
                        >
                          <div
                            onClick={() => toggleTableExpansion(invoice.id)}
                            className="w-full flex flex-wrap justify-between items-center cursor-pointer"
                          >
                            <Card.Grid
                              hoverable={false}
                              style={{
                                ...gridStyle,
                                backgroundColor: "#fdc776",
                              }}
                              className="flex-1 md:w-1/4 p-2 bg-primary-2 text-center"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <p style={{ fontSize: "small" }}>Invoice No</p>
                                <p style={{ fontSize: "large" }}>
                                  {invoice.invoiceno}
                                </p>
                              </div>
                            </Card.Grid>
                            <Card.Grid
                              hoverable={false}
                              style={{
                                ...gridStyle,
                                backgroundColor: "#fdc776",
                              }}
                              className="flex flex-wrap justify-between items-center cursor-pointer"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <p style={{ fontSize: "small" }}>Issue Date</p>
                                <p style={{ fontSize: "large" }}>
                                  {invoice.createdon}
                                </p>
                              </div>
                            </Card.Grid>
                            <Card.Grid
                              hoverable={false}
                              style={{
                                ...gridStyle,
                                backgroundColor: "#fdc776",
                              }}
                              className="flex flex-wrap justify-between items-center cursor-pointer"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <p style={{ fontSize: "small" }}>Clinic</p>
                                <p style={{ fontSize: "large" }}>
                                  {invoice.clinicname}
                                </p>
                              </div>
                            </Card.Grid>
                            <Card.Grid
                              hoverable={false}
                              style={{
                                ...gridStyle,
                                backgroundColor: "#33495f",
                                color: "white",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5em",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <p style={{ fontSize: "small" }}>
                                    Total Amount (₹)
                                  </p>
                                  <p style={{ fontSize: "large" }}>
                                    ₹{invoice.amount}
                                  </p>
                                </div>
                                {expandedInvoiceId === invoice.id ? (
                                  <ChevronUp />
                                ) : (
                                  <ChevronDown />
                                )}
                              </div>
                            </Card.Grid>
                          </div>
                          {expandedInvoiceId === invoice.id && (
                            <>
                              <Table<LineItemTable>
                                columns={columns}
                                dataSource={getInvoiceLines(
                                  invoice.invoiceline,
                                )}
                                style={{ width: "100%" }}
                                pagination={false}
                              />
                              <Card
                                style={{
                                  width: "100%",
                                  cursor: "pointer",
                                  border: "none",
                                }}
                                onClick={() => generatePDF(invoice)}
                              >
                                <Card.Grid
                                  hoverable={false}
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "0.5em",
                                  }}
                                >
                                  <p>Download Invoice as PDF</p>
                                  <FileDown />
                                </Card.Grid>
                              </Card>
                            </>
                          )}
                        </Card>
                      )
                    })}

                  {/* Pagination Controls */}
                  <div className="flex justify-center mt-6">
                    <ul className="flex space-x-2">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-primary-3 text-gray-700 hover:bg-primary-2"
                          }`}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from(
                        {
                          length: Math.ceil(filteredInvoices.length / pageSize),
                        },
                        (_, i) => i + 1,
                      ).map((page) => (
                        <li key={page}>
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? "bg-[#33495f] text-white"
                                : "bg-primary-3 text-gray-700 hover:bg-primary-2"
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage ===
                            Math.ceil(filteredInvoices.length / pageSize)
                          }
                          className={`px-3 py-1 rounded ${
                            currentPage ===
                            Math.ceil(filteredInvoices.length / pageSize)
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-primary-3 text-gray-700 hover:bg-primary-2"
                          }`}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Invoices
