import type { Metadata } from "next"
import { PrivacyContent } from "./privacy-content"

export const metadata: Metadata = {
  title: "Privacy Policy - Townshub",
  description: "Townshub privacy policy. Learn how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
