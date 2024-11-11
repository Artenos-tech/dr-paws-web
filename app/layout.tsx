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
      path: "./fonts/Roca-Font/Roca Regular.ttf",
      weight: "300",
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
    <html lang="en" className={`${roca.variable} ${openSans.variable}`}>
      <body className={`w-full min-h-screen overflow-x-hidden`}>
        <div className="w-full overflow-x-hidden">
          <NavBar />
          <div className="mt-16">{children}</div>

          <Footer />
        </div>
      </body>
    </html>
  );
}
