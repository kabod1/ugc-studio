"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TRAINING_MODULES, getModule, getLesson } from "@/lib/training-content"
import {
  CheckCircle2, ChevronLeft, ChevronRight, Clock,
  PlayCircle, BookOpen, Target, ListChecks, Lock, Loader2, ExternalLink
} from "lucide-react"
import { toast } from "sonner"

export default function LessonPage({ params }: { params: { moduleId: string; lessonId: string } }) {
  const moduleId = parseInt(params.moduleId)
  const lessonId = parseInt(params.lessonId)
  const router = useRouter()

  const mod = getModule(moduleId)
  const lesson = getLesson(moduleId, lessonId)

  const [completed, setCompleted] = useState(false)
  const [marking, setMarking] = useState(false)
  const [progress, setProgress] = useState<{ module_id: number; lesson_id: number }[]>([])
  const [activeTab, setActiveTab] = useState<"video" | "text">("video")

  useEffect(() => {
    fetch("/api/lesson-progress")
      .then((r) => r.json())
      .then((d) => {
        const p = d.progress || []
        setProgress(p)
        setCompleted(p.some((x: any) => x.module_id === moduleId && x.lesson_id === lessonId))
      })
      .catch(() => {})
  }, [moduleId, lessonId])

  if (!mod || !lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link href="/creator/training" className="text-primary hover:underline mt-2 inline-block">Back to Training</Link>
      </div>
    )
  }

  if (!mod.free) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold">Pro Module</h2>
        <p className="text-muted-foreground">This module is part of Creator Pro. Upgrade to unlock all lessons.</p>
        <Link
          href="/creator/settings"
          className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Upgrade to Creator Pro — €19.99/mo
        </Link>
        <div className="mt-2">
          <Link href="/creator/training" className="text-sm text-muted-foreground hover:underline">← Back to Training</Link>
        </div>
      </div>
    )
  }

  const lessonIndex = mod.lessons.findIndex((l) => l.id === lessonId)
  const prevLesson = mod.lessons[lessonIndex - 1]
  const nextLesson = mod.lessons[lessonIndex + 1]
  const nextModule = TRAINING_MODULES.find((m) => m.id === moduleId + 1)

  async function markComplete() {
    if (completed) return
    setMarking(true)
    try {
      const res = await fetch("/api/lesson-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_id: moduleId, lesson_id: lessonId }),
      })
      if (res.ok) {
        setCompleted(true)
        toast.success("Lesson completed! 🎉")
      }
    } catch {
      toast.error("Couldn't save progress. Please try again.")
    } finally {
      setMarking(false)
    }
  }

  function goNext() {
    if (nextLesson) {
      router.push(`/creator/training/${moduleId}/${nextLesson.id}`)
    } else if (nextModule && nextModule.free) {
      router.push(`/creator/training/${nextModule.id}/${nextModule.lessons[0].id}`)
    } else {
      router.push("/creator/training")
    }
  }

  const isLessonDone = (mId: number, lId: number) =>
    progress.some((p) => p.module_id === mId && p.lesson_id === lId)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/creator/training" className="hover:text-foreground transition-colors">Training</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate">{mod.title}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate">Lesson {lessonId}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Lesson header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Module {moduleId} · Lesson {lessonId}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {lesson.duration}
              </span>
              {completed && (
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "video" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PlayCircle className="h-4 w-4" />
              Video
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "text" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Read
            </button>
          </div>

          {/* VIDEO TAB */}
          {activeTab === "video" && (
            <div className="space-y-4">
              {/* YouTube search card */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-red-600 to-red-700 aspect-video flex flex-col items-center justify-center text-white p-8 text-center">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-white/15 flex items-center justify-center">
                      <PlayCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-75 mb-1">Watch on YouTube</p>
                    <h3 className="text-xl font-bold leading-snug">{lesson.videoTitle}</h3>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.videoQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors text-sm"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch on YouTube
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <p className="text-xs opacity-60">Opens in a new tab — then switch back to continue</p>
                </div>
              </div>

              {/* Objectives under video */}
              <div className="bg-card border rounded-xl p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-primary" />
                  What you'll learn
                </h3>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TEXT TAB */}
          {activeTab === "text" && (
            <div className="space-y-6">
              {/* Objectives */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-primary">
                  <Target className="h-4 w-4" />
                  Learning objectives
                </h3>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lesson content */}
              <div
                className="prose prose-sm max-w-none [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-foreground [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_li]:text-sm [&_ol]:mt-2 [&_ol]:space-y-1.5 [&_strong]:font-semibold [&_em]:italic [&_em]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>
          )}

          {/* Action checklist */}
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <ListChecks className="h-4 w-4 text-primary" />
              Your action items
            </h3>
            <ul className="space-y-3">
              {lesson.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded border-2 border-muted-foreground/30 shrink-0 mt-0.5 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Complete + Navigation */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!completed ? (
              <button
                onClick={markComplete}
                disabled={marking}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {marking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {marking ? "Saving..." : "Mark as Complete"}
              </button>
            ) : (
              <div className="flex items-center gap-2 h-12 px-6 rounded-xl bg-green-50 text-green-700 font-semibold border border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                Lesson Completed
              </div>
            )}

            <button
              onClick={goNext}
              className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border font-medium hover:bg-muted transition-colors"
            >
              {nextLesson ? "Next Lesson" : nextModule?.free ? "Next Module" : "Back to Training"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sidebar — lesson list */}
        <div className="hidden lg:block">
          <div className="bg-card border rounded-xl overflow-hidden sticky top-20">
            <div className="px-4 py-3 border-b bg-muted/30">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Module {moduleId}</p>
              <p className="text-sm font-semibold mt-0.5 leading-tight">{mod.title}</p>
            </div>
            <div className="divide-y max-h-[60vh] overflow-y-auto">
              {mod.lessons.map((l) => {
                const isCurrent = l.id === lessonId
                const isDone = isLessonDone(moduleId, l.id)
                return (
                  <Link
                    key={l.id}
                    href={`/creator/training/${moduleId}/${l.id}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isCurrent
                        ? "bg-primary/5 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${isCurrent ? "border-primary" : "border-muted-foreground/30"}`} />
                    )}
                    <span className="leading-tight truncate">{l.title}</span>
                  </Link>
                )
              })}
            </div>

            {/* Module nav */}
            <div className="px-4 py-3 border-t space-y-1">
              {prevLesson && (
                <Link
                  href={`/creator/training/${moduleId}/${prevLesson.id}`}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous lesson
                </Link>
              )}
              <Link
                href="/creator/training"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <BookOpen className="h-3 w-3" />
                All modules
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
