import { Share2, Copy, Users, DollarSign, TrendingUp } from "lucide-react"

export default function AffiliatesPage() {
  const referralCode = "CREATOR-DEMO"
  const referralLink = `https://townshub.com/signup?ref=${referralCode}`

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Affiliates</h1>
        <p className="text-muted-foreground mt-1">Earn money by referring other creators and brands to Townshub.</p>
      </div>

      {/* Earnings summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">€0</p>
          <p className="text-xs text-muted-foreground mt-1">Total Earned</p>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground mt-1">Referrals</p>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground mt-1">Active</p>
        </div>
      </div>

      {/* Referral link */}
      <div className="bg-card border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          Your Referral Link
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 h-10 rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground"
          />
          <button
            onClick={() => navigator.clipboard?.writeText(referralLink)}
            className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copy
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Share this link with other creators or brands. You earn a commission for every paid signup.</p>
      </div>

      {/* How it works */}
      <div className="space-y-4">
        <h3 className="font-semibold">How it works</h3>
        <div className="space-y-3">
          {[
            { icon: Share2, title: "Share your link", desc: "Send your referral link to creators, brands, or post it on social media." },
            { icon: Users, title: "They sign up", desc: "When someone creates a paid account using your link, it's tracked." },
            { icon: DollarSign, title: "You earn", desc: "Earn 20% of their first month's subscription — paid directly to your Townshub earnings." },
            { icon: TrendingUp, title: "Recurring income", desc: "Earn for as long as your referrals stay subscribed." },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4 bg-card border rounded-xl p-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission table */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold">Commission rates</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Creator Pro referral</span>
            <span className="font-semibold text-primary">€4 / month</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Brand Starter referral</span>
            <span className="font-semibold text-primary">€6 / month</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Brand Pro referral</span>
            <span className="font-semibold text-primary">€15 / month</span>
          </div>
        </div>
      </div>
    </div>
  )
}
