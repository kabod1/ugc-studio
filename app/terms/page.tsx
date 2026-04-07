import type { Metadata } from "next"
import { TermsContent } from "./terms-content"

export const metadata: Metadata = {
  title: "Terms of Service - Townshub",
  description: "Townshub terms of service. Rules and guidelines for using our platform.",
}

export default function TermsPage() {
  return <TermsContent />
}
