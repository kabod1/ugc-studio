"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users, FileVideo, CreditCard, Shield, BarChart3, ArrowRight,
  Zap, Globe, Video, Lock, CheckCircle2, Bell, RefreshCw,
  BadgeCheck, Clock, HeartHandshake, Star, Play, TrendingUp,
  Sparkles, ChevronRight, Menu, X
} from "lucide-react"
import { PricingSection } from "@/components/landing/pricing-section"
import { CreatorTestimonials } from "@/components/landing/creator-testimonials"
import { LogoHorizontal } from "@/components/shared/logo"
import { ManageCookiesButton } from "@/components/shared/manage-cookies-button"

const features = [
  {
    icon: Users,
    title: "AI Creator Matching",
    description: "GPT-4o powered matching finds the perfect creators for every campaign. Filter by category, platform, location, and ratings.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileVideo,
    title: "Content Hub",
    description: "Version-tracked submissions, real-time feedback, AI quality scoring, and brand guidelines management in one place.",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: CreditCard,
    title: "Escrow Payments",
    description: "Funds held securely and released automatically the moment a brand approves content. No invoices, no delays.",
    color: "from-green-500 to-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Contracts & Compliance",
    description: "Auto-generate contracts on approval, track usage rights, manage territories and age verification seamlessly.",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track campaign spend, monitor approval rates, view monthly trends with interactive charts, and measure ROI.",
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Video,
    title: "AI Video Generation",
    description: "Generate authentic UGC-style video ads with AI. GPT-4o analysis, ElevenLabs voice, and WaveSpeed lip-sync.",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
  },
]

const steps = [
  { num: "01", title: "Create Brief", description: "Define campaign objectives, requirements, and budget in minutes" },
  { num: "02", title: "Find Creators", description: "AI matches your brief with the perfect creators from our network" },
  { num: "03", title: "Manage Content", description: "Collaborate through our hub with real-time feedback and version control" },
  { num: "04", title: "Review & Approve", description: "AI quality checks and streamlined one-click approval workflow" },
  { num: "05", title: "Auto-Release Payment", description: "Escrow releases instantly to the creator the moment you approve" },
  { num: "06", title: "Analyze Results", description: "Track performance, ROI, and optimize future campaigns with data" },
]

const trustFeatures = [
  {
    icon: Lock,
    title: "Funds held in escrow",
    who: "For Brands",
    color: "text-blue-600",
    bg: "bg-blue-50",
    description: "Your payment is locked safely in escrow the moment you pay. It only moves when you approve the content. Never charged for work you didn't receive.",
  },
  {
    icon: Bell,
    title: "Instant payment notifications",
    who: "For Creators",
    color: "text-green-600",
    bg: "bg-green-50",
    description: "The moment a brand pays, you receive an instant notification. No guessing, no chasing. You know exactly when money is waiting in escrow.",
  },
  {
    icon: RefreshCw,
    title: "Automatic payout on approval",
    who: "For Creators",
    color: "text-purple-600",
    bg: "bg-purple-50",
    description: "When a brand approves your content, payment releases automatically to your bank via Stripe. No forms, no waiting, no middleman.",
  },
  {
    icon: BadgeCheck,
    title: "Content approved = money sent",
    who: "For Brands",
    color: "text-orange-600",
    bg: "bg-orange-50",
    description: "Approve content with one click and payment transfers in seconds. Your brand gets the content, the creator gets paid. Clean, fast, transparent.",
  },
  {
    icon: HeartHandshake,
    title: "Dispute protection built in",
    who: "For Everyone",
    color: "text-rose-600",
    bg: "bg-rose-50",
    description: "If content doesn't meet your brief, request revisions before approving. Escrow only releases when both sides are satisfied.",
  },
  {
    icon: Clock,
    title: "No more late payments",
    who: "For Creators",
    color: "text-amber-600",
    bg: "bg-amber-50",
    description: "Late payments are one of the biggest problems freelancers face. On UGC Studio, that's impossible. The money is already held in escrow before you start filming.",
  },
]

const brandQuotes = [
  {
    quote: "I used to spend hours chasing creators for invoices. Now payment just happens automatically when I click approve. It's removed so much friction from our workflow.",
    name: "Sarah M.",
    role: "Brand Manager, Beauty Brand",
    avatar: "S",
    rating: 5,
    color: "bg-blue-600",
  },
  {
    quote: "As a creator, I was always worried about getting paid. Seeing 'payment received in escrow' before I even start filming completely changed how I work.",
    name: "James O.",
    role: "UGC Creator, Lagos",
    avatar: "J",
    rating: 5,
    color: "bg-purple-600",
  },
  {
    quote: "The escrow system means I trust the brands I work with here, even if I've never worked with them before. The platform holds everyone accountable.",
    name: "Priya K.",
    role: "UGC Creator, London",
    avatar: "P",
    rating: 5,
    color: "bg-green-600",
  },
]

