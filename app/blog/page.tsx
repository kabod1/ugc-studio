import Link from "next/link"
import { Sparkles, ArrowRight, Calendar, User, Clock } from "lucide-react"
import { LogoHorizontal } from "@/components/shared/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - UGC Studio",
  description: "Insights, guides, and industry news about UGC marketing and creator collaborations.",
}

const posts = [
  {
    slug: "ugc-trends-2026",
    title: "5 UGC Trends Shaping Brand Marketing in 2026",
    excerpt: "From AI-generated content to micro-creator networks, here are the trends that are transforming how brands approach user-generated content this year.",
    author: "Nnamdi O.",
    date: "Feb 12, 2026",
    readTime: "6 min read",
    category: "Industry Trends",
  },
  {
    slug: "ai-creator-matching",
    title: "How AI Matching Finds Your Perfect Creator in Seconds",
    excerpt: "Our AI matching engine scores creators against your campaign brief. Here's how it works under the hood and why it outperforms manual search.",
    author: "Kai M.",
    date: "Feb 5, 2026",
    readTime: "8 min read",
    category: "Product",
  },
  {
    slug: "escrow-payments-guide",
    title: "The Complete Guide to Escrow Payments for UGC Campaigns",
    excerpt: "Escrow payments protect both brands and creators. Learn how our Stripe Connect integration ensures secure, timely payouts on every campaign.",
    author: "Sophie L.",
    date: "Jan 28, 2026",
    readTime: "5 min read",
    category: "Guides",
  },
  {
    slug: "creator-rate-guide",
    title: "How to Set Your Rates as a UGC Creator",
    excerpt: "Pricing your content can be tricky. We analyzed thousands of campaigns to help creators understand fair market rates across niches and platforms.",
    author: "Sophie L.",
    date: "Jan 20, 2026",
    readTime: "7 min read",
    category: "For Creators",
  },
  {
    slug: "content-quality-scoring",
    title: "Inside Our AI Quality Scoring System",
    excerpt: "We use AI to analyze content quality before brands even review it. Here's how our scoring system works and what it looks for.",
    author: "Kai M.",
    date: "Jan 14, 2026",
    readTime: "6 min read",
    category: "Product",
  },
  {
    slug: "brand-guidelines-best-practices",
    title: "Writing Campaign Briefs That Actually Get Great Content",
    excerpt: "A strong brief is the difference between mediocre submissions and amazing content. Here are our best practices from analyzing top-performing campaigns.",
    author: "Nnamdi O.",
    date: "Jan 8, 2026",
    readTime: "5 min read",
    category: "Guides",
  },
]

const categories = ["All", "Industry Trends", "Product", "Guides", "For Creators"]

export default function BlogPage() {
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
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Insights, guides, and industry news about UGC marketing and creator collaborations.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                cat === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary/30" />
              </div>
              <div className="p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                  {post.category}
                </span>
                <h2 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-6">Get the latest UGC insights delivered to your inbox. No spam, unsubscribe anytime.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              Subscribe
            </button>
          </div>
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
