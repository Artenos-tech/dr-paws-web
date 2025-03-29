"use client"

import { Card, Table } from "antd"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { useEffect, useState } from "react"
import { ClipLoader } from "react-spinners"
import { ChevronDown, ChevronUp, FileDown } from "lucide-react"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import {
  Column,
  Content,
  ContentText,
  TDocumentDefinitions,
  TableCell,
} from "pdfmake/interfaces"
import logo from "@/public/assets/images/logo/logo.svg"

pdfMake.vfs = pdfFonts.vfs

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
  unitPrice: string
  discount: string
  amount: string
}

const Invoices = () => {
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(
    null,
  )

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
      total: number
    }[],
  ) => {
    return invoiceLines.map((line) => {
      return {
        description: line.planitem || line.planitemid.toString(),
        quantity: line.quantity,
        unitPrice: `₹${line.cliniccost}`,
        discount: `₹${line.discount}`,
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

    const invoiceDetailsContent: Content = {
      columns: [
        {
          stack: [
            // {
            //   text: `GSTIN`,
            //   style: "headerLabel",
            //   margin: [0, 0, 0, 5],
            // },
            // {
            //   text: `27AAHCS1234C1ZV`,
            //   style: "entityName",
            // },
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
          ],
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

  const invoices =
    (invoicesResult?.ok && invoicesResult.value.body.invoices) || []

  return (
    <div className="flex flex-col w-full h-full  items-center font-roca pb-20 flex-grow">
      <main className="flex flex-col w-full items-center px-8 md:px-32 lg:px-20 xl:px-40">
        <h1 className="text-3xl m-4 lg:m-12">Your Invoices</h1>
        <div className="flex flex-col gap-6 lg:w-full items-center">
          {loadingInvoices && <ClipLoader color="#33495f" />}
          {!loadingInvoices && invoices !== null && (
            <div className="w-full text-center">
              {invoices.length === 0 && (
                <h3 className="text-xl">No invoices found</h3>
              )}
              {invoices.length > 0 && (
                <>
                  {invoices.length > 0 &&
                    invoices.map((invoice) => {
                      return (
                        <Card
                          style={{
                            width: "100%",
                            backgroundColor: "#f7f1de",
                            marginBottom: "1.5em",
                          }}
                          key={invoice.id}
                        >
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              padding: "0",
                              cursor: "pointer",
                            }}
                            onClick={() => toggleTableExpansion(invoice.id)}
                          >
                            <Card.Grid
                              hoverable={false}
                              style={{
                                ...gridStyle,
                                backgroundColor: "#fdc776",
                              }}
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
                              }}
                            >
                              <div style={{ display: "flex", gap: "0.5em", justifyContent: "center" }}>
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
                                {expandedInvoiceId === invoice.id ? (<ChevronUp />) : (<ChevronDown />)}
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