const stats = [
  { value: "Global", label: "Brand reach", icon: Globe },
  { value: "AI", label: "Creator matching", icon: Users },
  { value: "Escrow", label: "Payment protection", icon: FileVideo },
  { value: "Stripe", label: "Powered payouts", icon: TrendingUp },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <LogoHorizontal />
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">How It Works</a>
            <a href="#trust" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Payment Protection</a>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</Link>
          </div>
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2">Log In</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors">
              Start Free <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {/* Mobile: CTA + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/signup" className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium">
              Start Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">How It Works</a>
            <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Payment Protection</a>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Pricing</Link>
            <div className="pt-2 border-t border-gray-100">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Log In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            GPT-4o Powered UGC Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-5 text-gray-900 leading-[1.1]">
            The UGC Platform That{" "}
            <span className="relative inline-block">
              <span className="text-primary">Pays Creators</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 9C50 3 100 1 150 3C200 5 250 8 298 9" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </span>{" "}
            Automatically
          </h1>

          <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover creators, manage UGC production, handle contracts, and
            release payments automatically — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all text-base shadow-lg shadow-gray-900/20">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-all text-base text-gray-700">
              <Play className="h-4 w-4" />
              See How It Works
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust banner */}
      <div className="bg-gray-900 text-white py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <span className="flex items-center gap-2 text-gray-300"><Lock className="h-4 w-4 text-green-400" /> Escrow-protected payments</span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-2 text-gray-300"><RefreshCw className="h-4 w-4 text-blue-400" /> Auto-release on approval</span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-2 text-gray-300"><Bell className="h-4 w-4 text-yellow-400" /> Real-time notifications</span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-2 text-gray-300"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Payments by Stripe</span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-4">
              <Zap className="h-3.5 w-3.5" />
              Everything in one place
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">Scale your UGC without the chaos</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Replace spreadsheets, email chains, and scattered tools with one powerful platform built for UGC production.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300">
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                  <f.icon className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium mb-4">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Simple process
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">From brief to results in 6 steps</h2>
            <p className="text-lg text-gray-500">The fastest path from idea to live UGC content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{s.num}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1">
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Protection */}
      <section id="trust" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold mb-4 border border-green-100">
              <Shield className="h-3.5 w-3.5" />
              Payment Protection
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              Brands pay on time.<br />Creators always get paid.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Built on one principle: money should never be the reason a collaboration fails.
            </p>
          </div>

          {/* Money flow */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <p className="text-sm font-semibold text-gray-400 text-center mb-8 uppercase tracking-wider">How the money flows</p>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                {[
                  { step: "1", label: "Brand pays", sub: "Funds held in escrow", icon: CreditCard, color: "bg-blue-600" },
                  { step: "2", label: "Creator films", sub: "Content submitted", icon: Video, color: "bg-purple-600" },
                  { step: "3", label: "Brand approves", sub: "One-click approval", icon: CheckCircle2, color: "bg-orange-500" },
                  { step: "4", label: "Auto-paid", sub: "Stripe transfer instantly", icon: Zap, color: "bg-green-600" },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex flex-col sm:flex-row items-center flex-1 w-full">
                    <div className="flex flex-col items-center text-center px-4 py-3 flex-1">
                      <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mb-3 shadow-lg`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-semibold text-sm text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-gray-300 shrink-0 rotate-90 sm:rotate-0 my-1 sm:my-0" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <p className="text-sm text-green-800 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  No manual transfers. No chasing emails. Payment is automatic the moment content is approved.
                </p>
              </div>
            </div>
          </div>

          {/* Trust cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trustFeatures.map((f) => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${f.bg}`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{f.who}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {[
              { value: "100%", label: "Payments secured by escrow", icon: Lock },
              { value: "<5s", label: "Average payout after approval", icon: Zap },
              { value: "€0", label: "Fees for creators to receive", icon: BadgeCheck },
              { value: "15%", label: "Platform fee, taken at checkout", icon: CreditCard },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-white">
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium mb-4">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              What users say
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Built for brands and creators.</h2>
            <p className="text-gray-500">Illustrative experiences from our platform. Names changed for privacy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {brandQuotes.map((q) => (
              <div key={q.name} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-all">
                <div className="flex gap-0.5">
                  {Array.from({ length: q.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{q.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <div className={`h-10 w-10 rounded-full ${q.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {q.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{q.name}</p>
                    <p className="text-xs text-gray-400">{q.role}</p>
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

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 mx-3 sm:mx-4 mb-6 sm:mb-8 bg-gray-900 rounded-2xl sm:rounded-3xl max-w-7xl lg:mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-white/20">
            <Sparkles className="h-3.5 w-3.5" />
            Join brands already scaling with UGC Studio
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
            Ready to transform your UGC workflow?
          </h2>
          <p className="text-base sm:text-lg text-gray-400 mb-2">Every payment protected. Every creator paid on time. Every time.</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-8 sm:mb-10">No credit card required · Cancel any time · Escrow protection from day one</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all text-base shadow-2xl">
            Start Your Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <LogoHorizontal />
              </div>
              <p className="text-sm text-gray-500 mb-3">The end-to-end UGC production platform for brands and creators.</p>
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Escrow-protected payments</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
                <li><a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a></li>
                <li><a href="#trust" className="hover:text-gray-900 transition-colors">Payment Protection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-gray-900 transition-colors">Cookie Policy</Link></li>
                <li><ManageCookiesButton /></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Townshub Limited. All rights reserved.</p>
            <p>Need help? <a href="mailto:support@townshub.com" className="text-primary hover:underline">support@townshub.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
