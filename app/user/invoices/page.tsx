"use client"

import type React from "react"

import { DatePicker, Button, Select, InputNumber } from "antd"
import { X } from "lucide-react"
import dayjs from "dayjs"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import InvoiceCard from "@/components/ui/InvoiceCard"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const { Option } = Select
const { RangePicker } = DatePicker

interface Invoice {
  id: string
  invoiceId: string
  date: string // ISO string
  billAmount: number
  totalTaxAmount: number
  status: "NO_BILL" | "OVERPAID" | "PARTIALLY_PAID" | "PAID" | "UNPAID"
  billingLineItems: {
    amount: number
    name: string
    taxes: {
      taxName: string
      taxAmount: number
      taxPercentage: number
      companyTaxId: string
    }[]
  }[]
}

type SortField = "date" | "invoiceId" | "billAmount"

interface FilterState {
  dateRange: [Date | null, Date | null]
  clinicName: string | null
  amountRange: [number | null, number | null]
}

type SortOrder = "asc" | "desc"

const Invoices = () => {
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
    field: "date",
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

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
  ) => {
    const startDate = dates?.[0]?.toDate() || null
    const endDate = dates?.[1] ? dates[1].endOf("day").toDate() : null

    setFilters((prev) => ({
      ...prev,
      dateRange: [startDate, endDate],
    }))
    setCurrentPage(1)
  }

  const handleAmountMinChange = (value: number | null) => {
    setFilters((prev) => ({
      ...prev,
      amountRange: [value, prev.amountRange[1]],
    }))
    setCurrentPage(1)
  }

  const handleAmountMaxChange = (value: number | null) => {
    setFilters((prev) => ({
      ...prev,
      amountRange: [prev.amountRange[0], value],
    }))
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

  const parseCustomDateString = (dateStr: string): dayjs.Dayjs | null => {
    const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1")
    return dayjs(cleaned, "D MMM YY", true)
  }

  const filterInvoices = (invoices: Invoice[]) => {
    return invoices.filter((invoice) => {
      if (filters.dateRange[0] || filters.dateRange[1]) {
        const invoiceDate = parseCustomDateString(invoice.date)
        if (!invoiceDate?.isValid()) return false

        const afterStartDate = filters.dateRange[0]
          ? invoiceDate.isSameOrAfter(dayjs(filters.dateRange[0]), "day")
          : true

        const beforeEndDate = filters.dateRange[1]
          ? invoiceDate.isSameOrBefore(dayjs(filters.dateRange[1]), "day")
          : true

        if (!(afterStartDate && beforeEndDate)) {
          return false
        }
      }

      if (
        filters.amountRange[0] !== null &&
        invoice.billAmount < filters.amountRange[0]!
      ) {
        return false
      }

      if (
        filters.amountRange[1] !== null &&
        invoice.billAmount > filters.amountRange[1]!
      ) {
        return false
      }

      return true
    })
  }

  const sortInvoices = (invoices: Invoice[]) => {
    return [...invoices].sort((a, b) => {
      switch (sortConfig.field) {
        case "date": {
          const dateA = parseCustomDateString(a.date)?.valueOf() || 0
          const dateB = parseCustomDateString(b.date)?.valueOf() || 0
          return sortConfig.order === "asc" ? dateA - dateB : dateB - dateA
        }
        case "invoiceId": {
          const idA = parseInt(a.invoiceId, 10)
          const idB = parseInt(b.invoiceId, 10)
          return sortConfig.order === "asc" ? idA - idB : idB - idA
        }
        case "billAmount":
          return sortConfig.order === "asc"
            ? a.billAmount - b.billAmount
            : b.billAmount - a.billAmount
        default:
          return 0
      }
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const allInvoices =
    (invoicesResult?.ok && invoicesResult.value.body.invoices) || []

  const filteredInvoices = sortInvoices(filterInvoices(allInvoices))
  const totalFiltered = filteredInvoices.length
  const totalPages = Math.ceil(totalFiltered / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = currentPage * pageSize
  const paginatedInvoices = filteredInvoices.slice(startIdx, endIdx)

  const isFiltering =
    filters.dateRange.some((d) => d !== null) ||
    filters.amountRange.some((v) => v !== null)

  useEffect(() => {
    const maxPages = Math.ceil(filteredInvoices.length / pageSize)
    if (currentPage > maxPages) setCurrentPage(1)
  }, [filteredInvoices.length])

  useEffect(() => {
    if (totalFiltered > 0 && currentPage > 1)
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
  }, [currentPage, totalFiltered])

  return (
    <div className="flex flex-col w-full h-full items-center font-roca pb-8 md:pb-12 lg:pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-7xl mx-auto">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6"></div>
        {/* Filters and Sorting Section */}
        <div className="w-full bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
            {/* Date Range Filter */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Issue Date Range
              </label>
              <RangePicker
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={["Start date", "End date"]}
                allowClear
                className="w-full text-xs md:text-sm"
                value={
                  filters.dateRange[0] || filters.dateRange[1]
                    ? [
                        filters.dateRange[0]
                          ? dayjs(filters.dateRange[0])
                          : undefined,
                        filters.dateRange[1]
                          ? dayjs(filters.dateRange[1])
                          : undefined,
                      ]
                    : undefined
                }
              />
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Amount Range (₹)
              </label>
              <div className="flex gap-2 w-full">
                <InputNumber
                  placeholder="Min"
                  onChange={handleAmountMinChange}
                  min={0}
                  className="w-full text-xs md:text-sm"
                  value={filters.amountRange[0]}
                />
                <span className="text-xs md:text-sm mt-2">-</span>
                <InputNumber
                  placeholder="Max"
                  onChange={handleAmountMaxChange}
                  min={filters.amountRange[0] || 0}
                  className="w-full text-xs md:text-sm"
                  value={filters.amountRange[1]}
                />
              </div>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <Select
                defaultValue="date-desc"
                onChange={handleSortChange}
                className="w-full text-xs md:text-sm"
                value={`${sortConfig.field}-${sortConfig.order}`}
              >
                <Option value="date-desc">Date (Newest First)</Option>
                <Option value="date-asc">Date (Oldest First)</Option>
                <Option value="invoiceId-desc">Invoice # (High to Low)</Option>
                <Option value="invoiceId-asc">Invoice # (Low to High)</Option>
                <Option value="billAmount-desc">Amount (High to Low)</Option>
                <Option value="billAmount-asc">Amount (Low to High)</Option>
              </Select>
            </div>

            {/* Clear All Filters Button */}
            {isFiltering && (
              <div className="flex justify-end w-full">
                <Button
                  type="default"
                  onClick={clearAllFilters}
                  icon={<X size={4} className="md:size-4" />}
                  className="text-gray-600 text-sm md:text-base w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 w-full items-center">
          {loadingInvoices && <ClipLoader color="#33495f" />}
          {!loadingInvoices && invoicesResult !== null && (
            <div className="w-full text-center">
              {filteredInvoices.length === 0 && (
                <div className="py-6 md:py-8">
                  <h3 className="text-lg md:text-xl mb-2">No invoices found</h3>
                  {isFiltering && (
                    <p className="text-sm text-gray-500">
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
                  <div className="mb-3 md:mb-4 text-left text-xs md:text-sm text-gray-500">
                    Showing{" "}
                    {Math.min(
                      pageSize,
                      filteredInvoices.length - (currentPage - 1) * pageSize,
                    )}{" "}
                    of {filteredInvoices.length} invoice
                    {filteredInvoices.length !== 1 ? "s" : ""}
                  </div>
                  {paginatedInvoices.map((invoice) => (
                    <InvoiceCard
                      key={invoice.id}
                      invoiceId={invoice.id}
                      invoiceNo={invoice.invoiceId}
                      date={invoice.date}
                      billAmount={invoice.billAmount}
                      totalTaxAmount={invoice.totalTaxAmount}
                      status={invoice.status}
                      billingLineItems={invoice.billingLineItems}
                    />
                  ))}
                  {/* Pagination Controls */}
                  <div className="flex justify-center mt-4 md:mt-6">
                    <ul className="flex flex-wrap gap-1 md:gap-2 justify-center">
                      <li>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm rounded ${
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
                            className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm rounded ${
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
                          disabled={currentPage === totalPages}
                          className={`px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm rounded ${
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
