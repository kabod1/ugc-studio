import Link from "next/link"
import {
  Users, FileVideo, CreditCard, Shield, BarChart3, ArrowRight,
  Zap, Globe, Video, Lock, CheckCircle2, Bell, RefreshCw,
  BadgeCheck, Clock, HeartHandshake, Star
} from "lucide-react"
import { PricingSection } from "@/components/landing/pricing-section"
import { FeaturedCreators } from "@/components/landing/featured-creators"
import { CreatorTestimonials } from "@/components/landing/creator-testimonials"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"

const features = [
  { icon: Users, title: "Creator Discovery & AI Matching", description: "Find the perfect creators with GPT-4o powered matching. Filter by category, platform, location, and ratings, then let AI score and rank creators for each campaign." },
  { icon: FileVideo, title: "Content Collaboration Hub", description: "Version-tracked submissions, real-time feedback with timestamp comments, AI-powered quality scoring, and brand guidelines management in one place." },
  { icon: CreditCard, title: "Protected Escrow Payments", description: "Funds are held securely in escrow and released automatically the moment a brand approves your content. No chasing invoices, no delays, no disputes." },
  { icon: Shield, title: "Compliance & Rights Management", description: "Auto-generate contracts on application approval, track usage rights with territories and duration, and manage age verification for creators." },
  { icon: BarChart3, title: "Performance Analytics", description: "Track campaign spend over time, monitor content approval rates, view monthly trends with interactive charts, and measure ROI across creators." },
  { icon: Video, title: "AI UGC Video Generation", description: "Generate authentic UGC-style video ads with AI. GPT-4o analysis, ElevenLabs voice synthesis, and WaveSpeed lip-sync technology." },
]

const steps = [
  { num: "01", title: "Create Brief", description: "Define your campaign objectives, requirements, and budget" },
  { num: "02", title: "Find Creators", description: "AI matches your brief with the perfect creators from our network" },
  { num: "03", title: "Manage Content", description: "Collaborate with creators through our content hub with real-time feedback" },
  { num: "04", title: "Review & Approve", description: "AI quality checks and streamlined approval workflow" },
  { num: "05", title: "Auto-Release Payment", description: "Escrow releases automatically to the creator the instant you approve" },
  { num: "06", title: "Analyze Results", description: "Track performance, ROI, and optimize future campaigns" },
]

const trustFeatures = [
  {
    icon: Lock,
    title: "Funds held in escrow",
    who: "For Brands",
    color: "bg-blue-50 text-blue-600",
    description: "Your payment is locked safely in escrow the moment you pay. It only moves when you approve the content. You are never charged for work you didn't receive.",
  },
  {
    icon: Bell,
    title: "Instant payment notifications",
    who: "For Creators",
    color: "bg-green-50 text-green-600",
    description: "The moment a brand pays, you receive an instant notification. No guessing, no chasing. You know exactly when money is waiting for you in escrow.",
  },
  {
    icon: RefreshCw,
    title: "Automatic payout on approval",
    who: "For Creators",
    color: "bg-purple-50 text-purple-600",
    description: "When a brand approves your content, your payment is released automatically to your bank via Stripe. No forms, no waiting, no middleman delays.",
  },
  {
    icon: BadgeCheck,
    title: "Content approved = money sent",
    who: "For Brands",
    color: "bg-orange-50 text-orange-600",
    description: "Approve content with one click and the payment transfers in seconds. Your brand gets the content, the creator gets paid. Clean, fast, transparent.",
  },
  {
    icon: HeartHandshake,
    title: "Dispute protection built in",
    who: "For Everyone",
    color: "bg-rose-50 text-rose-600",
    description: "If content doesn't meet your brief, request revisions before approving. Escrow only releases when both sides are satisfied — protecting brands and creators equally.",
  },
  {
    icon: Clock,
    title: "No more late payments",
    who: "For Creators",
    color: "bg-amber-50 text-amber-600",
    description: "63% of freelancers experience late payments. On UGC Studio, that's impossible. The money is already there before you start filming — escrow guarantees it.",
  },
]

