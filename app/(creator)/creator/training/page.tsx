import { BookOpen, Play, Clock, CheckCircle2, Lock } from "lucide-react"

const MODULES = [
  {
    id: 1,
    title: "UGC Fundamentals",
    description: "Learn what UGC is, why brands pay for it, and how the industry works.",
    lessons: 5,
    duration: "45 min",
    free: true,
    completed: false,
    topics: ["What is UGC?", "How brands use creator content", "Types of UGC campaigns", "Setting your rates", "Building your portfolio"],
  },
  {
    id: 2,
    title: "Filming Like a Pro",
    description: "Master lighting, framing, and audio for scroll-stopping content.",
    lessons: 6,
    duration: "1h 10min",
    free: true,
    completed: false,
    topics: ["Natural vs artificial lighting", "Vertical vs horizontal framing", "Clear audio on a budget", "Stabilisation tricks", "B-roll techniques", "Raw vs edited footage"],
  },
  {
    id: 3,
    title: "Writing Winning Scripts",
    description: "Hook viewers in 3 seconds and write scripts brands actually approve.",
    lessons: 4,
    duration: "35 min",
    free: true,
    completed: false,
    topics: ["The 3-second hook formula", "Problem → Solution → CTA structure", "Authentic vs scripted tone", "Reading brand briefs"],
  },
  {
    id: 4,
    title: "Editing for Conversions",
    description: "Quick, engaging edits that drive clicks and purchases.",
    lessons: 7,
    duration: "1h 20min",
    free: false,
    completed: false,
    topics: ["CapCut essentials", "Trending transitions", "Text overlays & captions", "Music licensing", "Colour grading basics", "Exporting for TikTok / Reels", "A/B testing edits"],
  },
  {
    id: 5,
    title: "Landing & Managing Clients",
    description: "Find brands, negotiate rates, and deliver work professionally.",
    lessons: 5,
    duration: "55 min",
    free: false,
    completed: false,
    topics: ["Writing your creator pitch", "Pricing your packages", "Contracts & deliverables", "Revision workflows", "Getting 5-star reviews"],
  },
]

export default function TrainingPage() {
  const freeCount = MODULES.filter((m) => m.free).length
  const proCount = MODULES.filter((m) => !m.free).length

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Creator Training</h1>
        <p className="text-muted-foreground mt-1">
          Step-by-step courses to help you land better campaigns and earn more.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{MODULES.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Modules</p>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{freeCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Free</p>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{proCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Pro Only</p>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {MODULES.map((mod) => (
          <div key={mod.id} className="bg-card border rounded-xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    mod.free ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {mod.free ? (
                      <BookOpen className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{mod.title}</h3>
                      {!mod.free && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {mod.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mod.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {mod.free ? (
                  <button className="shrink-0 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    Start
                  </button>
                ) : (
                  <button className="shrink-0 h-9 px-4 rounded-lg border text-sm font-medium text-muted-foreground cursor-not-allowed opacity-60">
                    Unlock
                  </button>
                )}
              </div>

              {/* Topic pills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {mod.topics.map((topic) => (
                  <span key={topic} className="text-[11px] bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-3">
        <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
        <h3 className="font-semibold text-lg">Unlock all {proCount} Pro modules</h3>
        <p className="text-sm text-muted-foreground">Upgrade to Creator Pro to access editing masterclasses and client management training.</p>
        <a
          href="/creator/settings"
          className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Upgrade to Creator Pro — €19.99/mo
        </a>
      </div>
    </div>
  )
}
