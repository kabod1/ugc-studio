import Link from "next/link"
import { MapPin, Briefcase, ArrowRight, Heart, Zap, Globe, Coffee } from "lucide-react"
import { LogoHorizontal } from "@/components/shared/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Careers - UGC Studio",
  description: "Join the UGC Studio team. We're building the future of creator-brand collaboration.",
}

const perks = [
  { icon: Globe, title: "Remote-First", description: "Work from anywhere in Europe. We're a distributed team that values output over hours." },
  { icon: Zap, title: "Ship Fast", description: "Small team, big impact. You'll ship features that reach thousands of users in your first week." },
  { icon: Heart, title: "Equity & Fair Pay", description: "Competitive salary, meaningful equity, and transparent compensation bands." },
  { icon: Coffee, title: "Flexible Hours", description: "We care about results, not when you start your day. Async communication by default." },
]

const openings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (Europe)",
    type: "Full-time",
    description: "Build and scale our Next.js/Supabase platform. You'll work across the stack — from real-time messaging to AI integrations and payment systems.",
  },
  {
    title: "Product Designer",
    department: "Product",
    location: "Remote (Europe)",
    type: "Full-time",
    description: "Design intuitive workflows for brands and creators. From campaign creation flows to analytics dashboards, you'll shape how people work with UGC.",
  },
  {
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote (Europe)",
    type: "Full-time",
    description: "Own our acquisition funnel. You'll run experiments across paid, organic, and partnership channels to grow our brand and creator communities.",
  },
  {
    title: "Creator Success Lead",
    department: "Operations",
    location: "Remote (Europe)",
    type: "Full-time",
    description: "Be the voice of our creator community. Onboard new creators, resolve issues, and build processes that help creators succeed on our platform.",
  },
  {
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote (Europe)",
    type: "Full-time",
    description: "Improve our creator matching, quality scoring, and content analysis systems. You'll work with GPT-4o, embeddings, and custom ML models.",
  },
]

export default function CareersPage() {
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
            Build the future of <span className="text-primary">creator economies</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're a small, ambitious team making UGC production seamless for brands and rewarding for creators.
            Join us and help shape how the creator economy works.
          </p>
          <a href="#openings" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
            View Open Roles <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((p) => (
              <div key={p.title} className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Open Positions</h2>
          <p className="text-center text-muted-foreground mb-12">
            {openings.length} roles open across engineering, product, marketing, and operations.
          </p>
          <div className="space-y-4">
            {openings.map((job) => (
              <div key={job.title} className="bg-card border rounded-xl p-6 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 mb-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5" /> {job.department}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={`mailto:support@townshub.com?subject=Application: ${job.title}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for exceptional people. Send us your CV and tell us what you'd bring to the team.
          </p>
          <a
            href="mailto:support@townshub.com?subject=General Application"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border font-medium hover:bg-muted"
          >
            Send General Application <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Townshub Limited. All rights reserved.</p>
          <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
        </div>
      </footer>
    </div>
  )
}
