"use client"

import { Card, Table } from "antd"
import { useAPICall } from "@/hooks/apicall"
import api from "@/services/api"
import { useEffect } from "react"
import { ClipLoader } from "react-spinners"
import { FileDown } from "lucide-react"
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
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
  unitPrice: number
  discount: number
  amount: number
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
      title: "Unit Price(INR)",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Amount (INR)",
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
        unitPrice: line.cliniccost,
        discount: line.discount,
        amount: line.total,
      }
    })
  }

  const generatePDF = (invoice: Invoice) => {
    const docDefinition = {
      content: [
        {
          text: `Invoice No: ${invoice.invoiceno}`,
          style: 'header',
        },
        {
          text: `Issue Date: ${invoice.createdon}`,
          style: 'subHeader',
        },
        {
          text: `Clinic: ${invoice.clinicname}`,
          style: 'subHeader',
        },
        {
          text: `Total Amount: $${invoice.amount.toFixed(2)}`,
          style: 'subHeader',
        },
        {
          text: '\n',
        },
        {
          table: {
            headerRows: 1,
            body: [
              ['Description', 'Quantity', 'Unit Price', 'Discount', 'Amount'],
              ...invoice.invoiceline.map((item) => [
                item.planitem ?? item.planitemid.toString(),
                item.quantity.toString(),
                item.cliniccost.toFixed(2),
                item.discount.toFixed(2),
                item.total.toFixed(2),
              ]),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          marginBottom: 10,
        },
        subHeader: {
          fontSize: 14,
          marginBottom: 5,
        },
      },
    };
    pdfMake.createPdf(docDefinition).open();
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
                                  Total Amount (INR)
                                </p>
                                <p style={{ fontSize: "large" }}>
                                  Rs. {invoice.amount}
                                </p>
                              </div>
                            </Card.Grid>
                            <Table<LineItemTable>
                              columns={columns}
                              dataSource={getInvoiceLines(invoice.invoiceline)}
                              style={{ width: "100%" }}
                              pagination={false}
                            />
                            <Card style={{width: "100%"}} onClick={() => generatePDF(invoice)}>
                              <Card.Grid style={{width: "100%", display: "flex", justifyContent: "center", gap: "1em"}}>
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
