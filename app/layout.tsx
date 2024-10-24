import type { Metadata } from "next";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";

// Load Open Sans from Google Fonts
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

// Load Roca from local font files
const roca = localFont({
  src: [
    {
      path: "./fonts/roca/RocaOne-Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/roca/RocaOne-Rg.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-roca",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr. Paws",
  description: "The neighbourhood vet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="drPaws">
      <body
        className={`${openSans.variable} ${roca.variable} font-open-sans w-full overflow-x-hidden`}
      >
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
