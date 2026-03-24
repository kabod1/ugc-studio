import Link from "next/link"
import { Users, Globe, Zap, Heart, ArrowRight } from "lucide-react"
import { LogoHorizontal } from "@/components/shared/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - UGC Studio",
  description: "Learn about UGC Studio, the end-to-end platform connecting brands with creators.",
}

const values = [
  { icon: Heart, title: "Creator-First", description: "We believe creators deserve fair pay, transparent terms, and tools that respect their craft. Every feature we build starts with creators in mind." },
  { icon: Zap, title: "Radical Simplicity", description: "UGC shouldn't require a 50-tab spreadsheet. We automate the tedious parts so you can focus on what matters — great content." },
  { icon: Globe, title: "Global by Default", description: "Our platform supports creators and brands across Europe and beyond, with EUR payments, multilingual search, and location-aware matching." },
  { icon: Users, title: "Trust & Transparency", description: "Escrow payments, clear contracts, and AI-powered quality checks build trust between brands and creators on every campaign." },
]

const stats = [
  { value: "500+", label: "Brands" },
  { value: "10,000+", label: "Creators" },
  { value: "50,000+", label: "Content Pieces Delivered" },
  { value: "€2M+", label: "Paid to Creators" },
]

const team = [
  { name: "Nnamdi Chukwunwike", role: "Founder & CEO", bio: "Also the CEO at Townshub Limited. Growth lead at a top European marketplace. Obsessed with making creator economies work at scale." },
  { name: "Sophie L.", role: "Head of Product", bio: "Ex-product designer at a leading SaaS company. Turns complex workflows into intuitive interfaces." },
  { name: "Kai M.", role: "Head of Engineering", bio: "Full-stack engineer with a passion for AI/ML. Built systems processing millions of transactions." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/"><LogoHorizontal /></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-primary">Log In</Link>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Making UGC work for <span className="text-primary">everyone</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            UGC Studio is the end-to-end platform that connects brands with talented creators,
            streamlines content production, and ensures fair, transparent collaboration at every step.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              UGC Studio was born from a simple frustration: managing user-generated content campaigns
              was a mess of spreadsheets, emails, and missed deadlines. Brands struggled to find the
              right creators, creators fought for fair pay, and everyone wasted time on admin instead
              of creating.
            </p>
            <p>
              We set out to build a platform that handles the entire UGC workflow — from discovering
              and matching creators using AI, through content collaboration and approval, all the way
              to secure escrow payments via Stripe Connect.
            </p>
            <p>
              Today, UGC Studio powers campaigns for hundreds of brands across Europe, helping them
              produce authentic content at scale while ensuring creators are paid fairly and on time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t) => (
              <div key={t.name} className="bg-card border rounded-xl p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-4">
                  {t.name.charAt(0)}
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{t.role}</p>
                <p className="text-sm text-muted-foreground">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us on the Journey</h2>
          <p className="text-muted-foreground mb-8">
            Whether you're a brand looking to scale content production or a creator ready to land your next deal,
            UGC Studio is built for you.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/careers" className="inline-flex items-center gap-2 px-6 py-3 rounded-md border font-medium hover:bg-muted">
              We're Hiring
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UGC Studio. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
        </div>
      </footer>
    </div>
  )
}
