import { Metadata } from "next"
import TermsPageContent from "@/components/legal/TermsPageContent"

export const metadata: Metadata = {
  title: "Terms & Conditions | Dr. Paws",
  description:
    "Read the General Terms and Conditions and promotional marketing offer terms for Dr. Paws.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Dr. Paws",
    description:
      "General Terms & Conditions and Marketing Offer terms for Dr. Paws.",
  },
}

export default function TermsAndConditionsPage() {
  return <TermsPageContent />
}
