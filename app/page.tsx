import Link from "next/link"
import { Sparkles, Users, FileVideo, CreditCard, Shield, BarChart3, ArrowRight, Check, Star, Zap, Globe, Video } from "lucide-react"

const features = [
  { icon: Users, title: "Creator Discovery & AI Matching", description: "Find perfect creators with AI-powered matching. Analyze audience demographics, predict content performance, and get smart recommendations." },
  { icon: FileVideo, title: "Content Collaboration Hub", description: "Version control, real-time feedback with timestamp comments, automatic quality checks, and brand kit integration all in one place." },
  { icon: CreditCard, title: "Smart Payment System", description: "Multi-currency support, automated escrow, tax form collection, performance-based bonuses, and Stripe Connect integration." },
  { icon: Shield, title: "Compliance & Rights Management", description: "Auto-generate contracts, track usage rights, handle age verification, and manage content licensing automatically." },
  { icon: BarChart3, title: "Performance Analytics", description: "Track actual sales attribution, run content A/B tests, calculate ROI per creator, and analyze audience sentiment." },
  { icon: Video, title: "AI UGC Video Generation", description: "Generate authentic UGC-style video ads with AI. GPT-4o analysis, ElevenLabs voice synthesis, and lip-sync technology." },
]

const steps = [
  { num: "01", title: "Create Brief", description: "Define your campaign objectives, requirements, and budget" },
  { num: "02", title: "Find Creators", description: "AI matches your brief with the perfect creators from our network" },
  { num: "03", title: "Manage Content", description: "Collaborate with creators through our content hub with real-time feedback" },
  { num: "04", title: "Review & Approve", description: "AI quality checks and streamlined approval workflow" },
  { num: "05", title: "Pay Creators", description: "Automated escrow payments with Stripe Connect" },
  { num: "06", title: "Analyze Results", description: "Track performance, ROI, and optimize future campaigns" },
]

const tiers = [
  { name: "Starter", price: "€79", period: "/month", features: ["1 active campaign", "Browse creator marketplace", "Basic creator search", "Direct messaging", "Email support"], popular: false },
  { name: "Growth", price: "€199", period: "/month", features: ["10 active campaigns", "Unlimited creator searches", "AI-powered creator matching", "Advanced analytics", "Priority support", "Team management"], popular: true },
  { name: "Scale", price: "€399", period: "/month", features: ["Unlimited campaigns", "Unlimited creator searches", "AI video generation", "Dedicated account manager", "API access", "White-label option", "Custom integrations"], popular: false },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">UGC Studio</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a>
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

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">No credit card required. Free to get started. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <div key={t.name} className={`bg-card border rounded-xl p-6 relative ${t.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}`}>
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">{t.price}</span>
                  <span className="text-muted-foreground">{t.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center px-4 py-2 rounded-md text-sm font-medium ${
                  t.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border hover:bg-muted"
                }`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Leading Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Chen", role: "Marketing Director, BeautyBrand", quote: "UGC Studio cut our campaign management time by 70%. We went from managing everything in spreadsheets to having a seamless workflow." },
              { name: "Marcus Johnson", role: "CEO, CreatorAgency", quote: "The AI matching is incredible. We're finding creators that perfectly align with our clients' brands, and the quality scores save hours of review time." },
              { name: "Elena Rodriguez", role: "Brand Manager, FitTech", quote: "The escrow payment system gave our creators confidence and our finance team peace of mind. We've scaled from 10 to 200 creators effortlessly." },
            ].map((t) => (
              <div key={t.name} className="bg-card border rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Creators</h2>
            <p className="text-lg text-muted-foreground">Top-rated creators ready to bring your brand to life</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Ava Martinez", niche: "Beauty & Lifestyle", followers: "245K", rating: 4.9, avatar: "A" },
              { name: "Jordan Lee", niche: "Tech & Gaming", followers: "180K", rating: 4.8, avatar: "J" },
              { name: "Priya Sharma", niche: "Fitness & Wellness", followers: "320K", rating: 5.0, avatar: "P" },
              { name: "Marcus Chen", niche: "Food & Travel", followers: "150K", rating: 4.7, avatar: "M" },
            ].map((c) => (
              <div key={c.name} className="bg-card border rounded-xl p-5 text-center hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
                  {c.avatar}
                </div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{c.niche}</p>
                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {c.rating}</span>
                  <span>{c.followers} followers</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
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
          <p className="text-lg opacity-90 mb-8">Join 500+ brands already using UGC Studio to scale their content production.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-white text-primary font-medium hover:bg-gray-100 text-lg">
            Start Your Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-bold">UGC Studio</span>
              </div>
              <p className="text-sm text-muted-foreground">The end-to-end UGC production platform.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UGC Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
