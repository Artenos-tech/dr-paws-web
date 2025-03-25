"use client"

import { Card, Table } from "antd"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { useEffect } from "react"
import { ClipLoader } from "react-spinners"
import { FileDown } from "lucide-react"
import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import {
  Column,
  Content,
  ContentText,
  TDocumentDefinitions,
  TableCell,
} from "pdfmake/interfaces"
pdfMake.vfs = pdfFonts.vfs

const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
  color: "white",
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
  const {
    call: getAllInvoices,
    result: invoicesResult,
    loading: loadingInvoices,
  } = useAPICall(api.getInvoices)

  useEffect(() => {
    getAllInvoices({})
  }, [])

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

  const generatePDF = (invoice: Invoice) => {
    const titleContent: ContentText = {
      text: "INVOICE",
      style: "title",
      alignment: "center",
    }

    const invoiceDetailsContent: Content = {
      columns: [
        {
          stack: [
            {
              text: `Invoice No`,
              style: "headerLabel",
              margin: [0, 0, 0, 5],
            },
            {
              text: `${invoice.invoiceno}`,
              style: "entityName",
            },
          ],
        },
        {
          stack: [
            {
              text: `Date`,
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
            { text: "Total", colSpan: 3, style: "totalRow" },
            {},
            {},
            {
              text: `₹${invoice.invoiceline.reduce((sum, item) => sum + item.discount, 0).toFixed(2)}`,
              style: "totalRow",
              alignment: "right",
            },
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
        ".",
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
                        <div
                          className="bg-primary-3 w-full flex flex-col gap-8 justify-center items-center p-8 rounded-lg"
                          key={invoice.id}
                        >
                          <Card style={{ width: "100%" }}>
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
                            </Card.Grid>
                            <Table<LineItemTable>
                              columns={columns}
                              dataSource={getInvoiceLines(invoice.invoiceline)}
                              style={{ width: "100%" }}
                              pagination={false}
                            />
                            <Card
                              style={{ width: "100%" }}
                              onClick={() => generatePDF(invoice)}
                            >
                              <Card.Grid
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "1em",
                                }}
                              >
                                <p>Download Invoice as PDF</p>
                                <FileDown />
                              </Card.Grid>
                            </Card>
                          </Card>
                        </div>
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
