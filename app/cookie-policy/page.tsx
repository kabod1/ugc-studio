import type { Metadata } from "next"
import { CookiePolicyContent } from "./cookie-policy-content"

export const metadata: Metadata = {
  title: "Cookie Policy - Townshub",
  description: "How Townshub uses cookies and similar technologies on our platform.",
}

export default function CookiePolicyPage() {
  return <CookiePolicyContent />
}