const brandQuotes = [
  {
    quote: "I used to spend hours chasing creators for invoices. Now the payment just happens automatically when I click approve. It's removed so much friction.",
    name: "Sarah M.",
    role: "Brand Manager, Beauty Brand",
    avatar: "S",
    rating: 5,
  },
  {
    quote: "As a creator, I was always worried about getting paid. Seeing that notification 'payment received in escrow' before I even start filming changed everything.",
    name: "James O.",
    role: "UGC Creator, Lagos",
    avatar: "J",
    rating: 5,
  },
  {
    quote: "The escrow system means I trust the brands I work with on here, even if I've never worked with them before. The platform holds everyone accountable.",
    name: "Priya K.",
    role: "UGC Creator, London",
    avatar: "P",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/">
            <LogoHorizontal />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a>
            <a href="#trust" className="text-sm text-muted-foreground hover:text-foreground">Payment Protection</a>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-primary">Log In</Link>
            <Link href="/signup" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            The #1 UGC Production Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Manage Your Entire UGC Workflow,{" "}
            <span className="text-primary">Brief to Payment</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The end-to-end platform for brands and agencies to discover creators,
            manage content production, handle compliance, and automate payments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 text-lg">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-8 py-3 rounded-md border font-medium hover:bg-muted text-lg">
              See How It Works
            </a>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> 500+ Brands</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4" /> 10,000+ Creators</span>
            <span className="flex items-center gap-2"><FileVideo className="h-4 w-4" /> 50,000+ Content Pieces</span>
          </div>
        </div>
      </section>

      {/* Trust banner strip */}
      <div className="bg-primary text-primary-foreground py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Escrow-protected payments</span>
          <span className="text-primary-foreground/40">·</span>
          <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Auto-release on content approval</span>
          <span className="text-primary-foreground/40">·</span>
          <span className="flex items-center gap-2"><Bell className="h-4 w-4" /> Real-time payment notifications</span>
          <span className="text-primary-foreground/40">·</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Powered by Stripe</span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Scale UGC</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Replace spreadsheets, email chains, and scattered tools with one powerful platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">From brief to results in 6 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="relative">
                <span className="text-5xl font-bold text-primary/10">{s.num}</span>
                <h3 className="font-semibold text-lg mt-2 mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Protection Section */}
      <section id="trust" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
              <Shield className="h-3.5 w-3.5" />
              Payment Protection
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Brands pay on time. Creators always get paid.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We built UGC Studio on one principle: money should never be the reason a collaboration fails.
              Our escrow system protects both sides, automatically.
            </p>
          </div>

          {/* How the money flows */}
          <div className="mt-14 mb-16 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-0">
              {[
                { step: "1", label: "Brand pays", sub: "Funds held securely in escrow", icon: CreditCard, color: "bg-blue-600" },
                { step: "2", label: "Creator films", sub: "Content submitted for review", icon: Video, color: "bg-purple-600" },
                { step: "3", label: "Brand approves", sub: "One click approval", icon: CheckCircle2, color: "bg-orange-500" },
                { step: "4", label: "Auto-paid", sub: "Stripe transfer in seconds", icon: Zap, color: "bg-green-600" },
              ].map((item, i, arr) => (
                <div key={item.step} className="flex flex-col sm:flex-row items-center flex-1 w-full">
                  <div className="flex flex-col items-center text-center px-4 py-4 flex-1">
                    <div className={`h-12 w-12 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 rotate-90 sm:rotate-0 my-1 sm:my-0" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-800 font-medium">
                ✅ No manual transfers. No chasing emails. Payment is automatic the moment content is approved.
              </p>
            </div>
          </div>

          {/* Trust cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustFeatures.map((f) => (
              <div key={f.title} className="bg-card border rounded-xl p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${f.color} bg-opacity-10`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{f.who}</span>
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Stat bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border rounded-2xl p-8 bg-muted/30">
            {[
              { value: "100%", label: "Payments secured by escrow" },
              { value: "<5s", label: "Average payout time after approval" },
              { value: "€0", label: "Fees for creators to receive payment" },
              { value: "15%", label: "Platform fee, taken at checkout only" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human trust quotes */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Real people. Real results.</h2>
            <p className="text-muted-foreground">What brands and creators say about getting paid on UGC Studio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandQuotes.map((q) => (
              <div key={q.name} className="bg-card border rounded-xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: q.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{q.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                    {q.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      <CreatorTestimonials />

      {/* Featured Creators */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Creators</h2>
            <p className="text-lg text-muted-foreground">Top-rated creators from around the world, ready to bring your brand to life</p>
          </div>
          <FeaturedCreators />
          <div className="text-center mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Browse all creators <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Transform Your UGC Workflow?</h2>
          <p className="text-lg opacity-90 mb-2">Join 500+ brands already using UGC Studio to scale their content production.</p>
          <p className="text-sm opacity-70 mb-8">Every payment protected. Every creator paid on time. Every time.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-white text-primary font-medium hover:bg-gray-100 text-lg">
            Start Your Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs opacity-60 mt-4">No credit card required · Cancel any time · Escrow protection from day one</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <LogoHorizontal />
              </div>
              <p className="text-sm text-muted-foreground">The end-to-end UGC production platform.</p>
              <div className="flex items-center gap-2 mt-3">
                <Lock className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Escrow-protected payments</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#trust" className="hover:text-foreground">Payment Protection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-foreground">Cookie Policy</Link></li>
                <li><ManageCookiesButton /></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Townshub Limited. All rights reserved.</p>
            <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
