import type { Metadata } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import NavBar from "@/components/layout/navbar"
import Footer from "@/components/layout/Footer"
import { UserProvider } from "@/context/UserContext"
import { V3UserProvider } from "@/context/V3UserContext"
import { AppConfigProvider } from "@/context/AppConfigContext"
import { PostHogProvider } from "./PostHogProvider"

// Load Open Sans from Google Fonts
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

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
})

export const metadata: Metadata = {
  title: "Dr. Paws",
  description: "The neighbourhood vet",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/custom-logo.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/custom-logo.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/custom-logo.png",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${roca.variable} ${openSans.variable}`}>
      <body className={`w-full min-h-screen overflow-x-hidden flex flex-col`}>
        <PostHogProvider>
          <AppConfigProvider>
            <UserProvider>
              <V3UserProvider>
                <Script
                  id="gtm-script"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TGCL6HKT');`,
                  }}
                />
                <noscript>
                  <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-TGCL6HKT"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                  />
                </noscript>
                <Script
                  id="meta-pixel"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1868756457218397');
fbq('track', 'PageView');`,
                  }}
                />
                <noscript>
                  <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src="https://www.facebook.com/tr?id=1868756457218397&ev=PageView&noscript=1"
                    alt=""
                  />
                </noscript>
                <div className="flex-grow flex flex-col w-full overflow-x-hidden ">
                  <NavBar />
                  <div className="mt-16 flex-grow">{children}</div>
                  <Footer />
                </div>
              </V3UserProvider>
            </UserProvider>
          </AppConfigProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
