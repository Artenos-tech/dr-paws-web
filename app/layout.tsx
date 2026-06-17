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
    <AppConfigProvider>
      <UserProvider>
        <V3UserProvider>
          <html lang="en" className={`${roca.variable} ${openSans.variable}`}>
            <body
              className={`w-full min-h-screen overflow-x-hidden flex flex-col`}
            >
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
              <Script
                id="posthog"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="rn sn init kn Qr wn Cn yn capture calculateEventProperties Rn register register_once register_for_session unregister unregister_for_session Fn getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync An identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty On En createPersonProfile setInternalOrTestUser Ln gn $n opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing In debug Kr Pn getPageViewId captureTraceFeedback captureTraceMetric vn".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_BBUYXF9xmi4t6TTR4DZT7Fo3ZewHKxcqFw8hYtDveY3Y',{api_host:'https://us.i.posthog.com',defaults:'2026-05-30',person_profiles:'identified_only'})`,
                }}
              />
              <div className="flex-grow flex flex-col w-full overflow-x-hidden ">
                <NavBar />
                <div className="mt-16 flex-grow">{children}</div>
                <Footer />
              </div>
            </body>
          </html>
        </V3UserProvider>
      </UserProvider>
    </AppConfigProvider>
  )
}
